'use client'

import React, { Suspense, use } from 'react'
import { BuyerNavbar } from '@/components/landing/BuyerNavbar'
import AdBanner from '@/components/landing/AdBanner'
import { PetCard } from '@/components/landing/PetCard'
import FiltersPanel from '@/components/landing/FiltersPanel'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import axios from 'axios';
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
// import { setPets } from "@/redux/petSlice";
import { setPets } from '@/store/slices/PetSlice'


const BuyerHome = () => {
    const dispatch = useDispatch();
    const pets = useSelector((state: any) => state.pet);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const BaseURL = process.env.NEXT_PUBLIC_BASE_URL;

    const fetchPets = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log("🔍 Fetching from:", `${BaseURL}/v1/api/buyer/pets`);

            const response = await axios.get(`${BaseURL}/v1/api/buyer/pets`, {
                withCredentials: true
            });

            const data = response.data.pets;
            console.log("=== BACKEND RESPONSE DEBUG ===");
            console.log("Full Response:", response.data);
            console.log("Pets Array:", data);
            console.log("Number of Pets:", data?.length);
            if (data && data.length > 0) {
                console.log("First Pet Sample:", data[0]);
                console.log("First Pet Seller:", data[0].seller);
                console.log("First Pet Images:", data[0].images || data[0].image);
                console.log("First Pet Location:", data[0].location);
            }
            console.log("=== END DEBUG ===");

            dispatch(setPets(data || []));
        } catch (error: any) {
            console.error("❌ Error fetching pets:", error);
            console.error("Error details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            setError(error.response?.data?.message || error.message || 'Failed to load pets');
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchPets();
    }, []);



    return (
        <div>
            <BuyerNavbar />
            <AdBanner />
            <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Available Pets</h2>
                    <p className="text-muted-foreground">Find your perfect companion</p>
                </div>

                {/* Filters Panel - Top Row */}
                <div className="mb-6">
                    <Suspense fallback={
                        <div className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                    }>
                        <FiltersPanel />
                    </Suspense>
                </div>

                {/* Pet Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
                    {loading ? (
                        // Loading skeleton
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-gray-100 rounded-xl h-96 animate-pulse" />
                        ))
                    ) : error ? (
                        // Error state
                        <div className="col-span-full text-center py-12">
                            <p className="text-red-500 mb-4">❌ {error}</p>
                            <button
                                onClick={fetchPets}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                            >
                                Retry
                            </button>
                        </div>
                    ) : pets && pets.length > 0 ? (
                        pets.map((pet: any, index: number) => (
                            <PetCard key={pet.id || index} pet={pet} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-muted-foreground">No pets available at the moment</p>
                        </div>
                    )}
                </div>
            </div>
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
