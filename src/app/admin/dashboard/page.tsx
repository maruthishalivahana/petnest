"use client";

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Users,
    ShieldCheck,
    Settings,
    BarChart3,
    PawPrint,
    LogOut
} from 'lucide-react';

function AdminDashboardContent() {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleLogout = () => {
        dispatch(logout());
        router.push('/login');
    };

    const stats = [
        { title: 'Total Users', value: '1,234', icon: Users, color: 'text-blue-500' },
        { title: 'Verified Sellers', value: '456', icon: ShieldCheck, color: 'text-green-500' },
        { title: 'Active Listings', value: '789', icon: PawPrint, color: 'text-purple-500' },
        { title: 'Reports', value: '23', icon: BarChart3, color: 'text-orange-500' },
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
                            <h1 className="text-xl font-bold">Admin Dashboard</h1>
                            <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Manage Users
                            </CardTitle>
                            <CardDescription>
                                View and manage user accounts
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5" />
                                Verify Sellers
                            </CardTitle>
                            <CardDescription>
                                Review pending seller verifications
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="w-5 h-5" />
                                System Settings
                            </CardTitle>
                            <CardDescription>
                                Configure platform settings
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>

                {/* User Info Card */}
                <Card className="mt-8 bg-primary/5 border-primary/20">
                    <CardHeader>
                        <CardTitle>User Information</CardTitle>
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
                                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                                <dd className="text-lg font-semibold">
                                    <span className="inline-flex items-center gap-1 text-green-600">
                                        <ShieldCheck className="w-4 h-4" />
                                        Active
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

export default function AdminDashboardPage() {


    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboardContent />
        </ProtectedRoute>
    );
}
