'use client';

import { MapPin, Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface FeaturedPet {
    _id: string;
    name: string;
    breedName?: string;
    breed?: string;
    age: string | number;
    price: number;
    images?: string[];
    location?: string | {
        city?: string;
        state?: string;
        pincode?: string;
    };
}

interface FeaturedPetCardProps {
    pet: FeaturedPet;
}

export function FeaturedPetCard({ pet }: FeaturedPetCardProps) {
    const router = useRouter();

    if (!pet) return null;

    const {
        _id,
        name,
        breedName,
        breed,
        age,
        price,
        location,
        images,
    } = pet;

    // Format location
    const formatLocation = () => {
        if (!location) return 'Location not specified';
        if (typeof location === 'string') return location;
        const parts = [location.city, location.state].filter(Boolean);
        return parts.join(', ') || 'Location not specified';
    };

    // Get image URL with fallback
    const getImageUrl = () => {
        if (images && Array.isArray(images) && images.length > 0) {
            const firstImage = images[0];
            if (firstImage && firstImage.trim() !== '') return firstImage;
        }
        return 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80';
    };

    const imageUrl = getImageUrl();
    const displayBreed = breedName || breed || 'Unknown Breed';
    const formattedLocation = formatLocation();

    const handleClick = () => {
        if (_id) router.push(`/pets/${_id}`);
    };

    return (
        <div
            onClick={handleClick}
            className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-2xl ring-2 ring-amber-400"
        >
            {/* Featured Badge */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1.5 shadow-lg">
                <Star className="h-3.5 w-3.5 fill-white text-white" />
                <span className="text-xs font-bold text-white">Featured</span>
            </div>

            {/* Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <Image
                    src={imageUrl}
                    alt={`${name} - ${displayBreed}`}
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
                {/* Pet Name & Breed */}
                <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                        {name}
                    </h3>
                    <p className="text-sm font-medium text-gray-600 line-clamp-1">{displayBreed}</p>
                </div>

                {/* Age & Location */}
                <div className="mb-4 flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                        <span className="font-medium">Age:</span> {age}
                    </span>
                    <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="line-clamp-1">{formattedLocation}</span>
                    </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Price</p>
                        <p className="text-2xl font-bold text-amber-600">
                            ₹{price.toLocaleString()}
                        </p>
                    </div>
                    <button className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-amber-600 hover:shadow-lg active:scale-95">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
}
