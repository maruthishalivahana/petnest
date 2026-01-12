import apiClient from "@/lib/apiClient";

// -------------------------
// Types
// -------------------------
export interface Pet {
    _id: string;
    name: string;
    breedName: string;
    breedId?: {
        name: string;
        species?: {
            category?: string;
            speciesName?: string;
        };
    };
    age: string;
    price: number;
    location: { city: string; state: string; pincode: string };
    images?: string[];
    isVerified?: boolean;
    isWishlisted?: boolean; // Added for wishlist status from search API
    sellerId?: string | {
        userId?: {
            name: string;
            _id: string;
            email?: string;
            phone?: string;
        };
        brandName?: string;
        _id: string;
        location?: { city: string; state: string; pincode: string } | string;
        whatsappNumber?: string;
    };
    description?: string;
    category?: string;
    currency?: string;
    gender?: string;
    weight?: string;
    color?: string;
    vaccinationStatus?: boolean;
    vaccinationInfo?: string;
    healthStatus?: string;
    personality?: string[];
    createdAt?: string;
    updatedAt?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T | null;
}

// -------------------------
// Get Single Pet by ID - SIMPLIFIED
// -------------------------
export const getPetById = async (petId: string): Promise<ApiResponse<Pet>> => {
    try {
        console.log('🔄 Fetching pet by ID:', petId);

        // Simple GET request without extra headers that cause CORS preflight
        const res = await apiClient.get(`/v1/api/buyer/pets/${petId}`);

        const petData = res.data?.pet || res.data?.data || res.data || null;

        console.log("✅ Pet details loaded:", petData?.name || 'Unknown');

        return {
            success: true,
            message: res.data?.message || "Pet details fetched successfully",
            data: petData,
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error("❌ Failed to fetch pet details:", err);

        // Determine error message
        let errorMessage = "Failed to fetch pet details";

        if (err?.message?.includes('Network Error') || err?.code === 'ERR_NETWORK') {
            errorMessage = "Connection error. Please check if you're logged in and the server is running.";
        } else if (err?.response?.status === 401 || err?.response?.status === 403) {
            errorMessage = "Please log in to view pet details";
        } else if (err?.response?.data?.message) {
            errorMessage = err.response.data.message;
        }

        return {
            success: false,
            message: errorMessage,
            data: null,
        };
    }
};

// -------------------------
// Search Pets by Keyword
// -------------------------
export const searchPets = async (keyword?: string): Promise<ApiResponse<Pet[]>> => {
    try {
        const queryParams = new URLSearchParams();

        if (keyword && keyword.trim()) {
            queryParams.set("keyword", keyword.trim());
        }

        const url = queryParams.toString()
            ? `/v1/api/buyer/pets/search?${queryParams.toString()}`
            : '/v1/api/buyer/pets/search';

        const res = await apiClient.get(url);

        return {
            success: true,
            message: res.data?.message || "Pets fetched successfully",
            data: res.data?.pets || res.data?.data || [],
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return {
            success: false,
            message: err?.response?.data?.message || "Failed to search pets",
            data: [],
        };
    }
};

// -------------------------
// Get All Breed Names (log)
// -------------------------
export const getAllBreedNames = async (): Promise<string[]> => {
    try {
        const res = await apiClient.get(`/v1/api/admin/breeds`);

        const payload = res?.data;
        // Try common shapes: {breeds: []} | {data: []} | []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let collection: any = payload?.breeds ?? payload?.data ?? payload?.items ?? payload;

        let names: string[] = [];
        if (Array.isArray(collection)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            names = collection
                .map((b: any) => b?.name ?? b?.breedName ?? (typeof b === 'string' ? b : undefined))
                .filter((n): n is string => typeof n === 'string');
        } else if (collection && typeof collection === 'object') {
            // Fallback if nested arrays are under collection.breeds or collection.data
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const nested: any = collection.breeds ?? collection.data;
            if (Array.isArray(nested)) {
                names = nested
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .map((b: any) => b?.name ?? b?.breedName ?? (typeof b === 'string' ? b : undefined))
                    .filter((n): n is string => typeof n === 'string');
            }
        }

        console.log("All breed names:", names);
        return names;
    } catch (error) {
        console.error("Failed to fetch breed names:", error);
        return [];
    }
};



// -------------------------
// Add New Pet Listing
// -------------------------
export const addPetListing = async (formData: FormData): Promise<ApiResponse<Pet>> => {
    try {
        // Don't set Content-Type manually - axios sets it automatically with boundary for FormData
        const res = await apiClient.post('/v1/api/seller/pet', formData);

        return {
            success: true,
            message: res.data?.message || 'Pet listing created successfully',
            data: res.data?.pet || res.data?.data || null,
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return {
            success: false,
            message: err?.response?.data?.message || 'Failed to create listing',
            data: null,
        };
    }
};

// Note: call getAllBreedNames() from client components or effects when needed.

// -------------------------
// Update Pet Listing
// -------------------------
export const updatePetListing = async (petId: string, formData: FormData): Promise<ApiResponse<Pet>> => {
    try {
        console.log('updatePetListing called with petId:', petId);
        console.log('FormData entries:');
        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }

        // Don't set Content-Type manually - axios sets it automatically with boundary for FormData
        const res = await apiClient.patch(`/v1/api/seller/pet/${petId}`, formData);

        console.log('Update response:', res.data);

        return {
            success: true,
            message: res.data?.message || 'Pet listing updated successfully',
            data: res.data?.pet || res.data?.data || null,
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error('updatePetListing error:', err);
        console.error('Error response:', err.response?.data);
        return {
            success: false,
            message: err?.response?.data?.message || 'Failed to update listing',
            data: null,
        };
    }
};

// -------------------------
// Get All Pets (Optional - for listing)
// -------------------------
// export const getAllPets = async (): Promise<ApiResponse<Pet[]>> => {
//     try {
//         const res = await api.get(`/v1/api/pets`);

//         return {
//             success: true,
//             message: res.data?.message || "Pets fetched successfully",
//             data: res.data?.data || res.data || [],
//         };
//     } catch (err: any) {
//         return {
//             success: false,
//             message: err?.response?.data?.message || "Failed to fetch pets",
//             data: [],
//         };
//     }
// };
