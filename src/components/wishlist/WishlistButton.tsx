'use client';

import { Heart } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { addWishlistItem, removeWishlistItem } from '@/store/slices/wishlistSlice';
import { addToWishlist, removeFromWishlist } from '@/services/wishlistApi';
import { useWishlistStatus } from '@/hooks/useWishlistStatus';
import { cn } from '@/lib/utils';

type WishlistButtonVariant = 'icon-only' | 'default';

interface WishlistButtonProps {
    petId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pet?: any;
    variant?: WishlistButtonVariant;
    className?: string;
    iconClassName?: string;
    showText?: boolean;
}

export function WishlistButton({
    petId,
    pet,
    variant = 'icon-only',
    className,
    iconClassName,
    showText,
}: WishlistButtonProps) {
    const dispatch = useAppDispatch();

    // Use the hook to get real backend status
    const { isWishlisted: backendIsWishlisted, isLoading: statusLoading } = useWishlistStatus(petId);

    const [isUpdating, setIsUpdating] = useState(false);

    // Use backend status as source of truth
    const isWishlisted = backendIsWishlisted;
    const loading = statusLoading || isUpdating;

    const handleToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (loading) return;
        setIsUpdating(true);

        // Store previous state for rollback
        const previousState = isWishlisted;

        try {
            if (isWishlisted) {
                // Optimistic update: remove from Redux
                dispatch(removeWishlistItem(petId));

                // Call backend
                const result = await removeFromWishlist(petId);

                if (!result.success) {
                    throw new Error(result.message);
                }

                toast.success('Removed from wishlist');
            } else {
                // Optimistic update: add to Redux
                if (pet) {
                    dispatch(addWishlistItem(pet));
                }

                // Call backend
                const result = await addToWishlist(petId);

                if (!result.success) {
                    throw new Error(result.message);
                }

                toast.success('Added to wishlist');
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Wishlist update error:', error);

            // Rollback optimistic update
            if (previousState) {
                // Was wishlisted, restore it
                if (pet) {
                    dispatch(addWishlistItem(pet));
                }
            } else {
                // Was not wishlisted, remove it
                dispatch(removeWishlistItem(petId));
            }

            toast.error(error.message || 'Failed to update wishlist');
        } finally {
            setIsUpdating(false);
        }
    };

    const icon = loading ? (
        <div className="h-5 w-5 animate-spin border-2 border-muted-foreground border-t-transparent rounded-full" />
    ) : (
        <Heart
            className={cn(
                'w-5 h-5 transition-all duration-200',
                isWishlisted
                    ? 'fill-red-500 text-red-500 stroke-red-500'
                    : 'fill-none text-muted-foreground hover:text-red-400 hover:fill-red-100',
                iconClassName
            )}
        />
    );

    if (variant === 'icon-only') {
        return (
            <button
                type="button"
                onClick={handleToggle}
                disabled={loading}
                className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full bg-card shadow hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all',
                    className
                )}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
                {icon}
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={handleToggle}
            disabled={loading}
            className={cn(
                'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                isWishlisted
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                className
            )}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            {icon}
            {showText && <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>}
        </button>
    );
}
