import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

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
// Get Single Pet by ID
// -------------------------
export const getPetById = async (petId: string): Promise<ApiResponse<Pet>> => {
    try {
        const res = await api.get(`/v1/api/buyer/pets/${petId}`);
        console.log("Pet details response:", res.data);

        return {
            success: true,
            message: res.data?.message || "Pet details fetched successfully",
            data: res.data?.pet || res.data?.data || res.data || null,
        };
    } catch (err: any) {
        return {
            success: false,
            message: err?.response?.data?.message || "Failed to fetch pet details",
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
