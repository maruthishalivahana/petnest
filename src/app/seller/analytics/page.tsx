'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/seller/StatCard';
import { WhatsAppAnalytics } from '@/components/seller/WhatsAppAnalytics';
import {
    Eye,
    Heart,
    MessageCircle,
    TrendingUp,
    Users,
    ArrowUpRight,
    Calendar,
    RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import apiClient from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';
import { useAppSelector } from '@/store/hooks';

interface SellerAnalyticsData {
    totalWhatsappClicks: number;
    pets: Array<{
        _id: string;
        name: string;
        whatsappClicks: number;
    }>;
}

export default function AnalyticsPage() {
    const { toast } = useToast();
    const { user } = useAppSelector((state) => state.auth);
    const [whatsappAnalytics, setWhatsappAnalytics] = useState<SellerAnalyticsData | null>(null);
    const [loadingWhatsApp, setLoadingWhatsApp] = useState(true);

    const fetchWhatsAppAnalytics = async () => {
        try {
            setLoadingWhatsApp(true);
            const response = await apiClient.get('/v1/api/seller/analytics/whatsapp');
            setWhatsappAnalytics(response.data.data);
        } catch (error: any) {
            console.error('Failed to fetch WhatsApp analytics:', error);
        } finally {
            setLoadingWhatsApp(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'seller') {
            fetchWhatsAppAnalytics();
        }
    }, [user]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Analytics & Insights</h2>
                    <p className="text-slate-500 mt-1">Track your performance and optimize your listings</p>
                </div>
                <Button onClick={fetchWhatsAppAnalytics} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Date Range Selector - Coming Soon */}
            <Card className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
                <div className="text-center">
                    <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">General Analytics Coming Soon</h3>
                    <p className="text-sm text-slate-500">
                        Views, wishlist saves, and engagement metrics will be available soon
                    </p>
                </div>
            </Card>

            {/* WhatsApp Analytics Section */}
            <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">WhatsApp Engagement</h3>
                {loadingWhatsApp ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Skeleton className="h-32" />
                            <Skeleton className="h-32" />
                            <Skeleton className="h-32" />
                        </div>
                        <Skeleton className="h-96" />
                    </div>
                ) : whatsappAnalytics ? (
                    <WhatsAppAnalytics
                        totalClicks={whatsappAnalytics.totalWhatsappClicks}
                        petAnalytics={whatsappAnalytics.pets.map(pet => ({
                            petId: pet._id,
                            petName: pet.name,
                            whatsappClicks: pet.whatsappClicks || 0
                        }))}
                    />
                ) : (
                    <Card>
                        <div className="p-12 text-center text-muted-foreground">
                            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No WhatsApp analytics data available</p>
                        </div>
                    </Card>
                )}
            </div>
        </div>

    );
}
