import React, { Suspense } from 'react'
import { BuyerNavbar } from '@/components/landing/BuyerNavbar'
import AdBanner from '@/components/landing/AdBanner'
import { PetCard } from '@/components/landing/PetCard'
import FiltersPanel from '@/components/landing/FiltersPanel'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

const BuyerHome = () => {
    const samplePets = [
        {
            name: "Buddy",
            breed: "Golden Retriever",
            age: "2 years",
            price: "₹15,000",
            location: "New York, NY",
            image: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&q=80",
            verified: true,
            rating: 4.8,
            seller: "Happy Pets",
            description: "Friendly and energetic companion, great with kids and families. Fully vaccinated and well-trained."
        },
        {
            name: "Luna",
            breed: "Siberian Husky",
            age: "1 year",
            price: "₹20,000",
            location: "Los Angeles, CA",
            image: "https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&q=80",
            verified: true,
            rating: 4.9,
            seller: "Pawsome Pets",
            description: "Beautiful blue eyes, active and playful. Loves outdoor activities and requires regular exercise."
        },
        {
            name: "Max",
            breed: "German Shepherd",
            age: "3 years",
            price: "₹18,000",
            location: "Chicago, IL",
            image: "https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=800&q=80",
            verified: false,
            rating: 4.6,
            seller: "Pet Paradise",
            description: "Intelligent and loyal protector. Well-behaved, obedient, and excellent for security and companionship."
        },
        {
            name: "Bella",
            breed: "French Bulldog",
            age: "1.5 years",
            price: "₹12,000",
            location: "Miami, FL",
            image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80",
            verified: true,
            rating: 4.7,
            seller: "Elite Pets",
            description: "Adorable and affectionate lapdog, perfect for apartment living. Low maintenance and loves attention."
        }
    ];

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
                    {samplePets.map((pet, index) => (
                        <PetCard key={index} pet={pet} />
                    ))}
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
