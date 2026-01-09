import axios from 'axios';
import type {
    Advertisement,
    AdvertisementResponse,
    SingleAdvertisementResponse,
    AdvertisementRequestData,
} from '@/types/advertisement.types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';

// Re-export types for convenience
export type { Advertisement } from '@/types/advertisement.types';

/**
 * Fetch all approved advertisements for public display
 * This endpoint should return only approved ads for the homepage
 */
export const fetchApprovedAdvertisements = async (
    adSpot?: string
): Promise<Advertisement[]> => {
    try {
        const params = new URLSearchParams();
        if (adSpot) {
            params.append('adSpot', adSpot);
        }
        params.append('isApproved', 'true');

        const response = await axios.get<AdvertisementResponse>(
            `${BASE_URL}/v1/api/advertisements?${params.toString()}`
        );

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
    return fetchApprovedAdvertisements('homepageBanner');
};

/**
 * Submit a new advertisement request
 */
export const submitAdvertisementRequest = async (
    data: AdvertisementRequestData
): Promise<SingleAdvertisementResponse> => {
    try {
        const response = await axios.post(
            `${BASE_URL}/v1/api/ads/request/advertisement`,
            data
        );
        return response.data;
    } catch (error) {
        console.error('Error submitting advertisement request:', error);
        throw error;
    }
};
