"use client";

import { Button } from '@/components/ui/button';
import { MessageCircle, Megaphone } from 'lucide-react';
import { generateBrandWhatsAppLink } from '@/services/whatsappApi';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface BrandWhatsAppButtonProps {
    variant?: 'default' | 'outline' | 'ghost' | 'secondary';
    size?: 'default' | 'sm' | 'lg';
    className?: string;
    fullWidth?: boolean;
}

export function BrandWhatsAppButton({
    variant = 'default',
    size = 'default',
    className,
    fullWidth = false
}: BrandWhatsAppButtonProps) {
    const { toast } = useToast();

    const handleClick = () => {
        try {
            const whatsappLink = generateBrandWhatsAppLink();
            window.open(whatsappLink, '_blank', 'noopener,noreferrer');

            toast({
                title: 'Opening WhatsApp',
                description: 'Contact us to advertise your brand on PetNest'
            });
        } catch (error) {
            console.error('Brand WhatsApp button error:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Unable to open WhatsApp. Please try again.'
            });
        }
    };

    return (
        <Button
            onClick={handleClick}
            variant={variant}
            size={size}
            className={cn(
                'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-200',
                fullWidth && 'w-full',
                className
            )}
        >
            <Megaphone className="mr-2 h-4 w-4" />
            Advertise Your Brand
        </Button>
    );
}

export function BrandCTACard() {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 p-8 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-3xl" />

            <div className="relative z-10 space-y-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Megaphone className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-2">
                            Advertise Your Pet Business
                        </h3>
                        <p className="text-white/90 text-sm leading-relaxed">
                            Reach thousands of pet lovers across Tamil Nadu. Showcase your brand
                            with premium placements and targeted campaigns.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-1">
                        <div className="text-3xl font-bold">10K+</div>
                        <div className="text-sm text-white/80">Monthly Visitors</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-3xl font-bold">500+</div>
                        <div className="text-sm text-white/80">Active Sellers</div>
                    </div>
                </div>

                <BrandWhatsAppButton
                    variant="outline"
                    size="lg"
                    fullWidth
                    className="border-2 border-white text-white hover:bg-white hover:text-purple-600"
                />

                <p className="text-xs text-white/70 text-center">
                    Get instant quotes • Quick response • Flexible packages
                </p>
            </div>
        </div>
    );
}
