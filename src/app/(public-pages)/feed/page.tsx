"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, MapPin, DollarSign, Loader2 } from "lucide-react";
import { adTracker } from "@/utils/adTracker";
import BuyerFooter from "@/components/landing/BuyerFooter";

interface Pet {
    _id: string;
    name: string;
    species: string;
    breed: string;
    age: number;
    price: number;
    images: string[];
    location?: string;
    description?: string;
}

interface Advertisement {
    _id: string;
    brandName: string;
    message: string;
    mediaUrl: string;
    contactEmail: string;
    contactNumber?: string;
    redirectUrl?: string;
}

interface FeedItem {
    type: "pet" | "ad";
    data: Pet | Advertisement;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080";

function getDeviceType() {
    if (typeof window === "undefined") return "desktop";
    const width = window.innerWidth;
    if (width < 768) return "mobile";
    return "desktop";
}

export default function FeedPage() {
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        fetchFeed();

        // Cleanup on unmount
        return () => {
            adTracker.reset();
        };
    }, []);

    const fetchFeed = async (pageNum = 1) => {
        try {
            if (pageNum > 1) setLoadingMore(true);
            else setLoading(true);

            const device = getDeviceType();
            const response = await fetch(
                `${BASE_URL}/v1/api/feed?page=${pageNum}&limit=12&device=${device}`
            );
            const result = await response.json();

            if (result.success && result.data) {
                if (pageNum === 1) {
                    setFeedItems(result.data);
                } else {
                    setFeedItems((prev) => [...prev, ...result.data]);
                }

                // Check if there are more pages
                const { pagination } = result;
                if (pagination && pageNum >= pagination.totalPages) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error("Error fetching feed:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchFeed(nextPage);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">
                        Discover Pets
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <Card key={i} className="overflow-hidden">
                                <Skeleton className="h-48 w-full" />
                                <CardContent className="p-4">
                                    <Skeleton className="h-4 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-1/2" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Discover Pets
                    </h1>
                    <p className="text-gray-600">
                        Find your perfect companion from our curated collection
                    </p>
                </div>

                {/* Feed Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {feedItems.map((item, index) =>
                        item.type === "pet" ? (
                            <PetCard
                                key={`pet-${(item.data as Pet)._id}-${index}`}
                                pet={item.data as Pet}
                            />
                        ) : (
                            <InlineAdCard
                                key={`ad-${(item.data as Advertisement)._id}-${index}`}
                                ad={item.data as Advertisement}
                            />
                        )
                    )}
                </div>

                {/* Load More */}
                {hasMore && (
                    <div className="flex justify-center mt-12">
                        <Button
                            onClick={loadMore}
                            disabled={loadingMore}
                            size="lg"
                            className="bg-orange-500 hover:bg-orange-600"
                        >
                            {loadingMore ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                "Load More"
                            )}
                        </Button>
                    </div>
                )}

                {/* End of Feed */}
                {!hasMore && feedItems.length > 0 && (
                    <div className="text-center mt-12 text-gray-500">
                        <p>You've reached the end of the feed</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && feedItems.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg">
                            No pets available at the moment
                        </p>
                    </div>
                )}
            </div>

            {/* Main Footer */}
            <BuyerFooter />
        </div>
    );
}

function PetCard({ pet }: { pet: Pet }) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
            <Link href={`/pets/${pet._id}`}>
                <div className="relative h-48 overflow-hidden">
                    <Image
                        src={pet.images[0] || "/placeholder-pet.jpg"}
                        alt={pet.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        onClick={(e) => {
                            e.preventDefault();
                            // Add to wishlist logic
                        }}
                    >
                        <Heart className="h-4 w-4" />
                    </Button>
                </div>
                <CardContent className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {pet.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                        {pet.breed} • {pet.age} {pet.age === 1 ? "year" : "years"}
                    </p>
                    {pet.location && (
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                            <MapPin className="h-3 w-3 mr-1" />
                            {pet.location}
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-orange-600 font-bold">
                            <DollarSign className="h-4 w-4" />
                            {pet.price.toLocaleString()}
                        </div>
                        <Badge variant="secondary">{pet.species}</Badge>
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
}

function InlineAdCard({ ad }: { ad: Advertisement }) {
    const adRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (adRef.current) {
            adTracker.trackImpression(ad._id, adRef.current);
        }
    }, [ad._id]);

    const handleAdClick = () => {
        const redirectUrl = ad.redirectUrl || `mailto:${ad.contactEmail}`;
        adTracker.trackClick(ad._id, redirectUrl);
    };

    return (
        <Card
            ref={adRef}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200"
        >
            <div className="relative">
                <Badge
                    variant="secondary"
                    className="absolute top-2 left-2 bg-white/90 text-gray-600 text-xs z-10"
                >
                    Sponsored
                </Badge>
                <div className="relative h-48 overflow-hidden">
                    <Image
                        src={ad.mediaUrl || "/placeholder-ad.jpg"}
                        alt={ad.brandName}
                        fill
                        className="object-cover"
                    />
                </div>
            </div>
            <CardContent className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {ad.brandName}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {ad.message}
                </p>
                <Button
                    onClick={handleAdClick}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                >
                    Learn More
                </Button>
            </CardContent>
        </Card>
    );
}
