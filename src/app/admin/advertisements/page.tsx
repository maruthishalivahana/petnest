"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    CheckCircle,
    XCircle,
    Clock,
    Megaphone,
    DollarSign,
    Eye,
    Trash2,
    TrendingUp,
    Loader2
} from 'lucide-react';
import {
    Advertisement,
    getAllAdvertisements,
    updateAdvertisementStatus,
    deleteAdvertisement as deleteAdAPI
} from '@/services/admin/adminAdvertisementService';

function AdvertisementManagementContent() {
    const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [actionDialog, setActionDialog] = useState<{
        open: boolean;
        type: 'approve' | 'reject' | 'delete' | null;
        adId: string | null;
    }>({
        open: false,
        type: null,
        adId: null,
    });

    useEffect(() => {
        if (advertisements.length === 0 && loading) {
            fetchAdvertisements();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchAdvertisements = async () => {
        try {
            setLoading(true);
            const response = await getAllAdvertisements();
            setAdvertisements(response.advertisements);
        } catch (error) {
            // Silent error
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (adId: string) => {
        try {
            await updateAdvertisementStatus(adId, 'approved');
            setAdvertisements(advertisements.map(ad =>
                ad.id === adId ? { ...ad, status: 'approved' as const } : ad
            ));
            setActionDialog({ open: false, type: null, adId: null });
        } catch (error) {
            // Silent error
        }
    };

    const handleReject = async (adId: string) => {
        try {
            await updateAdvertisementStatus(adId, 'rejected');
            setAdvertisements(advertisements.map(ad =>
                ad.id === adId ? { ...ad, status: 'rejected' as const } : ad
            ));
            setActionDialog({ open: false, type: null, adId: null });
        } catch (error) {
            // Silent error
        }
    };

    const handleDelete = async (adId: string) => {
        try {
            await deleteAdAPI(adId);
            setAdvertisements(advertisements.filter(ad => ad.id !== adId));
            setActionDialog({ open: false, type: null, adId: null });
        } catch (error) {
            // Silent error
        }
    };

    const viewDetails = (ad: Advertisement) => {
        setSelectedAd(ad);
        setShowDetailsDialog(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                </Badge>;
            case 'approved':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Approved
                </Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                    <XCircle className="w-3 h-3 mr-1" />
                    Rejected
                </Badge>;
            default:
                return null;
        }
    };

    const pendingAds = advertisements.filter(ad => ad.status === 'pending');
    const approvedAds = advertisements.filter(ad => ad.status === 'approved');
    const rejectedAds = advertisements.filter(ad => ad.status === 'rejected');

    const AdCard = ({ ad }: { ad: Advertisement }) => (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{ad.title}</CardTitle>
                        <p className="text-sm text-gray-600">{ad.advertiser}</p>
                    </div>
                    {getStatusBadge(ad.status)}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <p className="text-gray-600">Budget</p>
                        <p className="font-semibold text-gray-900">${ad.budget || 0}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Duration</p>
                        <p className="font-semibold text-gray-900">{ad.duration}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Impressions</p>
                        <p className="font-semibold text-gray-900">{ad.impressions?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Created</p>
                        <p className="font-semibold text-gray-900">
                            {new Date(ad.createdDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => viewDetails(ad)}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                    </Button>
                    {ad.status === 'pending' && (
                        <>
                            <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => setActionDialog({
                                    open: true,
                                    type: 'approve',
                                    adId: ad.id
                                })}
                            >
                                <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setActionDialog({
                                    open: true,
                                    type: 'reject',
                                    adId: ad.id
                                })}
                            >
                                <XCircle className="w-4 h-4" />
                            </Button>
                        </>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => setActionDialog({
                            open: true,
                            type: 'delete',
                            adId: ad.id
                        })}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );

    const totalBudget = advertisements.reduce((sum, ad) => sum + (ad.budget || 0), 0);
    const totalImpressions = advertisements.reduce((sum, ad) => sum + (ad.impressions || 0), 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Advertisement Management</h1>
                <p className="text-gray-600 mt-1">Manage and review advertisement requests</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-orange-600">{pendingAds.length}</p>
                            </div>
                            <Clock className="w-8 h-8 text-orange-600 opacity-20" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Approved</p>
                                <p className="text-2xl font-bold text-green-600">{approvedAds.length}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-600 opacity-20" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Budget</p>
                                <p className="text-2xl font-bold text-blue-600">${totalBudget}</p>
                            </div>
                            <DollarSign className="w-8 h-8 text-blue-600 opacity-20" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Impressions</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {(totalImpressions / 1000).toFixed(1)}K
                                </p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-purple-600 opacity-20" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="pending">
                        Pending ({pendingAds.length})
                    </TabsTrigger>
                    <TabsTrigger value="approved">
                        Approved ({approvedAds.length})
                    </TabsTrigger>
                    <TabsTrigger value="all">
                        All ({advertisements.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingAds.length > 0 ? (
                            pendingAds.map(ad => <AdCard key={ad.id} ad={ad} />)
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No pending advertisements</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="approved" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {approvedAds.length > 0 ? (
                            approvedAds.map(ad => <AdCard key={ad.id} ad={ad} />)
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No approved advertisements</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="all" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {advertisements.map(ad => <AdCard key={ad.id} ad={ad} />)}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Details Dialog */}
            <AlertDialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                <AlertDialogContent className="max-w-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <Megaphone className="w-5 h-5" />
                            Advertisement Details
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Complete information about the advertisement
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {selectedAd && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="text-sm font-medium text-gray-600">Title</label>
                                    <p className="text-gray-900 font-medium mt-1">{selectedAd.title}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Advertiser</label>
                                    <p className="text-gray-900 mt-1">{selectedAd.advertiser}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Email</label>
                                    <p className="text-gray-900 mt-1">{selectedAd.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Budget</label>
                                    <p className="text-gray-900 font-semibold mt-1">${selectedAd.budget || 0}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Duration</label>
                                    <p className="text-gray-900 mt-1">{selectedAd.duration}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Impressions</label>
                                    <p className="text-gray-900 font-semibold mt-1">
                                        {selectedAd.impressions?.toLocaleString() || '0'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Status</label>
                                    <div className="mt-1">{getStatusBadge(selectedAd.status)}</div>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-sm font-medium text-gray-600">Created Date</label>
                                    <p className="text-gray-900 mt-1">
                                        {new Date(selectedAd.createdDate).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <AlertDialogFooter>
                        <AlertDialogCancel>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Action Confirmation Dialog */}
            <AlertDialog
                open={actionDialog.open}
                onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {actionDialog.type === 'approve' && 'Approve Advertisement?'}
                            {actionDialog.type === 'reject' && 'Reject Advertisement?'}
                            {actionDialog.type === 'delete' && 'Delete Advertisement?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {actionDialog.type === 'approve' && 'This will approve the advertisement and it will start running on the platform.'}
                            {actionDialog.type === 'reject' && 'This will reject the advertisement request. The advertiser will be notified.'}
                            {actionDialog.type === 'delete' && 'This action cannot be undone. This will permanently delete the advertisement.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (actionDialog.adId) {
                                    if (actionDialog.type === 'approve') handleApprove(actionDialog.adId);
                                    else if (actionDialog.type === 'reject') handleReject(actionDialog.adId);
                                    else if (actionDialog.type === 'delete') handleDelete(actionDialog.adId);
                                }
                            }}
                            className={
                                actionDialog.type === 'approve'
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : actionDialog.type === 'delete'
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : ''
                            }
                        >
                            {actionDialog.type === 'approve' && 'Approve'}
                            {actionDialog.type === 'reject' && 'Reject'}
                            {actionDialog.type === 'delete' && 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default function AdvertisementManagementPage() {
    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <AdvertisementManagementContent />
        </ProtectedRoute>
    );
}
