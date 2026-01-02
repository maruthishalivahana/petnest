'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    User,
    Upload,
    MapPin,
    Phone,
    Mail,
    Building2,
    ShieldCheck,
    Edit,
    Save,
    Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { getCurrentSellerDetails } from '@/services/seller';

interface SellerDetails {
    _id: string;
    userId?: {
        _id: string;
        name: string;
        email: string;
    };
    brandName?: string;
    bio?: string;
    whatsappNumber?: string;
    location?: {
        city?: string;
        state?: string;
        pincode?: string;
    };
    status?: string;
    documents?: {
        idProof?: string;
        certificate?: string;
        shopImage?: string;
    };
    analytics?: {
        totalViews?: number;
        wishlistSaves?: number;
        averageRating?: number;
    };
    verificationDate?: string;
    verificationNotes?: string;
}

export default function SellerProfilePage() {
    const { user, isLoading: authLoading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [sellerDetails, setSellerDetails] = useState<SellerDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const profileCompletion = 75;

    useEffect(() => {
        const fetchSellerDetails = async () => {
            // Wait for auth to finish loading
            if (authLoading) {
                return;
            }

            if (!user) {
                console.log('User object:', user);
                setError('User not found. Please log in again.');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                console.log('Fetching current seller details');
                const data = await getCurrentSellerDetails();
                console.log('Seller details fetched:', data);
                setSellerDetails(data);
                setError(null);
            } catch (err) {
                setError('Failed to load seller details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSellerDetails();
    }, [user, authLoading]);

    if (authLoading || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl">
                <Card className="p-6">
                    <div className="space-y-3">
                        <p className="text-red-500 font-medium">{error}</p>
                        {!user && (
                            <p className="text-sm text-slate-600">
                                No user data found. Please try logging in again.
                            </p>
                        )}
                        {user && !user.id && (
                            <p className="text-sm text-slate-600">
                                User data is incomplete. User ID is missing.
                            </p>
                        )}
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Profile Completion */}
            <Card className="p-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900">Profile Completion</h3>
                        <span className="text-sm font-medium text-primary">{profileCompletion}%</span>
                    </div>
                    <Progress value={profileCompletion} className="h-2" />
                    <p className="text-sm text-slate-500">
                        Complete your profile to increase trust and get more inquiries
                    </p>
                </div>
            </Card>

            {/* Verification Status */}
            <Card className="p-6">
                <div className="flex items-start gap-4">
                    <div className={`h-12 w-12 rounded-lg ${sellerDetails?.status === 'verified' ? 'bg-green-100' : 'bg-yellow-100'
                        } flex items-center justify-center shrink-0`}>
                        <ShieldCheck className={`h-6 w-6 ${sellerDetails?.status === 'verified' ? 'text-green-600' : 'text-yellow-600'
                            }`} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-900">Verification Status</h3>
                            <Badge className={sellerDetails?.status === 'verified'
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            }>
                                {sellerDetails?.status === 'verified' ? 'Verified' : sellerDetails?.status || 'Pending'}
                            </Badge>
                        </div>
                        <p className="text-sm text-slate-500">
                            {sellerDetails?.status === 'verified'
                                ? 'Your seller account is verified. Verified sellers get 3x more inquiries.'
                                : 'Your seller account is pending verification. Complete your profile to get verified.'}
                        </p>
                        {sellerDetails?.verificationNotes && (
                            <p className="text-sm text-slate-600 mt-2">
                                <strong>Note:</strong> {sellerDetails.verificationNotes}
                            </p>
                        )}
                    </div>
                </div>
            </Card>

            {/* Profile Information */}
            <Card>
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900">Profile Information</h3>
                        <Button
                            variant={isEditing ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </>
                            ) : (
                                <>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Logo Upload */}
                    <div>
                        <Label className="text-sm font-medium text-slate-700 mb-3 block">
                            Brand Logo
                        </Label>
                        <div className="flex items-center gap-4">
                            <div className="h-20 w-20 rounded-lg bg-slate-100 overflow-hidden relative">
                                {sellerDetails?.documents?.shopImage ? (
                                    <Image
                                        src={sellerDetails.documents.shopImage}
                                        alt="Brand Logo"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Building2 className="h-10 w-10 text-slate-400" />
                                    </div>
                                )}
                            </div>
                            <Button variant="outline" size="sm" disabled={!isEditing}>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload New Logo
                            </Button>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="brandName">Brand Name</Label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    id="brandName"
                                    defaultValue={sellerDetails?.brandName || ''}
                                    placeholder="Enter brand name"
                                    disabled={!isEditing}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ownerName">Owner Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    id="ownerName"
                                    defaultValue={sellerDetails?.userId?.name || user?.name || ''}
                                    placeholder="Enter owner name"
                                    disabled={!isEditing}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    defaultValue={sellerDetails?.userId?.email || user?.email || ''}
                                    placeholder="Enter email"
                                    disabled={!isEditing}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="whatsapp">WhatsApp Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    id="whatsapp"
                                    defaultValue={sellerDetails?.whatsappNumber || ''}
                                    placeholder="Enter WhatsApp number"
                                    disabled={!isEditing}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="location">Location</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    id="location"
                                    defaultValue={
                                        sellerDetails?.location
                                            ? `${sellerDetails.location.city || ''}, ${sellerDetails.location.state || ''} ${sellerDetails.location.pincode || ''}`.trim()
                                            : ''
                                    }
                                    placeholder="Enter location"
                                    disabled={!isEditing}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="bio">Bio</Label>
                            <textarea
                                id="bio"
                                rows={4}
                                disabled={!isEditing}
                                defaultValue={sellerDetails?.bio || ''}
                                placeholder="Tell us about your business"
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Documents */}
            <Card>
                <div className="p-6 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-900">Verification Documents</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <ShieldCheck className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">Business Registration</p>
                                <p className="text-sm text-slate-500">business_license.pdf</p>
                            </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Verified
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <ShieldCheck className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">Identity Proof</p>
                                <p className="text-sm text-slate-500">aadhar_card.pdf</p>
                            </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Verified
                        </Badge>
                    </div>

                    <Button variant="outline" className="w-full" disabled={!isEditing}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Additional Documents
                    </Button>
                </div>
            </Card>
        </div>
    );
}
