'use client';

import { Heart, Info, MapPin, MessageCircle, Shield, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import Image from 'next/image';

interface Pet {
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
    const [isWishlisted, setIsWishlisted] = useState(false);

    // Guard clause to handle undefined pet
    if (!pet) {
        return null;
    }

    const {
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

    // Format location
    const formatLocation = () => {
        if (location) {
            const parts = [location.city, location.state, location.pincode].filter(Boolean);
            return parts.join(', ') || 'Location not specified';
        }
        return 'Location not specified';
    };

    // Get seller name
    const getSellerName = () => {
        if (sellerId?.userId?.name) {
            return sellerId.userId.name;
        }
        if (sellerId?.brandName) {
            return sellerId.brandName;
        }
        return null;
    };

    // Get image URL
    const getImageUrl = () => {
        if (images && Array.isArray(images) && images.length > 0) {
            const firstImage = images[0];
            if (firstImage && firstImage.trim() !== '') {
                return firstImage;
            }
        }
        return 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80';
    };

    const imageUrl = getImageUrl();
    const sellerName = getSellerName();

    // Convert currency string to rupee symbol
    const currencySymbol = currency?.toLowerCase() === 'indian' ? '₹' : (currency || '₹');
    const formattedPrice = typeof price === 'number' ? `${currencySymbol}${price.toLocaleString()}` : `${currencySymbol}${price}`;

    return (
        <Card className="group relative overflow-hidden rounded-2xl border bg-card shadow-lg transition-all duration-300 hover:shadow-2xl max-w-md p-0">

            {/* --- Image Section --- */}
            <div className="relative aspect-[4/3] overflow-hidden bg-muted/30">
                <Image
                    src={imageUrl}
                    alt={`${name} - ${breedName}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                />

                {/* Verified Badge - Top Left */}
                {isVerified && (
                    <div className="absolute top-3 left-3 z-10">
                        <div className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 backdrop-blur-sm">
                            <Shield className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
                            <span className="text-sm font-semibold text-primary-foreground">Verified</span>
                        </div>
                    </div>
                )}

                {/* Wishlist Button - Top Right */}
                <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-md transition-all hover:scale-110 active:scale-95 z-10"
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <Heart
                        className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-destructive text-destructive' : 'text-muted-foreground'
                            }`}
                    />
                </button>
            </div>

            {/* --- Content Section --- */}
            <div className="flex flex-col gap-3 p-4">

                {/* Name and Rating */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-2xl text-foreground leading-tight truncate">
                            {name}
                        </h3>
                        <p className="text-base text-muted-foreground mt-1">{breedName}</p>
                    </div>
                </div>

                {/* Age and Location */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="font-medium">{age}</span>
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{formatLocation()}</span>
                        </div>
                    </div>

                    {/* Seller Info */}
                    {sellerName && (
                        <p className="text-sm text-muted-foreground">
                            by <span className="font-medium text-foreground">{sellerName}</span>
                        </p>
                    )}
                </div>

                {/* Description */}
                {description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {description}
                    </p>
                )}

                {/* Price and Contact Button */}
                <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex-1">
                        <span className="text-3xl font-bold text-primary">
                            {formattedPrice}
                        </span>
                    </div>
                    <Button
                        size="default"
                        className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-lg transition-all px-7 font-semibold text-base h-10"
                    >
                        Contact
                    </Button>
                </div>
            </div>
        </Card>
    );
}
