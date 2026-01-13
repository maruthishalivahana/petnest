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
    const currencySymbol = currency === 'INR' || currency === 'indian' ? '₹' : currency === 'USD' ? '$' : '₹';
    const formattedPrice = typeof price === 'number' ? `${currencySymbol}${price.toLocaleString('en-IN')}` : `${currencySymbol}${price}`;

    const handleViewDetails = () => {
        if (_id) router.push(`/pets/${_id}`);
    };

    return (
        <div
            className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800"
        >
            {/* Verified Badge */}
            {isVerified && (
                <div className="absolute top-3 left-3 z-10">
                    <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 px-3 py-1.5 shadow-lg">
                        <Shield className="h-3.5 w-3.5 fill-white text-white" />
                        <span className="text-xs font-bold text-white">Verified</span>
                    </div>
                </div>
            )}

            {/* Wishlist Button */}
            {pet._id && (
                <div className="absolute top-3 right-3 z-20 rounded-full bg-white/90 p-1.5 shadow-lg transition-transform active:scale-95 backdrop-blur-sm">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <WishlistButton petId={pet._id} pet={pet as any} />
                </div>
            )}

            {/* Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <Image
                    src={imageUrl}
                    alt={`${name} - ${breedName}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Pet Name & Breed - Horizontal Layout */}
                <div className="mb-3 flex items-center justify-between gap-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
                        {name}
                    </h3>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">{breedName}</p>
                </div>

                {/* Description */}
                {description && (
                    <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                        {description}
                    </p>
                )}

                {/* Age & Location - Horizontal Layout */}
                <div className="mb-3 flex items-center justify-between text-sm text-gray-500 gap-2">
                    <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{age}</span>
                    </span>
                    <span className="flex items-center gap-1 flex-1 justify-end">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="line-clamp-1  gap-5 text-right">{formatLocation()}</span>
                    </span>
                </div>

                {/* Seller Info - Horizontal */}
                {sellerName && (
                    <div className="mb-3 flex items-center gap-1.5 text-xs text-gray-400">
                        <User className="h-3 w-3" />
                        <span className="truncate">By {sellerName}</span>
                    </div>
                )}

                {/* Price & Actions */}
                <div className="border-t border-gray-100 dark:border-slate-800 pt-3">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-baseline gap-2">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Price:</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {formattedPrice}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 items-stretch">
                        {/* WhatsApp Button */}
                        {_id && sellerId?._id && (
                            <WhatsAppButton
                                sellerId={sellerId._id}
                                petId={_id}
                                size="sm"
                                fullWidth={false}
                                className="flex-1 h-10 text-sm font-semibold rounded-lg"
                            />
                        )}

                        {/* View Details Button */}
                        <button
                            onClick={handleViewDetails}
                            className="flex-1 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 px-4 text-sm font-semibold text-gray-900 dark:text-white shadow-sm transition-all hover:bg-slate-200 dark:hover:bg-slate-700 hover:shadow-md active:scale-95 flex items-center justify-center"
                        >
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}