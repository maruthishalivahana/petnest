'use client';

import { useEffect, useState } from 'react';
import { Heart, Loader2, ShoppingBag } from 'lucide-react';
import { PetCard } from '@/components/landing/PetCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setWishlistItems } from '@/store/slices/wishlistSlice';
import { getWishlistItems } from '@/services/wishlistApi';
import { toast } from 'sonner';

export default function Wishlist() {
    const dispatch = useAppDispatch();
    const wishlistItems = useAppSelector((state) => state.wishlist.items);
    const user = useAppSelector((state) => state.auth.user);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch wishlist on mount to get fresh data from backend
    useEffect(() => {
        if (user) {
            // Only show loading if no cached data
            if (wishlistItems.length === 0) {
                setLoading(true);
            }
            fetchWishlist();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchWishlist = async () => {
        if (!user) return;

        try {
            setError(null);

            const items = await getWishlistItems();
            console.log('Fetched wishlist items:', items);
            console.log('Items count:', items.length);
            dispatch(setWishlistItems({ items, userId: user.id }));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error('Error fetching wishlist:', err);
            setError(err.message || 'Failed to load wishlist');
            toast.error('Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                        <p className="text-muted-foreground">Loading your wishlist...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error && wishlistItems.length === 0) {
        return (
            <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
                            <Heart className="w-10 h-10 text-destructive" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            Something went wrong
                        </h2>
                        <p className="text-muted-foreground text-center max-w-md mb-6">
                            {error}
                        </p>
                        <button
                            onClick={fetchWishlist}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                        >
                            <Loader2 className="w-4 h-4" />
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Empty wishlist UI
    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
                            <Heart className="w-8 h-8 text-primary" />
                            My Wishlist
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Save your favorite pets to easily find them later
                        </p>
                    </div>

                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                            <Heart className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            Your wishlist is empty
                        </h2>
                        <p className="text-muted-foreground text-center max-w-md mb-8">
                            Start adding pets by clicking the heart icon
                        </p>
                        <a
                            href="/home"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Browse Pets
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // Show wishlist items
    return (
        <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
                        <Heart className="w-8 h-8 text-primary fill-primary" />
                        My Wishlist
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {wishlistItems.length} {wishlistItems.length === 1 ? 'pet' : 'pets'} saved
                    </p>
                </div>

                {/* Debug Info */}


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlistItems.length > 0 ? (
                        wishlistItems.map((pet) => {
                            console.log('Rendering pet card:', pet._id, pet.name);
                            return <PetCard key={pet._id} pet={pet} />;
                        })
                    ) : (
                        <div className="col-span-full text-center py-8 text-muted-foreground">
                            No pets in wishlist yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
