import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
    Species,
    Breed,
    getAllSpecies,
    getAllBreeds,
    createSpecies,
    createBreed,
    deleteSpecies,
    deleteBreed
} from '@/services/admin/adminSpeciesService';

interface AdminSpeciesState {
    species: Species[];
    breeds: Breed[];
    loading: boolean;
    error: string | null;
}

const initialState: AdminSpeciesState = {
    species: [],
    breeds: [],
    loading: false,
    error: null,
};

// Async thunks
export const fetchAllSpecies = createAsyncThunk(
    'adminSpecies/fetchAllSpecies',
    async () => {
        const response = await getAllSpecies();
        return response.species;
    }
);

export const fetchAllBreeds = createAsyncThunk(
    'adminSpecies/fetchAllBreeds',
    async () => {
        const response = await getAllBreeds();
        return response.breeds;
    }
);

export const createSpeciesThunk = createAsyncThunk(
    'adminSpecies/createSpecies',
    async (name: string) => {
        const response = await createSpecies({
            speciesName: name,
            category: 'Mammal', // Default category
        });
        return response.species;
    }
);

export const createBreedThunk = createAsyncThunk(
    'adminSpecies/createBreed',
    async ({ name, speciesId }: { name: string; speciesId: string }) => {
        const response = await createBreed(
            name,
            speciesId,
            'Mammal', // Default category
            'Allowed' // Default legal status
        );
        return response.breed;
    }
);

export const deleteSpeciesThunk = createAsyncThunk(
    'adminSpecies/deleteSpecies',
    async (id: string) => {
        await deleteSpecies(id);
        return id;
    }
);

export const deleteBreedThunk = createAsyncThunk(
    'adminSpecies/deleteBreed',
    async (id: string) => {
        await deleteBreed(id);
        return id;
    }
);

const adminSpeciesSlice = createSlice({
    name: 'adminSpecies',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all species
            .addCase(fetchAllSpecies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllSpecies.fulfilled, (state, action: PayloadAction<Species[]>) => {
                state.loading = false;
                state.species = action.payload;
            })
            .addCase(fetchAllSpecies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch species';
            })
            // Fetch all breeds
            .addCase(fetchAllBreeds.fulfilled, (state, action: PayloadAction<Breed[]>) => {
                state.breeds = action.payload;
            })
            // Create species
            .addCase(createSpeciesThunk.fulfilled, (state, action: PayloadAction<Species>) => {
                state.species.push(action.payload);
            })
            // Create breed
            .addCase(createBreedThunk.fulfilled, (state, action: PayloadAction<Breed>) => {
                state.breeds.push(action.payload);
                const species = state.species.find(s => s.id === action.payload.speciesId);
                if (species && species.breedCount !== undefined) {
                    species.breedCount += 1;
                }
            })
            // Delete species
            .addCase(deleteSpeciesThunk.fulfilled, (state, action: PayloadAction<string>) => {
                const speciesId = action.payload;
                state.species = state.species.filter(s => s.id !== speciesId);
                state.breeds = state.breeds.filter(b => b.speciesId !== speciesId);
            })
            // Delete breed
            .addCase(deleteBreedThunk.fulfilled, (state, action: PayloadAction<string>) => {
                const breedId = action.payload;
                const breed = state.breeds.find(b => b.id === breedId);
                if (breed) {
                    const species = state.species.find(s => s.id === breed.speciesId);
                    if (species && species.breedCount !== undefined) {
                        species.breedCount = Math.max(0, species.breedCount - 1);
                    }
                }
                state.breeds = state.breeds.filter(b => b.id !== breedId);
            });
    },
});

export const { clearError } = adminSpeciesSlice.actions;
export default adminSpeciesSlice.reducer;
