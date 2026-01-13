"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PawPrint, ArrowLeft, Menu, X } from "lucide-react";
import AdBanner from "@/components/landing/AdBanner";
import AdvertisementDisplay from "@/components/landing/AdvertisementDisplay";

export default function AdvertisementsPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation - Mobile First */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="w-full mx-auto px-3 sm:px-4 lg:px-8">
                    <div className="flex justify-between items-center h-14 sm:h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-1.5 sm:gap-2">
                            <div className="bg-orange-600 p-1.5 sm:p-2 rounded-lg text-white">
                                <PawPrint size={18} className="sm:w-5 sm:h-5" strokeWidth={3} />
                            </div>
                            <span className="text-lg sm:text-xl font-bold text-gray-900">PetNest</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-2 lg:gap-4">
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

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6 text-gray-700" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-700" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden py-3 border-t border-gray-100">
                            <div className="flex flex-col gap-2">
                                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="ghost" size="sm" className="w-full justify-start">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back to Home
                                    </Button>
                                </Link>
                                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="ghost" size="sm" className="w-full justify-start">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                                    <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Banner */}
            <section className="mb-4 sm:mb-6 lg:mb-8">
                <AdBanner />
            </section>

            {/* All Advertisements Section */}
            <section className="pb-8 sm:pb-12 lg:pb-16">
                <AdvertisementDisplay />
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="w-full mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
                    <div className="text-center text-xs sm:text-sm text-gray-600">
                        <p>&copy; {new Date().getFullYear()} PetNest. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
