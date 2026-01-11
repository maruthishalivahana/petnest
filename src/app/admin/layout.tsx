"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    Users,
    ShieldCheck,
    PawPrint,
    Megaphone,
    Database,
    AlertCircle,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Star,
    Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

interface NavItem {
    title: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
}

const navigation: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'User Management',
        href: '/admin/users',
        icon: Users,
    },
    {
        title: 'Seller Verification',
        href: '/admin/seller-verification',
        icon: ShieldCheck,
        badge: '12',
    },
    {
        title: 'Pet Verification',
        href: '/admin/pet-verification',
        icon: PawPrint,
        badge: '8',
    },
    {
        title: 'Add Advertisement',
        href: '/admin/advertisements/create',
        icon: Plus,
    },
    {
        title: 'Advertisements',
        href: '/admin/advertisements',
        icon: Megaphone,
    },
    {
        title: 'Featured Requests',
        href: '/admin/featured-requests',
        icon: Star,
    },
    {
        title: 'Species & Breeds',
        href: '/admin/species-breeds',
        icon: Database,
    },
    {
        title: 'Reports & Moderation',
        href: '/admin/reports',
        icon: AlertCircle,
        badge: '3',
    },
    {
        title: 'System Settings',
        href: '/admin/settings',
        icon: Settings,
    },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/login');
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                    <Link href="/admin/dashboard" className="flex items-center gap-2">
                        <div className="bg-primary p-2 rounded-lg">
                            <PawPrint className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">PetNest</h1>
                            <p className="text-xs text-gray-500">Admin Panel</p>
                        </div>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary text-white"
                                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className="w-5 h-5" />
                                    <span>{item.title}</span>
                                </div>
                                {item.badge && (
                                    <span
                                        className={cn(
                                            "px-2 py-0.5 text-xs font-semibold rounded-full",
                                            isActive
                                                ? "bg-white text-primary"
                                                : "bg-red-100 text-red-700"
                                        )}
                                    >
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                            {user?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user?.name || 'Admin User'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.email || 'admin@petnest.com'}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 z-30">
                    <div className="flex items-center justify-between h-16 px-4 lg:px-8">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-500 hover:text-gray-700"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Breadcrumb / Page Title */}
                        <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600">
                            <span>Admin</span>
                            <ChevronRight className="w-4 h-4" />
                            <span className="font-medium text-gray-900">
                                {navigation.find((item) => item.href === pathname)?.title || 'Dashboard'}
                            </span>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-4 ml-auto">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLogout}
                                className="gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-gray-50">
                    <div className="p-4 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
            <Toaster />
        </div>
    );
}
