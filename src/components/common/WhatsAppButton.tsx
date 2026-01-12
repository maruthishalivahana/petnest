"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Loader2 } from 'lucide-react';
import { generateWhatsAppLink, trackWhatsAppClick } from '@/services/whatsappApi';
import { useToast } from '@/hooks/use-toast';
import { useAppSelector } from '@/store/hooks';
import { cn } from '@/lib/utils';

interface WhatsAppButtonProps {
    sellerId: string;
    petId: string;
    variant?: 'default' | 'outline' | 'ghost' | 'secondary';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
    fullWidth?: boolean;
    showIcon?: boolean;
}

export function WhatsAppButton({
    sellerId,
    petId,
    variant = 'default',
    size = 'default',
    className,
    fullWidth = false,
    showIcon = true
}: WhatsAppButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { user } = useAppSelector((state) => state.auth);

    const handleWhatsAppClick = async () => {
        if (!sellerId || !petId) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Missing seller or pet information'
            });
            return;
        }

        setIsLoading(true);

        try {
            // Step 1: Generate WhatsApp link (secure, no phone number exposed)
            const linkResult = await generateWhatsAppLink(sellerId, petId);

            if (!linkResult.success || !linkResult.data) {
                toast({
                    variant: 'destructive',
                    title: 'Unable to Connect',
                    description: linkResult.message || 'Seller contact information not available'
                });
                return;
            }

            const { whatsappLink } = linkResult.data;

            // Step 2: Track click for analytics (async, non-blocking)
            trackWhatsAppClick({
                sellerId,
                petId,
                buyerId: user?.id
            }).catch(err => {
                console.error('Failed to track WhatsApp click:', err);
                // Don't show error to user, this is analytics only
            });

            // Step 3: Open WhatsApp in new tab/window
            window.open(whatsappLink, '_blank', 'noopener,noreferrer');

            toast({
                title: 'Opening WhatsApp',
                description: 'You will be redirected to WhatsApp shortly'
            });

        } catch (error) {
            console.error('WhatsApp button error:', error);
            toast({
                variant: 'destructive',
                title: 'Connection Failed',
                description: 'Unable to open WhatsApp. Please try again later.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleWhatsAppClick}
            disabled={isLoading}
            variant={variant}
            size={size}
            className={cn(
                'bg-green-600 hover:bg-green-700 text-white transition-all duration-200',
                fullWidth && 'w-full',
                className
            )}
        >
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                </>
            ) : (
                <>
                    {showIcon && <MessageCircle className="mr-2 h-4 w-4" />}
                    Contact on WhatsApp
                </>
            )}
        </Button>
    );
}
