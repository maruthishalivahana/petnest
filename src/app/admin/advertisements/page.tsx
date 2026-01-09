"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, ListChecks, Plus, TrendingUp, Eye, MousePointerClick } from "lucide-react";
import AdvertisementsTable from "@/components/admin/advertisements/AdvertisementsTable";
import { getAllAdvertisements } from "@/services/admin/adminAdvertisementService";

export default function AdminAdvertisementsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("pending");
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        totalImpressions: 0,
        totalClicks: 0,
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const ads = await getAllAdvertisements();
            // Mock calculations - replace with real data from API
            const totalImpressions = ads.length * Math.floor(Math.random() * 5000);
            const totalClicks = ads.length * Math.floor(Math.random() * 200);

            setStats({
                total: ads.length,
                active: ads.filter(ad => ad.isApproved).length,
                totalImpressions,
                totalClicks,
            });
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        }
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Advertisement Management</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage advertisement requests, approvals, and active campaigns
                    </p>
                </div>
                <Button onClick={() => router.push('/admin/advertisements/create')} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create New Ad
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Ads</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">All advertisements</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.active}</div>
                        <p className="text-xs text-muted-foreground">Currently running</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalImpressions.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Ad views this month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                        <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalClicks.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.totalImpressions > 0
                                ? `${((stats.totalClicks / stats.totalImpressions) * 100).toFixed(2)}% CTR`
                                : '0% CTR'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
                    <TabsTrigger value="pending" className="gap-2">
                        <Clock className="h-4 w-4" />
                        Pending Requests
                    </TabsTrigger>
                    <TabsTrigger value="approved" className="gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Approved
                    </TabsTrigger>
                    <TabsTrigger value="listings" className="gap-2">
                        <ListChecks className="h-4 w-4" />
                        Listings
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Advertisement Requests</CardTitle>
                            <CardDescription>
                                Review and approve or reject new advertisement submissions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AdvertisementsTable type="pending" />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="approved" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Approved Advertisements</CardTitle>
                            <CardDescription>
                                Manage approved advertisements and their status
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AdvertisementsTable type="approved" />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="listings" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Advertisement Listings</CardTitle>
                            <CardDescription>
                                Active advertisement campaigns and placements
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AdvertisementsTable type="listings" />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
