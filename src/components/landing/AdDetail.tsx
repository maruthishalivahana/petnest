"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ExternalLink, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAdsByPlacementAndDevice, trackAdClick, trackAdImpression, type AdListing } from "@/services/advertisementApi";

interface AdDetailProps {
    className?: string;
}

/**
 * Advertisement component for pet detail pages
 * Shows below pet description
 */
export default function AdDetail({ className = "" }: AdDetailProps) {
    const [ad, setAd] = useState<AdListing | null>(null);
    const [loading, setLoading] = useState(true);

    // Detect device type
    const getDeviceType = (): 'mobile' | 'desktop' => {
        if (typeof window === 'undefined') return 'desktop';
        return window.innerWidth < 768 ? 'mobile' : 'desktop';
    };

    useEffect(() => {
        const loadAd = async () => {
            try {
                setLoading(true);
                const device = getDeviceType();
                const ads = await getAdsByPlacementAndDevice('pet_detail_below_desc', device);

                if (ads && ads.length > 0) {
                    const selectedAd = ads[Math.floor(Math.random() * ads.length)];
                    setAd(selectedAd);

                    // Track impression
                    if (selectedAd._id) {
                        await trackAdImpression(selectedAd._id);
                    }
                }
            } catch (error) {
                console.error("Failed to load detail ad:", error);
            } finally {
                setLoading(false);
            }
        };

        loadAd();
    }, []);

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (ad?._id) {
            await trackAdClick(ad._id);
        }
        if (ad?.redirectUrl) {
            window.open(ad.redirectUrl, '_blank', 'noopener,noreferrer');
        }
    };

    if (loading) {
        return (
            <Card className={`overflow-hidden ${className}`}>
                <div className="animate-pulse">
                    <div className="h-64 bg-gray-200"></div>
                    <CardContent className="p-6 space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                </div>
            </Card>
        );
    }

    if (!ad) {
        return null;
    }

    return (
        <Card className={`overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 via-white to-yellow-50 border-2 border-orange-200 ${className}`}>
            {/* Sponsored Header */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-white" />
                        {ad.brandName && (
                            <span className="text-sm font-bold text-white uppercase tracking-wide">
                                {ad.brandName}
                            </span>
                        )}
                        {ad.brandName && <span className="text-white/70 mx-1">•</span>}
                        <span className="text-sm font-bold text-white uppercase tracking-wide">
                            Sponsored Content
                        </span>
                    </div>
                </div>
            </div>

            {/* Ad Image */}
            <div className="relative w-full h-64 md:h-80">
                <Image
                    src={ad.imageUrl}
                    alt={ad.title}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Ad Content */}
            <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {ad.title}
                </h3>

                {ad.subtitle && (
                    <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                        {ad.subtitle}
                    </p>
                )}

                {ad.tagline && (
                    <p className="text-gray-600 mb-6 italic">
                        "{ad.tagline}"
                    </p>
                )}

                <div className="flex gap-3">
                    <Button
                        onClick={handleClick}
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-6 text-lg"
                    >
                        <span>{ad.ctaText || 'Learn More'}</span>
                        <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                </div>

                {/* Metrics (optional) */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                        Advertisement • {ad.impressions || 0} views
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
