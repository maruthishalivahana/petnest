'use client';

import { Card } from '@/components/ui/card';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
                <p className="text-slate-500 mt-1">Stay updated with your listing activities</p>
            </div>

            {/* Coming Soon */}
            <Card className="p-12">
                <div className="text-center">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Bell className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Notifications Coming Soon</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        We're working on bringing you real-time notifications for inquiries, wishlist saves, and performance updates.
                    </p>
                </div>
            </Card>
        </div>
    );
}
