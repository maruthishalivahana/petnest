'use client';

import { Heart } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addWishlistItem, removeWishlistItem } from '@/store/slices/wishlistSlice';
import { addToWishlist, removeFromWishlist } from '@/services/wishlistApi';
import { cn } from '@/lib/utils';

type WishlistButtonVariant = 'icon-only' | 'default';

interface WishlistButtonProps {
    petId: string;
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
    const wishlistedIds = useAppSelector((state) => state.wishlist.wishlistedIds);
    const isWishlisted = wishlistedIds.includes(petId);

    const [loading, setLoading] = useState(false);

    const handleToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (loading) return;
        setLoading(true);

        try {
            if (isWishlisted) {
                dispatch(removeWishlistItem(petId));
                await removeFromWishlist(petId);
                toast.success('Removed from wishlist');
            } else {
                if (pet) dispatch(addWishlistItem(pet));
                await addToWishlist(petId);
                toast.success('Added to wishlist');
            }
        } catch (error) {
            // revert
            if (isWishlisted && pet) {
                dispatch(addWishlistItem(pet));
            } else {
                dispatch(removeWishlistItem(petId));
            }

            toast.error('Failed to update wishlist');
        }

        setLoading(false);
    };

    const icon = loading ? (
        <div className="h-5 w-5 animate-spin border-2 border-muted-foreground border-t-transparent rounded-full" />
    ) : (
        <Heart
            className={cn(
                'w-5 h-5 transition',
                isWishlisted ? 'fill-red-500 text-red-500' : 'text-muted-foreground',
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
                    'flex h-10 w-10 items-center justify-center rounded-full bg-card shadow hover:scale-110 disabled:opacity-50',
                    className
                )}
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
                'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium',
                isWishlisted ? 'bg-red-50 text-red-600' : 'bg-muted text-muted-foreground',
                className
            )}
        >
            {icon}
            {showText && (isWishlisted ? 'Wishlisted' : 'Add to Wishlist')}
        </button>
    );
}
