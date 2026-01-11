"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { ChevronRight, Sparkles, Loader2 } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { getAdsByPlacementAndDevice, trackAdImpression, trackAdClick, type AdListing } from "@/services/advertisementApi";

// Fallback ads when no ads are available from backend
const fallbackAds = [
    {
        id: "fallback-1",
        image: "https://images.unsplash.com/photo-1600077106724-946750eeaf3c?w=1920&q=80",
        title: "Welcome to PetNest",
        subtitle: "Find Your Perfect Pet Companion Today",
        tagline: "Where Pets Meet Their Forever Homes",
        brandName: "PetNest",
        button: "Explore Pets",
        link: "#",
        gradient: "from-orange-600/80 via-orange-500/60 to-transparent",
    },
];

// Gradient variations for dynamic ads
const gradients = [
    "from-orange-600/80 via-orange-500/60 to-transparent",
    "from-blue-600/80 via-blue-500/60 to-transparent",
    "from-purple-600/80 via-purple-500/60 to-transparent",
    "from-green-600/80 via-green-500/60 to-transparent",
    "from-pink-600/80 via-pink-500/60 to-transparent",
];

interface AdDisplay {
    id: string;
    image: string;
    title: string;
    subtitle?: string;
    tagline?: string;
    brandName?: string;
    button: string;
    link: string;
    gradient: string;
}

export default function AdBanner() {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [ads, setAds] = useState<AdDisplay[]>(fallbackAds);
    const [backendAds, setBackendAds] = useState<AdListing[]>([]);
    const [loading, setLoading] = useState(true);
    const trackedImpressions = useRef<Set<string>>(new Set());

    // Detect device type
    const getDeviceType = (): 'mobile' | 'desktop' => {
        if (typeof window === 'undefined') return 'desktop';
        return window.innerWidth < 768 ? 'mobile' : 'desktop';
    };

    // Fetch advertisements from backend
    useEffect(() => {
        const loadAdvertisements = async () => {
            try {
                setLoading(true);
                const device = getDeviceType();
                const advertisements = await getAdsByPlacementAndDevice('home_top_banner', device);

                if (advertisements && advertisements.length > 0) {
                    setBackendAds(advertisements);
                    // Transform backend ads to display format
                    const transformedAds: AdDisplay[] = advertisements.map((ad, index) => ({
                        id: ad._id,
                        image: ad.imageUrl,
                        title: ad.title,
                        subtitle: ad.subtitle,
                        tagline: ad.tagline,
                        brandName: ad.brandName,
                        button: ad.ctaText || "Learn More",
                        link: ad.redirectUrl,
                        gradient: gradients[index % gradients.length],
                    }));
                    setAds(transformedAds);
                } else {
                    // Use fallback ads if no approved ads available
                    setAds(fallbackAds);
                    setBackendAds([]);
                }
            } catch (error) {
                console.error("Failed to load advertisements:", error);
                setAds(fallbackAds);
                setBackendAds([]);
            } finally {
                setLoading(false);
            }
        };

        loadAdvertisements();
    }, []);

    useEffect(() => {
        if (!api) return;

        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    // Track impression for currently visible ad
    useEffect(() => {
        const trackCurrentAdImpression = async () => {
            if (backendAds.length > 0 && current < backendAds.length) {
                const currentAd = backendAds[current];
                if (currentAd && !trackedImpressions.current.has(currentAd._id)) {
                    await trackAdImpression(currentAd._id);
                    trackedImpressions.current.add(currentAd._id);
                }
            }
        };

        trackCurrentAdImpression();
    }, [current, backendAds]);

    // Handle ad click
    const handleAdClick = async (adId: string, redirectUrl: string) => {
        if (adId && backendAds.find(ad => ad._id === adId)) {
            await trackAdClick(adId);
        }
        window.open(redirectUrl, '_blank', 'noopener,noreferrer');
    };

    // Show loading state
    if (loading) {
        return (
            <div className="w-full h-[280px] sm:h-[320px] md:h-[400px] lg:h-[450px] bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-600 dark:text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Loading advertisements...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <Carousel
                setApi={setApi}
                className="relative w-full"
                opts={{
                    loop: true,
                    align: "start",
                }}
                plugins={[
                    Autoplay({
                        delay: 5000,
                        stopOnInteraction: true,
                    }),
                ]}
            >
                <CarouselContent>
                    {ads.map((ad, index) => (
                        <CarouselItem key={ad.id}>
                            <div className="relative h-[280px] sm:h-[320px] md:h-[400px] lg:h-[450px] w-full overflow-hidden group">
                                {/* Banner Image with Parallax Effect */}
                                <div className="absolute inset-0">
                                    <Image
                                        src={ad.image}
                                        alt={ad.title}
                                        fill
                                        priority={index === 0}
                                        className="object-cover transition-all duration-700 group-hover:scale-110"
                                        unoptimized
                                    />
                                    {/* Overlay Gradient */}
                                    <div className={`absolute inset-0 bg-gradient-to-r ${ad.gradient}`} />
                                    {/* Vignette Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                </div>

                                {/* Content Overlay */}
                                <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-16">
                                    {/* Brand Badge */}
                                    {ad.brandName && (
                                        <div className="inline-flex items-center gap-1.5 w-fit mb-3 sm:mb-4 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 animate-in fade-in slide-in-from-left-4 duration-500">
                                            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300" />
                                            <span className="text-white text-xs sm:text-sm font-semibold tracking-wide">
                                                {ad.brandName}
                                            </span>
                                        </div>
                                    )}

                                    {/* Title */}
                                    <h2 className="text-white font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl drop-shadow-2xl mb-2 sm:mb-3 max-w-2xl leading-tight animate-in fade-in slide-in-from-left-6 duration-700">
                                        {ad.title}
                                    </h2>

                                    {/* Subtitle */}
                                    {ad.subtitle && (
                                        <p className="text-white/95 text-sm sm:text-base md:text-lg lg:text-xl font-medium mb-3 sm:mb-4 max-w-xl drop-shadow-lg animate-in fade-in slide-in-from-left-8 duration-1000">
                                            {ad.subtitle}
                                        </p>
                                    )}

                                    {/* Tagline */}
                                    {ad.tagline && (
                                        <p className="text-white/90 text-xs sm:text-sm md:text-base font-normal mb-5 sm:mb-6 max-w-lg drop-shadow-lg animate-in fade-in slide-in-from-left-9 duration-1200 italic">
                                            {ad.tagline}
                                        </p>
                                    )}

                                    {/* CTA Button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleAdClick(ad.id, ad.link);
                                        }}
                                        className="inline-flex items-center justify-center w-fit bg-white hover:bg-gray-50 text-gray-900 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold text-sm sm:text-base shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 animate-in fade-in slide-in-from-left-10"
                                    >
                                        {ad.button}
                                        <ChevronRight className="ml-1 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Navigation Arrows - Hidden on mobile */}
                <CarouselPrevious className="hidden md:flex left-4 lg:left-8 w-12 h-12 bg-white/90 hover:bg-white border-none shadow-xl transition-all duration-300 hover:scale-110" />
                <CarouselNext className="hidden md:flex right-4 lg:right-8 w-12 h-12 bg-white/90 hover:bg-white border-none shadow-xl transition-all duration-300 hover:scale-110" />

                {/* Dots Indicator */}
                <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-2.5 z-10">
                    {ads.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => api?.scrollTo(index)}
                            className={`transition-all duration-300 rounded-full ${current === index
                                ? "w-8 sm:w-10 h-2 sm:h-2.5 bg-white shadow-lg"
                                : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/50 hover:bg-white/75"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </Carousel>
        </div>
    );
}
