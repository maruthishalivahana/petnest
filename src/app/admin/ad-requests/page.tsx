"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    CheckCircle,
    XCircle,
    Loader2,
    Eye,
    Calendar,
    Mail,
    Phone,
    Package,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import apiClient from "@/lib/apiClient";

interface AdRequest {
    _id: string;
    brandName: string;
    contactEmail: string;
    contactNumber?: string;
    adSpot: string;
    message?: string;
    mediaUrl?: string;
    status: "pending" | "approved" | "rejected";
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
}

function AdRequestsContent() {
    const [requests, setRequests] = useState<AdRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedRequest, setSelectedRequest] = useState<AdRequest | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [actionDialog, setActionDialog] = useState<{
        open: boolean;
        type: "approve" | "reject" | null;
        requestId: string | null;
    }>({
        open: false,
        type: null,
        requestId: null,
    });
    const [rejectionReason, setRejectionReason] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, [statusFilter, page]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.append("page", page.toString());
            params.append("limit", "10");
            if (statusFilter !== "all") {
                params.append("status", statusFilter);
            }

            const response = await apiClient.get(
                `/advertisementrequests?${params.toString()}`
            );

            if (response.data.success) {
                setRequests(response.data.data || []);
                if (response.data.pagination) {
                    setTotalPages(response.data.pagination.totalPages || 1);
                }
            }
        } catch (error: any) {
            console.error("Error fetching ad requests:", error);
            toast.error("Failed to load ad requests");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (request: AdRequest) => {
        setSelectedRequest(request);
        setDetailsOpen(true);
    };

    const handleApproveClick = (requestId: string) => {
        setActionDialog({
            open: true,
            type: "approve",
            requestId,
        });
    };

    const handleRejectClick = (requestId: string) => {
        setActionDialog({
            open: true,
            type: "reject",
            requestId,
        });
        setRejectionReason("");
    };

    const handleConfirmAction = async () => {
        if (!actionDialog.requestId) return;

        try {
            setIsProcessing(true);

            if (actionDialog.type === "approve") {
                await apiClient.patch(
                    `/advertisementrequests/${actionDialog.requestId}/status`,
                    { status: "approved" }
                );
                toast.success("Advertisement request approved");
            } else if (actionDialog.type === "reject") {
                if (!rejectionReason.trim()) {
                    toast.error("Please provide a rejection reason");
                    return;
                }
                await apiClient.patch(
                    `/advertisementrequests/${actionDialog.requestId}/status`,
                    {
                        status: "rejected",
                        rejectionReason: rejectionReason.trim(),
                    }
                );
                toast.success("Advertisement request rejected");
            }

            // Refresh the list
            fetchRequests();
            setActionDialog({ open: false, type: null, requestId: null });
            setRejectionReason("");
        } catch (error: any) {
            console.error("Error updating request:", error);
            toast.error(
                error.response?.data?.message || "Failed to update request"
            );
        } finally {
            setIsProcessing(false);
        }
    };

    const filteredRequests = requests.filter((request) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            request.brandName.toLowerCase().includes(query) ||
            request.contactEmail.toLowerCase().includes(query)
        );
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
            case "approved":
                return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Approved</Badge>;
            case "rejected":
                return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getAdSpotLabel = (adSpot: string) => {
        const labels: Record<string, string> = {
            homepageBanner: "Homepage Banner",
            sidebarAd: "Sidebar",
            footerAd: "Footer",
            inlineAd: "Inline Feed",
        };
        return labels[adSpot] || adSpot;
    };

    if (loading && requests.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Advertisement Requests
                </h1>
                <p className="text-gray-600 mt-1">
                    Manage and review advertisement requests
                </p>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search by brand name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select
                            value={statusFilter}
                            onValueChange={(value) => {
                                setStatusFilter(value);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Requests ({filteredRequests.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredRequests.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No requests found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Brand Name</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Ad Spot</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRequests.map((request) => (
                                        <TableRow key={request._id}>
                                            <TableCell className="font-medium">
                                                {request.brandName}
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3 text-gray-400" />
                                                        {request.contactEmail}
                                                    </div>
                                                    {request.contactNumber && (
                                                        <div className="flex items-center gap-1 text-gray-500 mt-1">
                                                            <Phone className="h-3 w-3" />
                                                            {request.contactNumber}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getAdSpotLabel(request.adSpot)}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(request.status)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(request.createdAt).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleViewDetails(request)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    {request.status === "pending" && (
                                                        <>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                                onClick={() =>
                                                                    handleApproveClick(request._id)
                                                                }
                                                            >
                                                                <CheckCircle className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                onClick={() =>
                                                                    handleRejectClick(request._id)
                                                                }
                                                            >
                                                                <XCircle className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
                            <p className="text-sm text-gray-600">
                                Page {page} of {totalPages}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setPage((p) => Math.min(totalPages, p + 1))
                                    }
                                    disabled={page === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Details Dialog */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Request Details</DialogTitle>
                        <DialogDescription>
                            View complete information about this advertisement request
                        </DialogDescription>
                    </DialogHeader>
                    {selectedRequest && (
                        <div className="space-y-4">
                            {selectedRequest.mediaUrl && (
                                <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100">
                                    <Image
                                        src={selectedRequest.mediaUrl}
                                        alt={selectedRequest.brandName}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Brand Name</p>
                                    <p className="font-medium">
                                        {selectedRequest.brandName}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    {getStatusBadge(selectedRequest.status)}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Contact Email</p>
                                    <p className="font-medium">
                                        {selectedRequest.contactEmail}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Contact Number</p>
                                    <p className="font-medium">
                                        {selectedRequest.contactNumber || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Ad Spot</p>
                                    <p className="font-medium">
                                        {getAdSpotLabel(selectedRequest.adSpot)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Submitted</p>
                                    <p className="font-medium">
                                        {new Date(
                                            selectedRequest.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            {selectedRequest.message && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Message</p>
                                    <p className="text-sm bg-gray-50 p-3 rounded-md">
                                        {selectedRequest.message}
                                    </p>
                                </div>
                            )}
                            {selectedRequest.status === "rejected" &&
                                selectedRequest.rejectionReason && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            Rejection Reason
                                        </p>
                                        <p className="text-sm bg-red-50 p-3 rounded-md text-red-900">
                                            {selectedRequest.rejectionReason}
                                        </p>
                                    </div>
                                )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Action Confirmation Dialog */}
            <Dialog
                open={actionDialog.open}
                onOpenChange={(open) =>
                    !isProcessing &&
                    setActionDialog({ open, type: null, requestId: null })
                }
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {actionDialog.type === "approve"
                                ? "Approve Request"
                                : "Reject Request"}
                        </DialogTitle>
                        <DialogDescription>
                            {actionDialog.type === "approve"
                                ? "Are you sure you want to approve this advertisement request?"
                                : "Please provide a reason for rejecting this request."}
                        </DialogDescription>
                    </DialogHeader>
                    {actionDialog.type === "reject" && (
                        <div className="py-4">
                            <Textarea
                                placeholder="Enter rejection reason..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows={4}
                            />
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setActionDialog({ open: false, type: null, requestId: null })
                            }
                            disabled={isProcessing}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmAction}
                            disabled={isProcessing}
                            className={
                                actionDialog.type === "approve"
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-red-600 hover:bg-red-700"
                            }
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : actionDialog.type === "approve" ? (
                                "Approve"
                            ) : (
                                "Reject"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function AdRequestsPage() {
    return (
        <ProtectedRoute allowedRoles={["admin"]}>
            <AdRequestsContent />
        </ProtectedRoute>
    );
}
