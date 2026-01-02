"use client";

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Settings,
    Save,
    CheckCircle,
    Megaphone,
    ShieldCheck,
    PawPrint,
    Bell,
    Mail,
    Globe,
    Lock
} from 'lucide-react';

interface SystemSettings {
    enableAds: boolean;
    enableSellerVerification: boolean;
    enablePetVerification: boolean;
    enableEmailNotifications: boolean;
    enablePushNotifications: boolean;
    maintenanceMode: boolean;
    allowNewRegistrations: boolean;
    requireEmailVerification: boolean;
}

function SystemSettingsContent() {
    const [settings, setSettings] = useState<SystemSettings>({
        enableAds: true,
        enableSellerVerification: true,
        enablePetVerification: true,
        enableEmailNotifications: true,
        enablePushNotifications: false,
        maintenanceMode: false,
        allowNewRegistrations: true,
        requireEmailVerification: true,
    });

    const [showSaveSuccess, setShowSaveSuccess] = useState(false);

    const handleToggle = (key: keyof SystemSettings) => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSave = () => {
        // In a real app, this would save to backend
        setShowSaveSuccess(true);
        setTimeout(() => setShowSaveSuccess(false), 3000);
    };

    const SettingItem = ({
        icon: Icon,
        title,
        description,
        settingKey,
        color = "text-gray-600"
    }: {
        icon: React.ElementType;
        title: string;
        description: string;
        settingKey: keyof SystemSettings;
        color?: string;
    }) => (
        <div className="flex items-start justify-between py-4 border-b border-gray-100 last:border-0">
            <div className="flex gap-4 flex-1">
                <div className={`${color} mt-1`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{description}</p>
                </div>
            </div>
            <Switch
                checked={settings[settingKey]}
                onCheckedChange={() => handleToggle(settingKey)}
            />
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
                    <p className="text-gray-600 mt-1">Configure platform features and functionality</p>
                </div>
                <Button onClick={handleSave} className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                </Button>
            </div>

            {/* Success Message */}
            {showSaveSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-green-800 font-medium">Settings saved successfully!</p>
                </div>
            )}

            {/* Current Status Overview */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader>
                    <CardTitle className="text-blue-900">Platform Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        {settings.maintenanceMode ? (
                            <Badge className="bg-orange-600 hover:bg-orange-700">
                                Maintenance Mode Active
                            </Badge>
                        ) : (
                            <Badge className="bg-green-600 hover:bg-green-700">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Operational
                            </Badge>
                        )}
                        {settings.enableAds && (
                            <Badge variant="secondary">Ads Enabled</Badge>
                        )}
                        {settings.enableSellerVerification && (
                            <Badge variant="secondary">Seller Verification Required</Badge>
                        )}
                        {settings.enablePetVerification && (
                            <Badge variant="secondary">Pet Verification Required</Badge>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Feature Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Feature Management
                    </CardTitle>
                    <CardDescription>
                        Enable or disable major platform features
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SettingItem
                        icon={Megaphone}
                        title="Enable Advertisements"
                        description="Allow advertisers to submit and run ads on the platform"
                        settingKey="enableAds"
                        color="text-pink-600"
                    />
                    <SettingItem
                        icon={ShieldCheck}
                        title="Enable Seller Verification"
                        description="Require sellers to complete verification before listing pets"
                        settingKey="enableSellerVerification"
                        color="text-green-600"
                    />
                    <SettingItem
                        icon={PawPrint}
                        title="Enable Pet Verification"
                        description="Require admin approval for all new pet listings"
                        settingKey="enablePetVerification"
                        color="text-purple-600"
                    />
                </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Notification Settings
                    </CardTitle>
                    <CardDescription>
                        Configure platform notification preferences
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SettingItem
                        icon={Mail}
                        title="Email Notifications"
                        description="Send email notifications for important events and updates"
                        settingKey="enableEmailNotifications"
                        color="text-blue-600"
                    />
                    <SettingItem
                        icon={Bell}
                        title="Push Notifications"
                        description="Enable browser push notifications for real-time alerts"
                        settingKey="enablePushNotifications"
                        color="text-orange-600"
                    />
                </CardContent>
            </Card>

            {/* Access Control */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Access Control
                    </CardTitle>
                    <CardDescription>
                        Manage user access and registration settings
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SettingItem
                        icon={Globe}
                        title="Allow New Registrations"
                        description="Enable new users to register on the platform"
                        settingKey="allowNewRegistrations"
                        color="text-indigo-600"
                    />
                    <SettingItem
                        icon={Mail}
                        title="Require Email Verification"
                        description="Users must verify their email address before accessing the platform"
                        settingKey="requireEmailVerification"
                        color="text-teal-600"
                    />
                </CardContent>
            </Card>

            {/* Maintenance Mode */}
            <Card className="border-orange-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-800">
                        <Settings className="w-5 h-5" />
                        Maintenance Mode
                    </CardTitle>
                    <CardDescription className="text-orange-700">
                        Temporarily disable platform access for maintenance
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-orange-800">
                            <strong>Warning:</strong> Enabling maintenance mode will prevent all users (except admins)
                            from accessing the platform. Use this only during critical updates or maintenance.
                        </p>
                    </div>
                    <SettingItem
                        icon={Settings}
                        title="Maintenance Mode"
                        description="Put the platform into maintenance mode"
                        settingKey="maintenanceMode"
                        color="text-orange-600"
                    />
                </CardContent>
            </Card>

            {/* Settings Summary */}
            <Card className="bg-gray-50">
                <CardHeader>
                    <CardTitle>Current Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between items-center p-3 bg-white rounded border">
                            <span className="text-gray-600">Advertisements</span>
                            <Badge variant={settings.enableAds ? "default" : "secondary"}>
                                {settings.enableAds ? 'Enabled' : 'Disabled'}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded border">
                            <span className="text-gray-600">Seller Verification</span>
                            <Badge variant={settings.enableSellerVerification ? "default" : "secondary"}>
                                {settings.enableSellerVerification ? 'Required' : 'Optional'}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded border">
                            <span className="text-gray-600">Pet Verification</span>
                            <Badge variant={settings.enablePetVerification ? "default" : "secondary"}>
                                {settings.enablePetVerification ? 'Required' : 'Optional'}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded border">
                            <span className="text-gray-600">Email Notifications</span>
                            <Badge variant={settings.enableEmailNotifications ? "default" : "secondary"}>
                                {settings.enableEmailNotifications ? 'Enabled' : 'Disabled'}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded border">
                            <span className="text-gray-600">Push Notifications</span>
                            <Badge variant={settings.enablePushNotifications ? "default" : "secondary"}>
                                {settings.enablePushNotifications ? 'Enabled' : 'Disabled'}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded border">
                            <span className="text-gray-600">New Registrations</span>
                            <Badge variant={settings.allowNewRegistrations ? "default" : "secondary"}>
                                {settings.allowNewRegistrations ? 'Allowed' : 'Disabled'}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded border">
                            <span className="text-gray-600">Email Verification</span>
                            <Badge variant={settings.requireEmailVerification ? "default" : "secondary"}>
                                {settings.requireEmailVerification ? 'Required' : 'Optional'}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded border">
                            <span className="text-gray-600">Maintenance Mode</span>
                            <Badge variant={settings.maintenanceMode ? "destructive" : "default"}>
                                {settings.maintenanceMode ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function SystemSettingsPage() {
    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <SystemSettingsContent />
        </ProtectedRoute>
    );
}
