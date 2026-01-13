'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { useAppSelector } from '@/store/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    ShieldCheck,
    Upload,
    FileText,
    CheckCircle2,
    Clock,
    AlertCircle,
    Loader2,
    X,
    Building2,
    Phone,
    MapPin,
    Image as ImageIcon
} from 'lucide-react';

interface SellerStatus {
    status: 'pending' | 'verified' | 'rejected' | 'not_submitted';
    verificationNotes?: string;
}

interface FilePreview {
    name: string;
    size: string;
    file: File;
}

export default function SellerVerificationPage() {
    const router = useRouter();
    const { user } = useAppSelector((state) => state.auth);

    const [sellerStatus, setSellerStatus] = useState<SellerStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [brandName, setBrandName] = useState('');
    const [bio, setBio] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');

    // File states
    const [logoFile, setLogoFile] = useState<FilePreview | null>(null);
    const [idProofFile, setIdProofFile] = useState<FilePreview | null>(null);
    const [certificateFile, setCertificateFile] = useState<FilePreview | null>(null);
    const [shopImageFile, setShopImageFile] = useState<FilePreview | null>(null);

    // Validation errors
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        checkSellerStatus();
    }, []);

    const checkSellerStatus = async () => {
        try {
            setIsLoading(true);
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';
            const response = await axios.get(`${baseUrl}/v1/api/seller/status`, {
                withCredentials: true
            });

            const status = response.data.data || response.data;
            setSellerStatus(status);

            // Redirect if already verified
            if (status.status === 'verified') {
                router.push('/seller/dashboard');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                // No seller request found - allow submission
                setSellerStatus({ status: 'not_submitted' });
            } else {
                console.error('Error checking seller status:', error);
                toast.error('Failed to load verification status');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: React.Dispatch<React.SetStateAction<FilePreview | null>>,
        fieldName: string
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, [fieldName]: 'File size must be less than 5MB' }));
                return;
            }

            setter({
                name: file.name,
                size: formatFileSize(file.size),
                file
            });
            setErrors(prev => ({ ...prev, [fieldName]: '' }));
        }
    };

    const removeFile = (setter: React.Dispatch<React.SetStateAction<FilePreview | null>>) => {
        setter(null);
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!brandName.trim()) newErrors.brandName = 'Brand name is required';
        if (!whatsappNumber.trim()) {
            newErrors.whatsappNumber = 'WhatsApp number is required';
        } else if (!/^\d{10}$/.test(whatsappNumber)) {
            newErrors.whatsappNumber = 'WhatsApp number must be 10 digits';
        }
        if (bio && bio.length > 300) newErrors.bio = 'Bio must be less than 300 characters';
        if (!idProofFile) newErrors.idProof = 'ID proof is required';
        if (!certificateFile) newErrors.certificate = 'Business certificate is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix all errors before submitting');
            return;
        }

        try {
            setIsSubmitting(true);

            const formData = new FormData();
            formData.append('brandName', brandName);
            if (bio) formData.append('bio', bio);
            formData.append('whatsappNumber', whatsappNumber);

            // Append location fields
            if (city) formData.append('location[city]', city);
            if (state) formData.append('location[state]', state);
            if (pincode) formData.append('location[pincode]', pincode);

            // Append files (backend expects these field names directly)
            if (logoFile) formData.append('logoUrl', logoFile.file);
            if (idProofFile) formData.append('idProof', idProofFile.file);
            if (certificateFile) formData.append('certificate', certificateFile.file);
            if (shopImageFile) formData.append('shopImage', shopImageFile.file);

            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';
            const response = await axios.post(
                `${baseUrl}/v1/api/seller/request`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                }
            );

            toast.success('Seller verification request submitted successfully! Awaiting admin approval.');
            setSellerStatus({ status: 'pending' });

            // Optionally redirect or refresh
            setTimeout(() => {
                router.push('/seller/dashboard');
            }, 2000);

        } catch (error) {
            console.error('Seller verification request failed:', error);
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.response?.data?.error;
                toast.error(errorMessage || 'Failed to submit verification request');
            } else {
                toast.error('An unexpected error occurred');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // Pending status UI
    if (sellerStatus?.status === 'pending') {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <Card className="bg-amber-50 border-amber-200">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                                <Clock className="h-6 w-6 text-amber-600" />
                            </div>
                            <div>
                                <CardTitle className="text-amber-900">Verification Pending</CardTitle>
                                <CardDescription className="text-amber-700">
                                    Your request is under review
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-amber-800">
                            Your seller verification request has been submitted and is currently being reviewed by our admin team.
                            You will be notified via email once your account is verified. This usually takes 1-2 business days.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Rejected status UI with resubmission
    const isRejected = sellerStatus?.status === 'rejected';

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Seller Verification Request</h1>
                <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                    Complete your seller profile and submit documents for admin verification.
                    Once approved, you'll be able to list and sell pets on PetNest.
                </p>
            </div>

            {/* Rejection Alert */}
            {isRejected && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        <strong>Previous request rejected:</strong> {sellerStatus?.verificationNotes || 'Please review and resubmit with correct information.'}
                    </AlertDescription>
                </Alert>
            )}

            {/* Verification Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Business Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Business Information
                        </CardTitle>
                        <CardDescription>Tell us about your pet business</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="brandName">
                                Brand/Business Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="brandName"
                                placeholder="e.g., Happy Paws Pet Store"
                                value={brandName}
                                onChange={(e) => setBrandName(e.target.value)}
                                className={errors.brandName ? 'border-red-500' : ''}
                            />
                            {errors.brandName && (
                                <p className="text-sm text-red-500 mt-1">{errors.brandName}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="bio">
                                Business Bio <span className="text-gray-500 text-xs">(Optional, max 300 chars)</span>
                            </Label>
                            <Textarea
                                id="bio"
                                placeholder="Brief description of your business..."
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                maxLength={300}
                                rows={4}
                                className={errors.bio ? 'border-red-500' : ''}
                            />
                            <div className="flex justify-between mt-1">
                                {errors.bio && <p className="text-sm text-red-500">{errors.bio}</p>}
                                <p className="text-xs text-gray-500 ml-auto">{bio.length}/300</p>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="logo">
                                Business Logo <span className="text-gray-500 text-xs">(Optional)</span>
                            </Label>
                            {!logoFile ? (
                                <div className="mt-2">
                                    <label
                                        htmlFor="logo"
                                        className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="text-center">
                                            <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-600">Click to upload logo</p>
                                            <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                                        </div>
                                        <input
                                            id="logo"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleFileChange(e, setLogoFile, 'logo')}
                                        />
                                    </label>
                                </div>
                            ) : (
                                <div className="mt-2 flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                                    <FileText className="h-8 w-8 text-gray-400 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{logoFile.name}</p>
                                        <p className="text-xs text-gray-500">{logoFile.size}</p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeFile(setLogoFile)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Phone className="h-5 w-5" />
                            Contact Information
                        </CardTitle>
                        <CardDescription>How customers can reach you</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="whatsapp">
                                WhatsApp Number <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="whatsapp"
                                type="tel"
                                placeholder="9876543210"
                                maxLength={10}
                                value={whatsappNumber}
                                onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ''))}
                                className={errors.whatsappNumber ? 'border-red-500' : ''}
                            />
                            {errors.whatsappNumber && (
                                <p className="text-sm text-red-500 mt-1">{errors.whatsappNumber}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Location */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Location <span className="text-gray-500 text-sm font-normal">(Optional)</span>
                        </CardTitle>
                        <CardDescription>Your business location</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    placeholder="e.g., Mumbai"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="state">State</Label>
                                <Input
                                    id="state"
                                    placeholder="e.g., Maharashtra"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="pincode">Pincode</Label>
                            <Input
                                id="pincode"
                                placeholder="e.g., 400001"
                                maxLength={6}
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Documents */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Verification Documents
                        </CardTitle>
                        <CardDescription>Upload required documents for verification</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* ID Proof */}
                        <div>
                            <Label htmlFor="idProof">
                                ID Proof (Aadhar, Passport, etc.) <span className="text-red-500">*</span>
                            </Label>
                            {!idProofFile ? (
                                <div className="mt-2">
                                    <label
                                        htmlFor="idProof"
                                        className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="text-center">
                                            <Upload className="mx-auto h-6 w-6 text-gray-400" />
                                            <p className="mt-1 text-sm text-gray-600">Upload ID Proof</p>
                                            <p className="text-xs text-gray-500">PDF or Image, max 5MB</p>
                                        </div>
                                        <input
                                            id="idProof"
                                            type="file"
                                            accept="image/*,.pdf"
                                            className="hidden"
                                            onChange={(e) => handleFileChange(e, setIdProofFile, 'idProof')}
                                        />
                                    </label>
                                </div>
                            ) : (
                                <div className="mt-2 flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                    <CheckCircle2 className="h-8 w-8 text-green-600 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{idProofFile.name}</p>
                                        <p className="text-xs text-gray-500">{idProofFile.size}</p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeFile(setIdProofFile)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                            {errors.idProof && (
                                <p className="text-sm text-red-500 mt-1">{errors.idProof}</p>
                            )}
                        </div>

                        {/* Certificate */}
                        <div>
                            <Label htmlFor="certificate">
                                Business Certificate <span className="text-red-500">*</span>
                            </Label>
                            {!certificateFile ? (
                                <div className="mt-2">
                                    <label
                                        htmlFor="certificate"
                                        className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="text-center">
                                            <Upload className="mx-auto h-6 w-6 text-gray-400" />
                                            <p className="mt-1 text-sm text-gray-600">Upload Certificate</p>
                                            <p className="text-xs text-gray-500">PDF or Image, max 5MB</p>
                                        </div>
                                        <input
                                            id="certificate"
                                            type="file"
                                            accept="image/*,.pdf"
                                            className="hidden"
                                            onChange={(e) => handleFileChange(e, setCertificateFile, 'certificate')}
                                        />
                                    </label>
                                </div>
                            ) : (
                                <div className="mt-2 flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                    <CheckCircle2 className="h-8 w-8 text-green-600 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{certificateFile.name}</p>
                                        <p className="text-xs text-gray-500">{certificateFile.size}</p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeFile(setCertificateFile)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                            {errors.certificate && (
                                <p className="text-sm text-red-500 mt-1">{errors.certificate}</p>
                            )}
                        </div>

                        {/* Shop Image */}
                        <div>
                            <Label htmlFor="shopImage">
                                Shop/Business Image <span className="text-gray-500 text-xs">(Optional)</span>
                            </Label>
                            {!shopImageFile ? (
                                <div className="mt-2">
                                    <label
                                        htmlFor="shopImage"
                                        className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="text-center">
                                            <Upload className="mx-auto h-6 w-6 text-gray-400" />
                                            <p className="mt-1 text-sm text-gray-600">Upload Shop Image</p>
                                            <p className="text-xs text-gray-500">Image only, max 5MB</p>
                                        </div>
                                        <input
                                            id="shopImage"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleFileChange(e, setShopImageFile, 'shopImage')}
                                        />
                                    </label>
                                </div>
                            ) : (
                                <div className="mt-2 flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                    <CheckCircle2 className="h-8 w-8 text-green-600 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{shopImageFile.name}</p>
                                        <p className="text-xs text-gray-500">{shopImageFile.size}</p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeFile(setShopImageFile)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4 mb-4">
                            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-800">
                                <p className="font-medium">Before submitting:</p>
                                <ul className="mt-2 space-y-1 list-disc list-inside">
                                    <li>Ensure all required fields are filled correctly</li>
                                    <li>Documents should be clear and readable</li>
                                    <li>Verification typically takes 1-2 business days</li>
                                    <li>You'll receive an email notification once reviewed</li>
                                </ul>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 text-lg"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Submitting Request...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="mr-2 h-5 w-5" />
                                    Submit Verification Request
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
