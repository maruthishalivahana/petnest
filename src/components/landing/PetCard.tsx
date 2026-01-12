'use client';

import { MapPin, Shield, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { WishlistButton } from '@/components/wishlist/WishlistButton';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Pet {
    _id?: string;
    name: string;
    breedName: string;
    age: string;
    price: number;
    location: { city: string; state: string; pincode: string };
    images?: string[];
    isVerified?: boolean;
    sellerId?: {
        userId: {
            name: string;
            _id: string;
        };
        brandName: string;
        _id: string;
    };
    description?: string;
    category?: string;
    currency?: string;
}

interface PetCardProps {
    pet: Pet;
}

export function PetCard({ pet }: PetCardProps) {
    const router = useRouter();

    // Guard clause
    if (!pet) return null;

    const {
        _id,
        name,
        breedName,
        age,
        price,
        location,
        images,
        isVerified = false,
        sellerId,
        description,
        currency = '₹',
    } = pet;

    // --- Logic Preservation with Enhancement ---
    const formatLocation = () => {
        if (!location) return 'Location not specified';

        // Handle if location is a string (possibly JSON)
        if (typeof location === 'string') {
            try {
                const parsed = JSON.parse(location);
                const parts = [parsed.city, parsed.state].filter(Boolean);
                return parts.join(', ') || 'Location not specified';
            } catch {
                // If not JSON, return as is (already formatted string)
                return location;
            }
        }

        // Handle object format
        if (typeof location === 'object' && location !== null) {
            const parts = [location.city, location.state].filter(Boolean);
            return parts.join(', ') || 'Location not specified';
        }

        return 'Location not specified';
    };

    const getSellerName = () => {
        if (sellerId?.userId?.name) return sellerId.userId.name;
        if (sellerId?.brandName) return sellerId.brandName;
        return null;
    };

    const getImageUrl = () => {
        if (images && Array.isArray(images) && images.length > 0) {
            const firstImage = images[0];
            if (firstImage && firstImage.trim() !== '') return firstImage;
        }
        return 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80';
    };

    const imageUrl = getImageUrl();
    const sellerName = getSellerName();
    const currencySymbol = currency?.toLowerCase() === 'indian' ? '₹' : (currency || '₹');
    const formattedPrice = typeof price === 'number' ? `${currencySymbol}${price.toLocaleString()}` : `${currencySymbol}${price}`;

    const handleViewDetails = () => {
        if (_id) router.push(`/pets/${_id}`);
    };

    return (
        <Card className="group flex flex-col h-full p-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-950 dark:border-slate-800">

            {/* --- 1. Hero Image Section --- */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <Image
                    src={imageUrl}
                    alt={`${name} - ${breedName}`}
                    fill
                    className="object-cover transition-transform  duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized
                />

                {/* Overlay Gradient for contrast (Bottom up) */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent opacity-60" />

                {/* Verified Badge */}
                {isVerified && (
                    <div className="absolute top-3 left-3 z-10">
                        <div className="flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-medium text-white shadow-sm backdrop-blur-sm">
                            <Shield className="h-3 w-3 fill-current" />
                            <span>Verified</span>
                        </div>
                    </div>
                )}

                {/* Wishlist Button (Glassmorphism container) */}
                {pet._id && (
                    <div className="absolute top-3 right-3 z-20 rounded-full bg-white/90 p-1.5 shadow-sm transition-transform active:scale-95">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <WishlistButton petId={pet._id} pet={pet as any} />
                    </div>
                )}
            </div>

            {/* --- 2. Content Body --- */}
            <div className="flex flex-1 flex-col p-4">

                {/* Header: Name & Breed */}
                <div className="mb-3">
                    <div className="flex items-start justify-between">
                        <h3 className="line-clamp-1 text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
                            {name}
                        </h3>
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {breedName}
                    </p>
                </div>

                {/* Attributes Grid */}
                <div className="mb-4 flex flex-wrap gap-y-2 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md dark:bg-slate-900">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{age}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md dark:bg-slate-900">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="line-clamp-1 max-w-[120px]">{formatLocation()}</span>
                    </div>
                </div>

                {/* Seller Info (Subtle) */}
                {sellerName && (
                    <div className="mb-4 flex items-center gap-1.5 text-xs text-slate-400">
                        <User className="h-3 w-3" />
                        <span className="truncate">By {sellerName}</span>
                    </div>
                )}

                {/* Description (Truncated) */}
                {description && (
                    <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {description}
                    </p>
                )}

                {/* --- 3. Footer Action Area --- */}
                <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col gap-3">
                        {/* Price Display */}
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm text-slate-500">Adoption Fee:</span>
                            <span className="text-xl font-bold text-slate-900 dark:text-white">
                                {formattedPrice}
                            </span>
                        </div>

                        {/* WhatsApp Button - Primary Action */}
                        {_id && sellerId?._id && (
                            <WhatsAppButton
                                sellerId={sellerId._id}
                                petId={_id}
                                size="default"
                                fullWidth
                                className="h-11 text-sm font-semibold rounded-xl"
                            />
                        )}

                        {/* View Details - Secondary Action */}
                        <Button
                            onClick={handleViewDetails}
                            variant="outline"
                            className="w-full rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all h-11 text-sm font-semibold"
                        >
                            View Details
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}