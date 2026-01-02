import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SellerVerification, getAllPendingRequests, getAllVerifiedSellers, getAllSellerVerifications, verifySellerRequest } from '@/services/admin/adminSellerService';

interface AdminSellersState {
    pendingRequests: SellerVerification[];
    verifiedSellers: SellerVerification[];
    allVerifications: SellerVerification[];
    loading: boolean;
    error: string | null;
}

const initialState: AdminSellersState = {
    pendingRequests: [],
    verifiedSellers: [],
    allVerifications: [],
    loading: false,
    error: null,
};

// Async thunks
export const fetchPendingRequests = createAsyncThunk(
    'adminSellers/fetchPending',
    async () => {
        const response = await getAllPendingRequests();
        return response.requests;
    }
);

export const fetchVerifiedSellers = createAsyncThunk(
    'adminSellers/fetchVerified',
    async () => {
        const response = await getAllVerifiedSellers();
        return response.sellers;
    }
);

export const fetchAllVerifications = createAsyncThunk(
    'adminSellers/fetchAll',
    async () => {
        const response = await getAllSellerVerifications();
        return response.verifications;
    }
);

export const verifySellerThunk = createAsyncThunk(
    'adminSellers/verify',
    async ({ sellerRequestId, status }: { sellerRequestId: string; status: 'verified' | 'rejected' }) => {
        await verifySellerRequest(sellerRequestId, status);
        return { sellerRequestId, status };
    }
);

const adminSellersSlice = createSlice({
    name: 'adminSellers',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch pending requests
            .addCase(fetchPendingRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPendingRequests.fulfilled, (state, action: PayloadAction<SellerVerification[]>) => {
                state.loading = false;
                state.pendingRequests = action.payload;
            })
            .addCase(fetchPendingRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch pending requests';
            })
            // Fetch verified sellers
            .addCase(fetchVerifiedSellers.fulfilled, (state, action: PayloadAction<SellerVerification[]>) => {
                state.verifiedSellers = action.payload;
            })
            // Fetch all verifications
            .addCase(fetchAllVerifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllVerifications.fulfilled, (state, action: PayloadAction<SellerVerification[]>) => {
                state.loading = false;
                state.allVerifications = action.payload;
            })
            .addCase(fetchAllVerifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch verifications';
            })
            // Verify seller
            .addCase(verifySellerThunk.fulfilled, (state, action: PayloadAction<{ sellerRequestId: string; status: 'verified' | 'rejected' }>) => {
                const { sellerRequestId, status } = action.payload;

                // Update pendingRequests
                state.pendingRequests = state.pendingRequests.filter(r => r._id !== sellerRequestId);
                const seller = state.pendingRequests.find(r => r._id === sellerRequestId);
                if (seller && status === 'verified') {
                    state.verifiedSellers.push({ ...seller, status });
                }

                // Update allVerifications array with new status
                const verificationIndex = state.allVerifications.findIndex(v => v._id === sellerRequestId);
                if (verificationIndex !== -1) {
                    state.allVerifications[verificationIndex] = {
                        ...state.allVerifications[verificationIndex],
                        status
                    };
                }
            });
    },
});

export const { clearError } = adminSellersSlice.actions;
export default adminSellersSlice.reducer;
