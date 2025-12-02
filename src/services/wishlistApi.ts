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

        // Backend may return in different formats, so normalize safely:
        const data =
            res.data?.wishlist ||
            res.data?.data ||
            res.data?.items ||
            res.data ||
            [];

        return Array.isArray(data) ? data : [];
    } catch (err: any) {
        console.error("Wishlist Fetch Error:", err);
        throw new Error(
            err?.response?.data?.message || "Failed to fetch wishlist items"
        );
    }
};
