import apiClient from '@/lib/apiClient';
import type { Advertisement, AdListing } from '@/types/advertisement.types';

/**
 * API Response types
 */
interface GetAdvertisementsResponse {
    message?: string;
    data?: Advertisement[];
    advertisements?: Advertisement[];
    total?: number;
}

interface GetAdListingsResponse {
    success: boolean;
    data: AdListing[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

interface MessageResponse {
    message: string;
}

/**
 * Get all advertisements
 * GET /v1/api/admin/advertisements
 */
export const getAllAdvertisements = async (): Promise<Advertisement[]> => {
    const response = await apiClient.get<GetAdvertisementsResponse>('/v1/api/admin/advertisements');
    return response.data.data || response.data.advertisements || [];
};

/**
 * Get all pending advertisement requests
 * GET /v1/api/admin/advertisements/requests
 */
export const getAllPendingAdvertisements = async (): Promise<Advertisement[]> => {
    const response = await apiClient.get<GetAdvertisementsResponse>('/v1/api/admin/advertisements/requests');
    return response.data.data || response.data.advertisements || [];
};

/**
 * Get all approved advertisements
 * GET /v1/api/admin/advertisements/approved
 */
export const getAllApprovedAdvertisements = async (): Promise<Advertisement[]> => {
    const response = await apiClient.get<GetAdvertisementsResponse>('/v1/api/admin/advertisements/approved');
    return response.data.data || response.data.advertisements || [];
};

/**
 * Get all ad listings
 * GET /v1/api/ads/ads
 */
export const getAllAdListings = async (): Promise<AdListing[]> => {
    const response = await apiClient.get<GetAdListingsResponse>('/v1/api/ads/ads');
    return response.data.data || [];
};

/**
 * Get advertisement by ID
 * GET /v1/api/admin/advertisements/:adId
 */
export const getAdvertisementById = async (adId: string): Promise<Advertisement> => {
    const response = await apiClient.get<{ data: Advertisement }>(`/v1/api/admin/advertisements/${adId}`);
    return response.data.data;
};

/**
 * Update advertisement request status
 * PATCH /v1/api/admin/ad/request/:adId/:status
 */
export const updateAdvertisementStatus = async (
    adId: string,
    status: 'approved' | 'rejected'
): Promise<MessageResponse> => {
    const response = await apiClient.patch<MessageResponse>(`/v1/api/admin/ad/request/${adId}/${status}`);
    return response.data;
};

/**
 * Toggle ad active status
 * PATCH /v1/api/admin/advertisements/:adId/status
 */
export const toggleAdStatus = async (adId: string): Promise<MessageResponse> => {
    const response = await apiClient.patch<MessageResponse>(`/v1/api/admin/advertisements/${adId}/status`);
    return response.data;
};

/**
 * Delete advertisement
 * DELETE /v1/api/admin/advertisements/:adId
 */
export const deleteAdvertisement = async (adId: string): Promise<MessageResponse> => {
    const response = await apiClient.delete<MessageResponse>(`/v1/api/admin/advertisements/${adId}`);
    return response.data;
};

/**
 * Duplicate advertisement
 * POST /v1/api/ads/admin/ads/:adId/duplicate
 */
export const duplicateAdvertisement = async (adId: string): Promise<Advertisement> => {
    const response = await apiClient.post<{ data: Advertisement }>(`/v1/api/ads/admin/ads/${adId}/duplicate`);
    return response.data.data;
};

/**
 * Get advertisements with pagination and filters
 * GET /v1/api/ads/admin/ads
 */
export const getAdvertisementsWithFilters = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    placement?: string;
    status?: string;
    device?: string;
}): Promise<{ data: Advertisement[]; total: number }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.placement && params.placement !== 'all') queryParams.append('placement', params.placement);
    if (params?.status && params.status !== 'all') queryParams.append('status', params.status);
    if (params?.device && params.device !== 'all') queryParams.append('device', params.device);

    const response = await apiClient.get<GetAdvertisementsResponse>(
        `/v1/api/ads/admin/ads${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    );

    return {
        data: response.data.data || response.data.advertisements || [],
        total: response.data.total || 0
    };
};
