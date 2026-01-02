"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    ShieldCheck,
    PawPrint,
    Megaphone,
    TrendingUp,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Loader2,
    RefreshCw
} from 'lucide-react';
import { getDashboardStats, getRecentActivity, DashboardStats, Activity } from '@/services/admin/adminDashboardService';

const CACHE_KEY = 'admin_dashboard_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CachedData {
    stats: DashboardStats;
    activities: Activity[];
    timestamp: number;
}

// Default empty stats for immediate render
const DEFAULT_STATS: DashboardStats = {
    totalUsers: 0,
    activeSellers: 0,
    pendingSellerRequests: 0,
    verifiedPets: 0,
    pendingPetVerifications: 0,
    pendingAds: 0,
    activeListings: 0,
    totalReports: 0
};

function AdminDashboardContent() {
    const [dashboardStats, setDashboardStats] = useState<DashboardStats>(DEFAULT_STATS);
    const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

    // Load cached data from localStorage
    const loadCachedData = useCallback(() => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const data: CachedData = JSON.parse(cached);
                const age = Date.now() - data.timestamp;

                // Use cached data if it's less than CACHE_DURATION old
                if (age < CACHE_DURATION) {
                    setDashboardStats(data.stats);
                    setRecentActivity(data.activities);
                    setHasLoadedOnce(true);
                    return true;
                }
                // Even if cache is stale, show it while fetching fresh data
                if (age < 30 * 60 * 1000) { // Use stale cache up to 30 minutes
                    setDashboardStats(data.stats);
                    setRecentActivity(data.activities);
                    setHasLoadedOnce(true);
                    return false; // Return false to trigger fresh fetch
                }
            }
        } catch (error) {
            console.error('Failed to load cached data:', error);
        }
        return false;
    }, []);

    // Save data to cache
    const saveCachedData = useCallback((stats: DashboardStats, activities: Activity[]) => {
        try {
            const data: CachedData = {
                stats,
                activities,
                timestamp: Date.now()
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save cache:', error);
        }
    }, []);

    const fetchDashboardData = useCallback(async (isBackground = false) => {
        try {
            if (!isBackground && !hasLoadedOnce) {
                setLoading(true);
            }
            if (isBackground) {
                setIsRefreshing(true);
            }

            // Fetch with individual error handling - don't let one failure break everything
            const fetchWithFallback = async () => {
                try {
                    const [statsResponse, activityResponse] = await Promise.all([
                        getDashboardStats().catch(err => {
                            console.error('Stats fetch failed:', err);
                            return { stats: dashboardStats }; // Keep existing stats
                        }),
                        getRecentActivity(8).catch(err => {
                            console.error('Activity fetch failed:', err);
                            return { activities: recentActivity }; // Keep existing activities
                        })
                    ]);
                    return [statsResponse, activityResponse];
                } catch (error) {
                    throw error;
                }
            };

            // Race against timeout, but don't fail completely
            const result = await Promise.race([
                fetchWithFallback(),
                new Promise<never>((_, reject) =>
                    setTimeout(() => reject(new Error('Request timeout')), 10000)
                )
            ]);

            const [statsResponse, activityResponse] = result;

            if ('stats' in statsResponse && statsResponse.stats) {
                setDashboardStats(statsResponse.stats);
            }
            if ('activities' in activityResponse && activityResponse.activities) {
                setRecentActivity(activityResponse.activities);
            }

            if ('stats' in statsResponse && statsResponse.stats &&
                'activities' in activityResponse && activityResponse.activities) {
                saveCachedData(statsResponse.stats, activityResponse.activities);
            }

            setHasLoadedOnce(true);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            // Silently fail if we already have data showing
            if (!hasLoadedOnce) {
                loadCachedData();
            }
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, [dashboardStats, recentActivity, hasLoadedOnce, loadCachedData, saveCachedData]);

    useEffect(() => {
        // Load cached data first (even stale cache) for instant display
        const hasFreshCache = loadCachedData();

        // Fetch fresh data in background if:
        // 1. We have fresh cache (less than 5 min) - silent refresh
        // 2. We have stale cache or no cache - visible loading
        if (hasFreshCache) {
            // Delay background refresh slightly to prioritize UI render
            const timer = setTimeout(() => fetchDashboardData(true), 100);
            return () => clearTimeout(timer);
        } else {
            // Fetch immediately if no fresh cache
            fetchDashboardData(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRefresh = () => {
        fetchDashboardData(true);
    };

    // Only show loading spinner on very first load with no data
    if (loading && !hasLoadedOnce) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-gray-600">Loading dashboard...</span>
            </div>
        );
    }

    const stats = [
        {
            title: 'Total Users',
            value: dashboardStats.totalUsers.toLocaleString(),
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            subtext: 'Registered users',
            changeType: 'increase'
        },
        {
            title: 'Active Sellers',
            value: dashboardStats.activeSellers.toLocaleString(),
            icon: ShieldCheck,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            subtext: 'Verified sellers',
            changeType: 'increase'
        },
        {
            title: 'Pending Seller Requests',
            value: dashboardStats.pendingSellerRequests.toString(),
            icon: Clock,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
            subtext: 'Awaiting verification',
            changeType: 'neutral'
        },
        {
            title: 'Verified Pets',
            value: dashboardStats.verifiedPets.toLocaleString(),
            icon: PawPrint,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
            subtext: 'Approved listings',
            changeType: 'increase'
        },
        {
            title: 'Pending Pet Verifications',
            value: dashboardStats.pendingPetVerifications.toString(),
            icon: AlertCircle,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100',
            subtext: 'Awaiting review',
            changeType: 'neutral'
        },
        {
            title: 'Total Reports',
            value: dashboardStats.totalReports.toString(),
            icon: Megaphone,
            color: 'text-red-600',
            bgColor: 'bg-red-100',
            subtext: 'Needs attention',
            changeType: 'neutral'
        },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle2 className="w-4 h-4 text-green-600" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-orange-600" />;
            case 'failed':
                return <XCircle className="w-4 h-4 text-red-600" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-600" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", color: string }> = {
            success: { variant: 'default', color: 'bg-green-100 text-green-700 hover:bg-green-100' },
            pending: { variant: 'secondary', color: 'bg-orange-100 text-orange-700 hover:bg-orange-100' },
            failed: { variant: 'destructive', color: 'bg-red-100 text-red-700 hover:bg-red-100' },
        };

        const config = variants[status] || variants.success;

        return (
            <Badge variant={config.variant} className={config.color}>
                {status}
            </Badge>
        );
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
            return `${diffInMinutes} min ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-600 mt-1">Monitor your platform's key metrics and recent activities</p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                {stat.title}
                            </CardTitle>
                            <div className={`${stat.bgColor} p-2 rounded-lg`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                            <p className="text-xs text-gray-600 mt-1">
                                {stat.subtext}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
                    <p className="text-sm text-gray-600">Latest actions and events on your platform</p>
                </CardHeader>
                <CardContent>
                    {recentActivity.length > 0 ? (
                        <div className="space-y-4">
                            {recentActivity.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex-shrink-0 mt-0.5">
                                        {getStatusIcon(activity.status)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">
                                            {activity.description}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {formatTimestamp(activity.timestamp)}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        {getStatusBadge(activity.status)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">No recent activity to display</p>
                            <p className="text-gray-400 text-xs mt-1">Activity will appear here as it happens</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-blue-900">
                            Pending Actions Required
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-blue-800">Seller Verifications</span>
                                <Badge className="bg-blue-600 hover:bg-blue-700">
                                    {dashboardStats.pendingSellerRequests}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-blue-800">Pet Verifications</span>
                                <Badge className="bg-blue-600 hover:bg-blue-700">
                                    {dashboardStats.pendingPetVerifications}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-blue-800">Advertisement Approvals</span>
                                <Badge className="bg-blue-600 hover:bg-blue-700">
                                    {dashboardStats.pendingAds}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-blue-800">Reports to Review</span>
                                <Badge className="bg-blue-600 hover:bg-blue-700">
                                    {dashboardStats.totalReports}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-green-900">
                            Platform Health
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-green-800">Total Active Users</span>
                                <span className="text-lg font-bold text-green-900">
                                    {dashboardStats.totalUsers.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-green-800">Verified Sellers</span>
                                <span className="text-lg font-bold text-green-900">
                                    {dashboardStats.activeSellers.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-green-800">Verified Pets</span>
                                <span className="text-lg font-bold text-green-900">
                                    {dashboardStats.verifiedPets.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-green-800">System Status</span>
                                <Badge className="bg-green-600 hover:bg-green-700">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Healthy
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function AdminDashboardPage() {
    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboardContent />
        </ProtectedRoute>
    );
}
