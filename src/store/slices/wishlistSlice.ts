import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Pet {
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

interface WishlistState {
    items: Pet[];
    wishlistedIds: string[];
    userId: string | null; // Track which user owns this wishlist
    lastFetched: number | null; // Timestamp for cache invalidation
}

const initialState: WishlistState = {
    items: [],
    wishlistedIds: [],
    userId: null,
    lastFetched: null,
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        setWishlistItems: (state, action: PayloadAction<{ items: Pet[]; userId: string }>) => {
            state.items = action.payload.items;
            state.wishlistedIds = action.payload.items.map((pet) => pet._id);
            state.userId = action.payload.userId;
            state.lastFetched = Date.now();
            console.log('💾 [Redux] Wishlist updated:', {
                itemsCount: state.items.length,
                wishlistedIds: state.wishlistedIds,
                userId: state.userId
            });
        },

        addWishlistItem: (state, action: PayloadAction<Pet>) => {
            const pet = action.payload;

            if (!state.wishlistedIds.includes(pet._id)) {
                state.items.push(pet);
                state.wishlistedIds.push(pet._id); // <-- FIXED
            }
        },

        removeWishlistItem: (state, action: PayloadAction<string>) => {
            const petId = action.payload;

            state.items = state.items.filter((p) => p._id !== petId);
            state.wishlistedIds = state.wishlistedIds.filter((id) => id !== petId); // <-- FIXED
        },

        clearWishlist: (state) => {
            state.items = [];
            state.wishlistedIds = [];
            state.userId = null;
            state.lastFetched = null;
        },
    },
});

export const {
    setWishlistItems,
    addWishlistItem,
    removeWishlistItem,
    clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
