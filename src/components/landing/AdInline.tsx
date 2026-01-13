"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    getAdsByPlacementAndDevice,
    trackAdClick,
    trackAdImpression,
    type AdListing,
} from "@/services/advertisementApi";
import { cn } from "@/lib/utils";

interface AdInlineProps {
    className?: string;
}

export default function AdInline({ className = "" }: AdInlineProps) {
    const [ad, setAd] = useState<AdListing | null>(null);
    const [loading, setLoading] = useState(true);

    const getDeviceType = (): "mobile" | "desktop" => {
        if (typeof window === "undefined") return "desktop";
        return window.innerWidth < 768 ? "mobile" : "desktop";
    };

    useEffect(() => {
        const loadAd = async () => {
            try {
                setLoading(true);
                const device = getDeviceType();
                const ads = await getAdsByPlacementAndDevice("pet_feed_inline", device);

                if (ads && ads.length > 0) {
                    const randomAd = ads[Math.floor(Math.random() * ads.length)];
                    setAd(randomAd);
                    if (randomAd._id) await trackAdImpression(randomAd._id);
                }
            } catch (error) {
                console.error("[AdInline] Failed to load inline ad:", error);
            } finally {
                setLoading(false);
            }
        };
        loadAd();
    }, []);

    const handleClick = async () => {
        if (ad?._id) {
            await trackAdClick(ad._id);
            window.open(ad.redirectUrl, "_blank", "noopener,noreferrer");
        }
    };

    if (loading) {
        return (
            <div className={cn("w-full overflow-hidden rounded-2xl shadow-md", className)}>
                <div className="relative h-[380px] bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                    <div className="h-full px-6 py-6">
                        <Skeleton className="h-6 w-24 rounded-full mb-3" />
                        <Skeleton className="h-8 w-3/4 rounded-lg mb-2" />
                        <Skeleton className="h-4 w-2/3 rounded-lg mb-4" />
                        <Skeleton className="h-10 w-32 rounded-lg" />
                    </div>
                </div>
            </div>
        );
    }

    if (!ad) return null;

    const gradients = [
        "from-blue-400/90 via-blue-500/80 to-blue-600/90",
        "from-orange-400/90 via-orange-500/80 to-orange-600/90",
        "from-purple-400/90 via-purple-500/80 to-purple-600/90",
        "from-green-400/90 via-green-500/80 to-emerald-600/90",
        "from-pink-400/90 via-pink-500/80 to-rose-600/90",
        "from-amber-300/90 via-yellow-400/80 to-orange-500/90"
    ];
    const gradient = gradients[Math.floor(Math.random() * gradients.length)];

    return (
        <div
            onClick={handleClick}
            className={cn(
                "group relative w-full overflow-hidden rounded-2xl cursor-pointer shadow-md transition-all duration-300 hover:scale-105 hover:shadow-2xl",
                className
            )}
        >
            <div
                className={cn(
                    "relative w-full h-[380px] bg-gradient-to-br",
                    gradient
                )}
            >
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src={ad.imageUrl}
                        alt={ad.title}
                        fill
                        className="object-cover object-center opacity-20"
                        sizes="100vw"
                        priority
                    />
                </div>

                {/* Content */}
                <div className="relative h-full px-8 sm:px-10 lg:px-14 py-8 sm:py-10 flex flex-col justify-center text-white">
                    {/* Brand badge */}
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 sm:px-5 py-2 rounded-full w-fit mb-4">
                        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm font-bold uppercase tracking-wide">
                            {ad.brandName || "Sponsored"}
                        </span>
                    </div>

                    {/* Title */}
                    <div className="mb-3">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
                            {ad.title}
                        </h3>
                    </div>

                    {/* Subtitle */}
                    {ad.subtitle && (
                        <div className="mb-6">
                            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 leading-relaxed font-medium line-clamp-2 max-w-2xl">
                                {ad.subtitle}
                            </p>
                        </div>
                    )}

                    {/* CTA Button */}
                    <div>
                        <Button
                            className="bg-white text-gray-900 hover:bg-white/90 rounded-full px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base lg:text-lg font-bold shadow-xl transition-all duration-300 group-hover:scale-105 w-fit"
                        >
                            {ad.ctaText || "Start Now"}
                            <ArrowRight className="ml-2 sm:ml-2.5 w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>
                </div>

                {/* External link icon - top right corner */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-md p-1.5 sm:p-2 rounded-full">
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
}
