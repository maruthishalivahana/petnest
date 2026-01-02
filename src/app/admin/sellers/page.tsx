"use client";

import React, { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPendingRequests, fetchVerifiedSellers, verifySellerThunk } from '@/store/slices/adminSellersSlice';
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
import { Store, AlertCircle, CheckCircle, XCircle, Clock, Phone, Mail } from 'lucide-react';

// Status constants
const STATUS = {
    PENDING: 'pending',
    VERIFIED: 'verified',
    REJECTED: 'rejected',
} as const;

function SellerVerificationContent() {
    const dispatch = useAppDispatch();
    const { pendingRequests, verifiedSellers, loading, error } = useAppSelector((state) => state.adminSellers);

    // Fetch data on mount - only if not already loaded
    useEffect(() => {
        if (pendingRequests.length === 0 && verifiedSellers.length === 0 && !loading) {
            // Dispatch in parallel
            dispatch(fetchPendingRequests());
            dispatch(fetchVerifiedSellers());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Memoized stats
    const stats = useMemo(() => ({
        pending: pendingRequests.length,
        verified: verifiedSellers.length,
    }), [pendingRequests, verifiedSellers]);

    // Action handlers
    const handleApprove = async (sellerId: string) => {
        await dispatch(verifySellerThunk({ sellerRequestId: sellerId, status: 'verified' }));
    };

    const handleReject = async (sellerId: string) => {
        await dispatch(verifySellerThunk({ sellerRequestId: sellerId, status: 'rejected' }));
    };

    // Status badge helper
    const getStatusBadge = (status: string) => {
        if (status === STATUS.PENDING) {
            return (
                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                </Badge>
            );
        }
        if (status === STATUS.VERIFIED) {
            return (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                </Badge>
            );
        }
        return (
            <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                <XCircle className="w-3 h-3 mr-1" />
                Rejected
            </Badge>
        );
    };

    // Loading state
    if (loading) {
        return (
            <div className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(2)].map((_, i) => (
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
    if (pendingRequests.length === 0 && verifiedSellers.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                    <Store className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Seller Requests</h3>
                    <p className="text-gray-500 text-center">There are no seller verification requests yet.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Seller Verification</h1>
                <p className="text-gray-600 mt-1">Review and approve seller applications</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm text-gray-600">Pending Requests</div>
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm text-gray-600">Verified Sellers</div>
                        <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="pending">
                <TabsList>
                    <TabsTrigger value="pending">
                        Pending ({pendingRequests.length})
                    </TabsTrigger>
                    <TabsTrigger value="verified">
                        Verified ({verifiedSellers.length})
                    </TabsTrigger>
                </TabsList>

                {/* Pending Requests */}
                <TabsContent value="pending">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Seller Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {pendingRequests.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No pending requests
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Seller Name</TableHead>
                                            <TableHead>Business</TableHead>
                                            <TableHead>Contact</TableHead>
                                            <TableHead>Submitted</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pendingRequests.map((seller) => (
                                            <TableRow key={seller.id}>
                                                <TableCell className="font-medium">{seller.sellerName}</TableCell>
                                                <TableCell>{seller.businessName || 'N/A'}</TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <Mail className="w-3 h-3" />
                                                            {seller.email}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <Phone className="w-3 h-3" />
                                                            {seller.phone}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(seller.submittedOn).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </TableCell>
                                                <TableCell>{getStatusBadge(seller.status)}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-green-600 hover:bg-green-50"
                                                            onClick={() => handleApprove(seller.id)}
                                                            disabled={loading}
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-1" />
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-red-600 hover:bg-red-50"
                                                            onClick={() => handleReject(seller.id)}
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

                {/* Verified Sellers */}
                <TabsContent value="verified">
                    <Card>
                        <CardHeader>
                            <CardTitle>Verified Sellers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {verifiedSellers.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No verified sellers yet
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Seller Name</TableHead>
                                            <TableHead>Business</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Phone</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {verifiedSellers.map((seller) => (
                                            <TableRow key={seller.id}>
                                                <TableCell className="font-medium">{seller.sellerName}</TableCell>
                                                <TableCell>{seller.businessName || 'N/A'}</TableCell>
                                                <TableCell>{seller.email}</TableCell>
                                                <TableCell>{seller.phone}</TableCell>
                                                <TableCell>{getStatusBadge(seller.status)}</TableCell>
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

export default function SellerVerificationPage() {
    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <SellerVerificationContent />
        </ProtectedRoute>
    );
}
