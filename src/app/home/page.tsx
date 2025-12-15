'use client'

import React, { Suspense, use } from 'react'
import { BuyerNavbar } from '@/components/landing/BuyerNavbar'
import AdBanner from '@/components/landing/AdBanner'
import { PetCard } from '@/components/landing/PetCard'
import FiltersPanel from '@/components/landing/FiltersPanel'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import axios from 'axios';
import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setPets } from '@/store/slices/PetSlice'
// Using standard Lucide icons for UI states (assuming lucide-react is installed, if not, basic SVGs work)
import { AlertCircle, RefreshCcw, Dog } from 'lucide-react'

const BuyerHome = () => {
    const dispatch = useAppDispatch();
    const { pets } = useAppSelector((state) => state.pet);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const BaseURL = process.env.NEXT_PUBLIC_BASE_URL;

    const fetchPets = async () => {
        try {
            setError(null);

            // console.log("🔍 Fetching from:", `${BaseURL}/v1/api/buyer/pets`);

            const response = await axios.get(`${BaseURL}/v1/api/buyer/pets`, {
                withCredentials: true
            });

            const data = response.data.pets;
            // Debug logs preserved as per original code
            /* console.log("=== BACKEND RESPONSE DEBUG ===");
            console.log("Full Response:", response.data);
            // ... logs
            */

            dispatch(setPets(data || []));
        } catch (error: any) {
            console.error(" Error fetching pets:", error);
            setError(error.response?.data?.message || error.message || 'Failed to load pets');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // Only show loading if no cached pets to prevent layout shift on re-renders
        if (!pets || pets.length === 0) {
            setLoading(true);
        }
        fetchPets();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50/80 font-sans text-slate-900">
            {/* Navigation & Promotions */}
            <div className="bg-white shadow-sm z-50 relative">
                <BuyerNavbar />
            </div>

            <AdBanner />

            {/* Main Content Area */}
            <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

                {/* 1. Page Header & Introduction */}
                <div className="mb-8 md:mb-10 space-y-2">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                        Available Pets
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl">
                        Discover your perfect companion from verified breeders and shelters near you.
                    </p>
                </div>

                {/* 2. Filters Section */}
                {/* Wrapped in a clean container to separate tools from content */}
                <div className="mb-10 sticky top-4 z-30 md:static">
                    <Suspense fallback={
                        <div className="h-20 bg-white rounded-2xl border border-slate-200 animate-pulse shadow-sm" />
                    }>
                        <div className="bg-white/80 backdrop-blur-md md:bg-transparent md:backdrop-blur-none rounded-xl md:rounded-none py-2 md:py-0">
                            <FiltersPanel />
                        </div>
                    </Suspense>
                </div>

                {/* 3. Grid Layout */}
                {/* Improved Grid: 1 col mobile, 2 tablet/small laptop, 3 desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">

                    {loading ? (
                        // 4. Enhanced Loading Skeletons
                        // mimics the actual card shape (Image aspect ratio + text lines)
                        Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="flex flex-col space-y-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <div className="aspect-[4/3] w-full bg-slate-200 rounded-xl animate-pulse" />
                                <div className="space-y-2 pt-2">
                                    <div className="h-5 bg-slate-200 rounded w-3/4 animate-pulse" />
                                    <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse" />
                                </div>
                                <div className="pt-2 flex justify-between items-center">
                                    <div className="h-8 w-20 bg-slate-200 rounded-lg animate-pulse" />
                                    <div className="h-8 w-8 bg-slate-200 rounded-full animate-pulse" />
                                </div>
                            </div>
                        ))
                    ) : error ? (
                        // 5. Modern Error State
                        <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
                            <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500">
                                <AlertCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Unable to load pets</h3>
                            <p className="text-slate-500 mb-6 text-center max-w-md">{error}</p>
                            <button
                                onClick={fetchPets}
                                className="inline-flex items-center px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-all hover:shadow-lg active:scale-95"
                            >
                                <RefreshCcw size={18} className="mr-2" />
                                Try Again
                            </button>
                        </div>
                    ) : pets && pets.length > 0 ? (
                        // 6. Pet Cards
                        pets.map((pet: any, index: number) => (
                            <div key={pet._id || index} className="transition-transform duration-300 hover:-translate-y-1">
                                <PetCard pet={pet} />
                            </div>
                        ))
                    ) : (
                        // 7. Modern Empty State
                        <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
                            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
                                <Dog size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1">No pets found</h3>
                            <p className="text-slate-500">Try adjusting your filters or check back later.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default function BuyerHomePage() {
    return (
        <ProtectedRoute allowedRoles={['buyer']}>
            <BuyerHome />
        </ProtectedRoute>
    );
}