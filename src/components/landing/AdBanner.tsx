"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronRight, Sparkles } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const ads = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1600077106724-946750eeaf3c?w=1920&q=80",
        title: "Premium Pet Food",
        subtitle: "Healthy • Organic • Trusted by 10k+ Pet Parents",
        badge: "Best Seller",
        button: "Shop Now",
        link: "https://example.com",
        gradient: "from-orange-600/80 via-orange-500/60 to-transparent",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=1920&q=80",
        title: "Verified VetCare",
        subtitle: "Instant Online Consultations with Trusted Doctors",
        badge: "24/7 Available",
        button: "Book Now",
        link: "https://example.com",
        gradient: "from-blue-600/80 via-blue-500/60 to-transparent",
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1920&q=80",
        title: "Pet Accessories Sale",
        subtitle: "Up to 50% OFF — Limited Time",
        badge: "Hot Deal",
        button: "Explore",
        link: "https://example.com",
        gradient: "from-purple-600/80 via-purple-500/60 to-transparent",
    },
];

export default function AdBanner() {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) return;

        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

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
                                    {/* Badge */}
                                    <div className="inline-flex items-center gap-1.5 w-fit mb-3 sm:mb-4 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 animate-in fade-in slide-in-from-left-4 duration-500">
                                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300" />
                                        <span className="text-white text-xs sm:text-sm font-semibold tracking-wide">
                                            {ad.badge}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-white font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl drop-shadow-2xl mb-2 sm:mb-3 max-w-2xl leading-tight animate-in fade-in slide-in-from-left-6 duration-700">
                                        {ad.title}
                                    </h2>

                                    {/* Subtitle */}
                                    <p className="text-white/95 text-sm sm:text-base md:text-lg lg:text-xl font-medium mb-5 sm:mb-6 max-w-xl drop-shadow-lg animate-in fade-in slide-in-from-left-8 duration-1000">
                                        {ad.subtitle}
                                    </p>

                                    {/* CTA Button */}
                                    <a
                                        href={ad.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center w-fit bg-white hover:bg-gray-50 text-gray-900 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold text-sm sm:text-base shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 animate-in fade-in slide-in-from-left-10"
                                    >
                                        {ad.button}
                                        <ChevronRight className="ml-1 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                                    </a>
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
