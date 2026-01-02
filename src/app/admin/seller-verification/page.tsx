"use client";

import React, { useState, useEffect } from 'react';
import {
    fetchSellersByStatus,
    fetchSellerVerificationStats,
    approveSellerVerification,
    rejectSellerVerification,
    SellerVerification,
    SellerVerificationStats
} from '@/services/admin/adminSellerService';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    FileText,
    Phone,
    Mail,
    Building2,
    ShieldCheck,
    Loader2
} from 'lucide-react';

function SellerVerificationContent() {
    const [allVerifications, setAllVerifications] = useState<SellerVerification[]>([]);
    const [stats, setStats] = useState<SellerVerificationStats>({ pending: 0, approved: 0, rejected: 0, suspended: 0, total: 0 });
    const [activeTab, setActiveTab] = useState<'pending' | 'verified' | 'rejected'>('pending');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedSeller, setSelectedSeller] = useState<SellerVerification | null>(null);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [actionDialog, setActionDialog] = useState<{
        open: boolean;
        type: 'approve' | 'reject' | null;
        sellerId: string | null;
    }>({
        open: false,
        type: null,
        sellerId: null,
    });

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [verifications, statsData] = await Promise.all([
                fetchSellersByStatus(activeTab),
                fetchSellerVerificationStats(),
            ]);
            setAllVerifications(verifications || []);
            setStats(statsData);
        } catch (err: any) {
            setError(err?.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const handleApprove = async (sellerId: string) => {
        setLoading(true);
        try {
            await approveSellerVerification(sellerId, 'Documents verified successfully');
            await fetchData();
        } catch (err: any) {
            setError(err?.message || 'Failed to approve');
        } finally {
            setActionDialog({ open: false, type: null, sellerId: null });
            setLoading(false);
        }
    };

    const handleReject = async (sellerId: string) => {
        setLoading(true);
        try {
            await rejectSellerVerification(sellerId, 'Request rejected');
            await fetchData();
        } catch (err: any) {
            setError(err?.message || 'Failed to reject');
        } finally {
            setActionDialog({ open: false, type: null, sellerId: null });
            setLoading(false);
        }
    };

    const viewDetails = (seller: SellerVerification) => {
        setSelectedSeller(seller);
        setShowDetailsDialog(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                </Badge>;
            case 'verified':
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


    const pendingCount = stats.pending;
    const approvedCount = stats.approved;
    const rejectedCount = stats.rejected;


    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Seller Verification</h1>
                <p className="text-gray-600 mt-1">Review and approve seller verification requests</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
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
                                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-600 opacity-20" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Rejected</p>
                                <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
                            </div>
                            <XCircle className="w-8 h-8 text-red-600 opacity-20" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
                <button
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'pending'
                        ? 'border-b-2 border-orange-600 text-orange-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                    onClick={() => setActiveTab('pending')}
                >
                    Pending {pendingCount}
                </button>
                <button
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'verified'
                        ? 'border-b-2 border-green-600 text-green-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                    onClick={() => setActiveTab('verified')}
                >
                    Approved {approvedCount}
                </button>
                <button
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'rejected'
                        ? 'border-b-2 border-red-600 text-red-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                    onClick={() => setActiveTab('rejected')}
                >
                    Rejected {rejectedCount}
                </button>
            </div>

            {/* Verification Requests Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Verification Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Seller</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Business</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Contact</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Submitted</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(allVerifications || []).length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-gray-500">
                                            No verification requests found
                                        </td>
                                    </tr>
                                ) : (
                                    (allVerifications || []).map((verification) => (
                                        <tr key={verification._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{verification.userId.name}</p>
                                                    <p className="text-sm text-gray-500">{verification.userId.email}</p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-700">{verification.brandName}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-700">{verification.whatsappNumber || verification.userId.phoneNumber}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {new Date(verification.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="py-3 px-4">
                                                {getStatusBadge(verification.status)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => viewDetails(verification)}
                                                    >
                                                        View Details
                                                    </Button>
                                                    {activeTab === 'pending' && (
                                                        <>
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                className="bg-green-600 hover:bg-green-700"
                                                                onClick={() => setActionDialog({
                                                                    open: true,
                                                                    type: 'approve',
                                                                    sellerId: verification._id
                                                                })}
                                                            >
                                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => setActionDialog({
                                                                    open: true,
                                                                    type: 'reject',
                                                                    sellerId: verification._id
                                                                })}
                                                            >
                                                                <XCircle className="w-4 h-4 mr-1" />
                                                                Reject
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Details Dialog */}
            <AlertDialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                <AlertDialogContent className="max-w-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5" />
                            Seller Verification Details
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Complete information about the seller verification request
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {selectedSeller && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Seller Name</label>
                                    <p className="text-gray-900 font-medium mt-1">{selectedSeller.userId.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Brand Name</label>
                                    <p className="text-gray-900 font-medium mt-1">{selectedSeller.brandName}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Email</label>
                                    <p className="text-gray-900 mt-1">{selectedSeller.userId.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Phone</label>
                                    <p className="text-gray-900 mt-1">{selectedSeller.whatsappNumber || selectedSeller.userId.phoneNumber}</p>
                                </div>
                                {selectedSeller.location && (
                                    <div className="col-span-2">
                                        <label className="text-sm font-medium text-gray-600">Location</label>
                                        <p className="text-gray-900 mt-1">
                                            {[selectedSeller.location.city, selectedSeller.location.state, selectedSeller.location.pincode].filter(Boolean).join(', ')}
                                        </p>
                                    </div>
                                )}
                                {selectedSeller.bio && (
                                    <div className="col-span-2">
                                        <label className="text-sm font-medium text-gray-600">Bio</label>
                                        <p className="text-gray-900 mt-1">{selectedSeller.bio}</p>
                                    </div>
                                )}
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Submitted On</label>
                                    <p className="text-gray-900 mt-1">
                                        {new Date(selectedSeller.createdAt).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Status</label>
                                    <div className="mt-1">{getStatusBadge(selectedSeller.status)}</div>
                                </div>
                                {selectedSeller.verificationNotes && (
                                    <div className="col-span-2">
                                        <label className="text-sm font-medium text-gray-600">Verification Notes</label>
                                        <p className="text-gray-900 mt-1">{selectedSeller.verificationNotes}</p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">Documents</label>
                                <div className="mt-2 space-y-2">
                                    <a href={selectedSeller.documents.idProof} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-gray-50 rounded border hover:bg-gray-100">
                                        <FileText className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-blue-600">ID Proof</span>
                                    </a>
                                    <a href={selectedSeller.documents.certificate} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-gray-50 rounded border hover:bg-gray-100">
                                        <FileText className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-blue-600">Certificate</span>
                                    </a>
                                    {selectedSeller.documents.shopImage && (
                                        <a href={selectedSeller.documents.shopImage} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-gray-50 rounded border hover:bg-gray-100">
                                            <FileText className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-blue-600">Shop Image</span>
                                        </a>
                                    )}
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
                            {actionDialog.type === 'approve' ? 'Approve Seller?' : 'Reject Seller?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {actionDialog.type === 'approve'
                                ? 'This will grant seller privileges to this user. They will be able to list pets for sale.'
                                : 'This will reject the seller verification request. The user will not be able to sell pets.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (actionDialog.sellerId) {
                                    actionDialog.type === 'approve'
                                        ? handleApprove(actionDialog.sellerId)
                                        : handleReject(actionDialog.sellerId);
                                }
                            }}
                            className={actionDialog.type === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                            {actionDialog.type === 'approve' ? 'Approve' : 'Reject'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
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
