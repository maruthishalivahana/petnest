"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAdsByPlacement, trackAdClick, trackAdImpression, type AdListing } from "@/services/advertisementApi";

interface AdInlineProps {
    className?: string;
}

/**
 * Inline advertisement component for pet feed
 * Blends naturally with feed content
 */
export default function AdInline({ className = "" }: AdInlineProps) {
    const [ad, setAd] = useState<AdListing | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAd = async () => {
            try {
                setLoading(true);
                const ads = await getAdsByPlacement('pet_feed_inline');

                if (ads && ads.length > 0) {
                    // Randomly select one ad from available ads
                    const randomAd = ads[Math.floor(Math.random() * ads.length)];
                    setAd(randomAd);

                    // Track impression
                    if (randomAd._id) {
                        await trackAdImpression(randomAd._id);
                    }
                }
            } catch (error) {
                console.error("Failed to load inline ad:", error);
            } finally {
                setLoading(false);
            }
        };

        loadAd();
    }, []);

    const handleClick = async () => {
        if (ad?._id) {
            await trackAdClick(ad._id);
            window.open(ad.redirectUrl, '_blank', 'noopener,noreferrer');
        }
    };

    if (loading) {
        return (
            <Card className={`overflow-hidden ${className}`}>
                <div className="animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <CardContent className="p-4 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardContent>
                </div>
            </Card>
        );
    }

    if (!ad) {
        return null;
    }

    return (
        <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 border-orange-200 ${className}`}>
            {/* Sponsored Badge */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 px-4 py-2 border-b border-orange-100">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
                        Sponsored
                    </span>
                </div>
            </div>

            {/* Ad Image */}
            <div className="relative w-full h-48">
                <Image
                    src={ad.imageUrl}
                    alt={ad.title}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Ad Content */}
            <CardContent className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                    {ad.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {ad.ctaText || 'Discover more'}
                </p>
                <Button
                    onClick={handleClick}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                >
                    {ad.ctaText || 'Learn More'}
                </Button>
            </CardContent>
        </Card>
    );
}
