'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Bell,
    Lock,
    Trash2,
    ShieldCheck,
    AlertTriangle
} from 'lucide-react';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [whatsappNotifications, setWhatsappNotifications] = useState(true);
    const [marketingEmails, setMarketingEmails] = useState(false);

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
                <p className="text-slate-500 mt-1">Manage your account preferences and settings</p>
            </div>

            {/* Account Settings */}
            <Card>
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-slate-900">Account Settings</h3>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="flex gap-2">
                            <Input
                                id="email"
                                type="email"
                                defaultValue="john@petcare.com"
                                className="flex-1"
                            />
                            <Button variant="outline">Update</Button>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <Label>Password</Label>
                        <Button variant="outline" className="w-full justify-start">
                            <Lock className="h-4 w-4 mr-2" />
                            Change Password
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Notification Settings */}
            <Card>
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-slate-900">Notification Preferences</h3>
                    </div>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Label htmlFor="email-notif" className="font-medium cursor-pointer">
                                    Email Notifications
                                </Label>
                            </div>
                            <p className="text-sm text-slate-500">
                                Receive email updates about new inquiries and messages
                            </p>
                        </div>
                        <Checkbox
                            id="email-notif"
                            checked={emailNotifications}
                            onCheckedChange={(checked) => setEmailNotifications(checked as boolean)}
                        />
                    </div>

                    <Separator />

                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Label htmlFor="whatsapp-notif" className="font-medium cursor-pointer">
                                    WhatsApp Notifications
                                </Label>
                                <Badge variant="secondary" className="text-xs">Recommended</Badge>
                            </div>
                            <p className="text-sm text-slate-500">
                                Get instant alerts for new inquiries on WhatsApp
                            </p>
                        </div>
                        <Checkbox
                            id="whatsapp-notif"
                            checked={whatsappNotifications}
                            onCheckedChange={(checked) => setWhatsappNotifications(checked as boolean)}
                        />
                    </div>

                    <Separator />

                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Label htmlFor="marketing" className="font-medium cursor-pointer">
                                    Marketing Emails
                                </Label>
                            </div>
                            <p className="text-sm text-slate-500">
                                Receive tips, updates, and promotional offers
                            </p>
                        </div>
                        <Checkbox
                            id="marketing"
                            checked={marketingEmails}
                            onCheckedChange={(checked) => setMarketingEmails(checked as boolean)}
                        />
                    </div>
                </div>
            </Card>

            {/* Verification Status */}
            <Card>
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-slate-900">Verification Status</h3>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-900">Seller Verification</p>
                            <p className="text-sm text-slate-500">Your account is verified</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <ShieldCheck className="h-3 w-3 mr-1" />
                            Verified
                        </Badge>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-900">Document Verification</p>
                            <p className="text-sm text-slate-500">All documents verified</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <ShieldCheck className="h-3 w-3 mr-1" />
                            Complete
                        </Badge>
                    </div>
                </div>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200">
                <div className="p-6 border-b border-red-200 bg-red-50">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <h3 className="font-semibold text-red-900">Danger Zone</h3>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="font-medium text-slate-900 mb-1">Disable Seller Account</p>
                            <p className="text-sm text-slate-500">
                                Temporarily disable your seller account. Your listings will be hidden.
                            </p>
                        </div>
                        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                            Disable
                        </Button>
                    </div>

                    <Separator />

                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="font-medium text-slate-900 mb-1">Delete Account</p>
                            <p className="text-sm text-slate-500">
                                Permanently delete your seller account and all associated data.
                            </p>
                        </div>
                        <Button variant="destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
