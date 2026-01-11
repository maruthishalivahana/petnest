'use client'

import React, { Suspense } from 'react'
import { BuyerNavbar } from '@/components/landing/BuyerNavbar'
import AdBanner from '@/components/landing/AdBanner'
import AdFooter from '@/components/landing/AdFooter'
import AdInline from '@/components/landing/AdInline'
import AdMobileSticky from '@/components/landing/AdMobileSticky'
import BuyerFooter from '@/components/landing/BuyerFooter'
import { PetCard } from '@/components/landing/PetCard'
import { FeaturedPetCard } from '@/components/landing/FeaturedPetCard'
import FiltersPanel from '@/components/landing/FiltersPanel'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import axios from 'axios';
import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setPets, setIsSearching } from '@/store/slices/PetSlice'
import { searchPets } from '@/services/petApi'
import { useSearchParams } from 'next/navigation'
import { fetchFeaturedPetsBuyer, type FeaturedPet } from '@/services/featuredPetService'
// Using standard Lucide icons for UI states (assuming lucide-react is installed, if not, basic SVGs work)
import { AlertCircle, RefreshCcw, Dog, Star } from 'lucide-react'

const BuyerHome = () => {
    const dispatch = useAppDispatch();
    const { pets } = useAppSelector((state) => state.pet);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [featuredPets, setFeaturedPets] = useState<FeaturedPet[]>([]);
    const BaseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const searchParams = useSearchParams();

    // Get search and filter parameters from URL
    const searchQuery = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const gender = searchParams.get('gender') || '';
    const age = searchParams.get('age') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';

    const fetchPets = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch featured pets (always, not affected by filters)
            if (!searchQuery && !category && !gender && !age && !minPrice && !maxPrice) {
                try {
                    const featured = await fetchFeaturedPetsBuyer();
                    setFeaturedPets(featured);
                } catch (err) {
                    console.error('Error fetching featured pets:', err);
                    // Don't show error for featured pets, just log it
                }
            } else {
                setFeaturedPets([]);
            }

            if (searchQuery) {
                // Use search API when search query is present
                dispatch(setIsSearching(true));
                const response = await searchPets(searchQuery);

                if (response.success) {
                    let filteredPets = response.data || [];

                    // Apply client-side filters to search results
                    if (category) {
                        filteredPets = filteredPets.filter(pet =>
                            pet.category?.toLowerCase() === category.toLowerCase()
                        );
                    }
                    if (gender) {
                        filteredPets = filteredPets.filter(pet =>
                            pet.gender?.toLowerCase() === gender.toLowerCase()
                        );
                    }
                    if (age) {
                        filteredPets = filteredPets.filter(pet => pet.age === age);
                    }
                    if (minPrice) {
                        filteredPets = filteredPets.filter(pet => pet.price >= Number(minPrice));
                    }
                    if (maxPrice) {
                        filteredPets = filteredPets.filter(pet => pet.price <= Number(maxPrice));
                    }

                    dispatch(setPets(filteredPets));
                } else {
                    setError(response.message);
                }
            } else if (category || gender || age || minPrice || maxPrice) {
                // Fetch all pets and apply filters client-side
                dispatch(setIsSearching(false));
                const response = await axios.get(`${BaseURL}/v1/api/buyer/pets`, {
                    withCredentials: true
                });

                let filteredPets = response.data.pets || [];

                // Apply client-side filters
                if (category) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    filteredPets = filteredPets.filter((pet: any) =>
                        pet.category?.toLowerCase() === category.toLowerCase()
                    );
                }
                if (gender) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    filteredPets = filteredPets.filter((pet: any) =>
                        pet.gender?.toLowerCase() === gender.toLowerCase()
                    );
                }
                if (age) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    filteredPets = filteredPets.filter((pet: any) => pet.age === age);
                }
                if (minPrice) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    filteredPets = filteredPets.filter((pet: any) => pet.price >= Number(minPrice));
                }
                if (maxPrice) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    filteredPets = filteredPets.filter((pet: any) => pet.price <= Number(maxPrice));
                }

                dispatch(setPets(filteredPets));
            } else {
                // Fetch all pets when no search/filters
                dispatch(setIsSearching(false));
                const response = await axios.get(`${BaseURL}/v1/api/buyer/pets`, {
                    withCredentials: true
                });

                const data = response.data.pets;
                dispatch(setPets(data || []));
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error fetching pets:", error);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, category, gender, age, minPrice, maxPrice]); // Refetch when any parameter changes

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
                        {searchQuery ? `Search Results for "${searchQuery}"` : 'Available Pets'}
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl">
                        {searchQuery
                            ? `Found ${pets?.length || 0} pet${pets?.length !== 1 ? 's' : ''} matching your search`
                            : 'Discover your perfect companion from verified breeders and shelters near you.'
                        }
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

                {/* Featured Pets Section */}
                {!loading && featuredPets.length > 0 && (
                    <section className="mb-16">
                        <div className="flex items-center gap-2 mb-6">
                            <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
                            <h2 className="text-2xl font-bold text-gray-900">Featured Pets</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {featuredPets.map((pet) => (
                                <FeaturedPetCard key={pet._id} pet={pet} />
                            ))}
                        </div>
                    </section>
                )}

                {/* All Pets Section */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <Dog className="h-6 w-6 text-slate-600" />
                        <h2 className="text-2xl font-bold text-gray-900">All Pets</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

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
                            // 6. Pet Cards with inline ads
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            pets.map((pet: any, index: number) => (
                                <React.Fragment key={pet._id || index}>
                                    <div className="transition-transform duration-300 hover:-translate-y-1">
                                        <PetCard pet={pet} />
                                    </div>
                                    {/* Show inline ad after every 6 pets */}
                                    {(index + 1) % 6 === 0 && (
                                        <AdInline className="col-span-1" />
                                    )}
                                </React.Fragment>
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
                </section>
            </main>

            {/* Footer Ad */}
            <AdFooter />

            {/* Mobile Sticky Ad */}
            <AdMobileSticky />

            {/* Main Footer */}
            <BuyerFooter />
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