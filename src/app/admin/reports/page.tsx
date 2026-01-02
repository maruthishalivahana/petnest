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
    AlertCircle,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    User,
    Package,
    Store,
    Loader2
} from 'lucide-react';
import {
    Report,
    getAllReports,
    resolveReport as resolveReportAPI,
    dismissReport as dismissReportAPI
} from '@/services/admin/adminReportService';

function ReportsContent() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [actionDialog, setActionDialog] = useState<{
        open: boolean;
        type: 'resolve' | 'dismiss' | null;
        reportId: string | null;
    }>({
        open: false,
        type: null,
        reportId: null,
    });

    useEffect(() => {
        if (reports.length === 0 && loading) {
            fetchReports();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await getAllReports();
            setReports(response.reports);
        } catch (error) {
            // Silent error
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (reportId: string) => {
        try {
            await resolveReportAPI(reportId);
            setReports(reports.map(r =>
                r.id === reportId ? { ...r, status: 'resolved' as const } : r
            ));
            setActionDialog({ open: false, type: null, reportId: null });
        } catch (error) {
            // Silent error
        }
    };

    const handleDismiss = async (reportId: string) => {
        try {
            await dismissReportAPI(reportId);
            setReports(reports.map(r =>
                r.id === reportId ? { ...r, status: 'dismissed' as const } : r
            ));
            setActionDialog({ open: false, type: null, reportId: null });
        } catch (error) {
            // Silent error
        }
    };

    const viewDetails = (report: Report) => {
        setSelectedReport(report);
        setShowDetailsDialog(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                </Badge>;
            case 'resolved':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Resolved
                </Badge>;
            case 'dismissed':
                return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                    <XCircle className="w-3 h-3 mr-1" />
                    Dismissed
                </Badge>;
            default:
                return null;
        }
    };

    const getReportTypeIcon = (type: string) => {
        switch (type) {
            case 'user':
                return <User className="w-4 h-4" />;
            case 'listing':
                return <Package className="w-4 h-4" />;
            case 'seller':
                return <Store className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    const getReportTypeBadge = (type: string) => {
        const colors = {
            user: 'bg-blue-100 text-blue-700',
            listing: 'bg-purple-100 text-purple-700',
            seller: 'bg-indigo-100 text-indigo-700',
        };
        return (
            <Badge className={`${colors[type as keyof typeof colors]} hover:${colors[type as keyof typeof colors]}`}>
                {getReportTypeIcon(type)}
                <span className="ml-1 capitalize">{type}</span>
            </Badge>
        );
    };

    const pendingReports = reports.filter(r => r.status === 'pending');
    const resolvedReports = reports.filter(r => r.status === 'resolved');
    const dismissedReports = reports.filter(r => r.status === 'dismissed');

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
                <h1 className="text-3xl font-bold text-gray-900">Reports & Moderation</h1>
                <p className="text-gray-600 mt-1">Review and manage user reports and moderation actions</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-orange-600">{pendingReports.length}</p>
                            </div>
                            <Clock className="w-8 h-8 text-orange-600 opacity-20" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Resolved</p>
                                <p className="text-2xl font-bold text-green-600">{resolvedReports.length}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-600 opacity-20" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Dismissed</p>
                                <p className="text-2xl font-bold text-gray-600">{dismissedReports.length}</p>
                            </div>
                            <XCircle className="w-8 h-8 text-gray-600 opacity-20" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="pending">
                        Pending ({pendingReports.length})
                    </TabsTrigger>
                    <TabsTrigger value="resolved">
                        Resolved ({resolvedReports.length})
                    </TabsTrigger>
                    <TabsTrigger value="all">
                        All ({reports.length})
                    </TabsTrigger>
                </TabsList>

                {/* Pending Reports */}
                <TabsContent value="pending" className="mt-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {pendingReports.length > 0 ? (
                                    pendingReports.map((report) => (
                                        <div
                                            key={report.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {getReportTypeBadge(report.reportType)}
                                                        {getStatusBadge(report.status)}
                                                    </div>
                                                    <h3 className="font-semibold text-gray-900 mb-1">
                                                        {report.reportedItem}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        <strong>Reason:</strong> {report.reason}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Reported by: {report.reportedBy} • {new Date(report.createdDate).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-4 pt-4 border-t">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => viewDetails(report)}
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Details
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700"
                                                    onClick={() => setActionDialog({
                                                        open: true,
                                                        type: 'resolve',
                                                        reportId: report.id
                                                    })}
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Resolve
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setActionDialog({
                                                        open: true,
                                                        type: 'dismiss',
                                                        reportId: report.id
                                                    })}
                                                >
                                                    <XCircle className="w-4 h-4 mr-2" />
                                                    Dismiss
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">No pending reports</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Resolved Reports */}
                <TabsContent value="resolved" className="mt-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {resolvedReports.length > 0 ? (
                                    resolvedReports.map((report) => (
                                        <div
                                            key={report.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {getReportTypeBadge(report.reportType)}
                                                        {getStatusBadge(report.status)}
                                                    </div>
                                                    <h3 className="font-semibold text-gray-900 mb-1">
                                                        {report.reportedItem}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        <strong>Reason:</strong> {report.reason}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Reported by: {report.reportedBy} • {new Date(report.createdDate).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-4 pt-4 border-t">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => viewDetails(report)}
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">No resolved reports</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* All Reports */}
                <TabsContent value="all" className="mt-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {reports.map((report) => (
                                    <div
                                        key={report.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    {getReportTypeBadge(report.reportType)}
                                                    {getStatusBadge(report.status)}
                                                </div>
                                                <h3 className="font-semibold text-gray-900 mb-1">
                                                    {report.reportedItem}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    <strong>Reason:</strong> {report.reason}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Reported by: {report.reportedBy} • {new Date(report.createdDate).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-4 pt-4 border-t">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => viewDetails(report)}
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Details
                                            </Button>
                                            {report.status === 'pending' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => setActionDialog({
                                                            open: true,
                                                            type: 'resolve',
                                                            reportId: report.id
                                                        })}
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        Resolve
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setActionDialog({
                                                            open: true,
                                                            type: 'dismiss',
                                                            reportId: report.id
                                                        })}
                                                    >
                                                        <XCircle className="w-4 h-4 mr-2" />
                                                        Dismiss
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Details Dialog */}
            <AlertDialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                <AlertDialogContent className="max-w-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            Report Details
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Complete information about the report
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {selectedReport && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Report Type</label>
                                    <div className="mt-1">{getReportTypeBadge(selectedReport.reportType)}</div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Status</label>
                                    <div className="mt-1">{getStatusBadge(selectedReport.status)}</div>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-sm font-medium text-gray-600">Reported Item</label>
                                    <p className="text-gray-900 font-medium mt-1">{selectedReport.reportedItem}</p>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-sm font-medium text-gray-600">Reason</label>
                                    <p className="text-gray-900 mt-1">{selectedReport.reason}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Reported By</label>
                                    <p className="text-gray-900 mt-1">{selectedReport.reportedBy}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Report Date</label>
                                    <p className="text-gray-900 mt-1">
                                        {new Date(selectedReport.createdDate).toLocaleDateString('en-US', {
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
                            {actionDialog.type === 'resolve' ? 'Resolve Report?' : 'Dismiss Report?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {actionDialog.type === 'resolve'
                                ? 'Mark this report as resolved. This indicates that appropriate action has been taken.'
                                : 'Dismiss this report. This indicates that no action is required.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (actionDialog.reportId) {
                                    actionDialog.type === 'resolve'
                                        ? handleResolve(actionDialog.reportId)
                                        : handleDismiss(actionDialog.reportId);
                                }
                            }}
                            className={actionDialog.type === 'resolve' ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                            {actionDialog.type === 'resolve' ? 'Resolve' : 'Dismiss'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default function ReportsPage() {
    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <ReportsContent />
        </ProtectedRoute>
    );
}
