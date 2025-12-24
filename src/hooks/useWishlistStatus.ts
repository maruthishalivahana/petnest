import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { checkWishlist } from '@/services/wishlistApi';

/**
 * Hook to get real-time wishlist status for a pet
 * - Checks backend on mount
 * - Syncs with Redux state
 * - Returns loading state
 * 
 * This ensures UI always shows correct state from backend
 */
export function useWishlistStatus(petId: string) {
    const wishlistedIds = useAppSelector((state) => state.wishlist.wishlistedIds);
    const userId = useAppSelector((state) => state.auth.user?.id);

    const [isWishlisted, setIsWishlisted] = useState(() => {
        // Initial state from Redux (may be stale)
        return wishlistedIds.includes(petId);
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchWishlistStatus = async () => {
            if (!userId) {
                // User not logged in
                setIsWishlisted(false);
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                // Fetch real status from backend
                const backendStatus = await checkWishlist(petId);

                if (isMounted) {
                    setIsWishlisted(backendStatus);
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.error('Failed to check wishlist status:', err);
                if (isMounted) {
                    setError(err.message || 'Failed to check wishlist');
                    // Fallback to Redux state if backend fails
                    setIsWishlisted(wishlistedIds.includes(petId));
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchWishlistStatus();

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [petId, userId]); // Re-fetch if petId or user changes

    // Sync with Redux updates (optimistic updates)
    useEffect(() => {
        const reduxStatus = wishlistedIds.includes(petId);
        // Only update if not loading (to avoid overriding backend truth)
        if (!isLoading) {
            setIsWishlisted(reduxStatus);
        }
    }, [wishlistedIds, petId, isLoading]);

    return {
        isWishlisted,
        isLoading,
        error,
    };
}
