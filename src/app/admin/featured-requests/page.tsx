'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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
import { Star, CheckCircle, XCircle, Loader2, Package } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import {
    fetchFeaturedRequestsAdmin,
    approveFeaturedPet,
    rejectFeaturedPet,
    type FeaturedPetRequest,
} from '@/services/featuredPetService';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function FeaturedRequestsContent() {
    const [requests, setRequests] = useState<FeaturedPetRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionDialog, setActionDialog] = useState<{
        open: boolean;
        type: 'approve' | 'reject' | null;
        petId: string | null;
        petName: string | null;
    }>({
        open: false,
        type: null,
        petId: null,
        petName: null,
    });
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const data = await fetchFeaturedRequestsAdmin();
            setRequests(data);
        } catch (error) {
            console.error('Error fetching featured requests:', error);
            toast.error('Failed to load featured requests');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async () => {
        if (!actionDialog.petId || !actionDialog.type) return;

        setIsProcessing(true);
        try {
            if (actionDialog.type === 'approve') {
                await approveFeaturedPet(actionDialog.petId);
                toast.success(`Featured request approved for ${actionDialog.petName}`);
            } else {
                await rejectFeaturedPet(actionDialog.petId);
                toast.success(`Featured request rejected for ${actionDialog.petName}`);
            }

            // Remove from list
            setRequests(requests.filter(req => req.petId !== actionDialog.petId));
            setActionDialog({ open: false, type: null, petId: null, petName: null });
        } catch (error: any) {
            console.error('Error processing request:', error);
            const errorMessage = error?.response?.data?.message || 'Failed to process request';
            toast.error(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Featured Pet Requests</h1>
                    <p className="text-gray-600 mt-1">Review and manage featured listing requests</p>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                    <Star className="h-4 w-4 mr-2" />
                    {requests.length} Pending
                </Badge>
            </div>

            {/* Requests Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Pending Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                            <span className="ml-3 text-gray-600">Loading requests...</span>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Requests</h3>
                            <p className="text-gray-600">All featured requests have been processed</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Pet Details</TableHead>
                                        <TableHead>Seller</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Requested Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {requests.map((request) => (
                                        <TableRow key={request._id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 relative shrink-0">
                                                        {request.pet.images && request.pet.images.length > 0 ? (
                                                            <Image
                                                                src={request.pet.images[0]}
                                                                alt={request.pet.name}
                                                                fill
                                                                className="object-cover"
                                                                unoptimized
                                                            />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center bg-gray-200">
                                                                <Package className="h-6 w-6 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {request.pet.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {request.pet.breedName || request.pet.breed || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {request.seller?.name || 'Unknown Seller'}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {request.seller?.email || 'N/A'}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-semibold text-gray-900">
                                                    ₹{request.pet.price.toLocaleString()}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-gray-600">
                                                    {formatDate(request.requestedAt)}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                                    Pending
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() =>
                                                            setActionDialog({
                                                                open: true,
                                                                type: 'approve',
                                                                petId: request.petId,
                                                                petName: request.pet.name,
                                                            })
                                                        }
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() =>
                                                            setActionDialog({
                                                                open: true,
                                                                type: 'reject',
                                                                petId: request.petId,
                                                                petName: request.pet.name,
                                                            })
                                                        }
                                                    >
                                                        <XCircle className="h-4 w-4 mr-1" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Confirmation Dialog */}
            <AlertDialog open={actionDialog.open} onOpenChange={(open) => !isProcessing && setActionDialog({ ...actionDialog, open })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {actionDialog.type === 'approve' ? 'Approve Featured Request' : 'Reject Featured Request'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {actionDialog.type === 'approve' ? (
                                <>
                                    Are you sure you want to approve the featured listing request for{' '}
                                    <strong>{actionDialog.petName}</strong>?
                                    <br /><br />
                                    This pet will be displayed in the featured section with higher visibility.
                                </>
                            ) : (
                                <>
                                    Are you sure you want to reject the featured listing request for{' '}
                                    <strong>{actionDialog.petName}</strong>?
                                    <br /><br />
                                    The seller will be able to submit a new request in the future.
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleAction}
                            disabled={isProcessing}
                            className={actionDialog.type === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    {actionDialog.type === 'approve' ? 'Approve' : 'Reject'}
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default function FeaturedRequestsPage() {
    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <FeaturedRequestsContent />
        </ProtectedRoute>
    );
}
