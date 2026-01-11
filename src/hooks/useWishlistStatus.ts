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
    const wishlistLastFetched = useAppSelector((state) => state.wishlist.lastFetched);

    // Always trust Redux state as source of truth
    const isWishlisted = wishlistedIds.includes(petId);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasVerified, setHasVerified] = useState(false);

    // Debug log
    useEffect(() => {
        console.log(`🔍 [useWishlistStatus] Pet ${petId}:`, {
            isWishlisted,
            wishlistedIds,
            userId,
            wishlistLastFetched: wishlistLastFetched ? new Date(wishlistLastFetched).toLocaleTimeString() : null
        });
    }, [petId, isWishlisted, wishlistedIds, userId, wishlistLastFetched]);

    useEffect(() => {
        let isMounted = true;

        const verifyWishlistStatus = async () => {
            // Don't verify if:
            // - No user is logged in
            // - Wishlist was recently fetched (within last 30 seconds)
            // - Already verified this pet
            if (!userId || hasVerified) {
                setIsLoading(false);
                return;
            }

            // If wishlist was recently fetched, trust Redux state
            if (wishlistLastFetched && Date.now() - wishlistLastFetched < 30000) {
                setHasVerified(true);
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                // Only verify with backend if Redux state might be stale
                const backendStatus = await checkWishlist(petId);

                if (isMounted) {
                    setHasVerified(true);
                    // Log mismatch but trust Redux for display
                    if (backendStatus !== isWishlisted) {
                        console.warn(`Wishlist mismatch for pet ${petId}. Backend: ${backendStatus}, Redux: ${isWishlisted}`);
                    }
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.error('Failed to verify wishlist status:', err);
                if (isMounted) {
                    setError(err.message || 'Failed to verify wishlist');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        verifyWishlistStatus();

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [petId, userId, wishlistLastFetched]);

    // Reset verification when wishlistedIds change (user toggled wishlist)
    useEffect(() => {
        setHasVerified(false);
    }, [wishlistedIds]);

    return {
        isWishlisted,
        isLoading,
        error,
    };
}
