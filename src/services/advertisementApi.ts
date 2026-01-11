import apiClient from '@/lib/apiClient';
import type {
    Advertisement,
    AdvertisementResponse,
    SingleAdvertisementResponse,
    AdvertisementRequestData,
    AdListing,
    GetActiveAdsResponse,
    FeedResponse,
    ApiSuccessResponse,
} from '@/types/advertisement.types';

// Re-export types for convenience
export type { Advertisement, AdListing } from '@/types/advertisement.types';

/**
 * PUBLIC ENDPOINTS (No Authentication Required)
 */

/**
 * Get all active ads
 * GET /v1/api/ads
 */
export const getActiveAds = async (): Promise<AdListing[]> => {
    try {
        const response = await apiClient.get<GetActiveAdsResponse>('/v1/api/ads');
        return response.data.data || [];
    } catch (error) {
        console.error('Error fetching active ads:', error);
        return [];
    }
};

/**
 * Get active ads by placement
 * GET /v1/api/ads?placement=<placement>
 */
export const getAdsByPlacement = async (placement: string): Promise<AdListing[]> => {
    try {
        const response = await apiClient.get<GetActiveAdsResponse>(
            `/v1/api/ads?placement=${placement}`
        );
        return response.data.data || [];
    } catch (error) {
        console.error(`Error fetching ads for placement ${placement}:`, error);
        return [];
    }
};

/**
 * Track ad impression (when ad becomes visible)
 * POST /v1/api/ads/:id/impression
 * @param adId - The ID of the ad
 */
export const trackAdImpression = async (adId: string): Promise<boolean> => {
    try {
        await apiClient.post<ApiSuccessResponse>(
            `/v1/api/ads/${adId}/impression`
        );
        return true;
    } catch (error) {
        console.error('Error tracking ad impression:', error);
        return false;
    }
};

/**
 * Track ad click (when user clicks on ad)
 * POST /v1/api/ads/:id/click
 * @param adId - The ID of the ad
 */
export const trackAdClick = async (adId: string): Promise<boolean> => {
    try {
        await apiClient.post<ApiSuccessResponse>(
            `/v1/api/ads/${adId}/click`
        );
        return true;
    } catch (error) {
        console.error('Error tracking ad click:', error);
        return false;
    }
};

/**
 * Get feed with inline ads
 * GET /v1/api/feed
 */
export const getFeedWithAds = async (): Promise<FeedResponse> => {
    try {
        const response = await apiClient.get<FeedResponse>('/v1/api/feed');
        return response.data;
    } catch (error) {
        console.error('Error fetching feed with ads:', error);
        throw error;
    }
};

/**
 * LEGACY PUBLIC ENDPOINTS
 */

/**
 * Fetch all approved advertisements for public display
 */
export const fetchApprovedAdvertisements = async (): Promise<Advertisement[]> => {
    try {
        const response = await apiClient.get<AdvertisementResponse>('/v1/api/advertisements?isApproved=true');
        return response.data.data || [];
    } catch (error) {
        console.error('Error fetching advertisements:', error);
        return [];
    }
};

/**
 * Fetch homepage banner advertisements specifically
 */
export const fetchHomepageBanners = async (): Promise<Advertisement[]> => {
    return fetchApprovedAdvertisements();
};

/**
 * Submit a new advertisement request (public endpoint)
 * POST /v1/api/ads/ad-requests
 */
export const submitAdvertisementRequest = async (
    data: AdvertisementRequestData
): Promise<SingleAdvertisementResponse> => {
    try {
        const endpoint = '/v1/api/ads/ad-requests';
        console.log(`Attempting to submit ad request to: ${endpoint}`);
        console.log('Request data:', data);

        const response = await apiClient.post<SingleAdvertisementResponse>(
            endpoint,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Success! Response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Failed to submit ad request:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
        });
        throw error;
    }
};

