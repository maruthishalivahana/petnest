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

export { getSellerPetCount, getSellerpets, getCurrentSellerDetails };