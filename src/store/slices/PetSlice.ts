import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Pet } from "@/services/petApi";

interface PetState {
    pets: Pet[]; // All pets for listing
    currentPet: Pet | null; // Currently viewed pet details
    loading: boolean;
    error: string | null;
}

const initialState: PetState = {
    pets: [],
    currentPet: null,
    loading: false,
    error: null,
};

const petSlice = createSlice({
    name: "pet",
    initialState,
    reducers: {
        // Set all pets for listing page
        setPets: (state, action: PayloadAction<Pet[]>) => {
            state.pets = action.payload;
            state.error = null;
        },

        // Set loading state
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },

        // Set current pet details
        setCurrentPet: (state, action: PayloadAction<Pet | null>) => {
            state.currentPet = action.payload;
            state.loading = false;
            state.error = null;
        },

        // Set error
        setPetError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },

        // Clear current pet (when navigating away from details page)
        clearCurrentPet: (state) => {
            state.currentPet = null;
            state.error = null;
        },
    },
});

export const {
    setPets,
    setLoading,
    setCurrentPet,
    setPetError,
    clearCurrentPet
} = petSlice.actions;

export default petSlice.reducer;
