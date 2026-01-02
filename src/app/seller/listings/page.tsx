'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/seller/EmptyState';
import {
    Plus,
    Eye,
    Heart,
    Edit,
    Trash2,
    MoreVertical,
    PackageCheck,
    Store,
    Star
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { getSellerpets } from '@/services/seller';
import type { Pet } from '@/services/petApi';
import { useAppSelector } from '@/store/hooks';
import { requestFeaturedPet } from '@/services/featuredPetService';

// const mockListings = [
//     {
//         id: '1',
//         name: 'Golden Retriever Puppy',
//         breed: 'Golden Retriever',
//         image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=200',
//         price: '₹35,000',
//         status: 'active',
//         views: 234,
//         wishlistCount: 12,
//         age: '3 months',
//         postedAt: '2 days ago',
//     },
//     {
//         id: '2',
//         name: 'Persian Cat',
//         breed: 'Persian',
//         image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200',
//         price: '₹18,000',
//         status: 'pending',
//         views: 89,
//         wishlistCount: 5,
//         age: '2 months',
//         postedAt: '5 days ago',
//     },
//     {
//         id: '3',
//         name: 'Beagle Puppy',
//         breed: 'Beagle',
//         image: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=200',
//         price: '₹25,000',
//         status: 'active',
//         views: 156,
//         wishlistCount: 8,
//         age: '4 months',
//         postedAt: '1 week ago',
//     },
//     {
//         id: '4',
//         name: 'Labrador Puppy',
//         breed: 'Labrador',
//         image: 'https://images.unsplash.com/photo-1597633544424-4638a6d2f752?w=200',
//         price: '₹28,000',
//         status: 'sold',
//         views: 345,
//         wishlistCount: 23,
//         age: '3 months',
//         postedAt: '2 weeks ago',
//     },
// ];

export default function ListingsManagementPage() {
    const user = useAppSelector((state) => state.auth.user);

    // State
    const [pets, setPets] = useState<Pet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showFeaturedDialog, setShowFeaturedDialog] = useState(false);
    const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
    const [isRequestingFeatured, setIsRequestingFeatured] = useState(false);
    // Removed search and status filter logic
    const safePets = Array.isArray(pets) ? pets : [];
    // Fetch pets from API
    useEffect(() => {
        async function fetchPets() {
            if (user) {
                setIsLoading(true);
                const petList = await getSellerpets();
                setPets(Array.isArray(petList) ? petList : []);
                setIsLoading(false);
            }
        }
        fetchPets();
    }, [user]);

    // Update URL when filters change to preserve state
    // Removed effect for updating URL with filters

    // Removed filteredListings logic; will use safePets directly

    // Handle featured request
    const handleFeaturedRequest = async () => {
        if (!selectedPetId) return;

        setIsRequestingFeatured(true);
        try {
            await requestFeaturedPet(selectedPetId);
            toast.success('Featured listing request submitted successfully!');
            setShowFeaturedDialog(false);

            // Refresh pet list
            if (user) {
                const petList = await getSellerpets();
                setPets(Array.isArray(petList) ? petList : []);
            }
        } catch (error: any) {
            console.error('Error requesting featured:', error);
            const errorMessage = error?.response?.data?.message || 'Failed to request featured listing';
            toast.error(errorMessage);
        } finally {
            setIsRequestingFeatured(false);
            setSelectedPetId(null);
        }
    };

    // Check if featured request option should be shown
    const canRequestFeatured = (pet: Pet) => {
        if (!pet.isVerified) return false;

        const status = (pet as any).featuredRequest?.status;
        return !status || status === 'rejected';
    };

    // Get featured badge text
    const getFeaturedBadge = (pet: Pet) => {
        const status = (pet as any).featuredRequest?.status;
        if (status === 'pending') return 'Featured Request Pending';
        if (status === 'approved') return '⭐ Featured';
        return null;
    };


    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Manage Listings</h2>
                    <p className="text-slate-500 mt-1">View and manage all your pet listings</p>
                </div>
                <Button asChild>
                    <Link href="/seller/add-pet">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Listing
                    </Link>
                </Button>
            </div>

            {/* Filters removed */}

            {/* Listings */}
            {isLoading ? (
                <Card className="p-12 text-center">
                    <div className="text-slate-500">Loading your listings...</div>
                </Card>
            ) : safePets.length === 0 ? (
                <Card>
                    <EmptyState
                        icon={PackageCheck}
                        title="No listings found"
                        description={pets.length === 0 ? "Get started by adding your first pet listing" : "Try adjusting your filters"}
                        action={{
                            label: 'Add New Listing',
                            onClick: () => window.location.href = '/seller/listings/new'
                        }}
                    />
                </Card>
            ) : (
                <>
                    {/* Desktop Table */}
                    <Card className="hidden md:block">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Pet Details
                                        </th>
                                        <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Performance
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
                                    {safePets.map((pet) => (
                                        <tr key={pet._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-14 w-14 rounded-lg overflow-hidden bg-slate-100 relative shrink-0">
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
                                                        <p className="font-medium text-slate-900">{pet.name}</p>
                                                        <p className="text-sm text-slate-500">{pet.breedName} • {pet.age}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="font-semibold text-slate-900">₹{pet.price.toLocaleString()}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col gap-1">
                                                    <Badge
                                                        variant={pet.isVerified ? 'default' : 'secondary'}
                                                        className={pet.isVerified ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'}
                                                    >
                                                        {pet.isVerified ? 'Active' : 'Pending Review'}
                                                    </Badge>
                                                    {getFeaturedBadge(pet) && (
                                                        <Badge
                                                            variant="outline"
                                                            className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50"
                                                        >
                                                            {getFeaturedBadge(pet)}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="h-4 w-4" />
                                                        0
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Heart className="h-4 w-4" />
                                                        0
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-slate-500">
                                                {pet.createdAt ? new Date(pet.createdAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/pets/${pet._id}`}>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                View Details
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit Listing
                                                        </DropdownMenuItem>
                                                        {canRequestFeatured(pet) && (
                                                            <>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setSelectedPetId(pet._id);
                                                                        setShowFeaturedDialog(true);
                                                                    }}
                                                                >
                                                                    <Star className="h-4 w-4 mr-2" />
                                                                    Request Featured ⭐
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                        {pet.isVerified && (
                                                            <DropdownMenuItem>
                                                                <PackageCheck className="h-4 w-4 mr-2" />
                                                                Mark as Sold
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem className="text-red-600">
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-3">
                        {safePets.map((pet) => (
                            <Card key={pet._id} className="p-4">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="h-20 w-20 rounded-lg overflow-hidden bg-slate-100 relative shrink-0">
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
                                        <p className="text-sm text-slate-500">{pet.breedName} • {pet.age}</p>
                                        <p className="text-sm font-semibold text-slate-900 mt-1">₹{pet.price.toLocaleString()}</p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/pets/${pet._id}`}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit Listing
                                            </DropdownMenuItem>
                                            {pet.isVerified && (
                                                <DropdownMenuItem>
                                                    <PackageCheck className="h-4 w-4 mr-2" />
                                                    Mark as Sold
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem className="text-red-600">
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="flex items-center justify-between">
                                    <Badge
                                        variant={pet.isVerified ? 'default' : 'secondary'}
                                        className={pet.isVerified ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'}
                                    >
                                        {pet.isVerified ? 'Active' : 'Pending Review'}
                                    </Badge>
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <span className="flex items-center gap-1">
                                            <Eye className="h-4 w-4" />
                                            0
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Heart className="h-4 w-4" />
                                            0
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </>
            )}

            {/* Featured Request Confirmation Dialog */}
            <AlertDialog open={showFeaturedDialog} onOpenChange={setShowFeaturedDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Request Featured Listing</AlertDialogTitle>
                        <AlertDialogDescription>
                            Submit a request to feature this pet listing. Featured listings get higher visibility and appear at the top of search results.
                            <br /><br />
                            Your request will be reviewed by our admin team.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isRequestingFeatured}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleFeaturedRequest}
                            disabled={isRequestingFeatured}
                        >
                            {isRequestingFeatured ? 'Submitting...' : 'Submit Request'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
} 