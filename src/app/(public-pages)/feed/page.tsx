"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, MapPin, DollarSign, Loader2, Sparkles, ArrowRight } from "lucide-react";
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
        // Always fetch fresh data on mount to ensure updates are reflected
        setPage(1);
        setHasMore(true);
        fetchFeed();

        // Cleanup on unmount
        return () => {
            adTracker.reset();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                            <div className="col-span-full">
                                <InlineAdCard
                                    key={`ad-${(item.data as Advertisement)._id}-${index}`}
                                    ad={item.data as Advertisement}
                                />
                            </div>
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
        window.open(redirectUrl, "_blank");
    };

    return (
        <div
            ref={adRef}
            onClick={handleAdClick}
            className="relative w-full rounded-2xl bg-slate-50 p-6 sm:p-8 cursor-pointer transition hover:shadow-md"
        >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

                {/* LEFT CONTENT */}
                <div className="max-w-xl space-y-3">
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                        <Sparkles className="w-4 h-4" />
                        {ad.brandName}
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900">
                        {ad.brandName}
                    </h3>

                    <p className="text-zinc-600 text-sm sm:text-base leading-relaxed line-clamp-2">
                        {ad.message}
                    </p>

                    <Button
                        className="rounded-full px-5"
                        onClick={handleAdClick}
                    >
                        Learn More
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>

                {/* RIGHT FLOATING UI */}
                <div className="relative hidden md:block w-[220px] h-[140px]">
                    {/* Bubble 1 */}
                    <div className="absolute top-0 right-8 bg-white rounded-xl px-4 py-2 shadow-sm text-sm font-medium">
                        Verified
                    </div>

                    {/* Bubble 2 */}
                    <div className="absolute top-12 left-0 bg-white rounded-xl px-4 py-2 shadow-sm text-sm font-medium">
                        Trusted Brand
                    </div>

                    {/* Image Bubble */}
                    <div className="absolute bottom-0 right-6 bg-white p-1 rounded-full shadow-md">
                        <div className="relative w-14 h-14 rounded-full overflow-hidden">
                            <Image
                                src={ad.mediaUrl || "/placeholder-ad.jpg"}
                                alt={ad.brandName}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

