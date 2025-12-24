'use client';

import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/seller/StatCard';
import {
    Eye,
    Heart,
    MessageCircle,
    TrendingUp,
    Users,
    ArrowUpRight,
    Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
    { title: 'Total Views', value: '12,847', icon: Eye, trend: { value: 23.5, isPositive: true }, description: 'Last 30 days' },
    { title: 'Wishlist Saves', value: '342', icon: Heart, trend: { value: -5.2, isPositive: false }, description: 'Last 30 days' },
    { title: 'WhatsApp Clicks', value: '156', icon: MessageCircle, trend: { value: 45.8, isPositive: true }, description: 'Last 30 days' },
    { title: 'Profile Views', value: '2,456', icon: Users, trend: { value: 12.3, isPositive: true }, description: 'Last 30 days' },
];

const topPerformingListings = [
    { name: 'Golden Retriever Puppy', views: 2456, clicks: 89, wishlistCount: 45 },
    { name: 'Persian Cat', views: 1834, clicks: 67, wishlistCount: 34 },
    { name: 'Beagle Puppy', views: 1567, clicks: 56, wishlistCount: 28 },
    { name: 'Labrador Retriever', views: 1234, clicks: 45, wishlistCount: 23 },
    { name: 'Siamese Cat', views: 987, clicks: 34, wishlistCount: 18 },
];

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Analytics & Insights</h2>
                <p className="text-slate-500 mt-1">Track your performance and optimize your listings</p>
            </div>

                {/* Date Range Selector */}
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Last 30 Days
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <StatCard key={stat.title} {...stat} />
                    ))}
                </div>

                {/* Charts Placeholder */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-6">
                        <h3 className="font-semibold text-slate-900 mb-4">Views Over Time</h3>
                        <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                            <div className="text-center">
                                <TrendingUp className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                                <p className="text-sm text-slate-500">Chart visualization</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="font-semibold text-slate-900 mb-4">Engagement Breakdown</h3>
                        <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                            <div className="text-center">
                                <TrendingUp className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                                <p className="text-sm text-slate-500">Chart visualization</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Top Performing Listings */}
                <Card>
                    <div className="p-6 border-b border-slate-200">
                        <h3 className="font-semibold text-slate-900">Top Performing Listings</h3>
                    </div>
                    <div className="divide-y divide-slate-200">
                        {topPerformingListings.map((listing, index) => (
                            <div key={listing.name} className="p-6 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <span className="font-bold text-primary">#{index + 1}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-slate-900 truncate">{listing.name}</h4>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Eye className="h-4 w-4" />
                                                {listing.views} views
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Heart className="h-4 w-4" />
                                                {listing.wishlistCount} saves
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MessageCircle className="h-4 w-4" />
                                                {listing.clicks} clicks
                                            </span>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="h-5 w-5 text-green-600" />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Insights */}
                <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                            <TrendingUp className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-1">Pro Tip</h3>
                            <p className="text-sm text-slate-600">
                                Listings with high-quality images and detailed descriptions get 3x more inquiries.
                                Consider adding more photos and health certificates to boost engagement.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

    );
}
