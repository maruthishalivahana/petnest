'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Store,
    BarChart3,
    Bell,
    Settings,
    LogOut,
    Menu,
    X,
    FileText,
    User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { toast } from 'sonner';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface NavItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
}

const navItems: NavItem[] = [
    { href: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/seller/profile', label: 'Seller Profile', icon: User },
    { href: '/seller/listings', label: 'Listings', icon: Store },
    { href: '/seller/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/seller/notifications', label: 'Notifications', icon: Bell, badge: 3 },
    { href: '/seller/verification', label: 'Verification', icon: FileText },
    { href: '/seller/settings', label: 'Settings', icon: Settings },
];

export default function SellerLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const user = useAppSelector((state) => state.auth.user);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await axios.post(`${BASE_URL}/v1/api/auth/logout`, {}, { withCredentials: true });
            dispatch(logout());
            toast.success('Logged out successfully');
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Failed to logout');
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mobile Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-slate-200 lg:hidden">
                <div className="flex items-center justify-between px-4 h-16">
                    <div className="flex items-center gap-2">
                        <Store className="h-6 w-6 text-primary" />
                        <span className="font-bold text-lg">PetNest Seller</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </header>

            {/* Sidebar Overlay (Mobile) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200 transition-transform duration-300 lg:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Logo */}
                <div className="flex items-center gap-2 px-6 h-16 border-b border-slate-200">
                    <Store className="h-6 w-6 text-primary" />
                    <span className="font-bold text-lg">PetNest Seller</span>
                </div>

                {/* User Info */}
                <div className="px-4 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{user?.name || 'Seller'}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                                )}
                            >
                                <Icon className="h-5 w-5 shrink-0" />
                                <span className="flex-1">{item.label}</span>
                                {item.badge && item.badge > 0 && (
                                    <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                                        {item.badge}
                                    </Badge>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-3 border-t border-slate-200">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                    >
                        <LogOut className="h-5 w-5 mr-3" />
                        {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Top Header (Desktop) */}
                <header className="sticky top-0 z-30 bg-white border-b border-slate-200 hidden lg:block">
                    <div className="flex items-center justify-between px-6 h-16">
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">
                                {navItems.find(item => pathname === item.href)?.label || 'Dashboard'}
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/home">
                                    <Store className="h-4 w-4 mr-2" />
                                    View Store
                                </Link>
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
