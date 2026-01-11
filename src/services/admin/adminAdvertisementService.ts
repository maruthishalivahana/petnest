import apiClient from '@/lib/apiClient';
import type {
    Advertisement,
    AdListing,
    CreateAdDTO,
    UpdateAdDTO,
    AdRequest,
    GetAdRequestsResponse,
    UpdateAdRequestStatusDTO,
    ApiSuccessResponse,
} from '@/types/advertisement.types';

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
    success?: boolean;
}

interface AdResponse {
    success: boolean;
    message: string;
    data: AdListing;
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
 * GET /v1/api/admin/advertisements/requests (Legacy - old advertisement system)
 * For new ad requests, use getAllAdRequests()
 */
export const getAllPendingAdvertisements = async (): Promise<Advertisement[]> => {
    const response = await apiClient.get<GetAdvertisementsResponse>('/v1/api/admin/advertisements/requests');
    return response.data.data || response.data.advertisements || [];
};

/**
 * Get all pending ad requests (New ad request system)
 * GET /v1/api/admin/advertisements/requests?status=pending
 */
export const getPendingAdRequests = async (): Promise<AdRequest[]> => {
    const response = await apiClient.get<GetAdRequestsResponse>('/v1/api/admin/advertisements/requests?status=pending');
    return response.data.data || [];
};

/**
 * Get all approved ad requests (New ad request system)
 * GET /v1/api/admin/advertisements/requests?status=approved
 */
export const getApprovedAdRequests = async (): Promise<AdRequest[]> => {
    const response = await apiClient.get<GetAdRequestsResponse>('/v1/api/admin/advertisements/requests?status=approved');
    return response.data.data || [];
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
 * GET /v1/api/ads/admin/ads
 */
export const getAllAdListings = async (): Promise<{ data: AdListing[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> => {
    const result = await getAdvertisementsWithFilters();
    return result;
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
 * PATCH /v1/api/admin/advertisements/requests/:adId/status
 */
export const updateAdvertisementStatus = async (
    adId: string,
    status: 'approved' | 'rejected'
): Promise<MessageResponse> => {
    const response = await apiClient.patch<MessageResponse>(`/v1/api/admin/advertisements/requests/${adId}/status`, { status });
    return response.data;
};

/**
 * Toggle ad active status
 * PATCH /v1/api/ads/admin/ads/:id/toggle
 */
export const toggleAdStatus = async (adId: string): Promise<{ success: boolean; message: string; data: AdListing }> => {
    const response = await apiClient.patch<{ success: boolean; message: string; data: AdListing }>(
        `/v1/api/ads/admin/ads/${adId}/toggle`
    );
    return response.data;
};

/**
 * Delete advertisement
 * DELETE /v1/api/ads/admin/ads/:id
 */
export const deleteAdvertisement = async (adId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
        `/v1/api/ads/admin/ads/${adId}`
    );
    return response.data;
};

/**
 * Duplicate advertisement
 * POST /v1/api/ads/admin/ads/:adId/duplicate
 */
export const duplicateAdvertisement = async (adId: string): Promise<AdListing> => {
    const response = await apiClient.post<{ success: boolean; message: string; data: AdListing }>(
        `/v1/api/ads/admin/ads/${adId}/duplicate`
    );
    return response.data.data;
};

/**
 * Get all advertisements without filters
 * GET /v1/api/ads/admin/ads
 */
export const getAdvertisementsWithFilters = async (): Promise<{ data: AdListing[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> => {
    console.log('Fetching all ad listings from: /v1/api/ads/admin/ads');

    const response = await apiClient.get<GetAdListingsResponse>('/v1/api/ads/admin/ads');
    console.log('Ad listings response:', response.data);

    return {
        data: response.data.data || [],
        pagination: response.data.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 }
    };
};

/**
 * AD REQUEST ENDPOINTS
 */

/**
 * Get all ad requests
 * GET /v1/api/admin/ad-requests
 */
export const getAllAdRequests = async (): Promise<{ data: AdRequest[]; total: number }> => {
    const response = await apiClient.get<GetAdRequestsResponse>('/v1/api/admin/ad-requests');

    return {
        data: response.data.data || [],
        total: response.data.pagination?.total || 0
    };
};

/**
 * Update ad request status (approve or reject)
 * PATCH /v1/api/admin/advertisements/requests/:id/status
 */
export const updateAdRequestStatus = async (
    requestId: string,
    data: UpdateAdRequestStatusDTO
): Promise<MessageResponse> => {
    const response = await apiClient.patch<ApiSuccessResponse<AdRequest>>(
        `/v1/api/admin/advertisements/requests/${requestId}/status`,
        data
    );
    return {
        message: response.data.message,
        success: response.data.success
    };
};

/**
 * ADMIN AD MANAGEMENT ENDPOINTS
 */

/**
 * Create a new ad with image upload
 * POST /v1/api/ads/admin/ads
 * Content-Type: multipart/form-data
 * Supports JPEG, PNG, WEBP (max 2MB)
 */
export const createAd = async (data: CreateAdDTO | FormData): Promise<AdListing> => {
    const config = data instanceof FormData ? {
        headers: { 'Content-Type': 'multipart/form-data' }
    } : undefined;

    const response = await apiClient.post<{ success: boolean; message: string; data: AdListing }>(
        '/v1/api/ads/admin/ads',
        data,
        config
    );
    return response.data.data;
};

/**
 * Get ad by ID
 * GET /v1/api/ads/admin/ads/:id
 */
export const getAdById = async (adId: string): Promise<AdListing> => {
    const response = await apiClient.get<{ success: boolean; message: string; data: AdListing }>(
        `/v1/api/ads/admin/ads/${adId}`
    );
    return response.data.data;
};

/**
 * Update an existing ad with optional image upload
 * PATCH /v1/api/ads/admin/ads/:id
 * Content-Type: multipart/form-data
 * Image update is optional - keeps existing if not provided
 */
export const updateAd = async (adId: string, data: UpdateAdDTO | FormData): Promise<AdListing> => {
    const config = data instanceof FormData ? {
        headers: { 'Content-Type': 'multipart/form-data' }
    } : undefined;

    const response = await apiClient.patch<{ success: boolean; message: string; data: AdListing }>(
        `/v1/api/ads/admin/ads/${adId}`,
        data,
        config
    );
    return response.data.data;
};
