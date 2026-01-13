"use client";

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { WhatsAppAnalytics } from '@/components/seller/WhatsAppAnalytics';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';

interface SellerAnalyticsData {
    totalWhatsappClicks: number;
    pets: Array<{
        _id: string;
        name: string;
        whatsappClicks: number;
    }>;
}

export default function SellerAnalyticsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { user } = useAppSelector((state) => state.auth);
    const [analytics, setAnalytics] = useState<SellerAnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/v1/api/seller/analytics/whatsapp');
            setAnalytics(response.data.data);
        } catch (error: any) {
            console.error('Failed to fetch analytics:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || 'Failed to load analytics'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'seller') {
            fetchAnalytics();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>
                <Skeleton className="h-96" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">WhatsApp Analytics</h1>
                        <p className="text-muted-foreground">
                            Track buyer engagement and inquiries
                        </p>
                    </div>
                </div>
                <Button onClick={fetchAnalytics} variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                </Button>
            </div>

            {/* Analytics Component */}
            {analytics ? (
                <WhatsAppAnalytics
                    totalClicks={analytics.totalWhatsappClicks}
                    petAnalytics={analytics.pets.map(pet => ({
                        petId: pet._id,
                        petName: pet.name,
                        whatsappClicks: pet.whatsappClicks || 0
                    }))}
                />
            ) : (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">
                            No analytics data available
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
