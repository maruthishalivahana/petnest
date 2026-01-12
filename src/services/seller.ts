import { setPets } from '@/store/slices/PetSlice';
import axios from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
// -------------------------



const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})


// get seller pet count

const getSellerPetCount = async () => {
    try {
        const res = await api.get(`/v1/api/seller/pet-count`);
        return res.data?.count || 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error('Error fetching seller pet count:', err);
        return 0;
    }
};
const getSellerpets = async () => {
    try {
        const res = await api.get(`/v1/api/seller/pets`);
        if (!res.data?.data || res.data?.data.length === 0) {
            console.log('No pets found for seller.');
            return [];
        }

        console.log('Seller pets fetched:', res.data?.data);
        setPets(res.data?.data); // Update the state with fetched pets
        return res.data?.data || [];
    } catch (error) {
        console.error('Error fetching seller pets:', error);
        return [];

    }
}

// Get seller details by sellerId
// const getSellerDetails = async (sellerId: string) => {
//     try {
//         const res = await api.get(`/v1/api/seller/details/${sellerId}`);
//         return res.data?.seller || null;
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (err: any) {
//         console.error('Error fetching seller details:', err);
//         throw err;
//     }
// };

// Get current logged-in seller's details
const getCurrentSellerDetails = async () => {
    try {
        // Use endpoint that gets seller for current authenticated user
        const res = await api.get(`/v1/api/seller/profile`);
        return res.data?.seller || null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error('Error fetching current seller details:', err);
        throw err;
    }
};

// Update seller profile with multipart/form-data
interface UpdateSellerProfileData {
    brandName?: string;
    bio?: string;
    whatsappNumber?: string;
    location?: {
        city?: string;
        state?: string;
        pincode?: string;
    };
    logo?: File;
}

const updateSellerProfile = async (data: UpdateSellerProfileData) => {
    try {
        const formData = new FormData();

        if (data.brandName) formData.append('brandName', data.brandName);
        if (data.bio) formData.append('bio', data.bio);
        if (data.whatsappNumber) formData.append('whatsappNumber', data.whatsappNumber);

        if (data.location) {
            if (data.location.city) formData.append('location[city]', data.location.city);
            if (data.location.state) formData.append('location[state]', data.location.state);
            if (data.location.pincode) formData.append('location[pincode]', data.location.pincode);
        }

        if (data.logo) {
            formData.append('logo', data.logo);
        }

        const res = await api.patch(`/v1/api/seller/profile`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return res.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error('Error updating seller profile:', err);
        throw err;
    }
};

export { getSellerPetCount, getSellerpets, getCurrentSellerDetails, updateSellerProfile };