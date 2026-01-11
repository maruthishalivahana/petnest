"use client";

import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import type { Advertisement, AdListing } from "@/types/advertisement.types";
import { Button } from "@/components/ui/button";

// Union type for ad details
type AdDataForDialog = Advertisement | AdListing | (Partial<Advertisement> & Partial<AdListing>);

interface AdDetailsDialogProps {
    ad: AdDataForDialog | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AdDetailsDialog({ ad, open, onOpenChange }: AdDetailsDialogProps) {
    if (!ad) return null;

    // Helper to check if it's an AdListing
    const isAdListing = (ad: any): ad is AdListing => 'title' in ad && 'imageUrl' in ad;

    const displayTitle = isAdListing(ad) ? ad.title : ad.brandName || '';
    const displayImage = isAdListing(ad) ? ad.imageUrl : ad.mediaUrl || '';
    const displayPlacement = isAdListing(ad) ? ad.placement : ad.adSpot || '';

    const getStatusBadge = () => {
        if (isAdListing(ad)) {
            return ad.isActive ?
                <Badge className="bg-green-600">Active</Badge> :
                <Badge variant="secondary">Inactive</Badge>;
        }
        if ('isApproved' in ad && ad.isApproved) {
            return <Badge className="bg-green-600">Approved</Badge>;
        }
        return <Badge variant="secondary">Pending Approval</Badge>;
    };

    const getAdSpotLabel = (spot: string) => {
        const labels: Record<string, string> = {
            homepageBanner: "Homepage Banner",
            sidebar: "Sidebar",
            footer: "Footer",
            blogFeature: "Blog Feature",
            home_top_banner: "Home Top Banner",
            home_sidebar: "Home Sidebar",
            home_footer: "Home Footer",
            pet_feed_inline: "Pet Feed Inline",
            pet_mobile_sticky: "Pet Mobile Sticky",
            pet_detail_below_desc: "Pet Detail Below Description",
            pet_detail_sidebar: "Pet Detail Sidebar",
            blog_mid_article: "Blog Mid Article",
            blog_sidebar: "Blog Sidebar",
            dashboard_header: "Dashboard Header",
        };
        return labels[spot] || spot;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Advertisement Details</DialogTitle>
                    <DialogDescription>
                        Review complete information about this advertisement
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Status and Ad Spot */}
                    <div className="flex items-center gap-3">
                        {getStatusBadge()}
                        <Badge className="bg-blue-600">{getAdSpotLabel(displayPlacement)}</Badge>
                        {isAdListing(ad) && (
                            <Badge variant="outline">{ad.device}</Badge>
                        )}
                    </div>

                    <Separator />

                    {/* Brand/Title Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">
                            {isAdListing(ad) ? "Ad Title" : "Brand Information"}
                        </h3>
                        <div className="space-y-2">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    {isAdListing(ad) ? "Title" : "Brand Name"}
                                </p>
                                <p className="font-medium text-lg">{displayTitle}</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Ad Listing specific fields */}
                    {isAdListing(ad) && (
                        <>
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Call to Action</h3>
                                <p className="text-sm leading-relaxed bg-muted p-4 rounded-lg">
                                    {ad.ctaText}
                                </p>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="text-lg font-semibold mb-3">Redirect URL</h3>
                                <a
                                    href={ad.redirectUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    {ad.redirectUrl}
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="text-lg font-semibold mb-3">Performance Metrics</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-muted p-3 rounded-lg">
                                        <p className="text-sm text-muted-foreground">Impressions</p>
                                        <p className="text-xl font-bold">{ad.impressions?.toLocaleString() || 0}</p>
                                    </div>
                                    <div className="bg-muted p-3 rounded-lg">
                                        <p className="text-sm text-muted-foreground">Clicks</p>
                                        <p className="text-xl font-bold">{ad.clicks?.toLocaleString() || 0}</p>
                                    </div>
                                    <div className="bg-muted p-3 rounded-lg">
                                        <p className="text-sm text-muted-foreground">CTR</p>
                                        <p className="text-xl font-bold">
                                            {ad.impressions && ad.impressions > 0
                                                ? ((ad.clicks || 0 / ad.impressions) * 100).toFixed(2)
                                                : '0.00'}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Advertisement Message (only for old format) */}
                    {!isAdListing(ad) && 'message' in ad && (
                        <>
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Advertisement Message</h3>
                                <p className="text-sm leading-relaxed bg-muted p-4 rounded-lg">
                                    {ad.message}
                                </p>
                            </div>

                            <Separator />
                        </>
                    )}

                    {/* Contact Information (only for old format) */}
                    {!isAdListing(ad) && 'contactEmail' in ad && (
                        <>
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Email</p>
                                            <p className="font-medium">{ad.contactEmail}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Phone</p>
                                            <p className="font-medium">{ad.contactNumber}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />
                        </>
                    )}

                    {/* Media */}
                    {displayImage && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Advertisement Media</h3>
                            <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
                                <img
                                    src={displayImage}
                                    alt={displayTitle}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-3"
                                onClick={() => window.open(displayImage, "_blank")}
                            >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Open Media in New Tab
                            </Button>
                        </div>
                    )}

                    <Separator />

                    {/* Dates */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Timeline</h3>
                        <div className="space-y-3">
                            {isAdListing(ad) && ad.startDate && (
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Campaign Start</p>
                                        <p className="font-medium">
                                            {new Date(ad.startDate).toLocaleString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {isAdListing(ad) && ad.endDate && (
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Campaign End</p>
                                        <p className="font-medium">
                                            {new Date(ad.endDate).toLocaleString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {'createdAt' in ad && ad.createdAt && (
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Created</p>
                                        <p className="font-medium">
                                            {new Date(ad.createdAt).toLocaleString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {'updatedAt' in ad && ad.updatedAt && (
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Last Updated</p>
                                        <p className="font-medium">
                                            {new Date(ad.updatedAt).toLocaleString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ID */}
                    {'_id' in ad && ad._id && (
                        <div className="text-xs text-muted-foreground">
                            <p>Advertisement ID: {ad._id}</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
