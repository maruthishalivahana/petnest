"use client";

import React, { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUnverifiedPets, updatePetStatusThunk } from '@/store/slices/adminPetsSlice';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { PawPrint, AlertCircle, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';

// Status constants
const STATUS = {
    NOT_VERIFIED: 'not-verified',
    VERIFIED: 'verified',
    REJECTED: 'rejected',
} as const;

function PetVerificationContent() {
    const dispatch = useAppDispatch();
    const { unverifiedPets, loading, error } = useAppSelector((state) => state.adminPets);

    // Fetch pets on mount - only if not already loaded
    useEffect(() => {
        if (unverifiedPets.length === 0 && !loading) {
            dispatch(fetchUnverifiedPets());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Memoized stats
    const stats = useMemo(() => ({
        total: unverifiedPets.length,
        pending: unverifiedPets.filter(p => p.status === STATUS.NOT_VERIFIED).length,
    }), [unverifiedPets]);

    // Action handlers
    const handleApprove = async (petId: string) => {
        await dispatch(updatePetStatusThunk({ petId, status: 'verified' }));
    };

    const handleReject = async (petId: string) => {
        await dispatch(updatePetStatusThunk({ petId, status: 'rejected' }));
    };

    // Status badge helper
    const getStatusBadge = (status: string) => {
        if (status === STATUS.NOT_VERIFIED) {
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
    if (unverifiedPets.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                    <PawPrint className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pet Listings</h3>
                    <p className="text-gray-500 text-center">There are no pet listings pending verification.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Pet Verification</h1>
                <p className="text-gray-600 mt-1">Review and verify pet listings</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm text-gray-600">Total Listings</div>
                        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm text-gray-600">Pending Verification</div>
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Pets Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Unverified Pet Listings</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pet Name</TableHead>
                                <TableHead>Species</TableHead>
                                <TableHead>Breed</TableHead>
                                <TableHead>Age</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {unverifiedPets.map((pet) => (
                                <TableRow key={pet._id || pet.id}>
                                    <TableCell className="font-medium">{pet.name}</TableCell>
                                    <TableCell>
                                        {typeof pet.category === 'string' ? pet.category : pet.category?.name || 'N/A'}
                                    </TableCell>
                                    <TableCell>{pet.breedName || pet.breedname || (typeof pet.breedId === 'object' ? pet.breedId?.name : 'N/A')}</TableCell>
                                    <TableCell>{pet.age}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <DollarSign className="w-3 h-3" />
                                            {pet.price}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <div>{pet.sellerId?.userId?.name || pet.sellerId?.brandName || 'N/A'}</div>
                                            <div className="text-gray-500">{pet.sellerId?.userId?.email || 'N/A'}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(pet.status || STATUS.NOT_VERIFIED)}</TableCell>
                                    <TableCell className="text-right">
                                        {pet.status === STATUS.NOT_VERIFIED && (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-green-600 hover:bg-green-50"
                                                    onClick={() => handleApprove(pet._id || pet.id || '')}
                                                    disabled={loading}
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-1" />
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 hover:bg-red-50"
                                                    onClick={() => handleReject(pet._id || pet.id || '')}
                                                    disabled={loading}
                                                >
                                                    <XCircle className="w-4 h-4 mr-1" />
                                                    Reject
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

export default function PetVerificationPage() {
    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <PetVerificationContent />
        </ProtectedRoute>
    );
}
