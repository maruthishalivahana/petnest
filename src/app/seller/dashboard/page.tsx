"use client";

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Package,
    DollarSign,
    TrendingUp,
    PawPrint,
    Plus,
    LogOut,
    Eye,
    MessageSquare
} from 'lucide-react';

function SellerDashboardContent() {
    const { user, logout } = useAuth();

    const stats = [
        { title: 'Active Listings', value: '12', icon: Package, color: 'text-blue-500' },
        { title: 'Total Sales', value: '₹45,000', icon: DollarSign, color: 'text-green-500' },
        { title: 'Views', value: '1,234', icon: Eye, color: 'text-purple-500' },
        { title: 'Messages', value: '28', icon: MessageSquare, color: 'text-orange-500' },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary p-2 rounded-lg">
                            <PawPrint className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Seller Dashboard</h1>
                            <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add Listing
                        </Button>
                        <Button
                            variant="outline"
                            onClick={logout}
                            className="gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                New Listing
                            </CardTitle>
                            <CardDescription>
                                Add a new pet for sale
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                My Listings
                            </CardTitle>
                            <CardDescription>
                                View and manage your listings
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                Analytics
                            </CardTitle>
                            <CardDescription>
                                View performance metrics
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Your latest listings and interactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                <div>
                                    <p className="font-medium">Golden Retriever - Buddy</p>
                                    <p className="text-sm text-muted-foreground">Posted 2 days ago</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-green-600">Active</p>
                                    <p className="text-sm text-muted-foreground">45 views</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                <div>
                                    <p className="font-medium">Siberian Husky - Luna</p>
                                    <p className="text-sm text-muted-foreground">Posted 5 days ago</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-green-600">Active</p>
                                    <p className="text-sm text-muted-foreground">78 views</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* User Info Card */}
                <Card className="mt-8 bg-primary/5 border-primary/20">
                    <CardHeader>
                        <CardTitle>Seller Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                                <dd className="text-lg font-semibold">{user?.name}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                                <dd className="text-lg font-semibold">{user?.email}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Role</dt>
                                <dd className="text-lg font-semibold capitalize">{user?.role}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Verification</dt>
                                <dd className="text-lg font-semibold">
                                    <span className="inline-flex items-center gap-1 text-green-600">
                                        Verified Seller
                                    </span>
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}

export default function SellerDashboardPage() {
    return (
        <ProtectedRoute allowedRoles={['seller']}>
            <SellerDashboardContent />
        </ProtectedRoute>
    );
}
