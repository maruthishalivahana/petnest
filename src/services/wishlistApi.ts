import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// -------------------------
// Types
// -------------------------
export interface WishlistItem {
    _id: string;
    name: string;
    breedName: string;
    age: string;
    price: number;
    location: { city: string; state: string; pincode: string };
    images?: string[];
    isVerified?: boolean;
    sellerId?: {
        userId: {
            name: string;
            _id: string;
        };
        brandName: string;
        _id: string;
    };
    description?: string;
    category?: string;
    currency?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T | null;
}

// -------------------------
// Base Axios Config
// -------------------------
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// -------------------------
// Add to Wishlist
// -------------------------
export const addToWishlist = async (petId: string): Promise<ApiResponse> => {
    try {
        const res = await api.post(`/v1/api/buyer/wishlist/${petId}`, {});

        return {
            success: true,
            message: res.data?.message || "Added to wishlist",
            data: res.data?.data || null,
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return {
            success: false,
            message: err?.response?.data?.message || "Failed to add to wishlist",
            data: null,
        };
    }
};

// -------------------------
// Remove from Wishlist
// -------------------------
export const removeFromWishlist = async (petId: string): Promise<ApiResponse> => {
    try {
        const res = await api.delete(`/v1/api/buyer/wishlist/${petId}`);

        return {
            success: true,
            message: res.data?.message || "Removed from wishlist",
            data: res.data?.data || null,
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return {
            success: false,
            message: err?.response?.data?.message || "Failed to remove from wishlist",
            data: null,
        };
    }
};

// -------------------------
// Get Wishlist Items
// -------------------------
export const getWishlistItems = async (): Promise<WishlistItem[]> => {
    try {
        const res = await api.get(`/v1/api/buyer/wishlist`);

        console.log('Raw API response:', res.data);
        console.log('Response keys:', Object.keys(res.data || {}));

        // Backend may return in different formats, so normalize safely:
        let data =
            res.data?.wishlist ||
            res.data?.data?.wishlist ||
            res.data?.data ||
            res.data?.items ||
            res.data ||
            [];

        console.log('Normalized wishlist data:', data);
        console.log('Is array?', Array.isArray(data));

        // Log first item structure if available
        if (Array.isArray(data) && data.length > 0) {
            console.log('First item structure:', data[0]);
            console.log('First item keys:', Object.keys(data[0] || {}));
        }

        // If data has a pets array inside
        if (data?.pets && Array.isArray(data.pets)) {
            console.log('Found pets array, extracting...');
            data = data.pets;
        }

        // If each item has a petId field (populated), extract it
        if (Array.isArray(data) && data.length > 0) {
            if (data[0]?.petId && typeof data[0].petId === 'object') {
                console.log('Extracting petId objects...');
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data = data.map((item: any) => {
                    const pet = item.petId;
                    return {
                        _id: pet._id,
                        name: pet.name,
                        breedName: pet.breedName || pet.breedname || '',
                        age: pet.age,
                        price: pet.price,
                        location: pet.location,
                        images: pet.images,
                        isVerified: pet.isVerified,
                        sellerId: pet.sellerId,
                        description: pet.description,
                        category: pet.category,
                        currency: pet.currency,
                        gender: pet.gender,
                        status: pet.status
                    };
                });
            } else if (data[0]?.pet && typeof data[0].pet === 'object') {
                console.log('Extracting pet objects...');
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data = data.map((item: any) => {
                    const pet = item.pet;
                    return {
                        _id: pet._id,
                        name: pet.name,
                        breedName: pet.breedName || pet.breedname || '',
                        age: pet.age,
                        price: pet.price,
                        location: pet.location,
                        images: pet.images,
                        isVerified: pet.isVerified,
                        sellerId: pet.sellerId,
                        description: pet.description,
                        category: pet.category,
                        currency: pet.currency,
                        gender: pet.gender,
                        status: pet.status
                    };
                });
            }
        }

        const result = Array.isArray(data) ? data : [];
        console.log('Final result:', result);
        console.log('Result length:', result.length);
        if (result.length > 0) {
            console.log('First result item:', result[0]);
        }

        return result;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error("Wishlist Fetch Error:", err);
        console.error("Error response:", err?.response?.data);
        throw new Error(
            err?.response?.data?.message || "Failed to fetch wishlist items"
        );
    }
};

// -------------------------
// Check if Pet is in Wishlist
// -------------------------
export const checkWishlist = async (petId: string): Promise<boolean> => {
    try {
        const res = await api.get(`/v1/api/buyer/wishlist/check/${petId}`);

        // Normalize response - backend might return different formats
        return res.data?.isWishlisted || res.data?.data?.isWishlisted || false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error("Check Wishlist Error:", err);
        // If endpoint fails, return false (not wishlisted)
        return false;
    }
};
