import apiClient from '@/lib/apiClient';

/**
 * Advertisement type definition
 */
export interface Advertisement {
    id: string;
    title: string;
    description?: string;
    advertiser?: string;
    email?: string;
    createdDate: string;
    status: 'pending' | 'approved' | 'rejected' | 'active' | 'expired';
    duration?: string;
    startDate?: string;
    endDate?: string;
    budget?: number;
    impressions?: number;
    clicks?: number;
    images?: string[];
}

/**
 * API Response types
 */
interface GetAdvertisementsResponse {
    advertisements: Advertisement[];
    total?: number;
}

interface GetAdvertisementRequestsResponse {
    requests: Advertisement[];
    total?: number;
}

interface GetAdListingsResponse {
    listings: Advertisement[];
    total?: number;
}

interface GetAdvertisementResponse {
    advertisement: Advertisement;
}

interface CreateAdResponse {
    message: string;
    ad: Advertisement;
}

interface MessageResponse {
    message: string;
}

/**
 * Get all advertisements
 * GET /v1/api/admin/advertisements
 */
export const getAllAdvertisements = async (): Promise<GetAdvertisementsResponse> => {
    const response = await apiClient.get<GetAdvertisementsResponse>('/v1/api/admin/advertisements');
    return response.data;
};

/**
 * Get all pending advertisement requests
 * GET /v1/api/admin/advertisements/requests
 */
export const getAllPendingAdvertisements = async (): Promise<GetAdvertisementRequestsResponse> => {
    const response = await apiClient.get<GetAdvertisementRequestsResponse>('/v1/api/admin/advertisements/requests');
    return response.data;
};

/**
 * Get all approved advertisements
 * GET /v1/api/admin/advertisements/approved
 */
export const getAllApprovedAdvertisements = async (): Promise<GetAdvertisementsResponse> => {
    const response = await apiClient.get<GetAdvertisementsResponse>('/v1/api/admin/advertisements/approved');
    return response.data;
};

/**
 * Get all ad listings
 * GET /v1/api/admin/advertisements/listings
 */
export const getAllAdListings = async (): Promise<GetAdListingsResponse> => {
    const response = await apiClient.get<GetAdListingsResponse>('/v1/api/admin/advertisements/listings');
    return response.data;
};

/**
 * Get advertisement by ID
 * GET /v1/api/admin/advertisements/:adId
 */
export const getAdvertisementById = async (adId: string): Promise<GetAdvertisementResponse> => {
    const response = await apiClient.get<GetAdvertisementResponse>(`/v1/api/admin/advertisements/${adId}`);
    return response.data;
};

/**
 * Update advertisement request status
 * PATCH /v1/api/admin/ad/request/:adId/:status
 */
export const updateAdvertisementStatus = async (adId: string, status: 'approved' | 'rejected'): Promise<MessageResponse> => {
    const response = await apiClient.patch<MessageResponse>(`/v1/api/admin/ad/request/${adId}/${status}`);
    return response.data;
};

/**
 * Change ad status
 * PATCH /v1/api/admin/advertisements/:adId/status
 */
export const changeAdStatus = async (adId: string, status: string): Promise<MessageResponse> => {
    const response = await apiClient.patch<MessageResponse>(`/v1/api/admin/advertisements/${adId}/status`, { status });
    return response.data;
};

/**
 * Create ad listing
 * POST /v1/api/admin/advertisements/listing
 */
export const createAdListing = async (formData: FormData): Promise<CreateAdResponse> => {
    const response = await apiClient.post<CreateAdResponse>('/v1/api/admin/advertisements/listing', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

/**
 * Delete ad listing
 * DELETE /v1/api/admin/advertisements/:adId
 */
export const deleteAdvertisement = async (adId: string): Promise<MessageResponse> => {
    const response = await apiClient.delete<MessageResponse>(`/v1/api/admin/advertisements/${adId}`);
    return response.data;
};
