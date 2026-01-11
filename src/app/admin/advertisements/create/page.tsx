"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Upload, X } from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/lib/apiClient';
import Image from 'next/image';

const PLACEMENTS = [
    { value: 'home_top_banner', label: 'Home - Top Banner' },
    { value: 'home_footer', label: 'Home - Footer' },
    { value: 'pet_feed_inline', label: 'Pet Feed - Inline Ads' },
    { value: 'pet_mobile_sticky', label: 'Pet Pages - Mobile Sticky' },
    { value: 'pet_detail_below_desc', label: 'Pet Detail - Below Description' },
];

interface FormData {
    title: string;
    subtitle: string;
    tagline: string;
    brandName: string;
    ctaText: string;
    redirectUrl: string;
    placement: string;
    device: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

export default function CreateAdvertisementPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        title: '',
        subtitle: '',
        tagline: '',
        brandName: '',
        ctaText: '',
        redirectUrl: '',
        placement: 'home_top_banner',
        device: 'both',
        startDate: '',
        endDate: '',
        isActive: true
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast({
                title: 'Invalid File Type',
                description: 'Please upload a JPEG, PNG, or WEBP image',
                variant: 'destructive',
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: 'File Too Large',
                description: 'Image must be less than 5MB',
                variant: 'destructive',
            });
            return;
        }

        setImageFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validation
            if (!formData.title.trim()) {
                toast({
                    title: 'Validation Error',
                    description: 'Title is required',
                    variant: 'destructive',
                });
                setLoading(false);
                return;
            }

            if (!formData.brandName.trim()) {
                toast({
                    title: 'Validation Error',
                    description: 'Brand name is required',
                    variant: 'destructive',
                });
                setLoading(false);
                return;
            }

            if (!imageFile) {
                toast({
                    title: 'Validation Error',
                    description: 'Please upload an image',
                    variant: 'destructive',
                });
                setLoading(false);
                return;
            }

            if (!formData.ctaText.trim()) {
                toast({
                    title: 'Validation Error',
                    description: 'CTA text is required',
                    variant: 'destructive',
                });
                setLoading(false);
                return;
            }

            if (!formData.redirectUrl.trim()) {
                toast({
                    title: 'Validation Error',
                    description: 'Redirect URL is required',
                    variant: 'destructive',
                });
                setLoading(false);
                return;
            }

            if (!formData.startDate || !formData.endDate) {
                toast({
                    title: 'Validation Error',
                    description: 'Start and end dates are required',
                    variant: 'destructive',
                });
                setLoading(false);
                return;
            }

            if (new Date(formData.endDate) <= new Date(formData.startDate)) {
                toast({
                    title: 'Validation Error',
                    description: 'End date must be after start date',
                    variant: 'destructive',
                });
                setLoading(false);
                return;
            }

            // Prepare FormData
            const submitData = new FormData();
            submitData.append('title', formData.title.trim());
            if (formData.subtitle.trim()) submitData.append('subtitle', formData.subtitle.trim());
            if (formData.tagline.trim()) submitData.append('tagline', formData.tagline.trim());
            submitData.append('brandName', formData.brandName.trim());
            submitData.append('image', imageFile);
            submitData.append('ctaText', formData.ctaText.trim());
            submitData.append('redirectUrl', formData.redirectUrl.trim());
            submitData.append('placement', formData.placement);
            submitData.append('device', formData.device);
            submitData.append('startDate', new Date(formData.startDate).toISOString());
            submitData.append('endDate', new Date(formData.endDate).toISOString());
            submitData.append('isActive', formData.isActive.toString());

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
                router.push('/admin/advertisements');
            }
        } catch (error: any) {
            console.error('Error creating advertisement:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to create advertisement',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const titleLength = formData.title.length;
    const subtitleLength = formData.subtitle.length;
    const taglineLength = formData.tagline.length;

    return (
        <div className="space-y-6 p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/advertisements">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Create New Advertisement</h1>
                    <p className="text-muted-foreground mt-1">Fill in the details to create a new ad campaign</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Advertisement Details</CardTitle>
                        <CardDescription>Enter the information for your new advertisement</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">
                                Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => {
                                    if (e.target.value.length <= 60) {
                                        setFormData({ ...formData, title: e.target.value });
                                    }
                                }}
                                placeholder="Eye-catching headline"
                                maxLength={60}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                {titleLength}/60 characters
                                {titleLength > 50 && <span className="text-orange-500 ml-2">Almost at limit!</span>}
                            </p>
                        </div>

                        {/* Subtitle */}
                        <div className="space-y-2">
                            <Label htmlFor="subtitle">Subtitle (Optional)</Label>
                            <Textarea
                                id="subtitle"
                                value={formData.subtitle}
                                onChange={(e) => {
                                    if (e.target.value.length <= 120) {
                                        setFormData({ ...formData, subtitle: e.target.value });
                                    }
                                }}
                                placeholder="Supporting text or description"
                                rows={2}
                                maxLength={120}
                            />
                            <p className="text-xs text-muted-foreground">
                                {subtitleLength}/120 characters
                                {subtitleLength > 100 && <span className="text-orange-500 ml-2">Almost at limit!</span>}
                            </p>
                        </div>

                        {/* Tagline */}
                        <div className="space-y-2">
                            <Label htmlFor="tagline">Tagline (Optional)</Label>
                            <Input
                                id="tagline"
                                value={formData.tagline}
                                onChange={(e) => {
                                    if (e.target.value.length <= 60) {
                                        setFormData({ ...formData, tagline: e.target.value });
                                    }
                                }}
                                placeholder="Short memorable phrase"
                                maxLength={60}
                            />
                            <p className="text-xs text-muted-foreground">
                                {taglineLength}/60 characters
                                {taglineLength > 50 && <span className="text-orange-500 ml-2">Almost at limit!</span>}
                            </p>
                        </div>

                        {/* Brand Name */}
                        <div className="space-y-2">
                            <Label htmlFor="brandName">
                                Brand Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="brandName"
                                value={formData.brandName}
                                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                                placeholder="Your brand or company name"
                                required
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <Label htmlFor="image">
                                Advertisement Image <span className="text-red-500">*</span>
                            </Label>
                            {!imagePreview ? (
                                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                                    <input
                                        type="file"
                                        id="image"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <label htmlFor="image" className="cursor-pointer">
                                        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                        <p className="text-sm font-medium">Click to upload image</p>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            PNG, JPG, WEBP up to 5MB
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Recommended: 1920x600px for banners
                                        </p>
                                    </label>
                                </div>
                            ) : (
                                <div className="relative rounded-lg overflow-hidden border">
                                    <Image
                                        src={imagePreview}
                                        alt="Ad preview"
                                        width={800}
                                        height={400}
                                        className="w-full h-auto object-cover"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2"
                                        onClick={removeImage}
                                    >
                                        <X className="h-4 w-4" />
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
                                value={formData.ctaText}
                                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                                placeholder="e.g., Shop Now, Learn More, Get Started"
                                required
                            />
                        </div>

                        {/* Redirect URL */}
                        <div className="space-y-2">
                            <Label htmlFor="redirectUrl">
                                Redirect URL <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="redirectUrl"
                                type="url"
                                value={formData.redirectUrl}
                                onChange={(e) => setFormData({ ...formData, redirectUrl: e.target.value })}
                                placeholder="https://example.com"
                                required
                            />
                            <p className="text-xs text-muted-foreground">Where users go when they click the ad</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Placement */}
                            <div className="space-y-2">
                                <Label htmlFor="placement">
                                    Placement <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.placement}
                                    onValueChange={(value) => setFormData({ ...formData, placement: value })}
                                >
                                    <SelectTrigger id="placement">
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
                            </div>

                            {/* Device */}
                            <div className="space-y-2">
                                <Label htmlFor="device">
                                    Target Device <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.device}
                                    onValueChange={(value) => setFormData({ ...formData, device: value })}
                                >
                                    <SelectTrigger id="device">
                                        <SelectValue placeholder="Select device" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="both">All Devices</SelectItem>
                                        <SelectItem value="desktop">Desktop Only</SelectItem>
                                        <SelectItem value="mobile">Mobile Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Start Date */}
                            <div className="space-y-2">
                                <Label htmlFor="startDate">
                                    Start Date <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="startDate"
                                    type="datetime-local"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    required
                                />
                            </div>

                            {/* End Date */}
                            <div className="space-y-2">
                                <Label htmlFor="endDate">
                                    End Date <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="endDate"
                                    type="datetime-local"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Active Toggle */}
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="isActive" className="text-base">Active Status</Label>
                                <p className="text-sm text-muted-foreground">
                                    Set whether this ad is immediately active
                                </p>
                            </div>
                            <Switch
                                id="isActive"
                                checked={formData.isActive}
                                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                            />
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => router.back()}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="flex-1" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Advertisement'
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
