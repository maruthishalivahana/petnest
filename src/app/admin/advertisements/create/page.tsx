"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/lib/apiClient';

const PLACEMENTS = [
    { value: 'home_top_banner', label: 'Home - Top Banner' },
    { value: 'home_sidebar', label: 'Home - Sidebar' },
    { value: 'home_footer', label: 'Home - Footer' },
    { value: 'pet_feed_inline', label: 'Pet Feed - Inline Ads' },
    { value: 'pet_mobile_sticky', label: 'Pet Pages - Mobile Sticky' },
    { value: 'pet_detail_below_desc', label: 'Pet Detail - Below Description' },
    { value: 'pet_detail_sidebar', label: 'Pet Detail - Sidebar' },
    { value: 'blog_mid_article', label: 'Blog - Mid Article' },
    { value: 'blog_sidebar', label: 'Blog - Sidebar' },
    { value: 'dashboard_header', label: 'Dashboard - Header' }
];

interface FormData {
    title: string;
    ctaText: string;
    redirectUrl: string;
    placement: string;
    device: string;
    targetPages: string;
    startDate: string;
    endDate: string;
}

export default function CreateAdvertisementPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        title: '',
        ctaText: '',
        redirectUrl: '',
        placement: 'home_top_banner',
        device: 'both',
        targetPages: '',
        startDate: '',
        endDate: ''
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast({
                title: 'Invalid File Type',
                description: 'Please upload a JPEG, PNG, or WEBP image',
                variant: 'destructive',
            });
            return;
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast({
                title: 'File Too Large',
                description: 'Image must be less than 2MB',
                variant: 'destructive',
            });
            return;
        }

        setImageFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate image
            if (!imageFile) {
                toast({
                    title: 'Validation Error',
                    description: 'Please upload an image',
                    variant: 'destructive',
                });
                setLoading(false);
                return;
            }

            // Validate dates
            if (new Date(formData.endDate) <= new Date(formData.startDate)) {
                toast({
                    title: 'Validation Error',
                    description: 'End date must be after start date',
                    variant: 'destructive',
                });
                setLoading(false);
                return;
            }

            // Prepare FormData for multipart upload
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('image', imageFile);
            submitData.append('ctaText', formData.ctaText);
            submitData.append('redirectUrl', formData.redirectUrl);
            submitData.append('placement', formData.placement);
            submitData.append('device', formData.device);
            submitData.append('startDate', new Date(formData.startDate).toISOString());
            submitData.append('endDate', new Date(formData.endDate).toISOString());

            if (formData.targetPages) {
                const pages = formData.targetPages.split(',').map(p => p.trim()).filter(Boolean);
                submitData.append('targetPages', JSON.stringify(pages));
            }

            const response = await apiClient.post('/v1/api/ads/admin/ads', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                toast({
                    title: 'Success',
                    description: 'Advertisement created successfully!',
                });

                // Reset form
                setFormData({
                    title: '',
                    ctaText: '',
                    redirectUrl: '',
                    placement: 'home_top_banner',
                    device: 'both',
                    targetPages: '',
                    startDate: '',
                    endDate: ''
                });
                setImageFile(null);
                setImagePreview(null);
                const input = document.getElementById('image') as HTMLInputElement;
                if (input) input.value = '';

                // Redirect to advertisements list after a short delay
                setTimeout(() => {
                    router.push('/admin/advertisements');
                }, 1500);
            } else {
                toast({
                    title: 'Error',
                    description: response.data.message || 'Failed to create advertisement',
                    variant: 'destructive',
                });
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Network error. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/advertisements">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Advertisement</h1>
                    <p className="text-muted-foreground mt-1">
                        Create a new advertisement to display to users
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Advertisement Details</CardTitle>
                        <CardDescription>
                            Fill in the details below to create a new advertisement
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">
                                Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Premium Dog Food Sale"
                            />
                            <p className="text-sm text-muted-foreground">
                                A descriptive title for the advertisement
                            </p>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <Label htmlFor="image">
                                Advertisement Image <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageChange}
                                required
                            />
                            <p className="text-sm text-muted-foreground">
                                Upload an image (JPEG, PNG, or WEBP, max 2MB)
                            </p>

                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="mt-3 border rounded-lg p-4 bg-gray-50">
                                    <p className="text-sm font-medium mb-2">Preview:</p>
                                    <img
                                        src={imagePreview}
                                        alt="Ad Preview"
                                        className="max-h-48 object-cover rounded mx-auto"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setImageFile(null);
                                            setImagePreview(null);
                                            const input = document.getElementById('image') as HTMLInputElement;
                                            if (input) input.value = '';
                                        }}
                                        className="mt-2"
                                    >
                                        Remove Image
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* CTA Text */}
                        <div className="space-y-2">
                            <Label htmlFor="ctaText">
                                Call-to-Action Text <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="ctaText"
                                required
                                maxLength={20}
                                value={formData.ctaText}
                                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                                placeholder="Shop Now"
                            />
                            <p className="text-sm text-muted-foreground">
                                Button text (max 20 characters): {formData.ctaText.length}/20
                            </p>
                        </div>

                        {/* Redirect URL */}
                        <div className="space-y-2">
                            <Label htmlFor="redirectUrl">
                                Redirect URL <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="redirectUrl"
                                type="url"
                                required
                                value={formData.redirectUrl}
                                onChange={(e) => setFormData({ ...formData, redirectUrl: e.target.value })}
                                placeholder="https://yourstore.com/products"
                            />
                            <p className="text-sm text-muted-foreground">
                                URL where users will be redirected when they click the ad
                            </p>
                        </div>

                        {/* Placement */}
                        <div className="space-y-2">
                            <Label htmlFor="placement">
                                Placement <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.placement}
                                onValueChange={(value) => setFormData({ ...formData, placement: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select placement" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PLACEMENTS.map((placement) => (
                                        <SelectItem key={placement.value} value={placement.value}>
                                            {placement.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-sm text-muted-foreground">
                                Where the advertisement will be displayed
                            </p>
                        </div>

                        {/* Device Target */}
                        <div className="space-y-3">
                            <Label>Device Target</Label>
                            <RadioGroup
                                value={formData.device}
                                onValueChange={(value) => setFormData({ ...formData, device: value })}
                                className="flex gap-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="mobile" id="mobile" />
                                    <Label htmlFor="mobile" className="font-normal cursor-pointer">
                                        Mobile
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="desktop" id="desktop" />
                                    <Label htmlFor="desktop" className="font-normal cursor-pointer">
                                        Desktop
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="both" id="both" />
                                    <Label htmlFor="both" className="font-normal cursor-pointer">
                                        Both
                                    </Label>
                                </div>
                            </RadioGroup>
                            <p className="text-sm text-muted-foreground">
                                Target devices for the advertisement
                            </p>
                        </div>

                        {/* Date Range */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">
                                    Start Date <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="startDate"
                                    type="datetime-local"
                                    required
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">
                                    End Date <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="endDate"
                                    type="datetime-local"
                                    required
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Target Pages */}
                        <div className="space-y-2">
                            <Label htmlFor="targetPages">Target Pages (Optional)</Label>
                            <Textarea
                                id="targetPages"
                                value={formData.targetPages}
                                onChange={(e) => setFormData({ ...formData, targetPages: e.target.value })}
                                placeholder="/home, /pets, /blog"
                                rows={3}
                            />
                            <p className="text-sm text-muted-foreground">
                                Comma-separated list of page URLs where the ad should appear (leave empty for all pages)
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Advertisement'
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push('/admin/advertisements')}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
