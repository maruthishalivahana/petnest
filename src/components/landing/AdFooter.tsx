"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { getAdsByPlacement, trackAdClick, trackAdImpression, type AdListing } from "@/services/advertisementApi";

export default function AdFooter() {
    const [ad, setAd] = useState<AdListing | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAd = async () => {
            try {
                setLoading(true);
                const ads = await getAdsByPlacement('home_footer');

                if (ads && ads.length > 0) {
                    const selectedAd = ads[0]; // Get first ad
                    setAd(selectedAd);

                    // Track impression
                    if (selectedAd._id) {
                        await trackAdImpression(selectedAd._id);
                    }
                }
            } catch (error) {
                console.error("Failed to load footer ad:", error);
            } finally {
                setLoading(false);
            }
        };

        loadAd();
    }, []);

    const handleClick = async () => {
        if (ad?._id) {
            await trackAdClick(ad._id);
        }
    };

    if (loading) {
        return (
            <div className="w-full bg-gradient-to-r from-orange-50 to-orange-100 animate-pulse">
                <div className="container mx-auto px-4 py-8">
                    <div className="h-32 bg-white/50 rounded-lg"></div>
                </div>
            </div>
        );
    }

    if (!ad) {
        return null;
    }

    return (
        <div className="w-full bg-gradient-to-r from-orange-50 to-orange-100 border-t border-orange-200">
            <div className="container mx-auto px-4 py-6">
                <a
                    href={ad.redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleClick}
                    className="block group"
                >
                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                        <div className="flex flex-col md:flex-row items-center gap-6 p-6">
                            {/* Ad Image */}
                            <div className="relative w-full md:w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                                <Image
                                    src={ad.imageUrl}
                                    alt={ad.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* Ad Content */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                    <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
                                        Sponsored
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                    {ad.title}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                    {ad.ctaText || 'Click to learn more'}
                                </p>
                                <div className="inline-flex items-center gap-2 text-orange-600 font-semibold text-sm group-hover:gap-3 transition-all">
                                    Learn More
                                    <ExternalLink className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
}
