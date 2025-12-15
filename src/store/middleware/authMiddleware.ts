import { Middleware } from '@reduxjs/toolkit';
import { logout, setCredentials } from '../slices/authSlice';
import { clearWishlist } from '../slices/wishlistSlice';
import { getWishlistItems } from '@/services/wishlistApi';

/**
 * Middleware to handle auth-related side effects
 * - Clears wishlist on logout
 * - Clears wishlist before login (prevents cross-user contamination)
 * - Fetches fresh wishlist after login
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
        getWishlistItems()
            .then((items) => {
                // Only update if user is still logged in and same user
                const currentUser = store.getState().auth.user;
                if (currentUser && currentUser.id === userId) {
                    store.dispatch({
                        type: 'wishlist/setWishlistItems',
                        payload: { items, userId },
                    });
                }
            })
            .catch((error) => {
                console.error('Failed to fetch wishlist after login:', error);
            });

        return result;
    }

    return next(action);
};
