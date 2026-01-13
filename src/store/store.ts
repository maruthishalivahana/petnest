import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from './storage';

import authReducer from './slices/authSlice';
import petReducer from './slices/PetSlice';
import wishlistReducer from './slices/wishlistSlice';
import adminUsersReducer from './slices/adminUsersSlice';
import adminSellersReducer from './slices/adminSellersSlice';
import adminPetsReducer from './slices/adminPetsSlice';
import adminAdvertisementsReducer from './slices/adminAdvertisementsSlice';
import adminSpeciesReducer from './slices/adminSpeciesSlice';
import { authMiddleware } from './middleware/authMiddleware';

// Persist config (NO transforms, NO Set logic)
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'wishlist'], // Persist both auth and wishlist
};

// Combine all reducers
const rootReducer = combineReducers({
    auth: authReducer,
    pet: petReducer,
    wishlist: wishlistReducer, // Must match state.wishlist
    adminUsers: adminUsersReducer,
    adminSellers: adminSellersReducer,
    adminPets: adminPetsReducer,
    adminAdvertisements: adminAdvertisementsReducer,
    adminSpecies: adminSpeciesReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure & export store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(authMiddleware),
});

export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
