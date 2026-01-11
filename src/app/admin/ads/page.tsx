"use client";

export const dynamic = 'force-dynamic';

import React, { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    fetchAllAdvertisements,
    fetchPendingAdvertisements,
    fetchApprovedAdvertisements,
    updateAdStatusThunk,
    deleteAdThunk
} from '@/store/slices/adminAdvertisementsSlice';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Megaphone, AlertCircle, CheckCircle, XCircle, Clock, Trash2, DollarSign } from 'lucide-react';

// Status constants
const STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    ACTIVE: 'active',
    EXPIRED: 'expired',
} as const;

function AdvertisementManagementContent() {
    const dispatch = useAppDispatch();
    const {
        allAdvertisements,
        pendingAdvertisements,
        approvedAdvertisements,
        loading,
        error
    } = useAppSelector((state) => state.adminAdvertisements);

    // Fetch data on mount - only if not already loaded
    useEffect(() => {
        if (allAdvertisements.length === 0 && pendingAdvertisements.length === 0 && approvedAdvertisements.length === 0 && !loading) {
            // Dispatch all in parallel
            dispatch(fetchAllAdvertisements());
            dispatch(fetchPendingAdvertisements());
            dispatch(fetchApprovedAdvertisements());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Memoized stats
    const stats = useMemo(() => ({
        total: allAdvertisements.length,
        pending: pendingAdvertisements.length,
        approved: approvedAdvertisements.length,
    }), [allAdvertisements, pendingAdvertisements, approvedAdvertisements]);

    // Action handlers
    const handleApprove = async (adId: string) => {
        await dispatch(updateAdStatusThunk({ adId, status: 'approved' }));
    };

    const handleReject = async (adId: string) => {
        await dispatch(updateAdStatusThunk({ adId, status: 'rejected' }));
    };

    const handleDelete = async (adId: string) => {
        if (confirm('Are you sure you want to delete this advertisement?')) {
            await dispatch(deleteAdThunk(adId));
        }
    };

    // Status badge helper
    const getStatusBadge = (isApproved: boolean) => {
        if (isApproved) {
            return (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Approved
                </Badge>
            );
        }
        return (
            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                <Clock className="w-3 h-3 mr-1" />
                Pending
            </Badge>
        );
    };

    // Legacy status badge helper (kept for compatibility)
    const getStatusBadgeOld = (status: string) => {
        const badges = {
            [STATUS.PENDING]: (
                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                </Badge>
            ),
            [STATUS.APPROVED]: (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Approved
                </Badge>
            ),
            [STATUS.REJECTED]: (
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                    <XCircle className="w-3 h-3 mr-1" />
                    Rejected
                </Badge>
            ),
            [STATUS.ACTIVE]: (
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                    Active
                </Badge>
            ),
            [STATUS.EXPIRED]: (
                <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                    Expired
                </Badge>
            ),
        };
        return badges[status as keyof typeof badges] || null;
    };

    // Loading state
    if (loading) {
        return (
            <div className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-24" />
                    ))}
                </div>
                <Skeleton className="h-96" />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    // Empty state
    if (allAdvertisements.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                    <Megaphone className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Advertisements</h3>
                    <p className="text-gray-500 text-center">There are no advertisement requests yet.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Advertisement Management</h1>
                <p className="text-gray-600 mt-1">Review and manage advertising campaigns</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm text-gray-600">Total Ads</div>
                        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm text-gray-600">Pending Review</div>
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm text-gray-600">Approved</div>
                        <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all">
                <TabsList>
                    <TabsTrigger value="all">
                        All ({allAdvertisements.length})
                    </TabsTrigger>
                    <TabsTrigger value="pending">
                        Pending ({pendingAdvertisements.length})
                    </TabsTrigger>
                    <TabsTrigger value="approved">
                        Approved ({approvedAdvertisements.length})
                    </TabsTrigger>
                </TabsList>

                {/* All Advertisements */}
                <TabsContent value="all">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Advertisements</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Advertiser</TableHead>
                                        <TableHead>Budget</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allAdvertisements.map((ad) => (
                                        <TableRow key={ad._id}>
                                            <TableCell className="font-medium">{ad.brandName}</TableCell>
                                            <TableCell>{ad.brandName || 'N/A'}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{ad.adSpot}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(ad.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(ad.isApproved)}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-red-600"
                                                    onClick={() => handleDelete(ad._id)}
                                                    disabled={loading}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Pending Advertisements */}
                <TabsContent value="pending">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Advertisements</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {pendingAdvertisements.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No pending advertisements
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Brand Name</TableHead>
                                            <TableHead>Contact</TableHead>
                                            <TableHead>Ad Spot</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pendingAdvertisements.map((ad) => (
                                            <TableRow key={ad._id}>
                                                <TableCell className="font-medium">{ad.brandName}</TableCell>
                                                <TableCell>{ad.contactEmail}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{ad.adSpot}</Badge>
                                                </TableCell>
                                                <TableCell>{getStatusBadge(ad.isApproved)}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-green-600 hover:bg-green-50"
                                                            onClick={() => handleApprove(ad._id)}
                                                            disabled={loading}
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-1" />
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-red-600 hover:bg-red-50"
                                                            onClick={() => handleReject(ad._id)}
                                                            disabled={loading}
                                                        >
                                                            <XCircle className="w-4 h-4 mr-1" />
                                                            Reject
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Approved Advertisements */}
                <TabsContent value="approved">
                    <Card>
                        <CardHeader>
                            <CardTitle>Approved Advertisements</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {approvedAdvertisements.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No approved advertisements yet
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Brand Name</TableHead>
                                            <TableHead>Contact</TableHead>
                                            <TableHead>Ad Spot</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {approvedAdvertisements.map((ad) => (
                                            <TableRow key={ad._id}>
                                                <TableCell className="font-medium">{ad.brandName}</TableCell>
                                                <TableCell>{ad.contactEmail}</TableCell>
                                                <TableCell><Badge variant="outline">{ad.adSpot}</Badge></TableCell>
                                                <TableCell>{getStatusBadge(ad.isApproved)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
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
