import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PetVerification, getAllNotVerifiedPets, updatePetStatus } from '@/services/admin/adminPetService';

interface AdminPetsState {
    unverifiedPets: PetVerification[];
    loading: boolean;
    error: string | null;
}

const initialState: AdminPetsState = {
    unverifiedPets: [],
    loading: false,
    error: null,
};

// Async thunks
export const fetchUnverifiedPets = createAsyncThunk(
    'adminPets/fetchUnverified',
    async () => {
        const response = await getAllNotVerifiedPets();
        return response.pets;
    }
);

export const updatePetStatusThunk = createAsyncThunk(
    'adminPets/updateStatus',
    async ({ petId, status }: { petId: string; status: 'verified' | 'rejected' }) => {
        await updatePetStatus(petId, status);
        return { petId, status };
    }
);

const adminPetsSlice = createSlice({
    name: 'adminPets',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch unverified pets
            .addCase(fetchUnverifiedPets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUnverifiedPets.fulfilled, (state, action: PayloadAction<PetVerification[]>) => {
                state.loading = false;
                state.unverifiedPets = action.payload;
            })
            .addCase(fetchUnverifiedPets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch unverified pets';
            })
            // Update pet status
            .addCase(updatePetStatusThunk.fulfilled, (state, action: PayloadAction<{ petId: string; status: 'verified' | 'rejected' }>) => {
                const { petId } = action.payload;
                state.unverifiedPets = state.unverifiedPets.filter(p => p.id !== petId);
            });
    },
});

export const { clearError } = adminPetsSlice.actions;
export default adminPetsSlice.reducer;
