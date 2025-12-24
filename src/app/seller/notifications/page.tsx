'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/seller/EmptyState';
import {
    Bell,
    Check,
    CheckCheck,
    Heart,
    MessageCircle,
    ShieldAlert,
    TrendingUp,
    Eye,
    Clock
} from 'lucide-react';

const notifications = [
    {
        id: '1',
        type: 'inquiry',
        icon: MessageCircle,
        title: 'New inquiry for Golden Retriever Puppy',
        message: 'Someone is interested in your listing. Check your WhatsApp.',
        time: '5 minutes ago',
        read: false,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
    },
    {
        id: '2',
        type: 'wishlist',
        icon: Heart,
        title: '3 new wishlist saves',
        message: 'Your Persian Cat listing was saved to wishlist',
        time: '1 hour ago',
        read: false,
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600'
    },
    {
        id: '3',
        type: 'performance',
        icon: TrendingUp,
        title: 'Listing performing well',
        message: 'Your Beagle Puppy got 50+ views today',
        time: '3 hours ago',
        read: true,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600'
    },
    {
        id: '4',
        type: 'verification',
        icon: ShieldAlert,
        title: 'Document verification complete',
        message: 'Your business license has been verified',
        time: '1 day ago',
        read: true,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600'
    },
    {
        id: '5',
        type: 'view',
        icon: Eye,
        title: 'Profile views increased',
        message: 'Your profile was viewed 45 times this week',
        time: '2 days ago',
        read: true,
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600'
    },
];

export default function NotificationsPage() {
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
                    <p className="text-slate-500 mt-1">
                        {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Button variant="outline" size="sm">
                        <CheckCheck className="h-4 w-4 mr-2" />
                        Mark all as read
                    </Button>
                )}
            </div>

            {/* Notifications List */}
            {notifications.length === 0 ? (
                <Card>
                    <EmptyState
                        icon={Bell}
                        title="No notifications"
                        description="You're all caught up! New notifications will appear here."
                    />
                </Card>
            ) : (
                <Card className="divide-y divide-slate-200">
                    {notifications.map((notification) => {
                        const Icon = notification.icon;
                        return (
                            <div
                                key={notification.id}
                                className={`p-6 hover:bg-slate-50 transition-colors ${!notification.read ? 'bg-primary/5' : ''}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`h-10 w-10 rounded-lg ${notification.iconBg} flex items-center justify-center shrink-0`}>
                                        <Icon className={`h-5 w-5 ${notification.iconColor}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h4 className="font-medium text-slate-900">{notification.title}</h4>
                                            {!notification.read && (
                                                <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-600 mb-2">{notification.message}</p>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Clock className="h-3 w-3" />
                                            {notification.time}
                                        </div>
                                    </div>
                                    {!notification.read && (
                                        <Button variant="ghost" size="sm">
                                            <Check className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </Card>
            )}
        </div>
    );
}
