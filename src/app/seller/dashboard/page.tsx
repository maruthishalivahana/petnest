'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/seller/StatCard';
import {
    Store,
    Eye,
    Heart,
    MessageCircle,
    TrendingUp,
    Plus
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getSellerPetCount, getSellerpets } from '@/services/seller';
import { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import type { Pet } from '@/services/petApi';

export default function SellerDashboardPage() {
    const user = useAppSelector((state) => state.auth.user);
    const [petCount, setPetCount] = useState<number>(0);
    const [pets, setPets] = useState<Pet[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (user) {
                setIsLoading(true);
                const [count, petList] = await Promise.all([
                    getSellerPetCount(),
                    getSellerpets()
                ]);
                setPetCount(count);
                setPets(petList.slice(0, 3)); // Show only 3 recent listings
                setIsLoading(false);
            }
        }
        fetchData();
    }, [user]);

    const stats = [
        { title: 'Total Listings', value: isLoading ? '...' : String(petCount), icon: Store, trend: { value: 0, isPositive: true } },
        { title: 'Total Views', value: 0, icon: Eye, trend: { value: 0, isPositive: true } },
        { title: 'Wishlist Saves', value: 0, icon: Heart, trend: { value: 0, isPositive: true } },
        { title: 'WhatsApp Clicks', value: 0, icon: MessageCircle, trend: { value: 0, isPositive: true } },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Welcome back! 👋</h2>
                    <p className="text-slate-500 mt-1">Here&apos;s what&apos;s happening with your store today.</p>
                </div>
                <Button asChild>
                    <Link href="/seller/add-pet">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Listing
                    </Link>
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>

            {/* Quick Actions */}
            <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-slate-900">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Button variant="outline" className="h-auto py-3 flex flex-col gap-2" asChild>
                        <Link href="/seller/add-pet">
                            <Plus className="h-5 w-5" />
                            <span className="text-xs">Add Pet</span>
                        </Link>
                    </Button>
                    <Button variant="outline" className="h-auto py-3 flex flex-col gap-2" asChild>
                        <Link href="/seller/analytics">
                            <Eye className="h-5 w-5" />
                            <span className="text-xs">View Stats</span>
                        </Link>
                    </Button>
                    <Button variant="outline" className="h-auto py-3 flex flex-col gap-2" asChild>
                        <Link href="/seller/profile">
                            <Store className="h-5 w-5" />
                            <span className="text-xs">Edit Profile</span>
                        </Link>
                    </Button>
                    <Button variant="outline" className="h-auto py-3 flex flex-col gap-2" asChild>
                        <Link href="/seller/verification">
                            <TrendingUp className="h-5 w-5" />
                            <span className="text-xs">Verification</span>
                        </Link>
                    </Button>
                </div>
            </Card>

            {/* Recent Listings */}
            <Card>
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900">Recent Listings</h3>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/seller/listings">View All</Link>
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-6 text-center text-slate-500">Loading...</div>
                ) : pets.length === 0 ? (
                    <div className="p-6 text-center text-slate-500">
                        <p>No pets listed yet</p>
                        <Button asChild className="mt-4">
                            <Link href="/seller/add-pet">Add Your First Pet</Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Pet
                                        </th>
                                        <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Posted
                                        </th>
                                        <th className="text-right py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {pets.map((pet) => (
                                        <tr key={pet._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 rounded-lg overflow-hidden bg-slate-100 relative shrink-0">
                                                        {pet.images && pet.images.length > 0 ? (
                                                            <Image
                                                                src={pet.images[0]}
                                                                alt={pet.name}
                                                                fill
                                                                className="object-cover"
                                                                unoptimized
                                                            />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center bg-slate-200">
                                                                <Store className="h-6 w-6 text-slate-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-slate-900">{pet.name}</span>
                                                        <p className="text-xs text-slate-500">{pet.breedName}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="font-semibold text-slate-900">₹{pet.price.toLocaleString()}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <Badge
                                                    variant={pet.isVerified ? 'default' : 'secondary'}
                                                    className={pet.isVerified ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'}
                                                >
                                                    {pet.isVerified ? 'Active' : 'Pending Review'}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-slate-600">
                                                {pet.location.city}, {pet.location.state}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-slate-500">
                                                {pet.createdAt ? new Date(pet.createdAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/pets/${pet._id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-slate-200">
                            {pets.map((pet) => (
                                <div key={pet._id} className="p-4 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="h-16 w-16 rounded-lg overflow-hidden bg-slate-100 relative shrink-0">
                                            {pet.images && pet.images.length > 0 ? (
                                                <Image
                                                    src={pet.images[0]}
                                                    alt={pet.name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-slate-200">
                                                    <Store className="h-8 w-8 text-slate-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-slate-900 truncate">{pet.name}</h4>
                                            <p className="text-xs text-slate-500">{pet.breedName}</p>
                                            <p className="text-sm font-semibold text-slate-900 mt-1">₹{pet.price.toLocaleString()}</p>
                                            <Badge
                                                variant={pet.isVerified ? 'default' : 'secondary'}
                                                className={`mt-2 ${pet.isVerified ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'}`}
                                            >
                                                {pet.isVerified ? 'Active' : 'Pending Review'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-slate-500">
                                        <span>{pet.location.city}, {pet.location.state}</span>
                                        <span>{pet.createdAt ? new Date(pet.createdAt).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
}
