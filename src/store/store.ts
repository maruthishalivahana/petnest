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
import storage from 'redux-persist/lib/storage';

import authReducer from './slices/authSlice';
import petReducer from './slices/PetSlice';
import wishlistReducer from './slices/wishlistSlice';

// Persist config (NO transforms, NO Set logic)
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['wishlist'], // Add 'auth' if you want to persist auth
};

// Combine all reducers
const rootReducer = combineReducers({
    auth: authReducer,
    pet: petReducer,
    wishlist: wishlistReducer, // Must match state.wishlist
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
        }),
});

export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
