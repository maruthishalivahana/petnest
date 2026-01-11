import { Middleware } from '@reduxjs/toolkit';
import { logout, setCredentials, restoreSession } from '../slices/authSlice';
import { clearWishlist } from '../slices/wishlistSlice';
import { getWishlistItems } from '@/services/wishlistApi';

/**
 * Middleware to handle auth-related side effects
 * - Clears wishlist on logout
 * - Clears wishlist before login (prevents cross-user contamination)
 * - Fetches fresh wishlist after login OR session restore
 */
export const authMiddleware: Middleware = (store) => (next) => (action) => {
    // Handle logout
    if (logout.match(action)) {
        // Clear wishlist BEFORE logout completes
        store.dispatch(clearWishlist());
    }

    // Handle login - clear old wishlist and fetch new one
    if (setCredentials.match(action)) {
        // Clear any existing wishlist from previous user
        store.dispatch(clearWishlist());

        // Proceed with login
        const result = next(action);

        // Fetch fresh wishlist for the new user (async, non-blocking)
        const userId = action.payload.user.id;
        console.log('🔄 [Login] Fetching wishlist for user:', userId);
        getWishlistItems()
            .then((items) => {
                console.log('✅ [Login] Wishlist items fetched:', items.length, 'items');
                console.log('📋 [Login] Wishlisted pet IDs:', items.map(pet => pet._id));
                // Only update if user is still logged in and same user
                const currentUser = store.getState().auth.user;
                if (currentUser && currentUser.id === userId) {
                    store.dispatch({
                        type: 'wishlist/setWishlistItems',
                        payload: { items, userId },
                    });
                    console.log('✅ [Login] Wishlist stored in Redux');
                }
            })
            .catch((error) => {
                console.error('❌ [Login] Failed to fetch wishlist:', error);
            });

        return result;
    }

    // Handle session restore - fetch wishlist for returning user
    if (restoreSession.match(action)) {
        // Proceed with session restore
        const result = next(action);

        // If session was successfully restored with a user, fetch their wishlist
        const payload = action.payload;
        if (payload && payload.user) {
            const userId = payload.user.id || payload.user._id;
            console.log('🔄 [Session Restore] Fetching wishlist for user:', userId);

            // Fetch wishlist for the restored user (async, non-blocking)
            getWishlistItems()
                .then((items) => {
                    console.log('✅ [Session Restore] Wishlist items fetched:', items.length, 'items');
                    console.log('📋 [Session Restore] Wishlisted pet IDs:', items.map(pet => pet._id));
                    // Only update if user is still logged in and same user
                    const currentUser = store.getState().auth.user;
                    if (currentUser && currentUser.id === userId) {
                        store.dispatch({
                            type: 'wishlist/setWishlistItems',
                            payload: { items, userId },
                        });
                        console.log('✅ [Session Restore] Wishlist stored in Redux');
                    }
                })
                .catch((error) => {
                    console.error('❌ [Session Restore] Failed to fetch wishlist:', error);
                });
        }

        return result;
    }

    return next(action);
};
