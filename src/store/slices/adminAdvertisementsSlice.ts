import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
    Advertisement,
    getAllAdvertisements,
    getAllPendingAdvertisements,
    getAllApprovedAdvertisements,
    updateAdvertisementStatus,
    deleteAdvertisement
} from '@/services/admin/adminAdvertisementService';

interface AdminAdvertisementsState {
    allAdvertisements: Advertisement[];
    pendingAdvertisements: Advertisement[];
    approvedAdvertisements: Advertisement[];
    loading: boolean;
    error: string | null;
}

const initialState: AdminAdvertisementsState = {
    allAdvertisements: [],
    pendingAdvertisements: [],
    approvedAdvertisements: [],
    loading: false,
    error: null,
};

// Async thunks
export const fetchAllAdvertisements = createAsyncThunk(
    'adminAdvertisements/fetchAll',
    async () => {
        const response = await getAllAdvertisements();
        return response;
    }
);

export const fetchPendingAdvertisements = createAsyncThunk(
    'adminAdvertisements/fetchPending',
    async () => {
        const response = await getAllPendingAdvertisements();
        return response;
    }
);

export const fetchApprovedAdvertisements = createAsyncThunk(
    'adminAdvertisements/fetchApproved',
    async () => {
        const response = await getAllApprovedAdvertisements();
        return response;
    }
);

export const updateAdStatusThunk = createAsyncThunk(
    'adminAdvertisements/updateStatus',
    async ({ adId, status }: { adId: string; status: 'approved' | 'rejected' }) => {
        await updateAdvertisementStatus(adId, status);
        return { adId, status };
    }
);

export const deleteAdThunk = createAsyncThunk(
    'adminAdvertisements/delete',
    async (adId: string) => {
        await deleteAdvertisement(adId);
        return adId;
    }
);

const adminAdvertisementsSlice = createSlice({
    name: 'adminAdvertisements',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all advertisements
            .addCase(fetchAllAdvertisements.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllAdvertisements.fulfilled, (state, action: PayloadAction<Advertisement[]>) => {
                state.loading = false;
                state.allAdvertisements = action.payload;
            })
            .addCase(fetchAllAdvertisements.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch advertisements';
            })
            // Fetch pending advertisements
            .addCase(fetchPendingAdvertisements.fulfilled, (state, action: PayloadAction<Advertisement[]>) => {
                state.pendingAdvertisements = action.payload;
            })
            // Fetch approved advertisements
            .addCase(fetchApprovedAdvertisements.fulfilled, (state, action: PayloadAction<Advertisement[]>) => {
                state.approvedAdvertisements = action.payload;
            })
            // Update ad status
            .addCase(updateAdStatusThunk.fulfilled, (state, action: PayloadAction<{ adId: string; status: 'approved' | 'rejected' }>) => {
                const { adId, status } = action.payload;
                state.pendingAdvertisements = state.pendingAdvertisements.filter(ad => ad._id !== adId);
                const ad = state.allAdvertisements.find(ad => ad._id === adId);
                if (ad) {
                    ad.isApproved = status === 'approved';
                    if (status === 'approved') {
                        state.approvedAdvertisements.push(ad);
                    }
                }
            })
            // Delete advertisement
            .addCase(deleteAdThunk.fulfilled, (state, action: PayloadAction<string>) => {
                const adId = action.payload;
                state.allAdvertisements = state.allAdvertisements.filter(ad => ad._id !== adId);
                state.pendingAdvertisements = state.pendingAdvertisements.filter(ad => ad._id !== adId);
                state.approvedAdvertisements = state.approvedAdvertisements.filter(ad => ad._id !== adId);
            });
    },
});

export const { clearError } = adminAdvertisementsSlice.actions;
export default adminAdvertisementsSlice.reducer;
