"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import apiClient from "@/lib/apiClient";
import {
    User, Mail, Phone, MapPin, Calendar, Shield,
    Edit, Camera, Settings, Heart, ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface BuyerProfile {
    _id: string;
    role: string;
    name: string;
    email: string;
    profilePic?: string;
    phoneNumber?: string;
    bio?: string;
    location?: string;
    preferences?: Record<string, any>;
    isVerified: boolean;
    isBanned: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function BuyerProfilePage() {
    const [profile, setProfile] = useState<BuyerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        bio: "",
        location: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log("Fetching buyer profile...");
                const response = await apiClient.get(
                    "/v1/api/buyer/profile"
                );
                console.log("Profile response:", response.data);

                // Handle both "user" and "buyer" response formats
                const profileData = response.data.user || response.data.buyer;

                if (profileData) {
                    setProfile(profileData);
                    setFormData({
                        name: profileData.name || "",
                        phoneNumber: profileData.phoneNumber || "",
                        bio: profileData.bio || "",
                        location: profileData.location || "",
                    });
                }
            } catch (error: any) {
                console.error("Failed to fetch profile:", error);
                console.error("Error response:", error.response?.data);
                console.error("Error status:", error.response?.status);

                let errorMessage = "Failed to load profile. Please try again.";

                if (error.response?.data?.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response?.data?.error) {
                    errorMessage = error.response.data.error;
                } else if (error.response?.status === 400) {
                    errorMessage = "Unable to load profile. Please check your authentication.";
                } else if (error.response?.status === 401) {
                    errorMessage = "Session expired. Please login again.";
                }

                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset form data to original profile values
        if (profile) {
            setFormData({
                name: profile.name || "",
                phoneNumber: profile.phoneNumber || "",
                bio: profile.bio || "",
                location: profile.location || "",
            });
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setError(null);

            // Use FormData for multipart/form-data format
            const formDataToSend = new FormData();

            // Only append fields that have values
            if (formData.name?.trim()) {
                formDataToSend.append("name", formData.name.trim());
            }
            if (formData.phoneNumber?.trim()) {
                formDataToSend.append("phoneNumber", formData.phoneNumber.trim());
            }
            if (formData.bio?.trim()) {
                formDataToSend.append("bio", formData.bio.trim());
            }
            if (formData.location?.trim()) {
                formDataToSend.append("location", formData.location.trim());
            }

            // Check if at least one field is being updated
            if (!formDataToSend.has("name") && !formDataToSend.has("phoneNumber") &&
                !formDataToSend.has("bio") && !formDataToSend.has("location")) {
                setError("Please fill in at least one field to update.");
                setIsSaving(false);
                return;
            }

            console.log("Sending update data as FormData:");
            formDataToSend.forEach((value, key) => {
                console.log(`${key}:`, value);
            });

            const response = await apiClient.patch(
                "/v1/api/buyer/profile",
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("Update successful:", response.data);

            // Handle response - API returns "buyer" instead of "user"
            const updatedProfile = response.data.buyer || response.data.user;

            if (updatedProfile) {
                setProfile(updatedProfile);
                setFormData({
                    name: updatedProfile.name || "",
                    phoneNumber: updatedProfile.phoneNumber || "",
                    bio: updatedProfile.bio || "",
                    location: updatedProfile.location || "",
                });
                setIsEditing(false);
                setError(null);
            }
        } catch (error: any) {
            console.error("Failed to update profile:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            console.error("Error headers:", error.response?.headers);

            let errorMessage = "Failed to update profile. Please try again.";

            // Handle specific error messages from API
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.response?.data?.errors) {
                // Handle validation errors
                const errors = error.response.data.errors;
                if (Array.isArray(errors)) {
                    errorMessage = errors.map((e: any) => e.msg || e.message).join(", ");
                } else if (typeof errors === "object") {
                    errorMessage = Object.values(errors).join(", ");
                }
            } else if (error.response?.status === 400) {
                errorMessage = "Invalid data provided. Please check your inputs.";
            }

            setError(errorMessage);

            // Show error in UI at the top of the page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900 py-8 px-4">
                <div className="max-w-5xl mx-auto space-y-6">
                    <Skeleton className="h-64 w-full rounded-3xl" />
                    <div className="grid md:grid-cols-2 gap-6">
                        <Skeleton className="h-48 rounded-2xl" />
                        <Skeleton className="h-48 rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <Card className="p-8 max-w-md w-full text-center">
                    <div className="mb-4">
                        <Shield className="w-12 h-12 text-red-500 mx-auto" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                        Unable to Load Profile
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                        {error}
                    </p>
                    <Button onClick={() => window.location.reload()} className="w-full">
                        Try Again
                    </Button>
                </Card>
            </div>
        );
    }

    if (!profile) return null;

    const memberSince = new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900 py-8 px-4">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Error Alert - Show inline when updating profile */}
                {error && profile && (
                    <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                        <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                                    Update Failed
                                </h3>
                                <p className="text-sm text-red-800 dark:text-red-200">
                                    {error}
                                </p>
                            </div>
                            <button
                                onClick={() => setError(null)}
                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                            >
                                ×
                            </button>
                        </div>
                    </Card>
                )}

                {/* Header Card */}
                <Card className="overflow-hidden border-0 shadow-xl">
                    <div className="relative h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                        <div className="absolute inset-0 bg-black/10" />
                    </div>

                    <div className="relative px-6 sm:px-8 pb-8">
                        {/* Profile Picture */}
                        <div className="relative -mt-16 mb-4">
                            <div className="relative w-32 h-32 rounded-full border-4 border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                                {profile.profilePic ? (
                                    <Image
                                        src={profile.profilePic}
                                        alt={profile.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User className="w-16 h-16 text-zinc-400" />
                                    </div>
                                )}
                            </div>
                            <button className="absolute bottom-1 right-1 p-2 bg-white dark:bg-zinc-800 rounded-full shadow-lg hover:scale-105 transition-transform">
                                <Camera className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                            </button>
                        </div>

                        {/* Name and Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    {!isEditing ? (
                                        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
                                            {profile.name}
                                        </h1>
                                    ) : (
                                        <Input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="text-2xl font-bold h-12"
                                            placeholder="Your name"
                                        />
                                    )}
                                    {profile.isVerified && (
                                        <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                    Member since {memberSince}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" className="gap-2">
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </Button>
                                {!isEditing ? (
                                    <Button onClick={handleEdit} className="gap-2">
                                        <Edit className="w-4 h-4" />
                                        Edit Profile
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            variant="outline"
                                            onClick={handleCancel}
                                            disabled={isSaving}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="mt-6">
                            {!isEditing ? (
                                profile.bio && (
                                    <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                        {profile.bio}
                                    </p>
                                )
                            ) : (
                                <div>
                                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
                                        Bio
                                    </label>
                                    <Textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        placeholder="Tell us about yourself..."
                                        className="min-h-[80px]"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Info Grid */}
                <div className="grid md:grid-cols-2 gap-6">

                    {/* Contact Information */}
                    <Card className="p-6 border-0 shadow-lg">
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
                            Contact Information
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide font-medium mb-1">
                                        Email
                                    </p>
                                    <p className="text-sm text-zinc-900 dark:text-white font-medium truncate">
                                        {profile.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg flex-shrink-0">
                                    <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide font-medium mb-1">
                                        Phone Number
                                    </p>
                                    {!isEditing ? (
                                        <p className="text-sm text-zinc-900 dark:text-white font-medium">
                                            {profile.phoneNumber || "Not provided"}
                                        </p>
                                    ) : (
                                        <Input
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            placeholder="+1234567890"
                                            className="h-9"
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex-shrink-0">
                                    <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide font-medium mb-1">
                                        Location
                                    </p>
                                    {!isEditing ? (
                                        <p className="text-sm text-zinc-900 dark:text-white font-medium">
                                            {profile.location || "Not provided"}
                                        </p>
                                    ) : (
                                        <Input
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            placeholder="New York, USA"
                                            className="h-9"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Account Status */}
                    <Card className="p-6 border-0 shadow-lg">
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
                            Account Status
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                        Verification Status
                                    </span>
                                </div>
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-xs font-semibold",
                                    profile.isVerified
                                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                        : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                                )}>
                                    {profile.isVerified ? "Verified" : "Not Verified"}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <User className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                        Account Type
                                    </span>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 capitalize">
                                    {profile.role}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                        Account Status
                                    </span>
                                </div>
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-xs font-semibold",
                                    profile.isBanned
                                        ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                        : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                )}>
                                    {profile.isBanned ? "Banned" : "Active"}
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl group-hover:scale-110 transition-transform">
                                <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-zinc-900 dark:text-white">
                                    My Wishlist
                                </h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    View saved pets
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl group-hover:scale-110 transition-transform">
                                <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-zinc-900 dark:text-white">
                                    Purchase History
                                </h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    View past orders
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
