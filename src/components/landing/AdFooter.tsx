"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ExternalLink, ArrowRight, Sparkles } from "lucide-react";
import { getAdsByPlacementAndDevice, trackAdClick, trackAdImpression, type AdListing } from "@/services/advertisementApi";

export default function AdFooter() {
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
                const ads = await getAdsByPlacementAndDevice('home_footer', device);

                if (ads && ads.length > 0) {
                    const selectedAd = ads[0];
                    setAd(selectedAd);

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

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (ad?._id) {
            await trackAdClick(ad._id);
        }
        if (ad?.redirectUrl) {
            window.open(ad.redirectUrl, '_blank', 'noopener,noreferrer');
        }
    };

    // Modern Loading Skeleton
    if (loading) {
        return (
            <div className="w-full py-8 bg-gray-50/50">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="h-40 w-full bg-white rounded-2xl border border-gray-200 p-6 flex items-center gap-6 animate-pulse">
                        <div className="h-28 w-28 md:w-48 bg-gray-100 rounded-xl shrink-0" />
                        <div className="flex-1 space-y-3">
                            <div className="h-4 w-20 bg-gray-100 rounded-full" />
                            <div className="h-6 w-3/4 bg-gray-100 rounded-lg" />
                            <div className="h-4 w-1/2 bg-gray-100 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!ad) {
        return null;
    }

    return (
        <section className="w-full bg-gradient-to-b from-transparent to-gray-50 py-8 md:py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <button
                    onClick={handleClick}
                    className="relative w-full group text-left outline-none"
                    aria-label={`View ad for ${ad.title}`}
                >
                    {/* Main Card Container */}
                    <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 ease-out">

                        {/* Decorative Background Blur (Optional Glow) */}
                        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />

                        <div className="relative grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-6 p-5 md:p-6 items-center">

                            {/* 1. Image Section */}
                            <div className="relative w-full md:w-56 h-48 md:h-32 shrink-0 rounded-xl overflow-hidden shadow-inner bg-gray-50">
                                <Image
                                    src={ad.imageUrl}
                                    alt={ad.title}
                                    fill
                                    className="object-fit transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                />
                                {/* Mobile Badge */}
                                <div className="absolute top-2 left-2 md:hidden bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                    Sponsored
                                </div>
                            </div>

                            {/* 2. Content Section */}
                            <div className="flex flex-col justify-center space-y-2">
                                <div className="hidden md:flex items-center gap-2 mb-1">
                                    <span className="bg-orange-50 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-orange-100">
                                        Sponsored
                                    </span>
                                    {ad.brandName && (
                                        <>
                                            <span className="text-gray-300 text-[10px]">•</span>
                                            <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                                {ad.brandName} <Sparkles className="w-3 h-3 text-orange-400" />
                                            </span>
                                        </>
                                    )}
                                </div>

                                <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-tight group-hover:text-orange-600 transition-colors">
                                    {ad.title}
                                </h3>

                                {ad.subtitle && (
                                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 md:line-clamp-1">
                                        {ad.subtitle}
                                    </p>
                                )}

                                {ad.tagline && (
                                    <p className="text-gray-400 text-xs font-medium italic">
                                        {ad.tagline}
                                    </p>
                                )}
                            </div>

                            {/* 3. Action Section (Button) */}
                            <div className="mt-2 md:mt-0 flex items-center md:pl-6 md:border-l border-gray-100">
                                <div className="w-full md:w-auto bg-gray-50 group-hover:bg-orange-600 text-gray-900 group-hover:text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-sm">
                                    {ad.ctaText || 'View Offer'}
                                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </div>
                </button>

                {/* Transparency Disclosure (Optional footer text) */}
                <div className="flex justify-end mt-2">
                    <span className="text-[10px] text-gray-400">Advertisement</span>
                </div>
            </div>
        </section>
    );
}