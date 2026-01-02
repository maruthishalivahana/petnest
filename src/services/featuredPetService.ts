import apiClient from '@/lib/apiClient';

/**
 * Pet data from backend (flat structure)
 */
interface PetData {
    _id: string;
    name: string;
    breedName?: string;
    breed?: string;
    price: number;
    age?: string;
    gender?: string;
    category?: string;
    images?: string[];
    sellerId: string | {
        _id: string;
        brandName?: string;
        userId?: string;
    };
    breedId?: {
        _id: string;
        name: string;
    };
    location?: {
        city?: string;
        state?: string;
        pincode?: string;
    };
    featuredRequest?: {
        isRequested: boolean;
        status: 'pending' | 'approved' | 'rejected';
        requestedAt: string;
        approvedAt?: string;
        adminNote?: string;
    };
}

/**
 * Backend response for featured request item
 */
interface BackendFeaturedRequestItem {
    pet: PetData;
    seller?: {
        _id: string;
        name?: string;
        email?: string;
        phone?: string;
    };
}

/**
 * Normalized Featured Pet Request type for frontend
 */
export interface FeaturedPetRequest {
    _id: string;
    petId: string;
    sellerId: string;
    status: 'pending' | 'approved' | 'rejected';
    requestedAt: string;
    reviewedAt?: string;
    reviewedBy?: string;
    pet: {
        _id: string;
        name: string;
        breed?: string;
        breedName?: string;
        price: number;
        images?: string[];
        age?: string;
        gender?: string;
    };
    seller?: {
        _id: string;
        name: string;
        email: string;
        phone?: string;
    };
}

/**
 * Featured Pet type for buyer view
 */
export interface FeaturedPet {
    _id: string;
    name: string;
    breed?: string;
    breedName?: string;
    price: number;
    age: string;
    gender: string;
    category?: string;
    location?: string;
    images?: string[];
    isFeatured: boolean;
    featuredAt?: string;
    seller?: {
        _id: string;
        name: string;
    };
}

/**
 * API Response types
 */
interface MessageResponse {
    message: string;
}

interface FeaturedRequestsResponse {
    success: boolean;
    count: number;
    data: PetData[];
}

interface FeaturedPetsResponse {
    message: string;
    data: FeaturedPet[];
}

/**
 * SELLER: Request featured listing for a pet
 * POST /v1/api/seller/pets/:petId/featured-request
 */
export const requestFeaturedPet = async (petId: string): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>(
        `/v1/api/seller/pets/${petId}/featured-request`
    );
    return response.data;
};

/**
 * ADMIN: Get all featured pet requests
 * GET /v1/api/admin/pets/featured-requests
 */
export const fetchFeaturedRequestsAdmin = async (): Promise<FeaturedPetRequest[]> => {
    const response = await apiClient.get<FeaturedRequestsResponse>(
        '/v1/api/admin/pets/featured-requests'
    );

    // Handle empty or invalid response
    if (!response.data || !response.data.data) {
        console.error('Invalid response structure:', response.data);
        return [];
    }

    // Map flat Pet objects to frontend structure
    const normalizedData = (response.data.data || [])
        .filter((pet: PetData) => pet && pet._id) // Filter out invalid items
        .map((pet: PetData): FeaturedPetRequest => {
            // Extract seller info (populated or just ID)
            const seller = typeof pet.sellerId === 'object' ? {
                _id: pet.sellerId._id,
                name: pet.sellerId.brandName || 'Unknown Seller',
                email: '',
            } : undefined;

            // Extract breed name
            const breedName = pet.breedName || pet.breedId?.name || pet.breed;

            return {
                _id: pet._id,
                petId: pet._id,
                sellerId: typeof pet.sellerId === 'object' ? pet.sellerId._id : pet.sellerId,
                status: pet.featuredRequest?.status || 'pending',
                requestedAt: pet.featuredRequest?.requestedAt || new Date().toISOString(),
                pet: {
                    _id: pet._id,
                    name: pet.name,
                    breed: breedName,
                    breedName: breedName,
                    price: pet.price,
                    images: pet.images || [],
                    age: pet.age,
                    gender: pet.gender,
                },
                seller,
            };
        });

    return normalizedData;
};

/**
 * ADMIN: Approve featured pet request
 * PATCH /v1/api/admin/pets/:petId/featured/approve
 */
export const approveFeaturedPet = async (petId: string): Promise<MessageResponse> => {
    const response = await apiClient.patch<MessageResponse>(
        `/v1/api/admin/pets/${petId}/featured/approve`
    );
    return response.data;
};

/**
 * ADMIN: Reject featured pet request
 * PATCH /v1/api/admin/pets/:petId/featured/reject
 */
export const rejectFeaturedPet = async (petId: string): Promise<MessageResponse> => {
    const response = await apiClient.patch<MessageResponse>(
        `/v1/api/admin/pets/${petId}/featured/reject`
    );
    return response.data;
};

/**
 * BUYER: Get featured pets
 * GET /v1/api/buyer/pets/featured
 */
export const fetchFeaturedPetsBuyer = async (): Promise<FeaturedPet[]> => {
    const response = await apiClient.get<FeaturedPetsResponse>(
        '/v1/api/buyer/pets/featured'
    );
    return response.data.data || [];
};
