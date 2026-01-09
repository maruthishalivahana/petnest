"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PawPrint, ArrowLeft } from "lucide-react";
import AdBanner from "@/components/landing/AdBanner";
import AdvertisementDisplay from "@/components/landing/AdvertisementDisplay";

export default function AdvertisementsPage() {
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

            {/* Hero Banner */}
            <section className="mb-8">
                <AdBanner />
            </section>

            {/* All Advertisements Section */}
            <section className="pb-16">
                <AdvertisementDisplay />
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center text-sm text-gray-600">
                        <p>&copy; {new Date().getFullYear()} PetNest. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
