import apiClient from '@/lib/apiClient';

/**
 * Pet Verification type definition
 */
export interface PetVerification {
    _id?: string;
    id?: string;
    name: string;
    breedName?: string;
    breedname?: string; // backend uses lowercase
    breedId?: string | { _id: string; name: string };
    gender?: string;
    age: number | string; // backend may send as string
    price: number;
    currency?: string;
    category?: string | { _id: string; name: string };
    status?: string;
    location?: {
        city?: string;
        state?: string;
        pincode?: string;
    };
    description?: string;
    vaccinationInfo?: string;
    images?: string[];
    sellerId?: {
        _id: string;
        userId?: {
            name: string;
            email: string;
        };
        brandName?: string;
    };
    isVerified: boolean;
    featuredRequest?: any;
    createdAt: string;
    updatedAt?: string;
    __v?: number;
}

/**
 * Pet Verification Stats
 */
export interface PetVerificationStats {
    pending: number;
    verified: number;
    total: number;
}

/**
 * API Response types
 */
interface GetNotVerifiedPetsResponse {
    success?: boolean;
    pets: PetVerification[];
    count?: number;
    total?: number;
}

interface BackendPetsResponse {
    message?: string;
    data: PetVerification[];
}

interface MessageResponse {
    success?: boolean;
    message: string;
}

/**
 * Get all unverified pets (isVerified = false)
 * GET /v1/api/admin/pets/not-verified
 */
export const getAllNotVerifiedPets = async (): Promise<GetNotVerifiedPetsResponse> => {
    const response = await apiClient.get<BackendPetsResponse>('/v1/api/admin/pets/not-verified');
    // Backend returns { message, data: Pet[] }, map to { pets: Pet[] }
    const petsData = response.data.data || [];
    return {
        pets: petsData.filter(pet => pet.isVerified === false),
        count: petsData.length,
        total: petsData.length
    };
};

/**
 * Get pets by verification status
 * pending = isVerified: false
 * verified = isVerified: true
 */
export const fetchPetsByStatus = async (status: 'pending' | 'verified'): Promise<PetVerification[]> => {
    if (status === 'pending') {
        const response = await getAllNotVerifiedPets();
        return response.pets || [];
    }
    // For verified, we need a separate endpoint or fetch all and filter
    // For now, return empty array - backend should provide verified pets endpoint
    return [];
};

/**
 * Get pet verification statistics from dashboard endpoint
 * GET /v1/api/admin/dashboard/pet-verification-stats
 */
export const fetchPetVerificationStats = async (): Promise<PetVerificationStats> => {
    try {
        const response = await apiClient.get<PetVerificationStats>('/v1/api/admin/dashboard/pet-verification-stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching pet verification stats:', error);
        return {
            pending: 0,
            verified: 0,
            total: 0
        };
    }
};

/**
 * Update pet verification status
 * PATCH /v1/api/admin/pets/:petId/verified (sets isVerified = true)
 * PATCH /v1/api/admin/pets/:petId/rejected (sets isVerified = false, or deletes)
 */
export const updatePetStatus = async (petId: string, status: 'verified' | 'rejected'): Promise<MessageResponse> => {
    const response = await apiClient.patch<MessageResponse>(`/v1/api/admin/pets/${petId}/${status}`);
    return response.data;
};
