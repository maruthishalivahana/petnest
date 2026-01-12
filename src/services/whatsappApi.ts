import apiClient from '@/lib/apiClient';

/**
 * WhatsApp API Service
 * Handles secure WhatsApp link generation and click tracking
 * Phone numbers are NEVER exposed to frontend
 */

export interface WhatsAppLinkResponse {
    success: boolean;
    data?: {
        whatsappLink: string;
        trackingId: string;
    };
    message?: string;
}

export interface TrackWhatsAppRequest {
    sellerId: string;
    petId: string;
    buyerId?: string;
}

export interface TrackWhatsAppResponse {
    success: boolean;
    message: string;
}

/**
 * Generate WhatsApp deep link with prefilled message
 * @param sellerId - Seller MongoDB ObjectId
 * @param petId - Pet MongoDB ObjectId
 * @returns WhatsApp link with encoded message (no phone number exposed)
 */
export const generateWhatsAppLink = async (
    sellerId: string,
    petId: string
): Promise<WhatsAppLinkResponse> => {
    try {
        const response = await apiClient.get<WhatsAppLinkResponse>(
            `/v1/api/whatsapp/generate`,
            {
                params: { sellerId, petId }
            }
        );
        return response.data;
    } catch (error: any) {
        console.error('Failed to generate WhatsApp link:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to generate WhatsApp link'
        };
    }
};

/**
 * Track WhatsApp click for analytics
 * @param data - Tracking data with sellerId, petId, and optional buyerId
 */
export const trackWhatsAppClick = async (
    data: TrackWhatsAppRequest
): Promise<TrackWhatsAppResponse> => {
    try {
        const response = await apiClient.post<TrackWhatsAppResponse>(
            '/v1/api/whatsapp/track',
            data
        );
        return response.data;
    } catch (error: any) {
        console.error('Failed to track WhatsApp click:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to track click'
        };
    }
};

/**
 * Generate brand advertising WhatsApp link
 * For businesses wanting to advertise on PetNest
 */
export const generateBrandWhatsAppLink = (): string => {
    const phoneNumber = '9949445524'; // Replace with PetNest business number
    const message = `Hi PetNest Team,

I'm interested in advertising my brand on PetNest platform.

Could you please provide information about:
- Available advertisement placements
- Pricing and packages
- Target audience reach
- Campaign duration options

Looking forward to hearing from you!`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};
