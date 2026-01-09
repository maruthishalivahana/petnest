"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint, ArrowLeft, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { submitAdvertisementRequest } from "@/services/advertisementApi";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdvertisementRequestPage() {
    const [formData, setFormData] = useState({
        brandName: "",
        contactEmail: "",
        contactNumber: "",
        adSpot: "",
        message: "",
        mediaUrl: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await submitAdvertisementRequest(formData);
            setSuccess(true);
            setFormData({
                brandName: "",
                contactEmail: "",
                contactNumber: "",
                adSpot: "",
                message: "",
                mediaUrl: "",
            });
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to submit request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50">
            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="bg-orange-600 p-2 rounded-lg text-white">
                                <PawPrint size={20} strokeWidth={3} />
                            </div>
                            <span className="text-xl font-bold text-gray-900">PetNest</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Home
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button variant="ghost" size="sm">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-semibold">Advertise with PetNest</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Request Advertisement Placement
                    </h1>
                    <p className="text-lg text-orange-100 max-w-2xl mx-auto">
                        Reach thousands of pet lovers across Tamil Nadu. Submit your advertisement request and our team will review it.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {success ? (
                    <Card className="border-green-200 bg-green-50">
                        <CardContent className="pt-6">
                            <div className="text-center py-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Request Submitted Successfully!
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Thank you for your interest in advertising with PetNest. Our team will review your request and contact you shortly.
                                </p>
                                <div className="flex gap-3 justify-center">
                                    <Button
                                        onClick={() => setSuccess(false)}
                                        variant="outline"
                                    >
                                        Submit Another Request
                                    </Button>
                                    <Link href="/">
                                        <Button className="bg-orange-600 hover:bg-orange-700">
                                            Back to Home
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Advertisement Request Form</CardTitle>
                            <CardDescription>
                                Fill in the details below to submit your advertisement request. All fields are required.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Brand Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="brandName">Brand Name *</Label>
                                    <Input
                                        id="brandName"
                                        placeholder="Enter your brand name"
                                        value={formData.brandName}
                                        onChange={(e) => handleChange("brandName", e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Contact Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="contactEmail">Contact Email *</Label>
                                    <Input
                                        id="contactEmail"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={formData.contactEmail}
                                        onChange={(e) => handleChange("contactEmail", e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Contact Number */}
                                <div className="space-y-2">
                                    <Label htmlFor="contactNumber">Contact Number *</Label>
                                    <Input
                                        id="contactNumber"
                                        type="tel"
                                        placeholder="+91 9876543210"
                                        value={formData.contactNumber}
                                        onChange={(e) => handleChange("contactNumber", e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Ad Spot */}
                                <div className="space-y-2">
                                    <Label htmlFor="adSpot">Advertisement Placement *</Label>
                                    <Select
                                        value={formData.adSpot}
                                        onValueChange={(value) => handleChange("adSpot", value)}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select placement location" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="homepageBanner">Homepage Banner (Premium)</SelectItem>
                                            <SelectItem value="sidebar">Sidebar Advertisement</SelectItem>
                                            <SelectItem value="footer">Footer Advertisement</SelectItem>
                                            <SelectItem value="blogFeature">Blog Feature Spot</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-gray-500">
                                        Choose where you want your ad to appear
                                    </p>
                                </div>

                                {/* Message */}
                                <div className="space-y-2">
                                    <Label htmlFor="message">Advertisement Message *</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Enter your advertisement message or tagline"
                                        value={formData.message}
                                        onChange={(e) => handleChange("message", e.target.value)}
                                        rows={4}
                                        required
                                    />
                                    <p className="text-xs text-gray-500">
                                        Keep it short and impactful (max 200 characters)
                                    </p>
                                </div>

                                {/* Media URL */}
                                <div className="space-y-2">
                                    <Label htmlFor="mediaUrl">Media URL *</Label>
                                    <Input
                                        id="mediaUrl"
                                        type="url"
                                        placeholder="https://example.com/image.jpg"
                                        value={formData.mediaUrl}
                                        onChange={(e) => handleChange("mediaUrl", e.target.value)}
                                        required
                                    />
                                    <p className="text-xs text-gray-500">
                                        Provide a link to your advertisement image or creative
                                    </p>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                {/* Submit Button */}
                                <div className="flex gap-3 pt-4">
                                    <Link href="/" className="flex-1">
                                        <Button type="button" variant="outline" className="w-full">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        className="flex-1 bg-orange-600 hover:bg-orange-700"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            "Submit Request"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Info Cards */}
                <div className="grid md:grid-cols-3 gap-6 mt-12">
                    <Card className="border-orange-200">
                        <CardContent className="pt-6 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
                                <Sparkles className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Premium Placement</h3>
                            <p className="text-sm text-gray-600">
                                Get your brand in front of thousands of pet lovers
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-orange-200">
                        <CardContent className="pt-6 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
                                <CheckCircle2 className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Quick Approval</h3>
                            <p className="text-sm text-gray-600">
                                Our team reviews requests within 24-48 hours
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-orange-200">
                        <CardContent className="pt-6 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
                                <PawPrint className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Targeted Reach</h3>
                            <p className="text-sm text-gray-600">
                                Connect with pet owners across Tamil Nadu
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center text-sm text-gray-600">
                        <p>&copy; {new Date().getFullYear()} PetNest. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
