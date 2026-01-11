"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdsByPlacement, trackAdClick, trackAdImpression, type AdListing } from "@/services/advertisementApi";

/**
 * Mobile sticky advertisement
 * Sticks to bottom of screen on mobile devices
 */
export default function AdMobileSticky() {
    const [ad, setAd] = useState<AdListing | null>(null);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check if device is mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const loadAd = async () => {
            try {
                setLoading(true);
                const ads = await getAdsByPlacement('pet_mobile_sticky');

                if (ads && ads.length > 0) {
                    const selectedAd = ads[0];
                    setAd(selectedAd);
                    setIsVisible(true);

                    // Track impression
                    if (selectedAd._id) {
                        await trackAdImpression(selectedAd._id);
                    }
                }
            } catch (error) {
                console.error("Failed to load mobile sticky ad:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isMobile) {
            loadAd();
        }
    }, [isMobile]);

    const handleClick = async () => {
        if (ad?._id) {
            await trackAdClick(ad._id);
            window.open(ad.redirectUrl, '_blank', 'noopener,noreferrer');
        }
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    // Don't show on desktop or if no ad
    if (!isMobile || !ad || !isVisible || loading) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden animate-in slide-in-from-bottom duration-300">
            <div className="bg-white border-t-2 border-orange-200 shadow-2xl">
                <div className="relative">
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                        aria-label="Close ad"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Ad Content */}
                    <div
                        onClick={handleClick}
                        className="flex items-center gap-3 p-3 cursor-pointer active:bg-gray-50"
                    >
                        {/* Ad Image */}
                        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                            <Image
                                src={ad.imageUrl}
                                alt={ad.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Ad Text */}
                        <div className="flex-1 min-w-0">
                            <div className="text-xs text-orange-600 font-semibold mb-1">
                                SPONSORED
                            </div>
                            <h4 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1">
                                {ad.title}
                            </h4>
                            <p className="text-xs text-gray-600 line-clamp-1">
                                {ad.ctaText || 'Tap to learn more'}
                            </p>
                        </div>

                        {/* CTA Button */}
                        <Button
                            size="sm"
                            className="bg-orange-600 hover:bg-orange-700 flex-shrink-0"
                        >
                            View
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
