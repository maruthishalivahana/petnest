import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Pet } from "@/services/petApi";

interface PetState {
    pets: Pet[]; // All pets for listing
    currentPet: Pet | null; // Currently viewed pet details
    loading: boolean;
    error: string | null;
    searchQuery: string; // Current search query
    isSearching: boolean; // Flag to indicate if search is active
}

const initialState: PetState = {
    pets: [],
    currentPet: null,
    loading: false,
    error: null,
    searchQuery: "",
    isSearching: false,
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

        // Set search query
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },

        // Set searching state
        setIsSearching: (state, action: PayloadAction<boolean>) => {
            state.isSearching = action.payload;
        },

        // Clear search
        clearSearch: (state) => {
            state.searchQuery = "";
            state.isSearching = false;
        },
    },
});

export const {
    setPets,
    setLoading,
    setCurrentPet,
    setPetError,
    clearCurrentPet,
    setSearchQuery,
    setIsSearching,
    clearSearch
} = petSlice.actions;

export default petSlice.reducer;
