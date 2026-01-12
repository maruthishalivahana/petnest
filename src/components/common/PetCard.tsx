"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { WishlistButton } from '@/components/wishlist/WishlistButton';
import { MapPin, Eye, Heart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface PetCardProps {
    pet: {
        _id: string;
        name: string;
        breedName?: string;
        age?: string;
        price: number;
        images?: string[];
        location?: {
            city?: string;
            state?: string;
        };
        sellerId?: string | {
            _id: string;
            brandName?: string;
            userId?: {
                name?: string;
            };
        };
        category?: string;
        isVerified?: boolean;
    };
    showWhatsAppButton?: boolean;
    className?: string;
}

export function PetCard({ pet, showWhatsAppButton = true, className }: PetCardProps) {
    const router = useRouter();

    const imageUrl = pet.images && pet.images.length > 0
        ? pet.images[0]
        : 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80';

    // Robust location formatting to handle both object and string types
    const formatLocation = () => {
        if (!pet.location) return 'Location not specified';

        // Handle if location is already a string
        if (typeof pet.location === 'string') {
            try {
                // Try to parse if it's a JSON string
                const parsed = JSON.parse(pet.location);
                const parts = [parsed.city, parsed.state].filter(Boolean);
                return parts.join(', ') || 'Location not specified';
            } catch {
                // If not JSON, return as is
                return pet.location;
            }
        }

        // Handle object format
        if (typeof pet.location === 'object') {
            const parts = [pet.location.city, pet.location.state].filter(Boolean);
            return parts.join(', ') || 'Location not specified';
        }

        return 'Location not specified';
    };

    const location = formatLocation();

    const sellerId = typeof pet.sellerId === 'string'
        ? pet.sellerId
        : pet.sellerId?._id;

    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(pet.price);

    const handleCardClick = (e: React.MouseEvent) => {
        // Don't navigate if clicking on action buttons
        const target = e.target as HTMLElement;
        if (
            target.closest('button') ||
            target.closest('[role="button"]')
        ) {
            return;
        }
        router.push(`/pets/${pet._id}`);
    };

    return (
        <Card
            className={cn(
                "group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer",
                className
            )}
            onClick={handleCardClick}
        >
            {/* Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                    src={imageUrl}
                    alt={pet.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Wishlist Button Overlay */}
                <div className="absolute top-3 right-3 z-10">
                    <WishlistButton
                        petId={pet._id}
                        pet={pet}
                        variant="icon-only"
                        className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                    />
                </div>

                {/* Category Badge */}
                {pet.category && (
                    <div className="absolute top-3 left-3">
                        <Badge className="bg-primary/90 backdrop-blur-sm text-white">
                            {pet.category}
                        </Badge>
                    </div>
                )}

                {/* Verified Badge */}
                {pet.isVerified && (
                    <div className="absolute bottom-3 left-3">
                        <Badge variant="secondary" className="bg-green-500/90 text-white backdrop-blur-sm">
                            ✓ Verified
                        </Badge>
                    </div>
                )}
            </div>

            <CardContent className="p-4 space-y-3">
                {/* Pet Info */}
                <div>
                    <h3 className="font-bold text-lg leading-tight line-clamp-1 mb-1">
                        {pet.name || 'Unnamed Pet'}
                    </h3>

                    {pet.breedName && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                            {pet.breedName} {pet.age && `• ${pet.age}`}
                        </p>
                    )}

                    {!pet.breedName && pet.age && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                            {pet.age}
                        </p>
                    )}

                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                        <MapPin className="w-3 h-3" />
                        <span className="line-clamp-1">{location}</span>
                    </div>
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t">
                    <div>
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="text-xl font-bold text-primary">
                            {formattedPrice}
                        </p>
                    </div>

                    {showWhatsAppButton && sellerId ? (
                        <WhatsAppButton
                            sellerId={sellerId}
                            petId={pet._id}
                            size="sm"
                        />
                    ) : (
                        <button
                            onClick={() => router.push(`/pets/${pet._id}`)}
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary/90 hover:shadow-lg active:scale-95"
                        >
                            View Details
                        </button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
