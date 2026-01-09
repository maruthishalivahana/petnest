"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Phone, Mail, Calendar, ExternalLink, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchHomepageBanners, type Advertisement } from "@/services/advertisementApi";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdvertisementDisplay() {
    const [ads, setAds] = useState<Advertisement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAds = async () => {
            try {
                setLoading(true);
                const advertisements = await fetchHomepageBanners();
                setAds(advertisements);
            } catch (error) {
                console.error("Failed to load advertisements:", error);
            } finally {
                setLoading(false);
            }
        };

        loadAds();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="overflow-hidden">
                            <Skeleton className="h-48 w-full" />
                            <CardContent className="p-6 space-y-3">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (ads.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="max-w-md mx-auto">
                    <Sparkles className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No Advertisements Available
                    </h3>
                    <p className="text-gray-500">
                        Check back later for featured advertisements and special offers.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Featured Advertisements
                </h2>
                <p className="text-gray-600">
                    Discover amazing deals from our trusted partners
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ads.map((ad) => (
                    <Card
                        key={ad._id}
                        className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                    >
                        {/* Advertisement Image */}
                        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                            {ad.mediaUrl && (
                                <Image
                                    src={ad.mediaUrl}
                                    alt={ad.brandName}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    unoptimized
                                />
                            )}
                            <div className="absolute top-3 right-3">
                                <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    Featured
                                </Badge>
                            </div>
                        </div>

                        <CardContent className="p-6">
                            {/* Brand Name */}
                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                                {ad.brandName}
                            </h3>

                            {/* Message */}
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {ad.message}
                            </p>

                            {/* Contact Information */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <Phone className="w-4 h-4 text-blue-600" />
                                    <span className="truncate">{ad.contactNumber}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <Mail className="w-4 h-4 text-blue-600" />
                                    <span className="truncate">{ad.contactEmail}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {new Date(ad.createdAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                            </div>

                            {/* Call to Action */}
                            <Button
                                className="w-full"
                                variant="default"
                                onClick={() => window.open(ad.mediaUrl, "_blank")}
                            >
                                View Details
                                <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
