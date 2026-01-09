"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PawPrint, Home, Grid3X3, LayoutList } from "lucide-react";
import AdBanner from "@/components/landing/AdBanner";
import AdvertisementDisplay from "@/components/landing/AdvertisementDisplay";
import AdSidebar from "@/components/landing/AdSidebar";

export default function AdvertisementShowcasePage() {
    return (
        <div className="min-h-screen bg-gray-50">
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
                                    <Home className="w-4 h-4 mr-2" />
                                    Home
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

            {/* Page Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Advertisement Components Showcase
                    </h1>
                    <p className="text-gray-600">
                        Preview all advertisement display components
                    </p>
                </div>
            </div>

            {/* Section 1: Banner Carousel */}
            <section className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <LayoutList className="w-5 h-5 text-orange-600" />
                        <h2 className="text-2xl font-bold text-gray-900">
                            1. Banner Carousel
                        </h2>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Full-width auto-rotating banner perfect for homepage hero sections
                    </p>
                </div>
                <AdBanner />
            </section>

            {/* Section 2: Grid Display + Sidebar */}
            <section className="py-8 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 mb-2">
                        <Grid3X3 className="w-5 h-5 text-orange-600" />
                        <h2 className="text-2xl font-bold text-gray-900">
                            2. Grid Display with Sidebar
                        </h2>
                    </div>
                    <p className="text-sm text-gray-600 mb-8">
                        Main content area with detailed ad cards and compact sidebar ads
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Main Content - Grid Display */}
                        <div className="lg:col-span-3">
                            <AdvertisementDisplay />
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-20">
                                <AdSidebar maxAds={3} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Component Info */}
            <section className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Component Usage
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <LayoutList className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">AdBanner</h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Auto-rotating carousel for homepage hero sections
                            </p>
                            <code className="text-xs bg-gray-100 p-2 rounded block">
                                {`<AdBanner />`}
                            </code>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <Grid3X3 className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">AdvertisementDisplay</h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Grid layout showing detailed advertisement cards
                            </p>
                            <code className="text-xs bg-gray-100 p-2 rounded block">
                                {`<AdvertisementDisplay />`}
                            </code>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <LayoutList className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">AdSidebar</h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Compact sidebar widget for secondary placements
                            </p>
                            <code className="text-xs bg-gray-100 p-2 rounded block">
                                {`<AdSidebar maxAds={3} />`}
                            </code>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center text-sm text-gray-600">
                        <p className="mb-2">
                            <strong>Documentation:</strong> Check ADVERTISEMENT_QUICK_START.md and ADVERTISEMENT_SYSTEM_DOCS.md
                        </p>
                        <p>&copy; {new Date().getFullYear()} PetNest. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
