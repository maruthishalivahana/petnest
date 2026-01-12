"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    ArrowUpDown,
    Plus,
    ChevronLeft,
    ChevronRight,
    Image as ImageIcon,
    Copy,
    FileX2,
    CheckCircle,
    XCircle,
    Calendar,
} from "lucide-react";
import type { Advertisement, AdListing, AdRequest } from "@/types/advertisement.types";
import {
    getAllAdvertisements,
    getAllPendingAdvertisements,
    getAllApprovedAdvertisements,
    getAllAdListings,
    updateAdvertisementStatus,
    toggleAdStatus,
    deleteAdvertisement,
    duplicateAdvertisement,
    getAdvertisementsWithFilters,
    getPendingAdRequests,
    getApprovedAdRequests,
    extendAdDates,
} from "@/services/admin/adminAdvertisementService";
import AdDetailsDialog from "./AdDetailsDialog";
import ConfirmDialog from "./ConfirmDialog";
import ExtendDatesDialog from "./ExtendDatesDialog";

interface AdvertisementsTableProps {
    type: "pending" | "approved" | "listings";
}

// Union type for Advertisement, AdListing, and AdRequest
type AdData = Advertisement | AdListing | AdRequest;

// Extended type with metrics
interface AdWithMetrics extends Partial<Advertisement & AdListing & AdRequest> {
    _id: string;
    impressions?: number;
    clicks?: number;
    ctr?: number;
    isActive?: boolean;
    status?: 'pending' | 'approved' | 'rejected';
    // Common display fields
    displayTitle?: string;
    displayImage?: string;
    displayPlacement?: string;
    createdAt: string;
    updatedAt: string;
}

type SortField = 'createdAt' | 'impressions' | 'clicks' | 'ctr' | 'title';
type SortOrder = 'asc' | 'desc';

export default function AdvertisementsTable({ type }: AdvertisementsTableProps) {
    const router = useRouter();
    const [advertisements, setAdvertisements] = useState<AdWithMetrics[]>([]);
    const [filteredAds, setFilteredAds] = useState<AdWithMetrics[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAd, setSelectedAd] = useState<AdWithMetrics | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [extendDatesOpen, setExtendDatesOpen] = useState(false);
    const [extendingDates, setExtendingDates] = useState(false);

    // Sorting
    const [sortField, setSortField] = useState<SortField>('createdAt');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        type: "approve" | "reject" | "toggle" | "delete" | "bulkActivate" | "bulkDeactivate";
        adId?: string;
    } | null>(null);

    const { toast } = useToast();

    useEffect(() => {
        fetchAdvertisements();
    }, [type]);

    useEffect(() => {
        filterAndSortAds();
    }, [advertisements, sortField, sortOrder]);

    const fetchAdvertisements = async () => {
        try {
            setLoading(true);
            let dataWithMetrics: AdWithMetrics[] = [];

            if (type === "listings") {
                const result = await getAdvertisementsWithFilters();

                dataWithMetrics = result.data.map(ad => {
                    const ctr = ad.impressions > 0 ? (ad.clicks / ad.impressions) * 100 : 0;
                    return {
                        ...ad,
                        ctr,
                        displayTitle: ad.title,
                        displayImage: ad.imageUrl,
                        displayPlacement: ad.placement,
                    };
                });
            } else if (type === "pending") {
                const requests = await getPendingAdRequests();

                dataWithMetrics = requests.map(request => ({
                    ...request,
                    impressions: 0,
                    clicks: 0,
                    ctr: 0,
                    isActive: false,
                    displayTitle: request.brandName,
                    displayImage: request.mediaUrl,
                    displayPlacement: request.requestedPlacement,
                }));
            } else if (type === "approved") {
                const requests = await getApprovedAdRequests();

                dataWithMetrics = requests.map(request => ({
                    ...request,
                    impressions: 0,
                    clicks: 0,
                    ctr: 0,
                    isActive: false,
                    displayTitle: request.brandName,
                    displayImage: request.mediaUrl,
                    displayPlacement: request.requestedPlacement,
                }));
            }

            setAdvertisements(dataWithMetrics);
        } catch (error: any) {
            console.error('Fetch advertisements error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Failed to fetch advertisements",
            });
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortAds = () => {
        let filtered = [...advertisements];

        // Sorting only
        filtered.sort((a, b) => {
            let aVal, bVal;

            switch (sortField) {
                case 'title':
                    aVal = (a.displayTitle || a.brandName || a.title || '').toLowerCase();
                    bVal = (b.displayTitle || b.brandName || b.title || '').toLowerCase();
                    break;
                case 'impressions':
                    aVal = a.impressions || 0;
                    bVal = b.impressions || 0;
                    break;
                case 'clicks':
                    aVal = a.clicks || 0;
                    bVal = b.clicks || 0;
                    break;
                case 'ctr':
                    aVal = a.ctr || 0;
                    bVal = b.ctr || 0;
                    break;
                case 'createdAt':
                default:
                    aVal = new Date(a.createdAt).getTime();
                    bVal = new Date(b.createdAt).getTime();
            }

            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        setFilteredAds(filtered);
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === paginatedAds.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(paginatedAds.map(ad => ad._id)));
        }
    };

    const toggleSelectAd = (adId: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(adId)) {
            newSelected.delete(adId);
        } else {
            newSelected.add(adId);
        }
        setSelectedIds(newSelected);
    };

    const handleView = (ad: AdWithMetrics) => {
        setSelectedAd(ad);
        setDetailsOpen(true);
    };

    const handleEdit = (adId: string) => {
        router.push(`/admin/advertisements/edit/${adId}`);
    };

    const handleDuplicate = async (adId: string) => {
        try {
            await duplicateAdvertisement(adId);
            toast({
                title: "Success",
                description: "Advertisement duplicated successfully",
            });
            fetchAdvertisements();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Failed to duplicate advertisement",
            });
        }
    };

    const handleToggleStatus = async (adId: string) => {
        try {
            // Optimistically update the UI first
            setAdvertisements((prev) =>
                prev.map((ad) =>
                    ad._id === adId ? { ...ad, isActive: !ad.isActive } : ad
                )
            );

            await toggleAdStatus(adId);
            toast({
                title: "Success",
                description: "Advertisement status updated successfully",
            });

            // Refetch to ensure data consistency
            fetchAdvertisements();
        } catch (error: any) {
            // Revert the optimistic update on error
            setAdvertisements((prev) =>
                prev.map((ad) =>
                    ad._id === adId ? { ...ad, isActive: !ad.isActive } : ad
                )
            );
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Failed to update status",
            });
        }
    };

    const handleDelete = async (adId: string) => {
        try {
            await deleteAdvertisement(adId);
            toast({
                title: "Success",
                description: "Advertisement deleted successfully",
            });
            setAdvertisements((prev) => prev.filter((ad) => ad._id !== adId));
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Failed to delete advertisement",
            });
        }
    };

    const handleBulkActivate = async () => {
        try {
            // Bulk activate selected ads
            await Promise.all(
                Array.from(selectedIds).map(id => toggleAdStatus(id))
            );
            toast({
                title: "Success",
                description: `${selectedIds.size} advertisements activated`,
            });
            setSelectedIds(new Set());
            fetchAdvertisements();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to activate advertisements",
            });
        }
    };

    const handleBulkDeactivate = async () => {
        try {
            // Bulk deactivate selected ads
            await Promise.all(
                Array.from(selectedIds).map(id => toggleAdStatus(id))
            );
            toast({
                title: "Success",
                description: `${selectedIds.size} advertisements deactivated`,
            });
            setSelectedIds(new Set());
            fetchAdvertisements();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to deactivate advertisements",
            });
        }
    };

    const handleExtendDates = async (days: number) => {
        try {
            setExtendingDates(true);
            const result = await extendAdDates(days);
            toast({
                title: "Success",
                description: result.message || `Extended ${result.updatedCount} advertisement(s) by ${days} days`,
            });
            setExtendDatesOpen(false);
            fetchAdvertisements();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Failed to extend advertisement dates",
            });
        } finally {
            setExtendingDates(false);
        }
    };

    const handleConfirmAction = async () => {
        if (!confirmDialog) return;

        switch (confirmDialog.type) {
            case "approve":
                if (confirmDialog.adId) await handleApprove(confirmDialog.adId);
                break;
            case "reject":
                if (confirmDialog.adId) await handleReject(confirmDialog.adId);
                break;
            case "toggle":
                if (confirmDialog.adId) await handleToggleStatus(confirmDialog.adId);
                break;
            case "delete":
                if (confirmDialog.adId) await handleDelete(confirmDialog.adId);
                break;
            case "bulkActivate":
                await handleBulkActivate();
                break;
            case "bulkDeactivate":
                await handleBulkDeactivate();
                break;
        }

        setConfirmDialog(null);
    };

    const handleApprove = async (adId: string) => {
        try {
            await updateAdvertisementStatus(adId, 'approved');
            toast({
                title: "Success",
                description: "Advertisement request approved successfully",
            });
            fetchAdvertisements();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Failed to approve request",
            });
        }
    };

    const handleReject = async (adId: string) => {
        try {
            console.log('Rejecting ad request:', adId);
            const result = await updateAdvertisementStatus(adId, 'rejected');
            console.log('Reject result:', result);
            toast({
                title: "Success",
                description: "Advertisement request rejected",
            });
            fetchAdvertisements();
        } catch (error: any) {
            console.error('Reject error:', error);
            console.error('Error response:', error.response);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || error.message || "Failed to reject request",
            });
        }
    };

    // Pagination logic
    const totalPages = Math.ceil(filteredAds.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedAds = filteredAds.slice(startIndex, endIndex);

    const getPlacementBadge = (placement: string) => {
        const colors: Record<string, string> = {
            home_top_banner: "bg-blue-600",
            home_sidebar: "bg-purple-600",
            home_footer: "bg-orange-600",
            pet_feed_inline: "bg-green-600",
            pet_mobile_sticky: "bg-pink-600",
            pet_detail_below_desc: "bg-indigo-600",
            pet_detail_sidebar: "bg-yellow-600",
            blog_mid_article: "bg-red-600",
            blog_sidebar: "bg-cyan-600",
            dashboard_header: "bg-teal-600",
            homepageBanner: "bg-blue-600",
            sidebar: "bg-purple-600",
            footer: "bg-orange-600",
            blogFeature: "bg-pink-600",
        };

        const label = placement.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        return (
            <Badge className={`${colors[placement] || "bg-gray-600"} text-white`}>
                {label}
            </Badge>
        );
    };

    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}k`;
        }
        return num.toString();
    };

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Toolbar: Actions */}
            <div className="flex justify-between items-center">
                <div>
                    {type === "listings" && (
                        <Button
                            variant="outline"
                            onClick={() => setExtendDatesOpen(true)}
                            className="gap-2"
                        >
                            <Calendar className="h-4 w-4" />
                            Extend Ad Dates
                        </Button>
                    )}
                </div>
                <Button
                    variant="outline"
                    onClick={() => router.push('/admin/advertisements/create')}
                    className="gap-2"
                >
                    <Plus className="h-4 w-4" />
                    New Ad
                </Button>
            </div>

            {/* Bulk Actions */}
            {selectedIds.size > 0 && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">{selectedIds.size} selected</span>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setConfirmDialog({ open: true, type: "bulkActivate" })}
                    >
                        Activate Selected
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setConfirmDialog({ open: true, type: "bulkDeactivate" })}
                    >
                        Deactivate Selected
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedIds(new Set())}
                    >
                        Clear Selection
                    </Button>
                </div>
            )}

            {/* Table */}
            {filteredAds.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 border rounded-lg bg-muted/20">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                        <FileX2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                        {advertisements.length === 0 ? "No advertisements yet" : "No results found"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-sm text-center">
                        {advertisements.length === 0
                            ? "Create your first ad to start displaying to buyers across the platform"
                            : "Try adjusting your filters or search terms"}
                    </p>
                    {advertisements.length === 0 && (
                        <Button onClick={() => router.push('/admin/advertisements/create')} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create Advertisement
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    <div className="rounded-md border overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={selectedIds.size === paginatedAds.length && paginatedAds.length > 0}
                                                onCheckedChange={toggleSelectAll}
                                            />
                                        </TableHead>
                                        <TableHead className="w-20">Image</TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleSort('title')}
                                                className="gap-1 -ml-3"
                                            >
                                                {type === "approved" ? "Brand Name" : "Title"}
                                                <ArrowUpDown className="h-3 w-3" />
                                            </Button>
                                        </TableHead>
                                        <TableHead>Placement</TableHead>
                                        {type === "approved" ? (
                                            <>
                                                <TableHead className="hidden md:table-cell">Contact</TableHead>
                                                <TableHead className="hidden lg:table-cell">Submitted Date</TableHead>
                                            </>
                                        ) : (
                                            <>
                                                <TableHead className="hidden md:table-cell">Device</TableHead>
                                                {type === "listings" && <TableHead className="hidden lg:table-cell">Campaign Dates</TableHead>}
                                                {type === "listings" && (
                                                    <TableHead>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleSort('impressions')}
                                                            className="gap-1 -ml-3"
                                                        >
                                                            Metrics
                                                            <ArrowUpDown className="h-3 w-3" />
                                                        </Button>
                                                    </TableHead>
                                                )}
                                            </>
                                        )}
                                        <TableHead className="w-20">Status</TableHead>
                                        <TableHead className="w-20 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedAds.map((ad) => (
                                        <TableRow key={ad._id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedIds.has(ad._id)}
                                                    onCheckedChange={() => toggleSelectAd(ad._id)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="relative w-14 h-10 rounded overflow-hidden bg-muted">
                                                    {(ad.displayImage || ad.mediaUrl || ad.imageUrl) ? (
                                                        <img
                                                            src={ad.displayImage || ad.mediaUrl || ad.imageUrl}
                                                            alt={ad.displayTitle || ad.brandName || ad.title}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center w-full h-full">
                                                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium max-w-[200px] truncate">
                                                    {ad.displayTitle || ad.brandName || ad.title}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getPlacementBadge(ad.displayPlacement || ad.adSpot || ad.placement || '')}
                                            </TableCell>
                                            {type === "approved" ? (
                                                <>
                                                    <TableCell className="hidden md:table-cell">
                                                        <div className="flex flex-col gap-1 text-sm">
                                                            <span className="font-medium">{ad.contactEmail}</span>
                                                            <span className="text-muted-foreground">{ad.contactNumber}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                                                        {new Date(ad.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </TableCell>
                                                </>
                                            ) : (
                                                <>
                                                    <TableCell className="hidden md:table-cell">
                                                        <Badge variant="outline">
                                                            {ad.device
                                                                ? ad.device.charAt(0).toUpperCase() + ad.device.slice(1)
                                                                : 'Both'}
                                                        </Badge>
                                                    </TableCell>
                                                    {type === "listings" && (
                                                        <>
                                                            <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                                                                <div className="flex flex-col gap-1">
                                                                    <span>Start: {new Date(ad.startDate || ad.createdAt).toLocaleDateString()}</span>
                                                                    <span>End: {new Date(ad.endDate || ad.updatedAt).toLocaleDateString()}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-col gap-1 text-sm">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-muted-foreground">Views:</span>
                                                                        <span className="font-medium">{formatNumber(ad.impressions || 0)}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-muted-foreground">Clicks:</span>
                                                                        <span className="font-medium">{formatNumber(ad.clicks || 0)}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-muted-foreground">CTR:</span>
                                                                        <span className="font-medium">{(ad.ctr || 0).toFixed(2)}%</span>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                            <TableCell>
                                                {type === "pending" || type === "approved" ? (
                                                    <Badge variant="secondary">{ad.status || 'pending'}</Badge>
                                                ) : (
                                                    <Switch
                                                        checked={ad.isActive || false}
                                                        onCheckedChange={() =>
                                                            setConfirmDialog({
                                                                open: true,
                                                                type: "toggle",
                                                                adId: ad._id,
                                                            })
                                                        }
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleView(ad)}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>

                                                        {type === "pending" ? (
                                                            <>
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        setConfirmDialog({
                                                                            open: true,
                                                                            type: "approve",
                                                                            adId: ad._id,
                                                                        })
                                                                    }
                                                                    className="text-green-600"
                                                                >
                                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                                    Approve
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        setConfirmDialog({
                                                                            open: true,
                                                                            type: "reject",
                                                                            adId: ad._id,
                                                                        })
                                                                    }
                                                                    className="text-red-600"
                                                                >
                                                                    <XCircle className="mr-2 h-4 w-4" />
                                                                    Reject
                                                                </DropdownMenuItem>
                                                            </>
                                                        ) : type === "approved" ? (
                                                            <DropdownMenuItem onClick={() => router.push('/admin/advertisements/create')}>
                                                                <Plus className="mr-2 h-4 w-4" />
                                                                Create Ad Listing
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <>
                                                                <DropdownMenuItem onClick={() => handleEdit(ad._id)}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleDuplicate(ad._id)}>
                                                                    <Copy className="mr-2 h-4 w-4" />
                                                                    Duplicate
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}

                                                        {type !== "approved" && (
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    setConfirmDialog({
                                                                        open: true,
                                                                        type: "delete",
                                                                        adId: ad._id,
                                                                    })
                                                                }
                                                                className="text-red-600"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Rows per page:</span>
                            <Select
                                value={itemsPerPage.toString()}
                                onValueChange={(value) => {
                                    setItemsPerPage(Number(value));
                                    setCurrentPage(1);
                                }}
                            >
                                <SelectTrigger className="w-[70px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="text-sm text-muted-foreground">
                                Showing {startIndex + 1}-{Math.min(endIndex, filteredAds.length)} of {filteredAds.length} {filteredAds.length === 1 ? 'ad' : 'ads'}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground px-2">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </>
            )}

            {/* Dialogs */}
            <AdDetailsDialog
                ad={selectedAd}
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
            />

            <ConfirmDialog
                open={confirmDialog?.open || false}
                onOpenChange={(open) => {
                    if (!open) setConfirmDialog(null);
                }}
                onConfirm={handleConfirmAction}
                title={
                    confirmDialog?.type === "approve"
                        ? "Approve Advertisement Request"
                        : confirmDialog?.type === "reject"
                            ? "Reject Advertisement Request"
                            : confirmDialog?.type === "delete"
                                ? "Delete Advertisement"
                                : confirmDialog?.type === "toggle"
                                    ? "Toggle Status"
                                    : confirmDialog?.type === "bulkActivate"
                                        ? "Activate Advertisements"
                                        : "Deactivate Advertisements"
                }
                description={
                    confirmDialog?.type === "approve"
                        ? "Are you sure you want to approve this advertisement request? This will allow the advertiser to proceed."
                        : confirmDialog?.type === "reject"
                            ? "Are you sure you want to reject this advertisement request? The advertiser will be notified."
                            : confirmDialog?.type === "delete"
                                ? "Are you sure you want to delete this advertisement? This action cannot be undone."
                                : confirmDialog?.type === "toggle"
                                    ? "Are you sure you want to toggle the active status of this advertisement?"
                                    : confirmDialog?.type === "bulkActivate"
                                        ? `Are you sure you want to activate ${selectedIds.size} advertisements?`
                                        : `Are you sure you want to deactivate ${selectedIds.size} advertisements?`
                }
            />

            <ExtendDatesDialog
                open={extendDatesOpen}
                onOpenChange={setExtendDatesOpen}
                onConfirm={handleExtendDates}
                loading={extendingDates}
            />
        </div>
    );
}
