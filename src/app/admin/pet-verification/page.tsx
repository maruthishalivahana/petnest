"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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
import {
    CheckCircle,
    XCircle,
    Clock,
    PawPrint,
    DollarSign,
    User,
    Mail,
    Calendar,
    Loader2
} from 'lucide-react';
import {
    PetVerification,
    PetVerificationStats,
    fetchPetsByStatus,
    fetchPetVerificationStats,
    updatePetStatus
} from '@/services/admin/adminPetService';

function PetVerificationContent() {
    const [pets, setPets] = useState<PetVerification[]>([]);
    const [stats, setStats] = useState<PetVerificationStats>({ pending: 0, verified: 0, total: 0 });
    const [loading, setLoading] = useState(false);
    const [selectedPet, setSelectedPet] = useState<PetVerification | null>(null);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [verifyDialog, setVerifyDialog] = useState<{
        open: boolean;
        petId: string | null;
    }>({
        open: false,
        petId: null,
    });

    const fetchNotVerifiedPets = async () => {
        setLoading(true);
        try {
            const [petsResponse, statsResponse] = await Promise.all([
                fetchPetsByStatus('pending'),
                fetchPetVerificationStats()
            ]);
            console.log('Fetched not verified pets:', petsResponse);
            console.log('Fetched stats:', statsResponse);
            setPets(petsResponse || []);
            setStats(statsResponse);
        } catch (err: any) {
            console.error('Error fetching pets:', err);
            toast.error('Failed to load not verified pets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotVerifiedPets();
    }, []);

    const handleVerify = async (petId: string) => {
        setLoading(true);
        try {
            const result = await updatePetStatus(petId, 'verified');
            toast.success(result.message || 'Pet verified successfully!');
            await fetchNotVerifiedPets();
        } catch (error) {
            console.error('Error verifying pet:', error);
            toast.error('Failed to verify pet');
        } finally {
            setVerifyDialog({ open: false, petId: null });
            setLoading(false);
        }
    };

    const viewDetails = (pet: PetVerification) => {
        setSelectedPet(pet);
        setShowDetailsDialog(true);
    };

    const getStatusBadge = (isVerified: boolean) => {
        if (isVerified === false) {
            return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                <Clock className="w-3 h-3 mr-1" />
                Pending
            </Badge>;
        }
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
        </Badge>;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Pet Verification</h1>

                {/* Pending Count Card */}
                <div className="inline-flex items-center gap-3 px-6 py-4 bg-white border-2 border-orange-200 rounded-full shadow-sm">
                    <Clock className="w-6 h-6 text-orange-600" />
                    <span className="text-base font-medium text-gray-700">Pending Verification</span>
                    <span className="text-xl font-bold text-orange-600 ml-2">{stats.pending}</span>
                </div>
            </div>

            {/* Pet Verification Table */}
            <Card className="border-0 shadow-lg">
                <CardContent className="p-0">
                    {pets.length === 0 ? (
                        <div className="text-center py-12">
                            <PawPrint className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg font-medium">
                                No pending pet verifications
                            </p>
                            <p className="text-gray-400 text-sm mt-2">
                                All pets have been verified!
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                                        <TableHead className="w-[100px]">Image</TableHead>
                                        <TableHead>Pet Details</TableHead>
                                        <TableHead>Breed</TableHead>
                                        <TableHead>Age</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Seller</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pets.map((pet) => {
                                        const petId = pet._id || pet.id || '';
                                        const breedName = pet.breedName || pet.breedname || 'Unknown Breed';
                                        const sellerName = pet.sellerId?.userId?.name || pet.sellerId?.brandName || 'Unknown Seller';
                                        const location = pet.location ? `${pet.location.city || ''}${pet.location.city && pet.location.state ? ', ' : ''}${pet.location.state || ''}` : 'N/A';
                                        const ageDisplay = typeof pet.age === 'string' ? pet.age : `${pet.age} ${pet.age === 1 ? 'month' : 'months'}`;

                                        return (
                                            <TableRow key={petId} className="hover:bg-gray-50 transition-colors">
                                                <TableCell>
                                                    {pet.images && pet.images.length > 0 ? (
                                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                                            <img
                                                                src={pet.images[0]}
                                                                alt={pet.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                                                            <PawPrint className="w-8 h-8 text-gray-300" />
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 capitalize">{pet.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {pet.gender && <span className="capitalize">{pet.gender}</span>}
                                                        </p>
                                                        {pet.description && (
                                                            <p className="text-xs text-gray-400 mt-1 line-clamp-1 max-w-xs">
                                                                {pet.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm capitalize">{breedName}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm">{ageDisplay}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-semibold text-gray-900">
                                                        {pet.currency?.toUpperCase() || 'INR'} {pet.price.toLocaleString()}
                                                    </div>
                                                    {pet.vaccinationInfo && (
                                                        <p className="text-xs text-green-600 mt-1">
                                                            💉 {pet.vaccinationInfo}
                                                        </p>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm text-gray-600">{location}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{sellerName}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(pet.createdAt).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(pet.isVerified)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 justify-center">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => viewDetails(pet)}
                                                            className="text-xs"
                                                        >
                                                            Details
                                                        </Button>
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            className="bg-green-600 hover:bg-green-700 text-xs"
                                                            onClick={() => setVerifyDialog({
                                                                open: true,
                                                                petId
                                                            })}
                                                            disabled={loading}
                                                        >
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            Verify
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Details Dialog */}
            <AlertDialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                <AlertDialogContent className="max-w-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <PawPrint className="w-5 h-5" />
                            Pet Listing Details
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Complete information about the pet listing
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {selectedPet && (
                        <div className="space-y-4 py-4">
                            {/* Pet Images */}
                            {selectedPet.images && selectedPet.images.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2">
                                    {selectedPet.images.map((img, idx) => (
                                        <div key={idx} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                            <img src={img} alt={`${selectedPet.name} ${idx + 1}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                                    <PawPrint className="w-24 h-24 text-gray-300" />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Pet Name</label>
                                    <p className="text-gray-900 font-medium mt-1">{selectedPet.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Breed</label>
                                    <p className="text-gray-900 font-medium mt-1">{selectedPet.breedName}</p>
                                </div>
                                {selectedPet.gender && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Gender</label>
                                        <p className="text-gray-900 mt-1">{selectedPet.gender}</p>
                                    </div>
                                )}
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Age</label>
                                    <p className="text-gray-900 mt-1">{selectedPet.age} months</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Price</label>
                                    <p className="text-gray-900 font-semibold mt-1">
                                        {selectedPet.currency || 'INR'} {selectedPet.price.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Status</label>
                                    <div className="mt-1">{getStatusBadge(selectedPet.isVerified)}</div>
                                </div>
                                {selectedPet.location && (
                                    <div className="col-span-2">
                                        <label className="text-sm font-medium text-gray-600">Location</label>
                                        <p className="text-gray-900 mt-1">
                                            {[selectedPet.location.city, selectedPet.location.state, selectedPet.location.pincode]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Seller Name</label>
                                    <p className="text-gray-900 mt-1">
                                        {selectedPet.sellerId?.userId?.name || selectedPet.sellerId?.brandName || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Seller Email</label>
                                    <p className="text-gray-900 mt-1">{selectedPet.sellerId?.userId?.email || 'N/A'}</p>
                                </div>
                                {selectedPet.description && (
                                    <div className="col-span-2">
                                        <label className="text-sm font-medium text-gray-600">Description</label>
                                        <p className="text-gray-900 mt-1">{selectedPet.description}</p>
                                    </div>
                                )}
                                {selectedPet.vaccinationInfo && (
                                    <div className="col-span-2">
                                        <label className="text-sm font-medium text-gray-600">Vaccination Info</label>
                                        <p className="text-gray-900 mt-1">{selectedPet.vaccinationInfo}</p>
                                    </div>
                                )}
                                <div className="col-span-2">
                                    <label className="text-sm font-medium text-gray-600">Submitted On</label>
                                    <p className="text-gray-900 mt-1">
                                        {new Date(selectedPet.createdAt).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <AlertDialogFooter>
                        <AlertDialogCancel>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Verify Confirmation Dialog */}
            <AlertDialog
                open={verifyDialog.open}
                onOpenChange={(open) => setVerifyDialog({ ...verifyDialog, open })}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Verify Pet Listing</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to verify this pet listing? The pet will be marked as verified and become visible to buyers on the platform.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (verifyDialog.petId) {
                                    handleVerify(verifyDialog.petId);
                                }
                            }}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Verify
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default function PetVerificationPage() {
    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <PetVerificationContent />
        </ProtectedRoute>
    );
}
