"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ExternalLink, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchApprovedAdvertisements, type Advertisement } from "@/services/advertisementApi";

interface AdSidebarProps {
    adSpot?: string;
    maxAds?: number;
    className?: string;
}

/**
 * Compact sidebar advertisement widget
 * Perfect for sidebars, footer sections, or secondary spaces
 */
export default function AdSidebar({
    adSpot = "sidebar",
    maxAds = 3,
    className = ""
}: AdSidebarProps) {
    const [ads, setAds] = useState<Advertisement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAds = async () => {
            try {
                setLoading(true);
                const advertisements = await fetchApprovedAdvertisements(adSpot);
                setAds(advertisements.slice(0, maxAds));
            } catch (error) {
                console.error("Failed to load sidebar ads:", error);
            } finally {
                setLoading(false);
            }
        };

        loadAds();
    }, [adSpot, maxAds]);

    if (loading) {
        return (
            <div className={`space-y-4 ${className}`}>
                {[1, 2, 3].slice(0, maxAds).map((i) => (
                    <Card key={i} className="overflow-hidden">
                        <div className="h-32 bg-gray-200 animate-pulse" />
                        <CardContent className="p-3">
                            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (ads.length === 0) {
        return null; // Don't show anything if no ads
    }

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="text-sm font-semibold text-gray-700 mb-3">
                Sponsored
            </div>

            {ads.map((ad) => (
                <Card
                    key={ad._id}
                    className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
                    onClick={() => window.open(ad.mediaUrl, "_blank")}
                >
                    {/* Ad Image */}
                    <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        {ad.mediaUrl && (
                            <Image
                                src={ad.mediaUrl}
                                alt={ad.brandName}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                unoptimized
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>

                    <CardContent className="p-3">
                        {/* Brand Name */}
                        <h4 className="font-bold text-sm text-gray-900 mb-1 line-clamp-1">
                            {ad.brandName}
                        </h4>

                        {/* Message */}
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {ad.message}
                        </p>

                        {/* CTA */}
                        <Button
                            size="sm"
                            variant="outline"
                            className="w-full text-xs h-7"
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(ad.mediaUrl, "_blank");
                            }}
                        >
                            View Details
                            <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
