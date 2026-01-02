"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
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
    Database,
    Plus,
    Trash2,
    Search,
    PawPrint,
    List,
    Loader2
} from 'lucide-react';
import {
    Species,
    Breed,
    SpeciesAnalytics,
    BreedAnalytics,
    getAllSpecies,
    getAllBreeds,
    createSpecies,
    createBreed,
    deleteSpecies as deleteSpeciesAPI,
    deleteBreed as deleteBreedAPI,
    fetchSpeciesAnalytics,
    fetchBreedsAnalytics
} from '@/services/admin/adminSpeciesService';

function SpeciesBreedsContent() {
    const router = useRouter();
    const [species, setSpecies] = useState<Species[]>([]);
    const [breeds, setBreeds] = useState<Breed[]>([]);
    const [speciesAnalytics, setSpeciesAnalytics] = useState<SpeciesAnalytics[]>([]);
    const [breedsAnalytics, setBreedsAnalytics] = useState<BreedAnalytics[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddSpeciesDialog, setShowAddSpeciesDialog] = useState(false);
    const [showAddBreedDialog, setShowAddBreedDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        type: 'species' | 'breed' | null;
        id: string | null;
        name: string | null;
    }>({
        open: false,
        type: null,
        id: null,
        name: null,
    });
    const [newSpeciesName, setNewSpeciesName] = useState('');
    const [newBreedName, setNewBreedName] = useState('');
    const [selectedSpeciesForBreed, setSelectedSpeciesForBreed] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (species.length === 0 && breeds.length === 0 && loading) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Parallel fetches including analytics
            const [speciesResponse, breedsResponse, speciesAnalyticsData, breedsAnalyticsData] = await Promise.all([
                getAllSpecies(),
                getAllBreeds(),
                fetchSpeciesAnalytics(),
                fetchBreedsAnalytics()
            ]);
            setSpecies(speciesResponse.species || []);
            setBreeds(breedsResponse.breeds || []);
            setSpeciesAnalytics(speciesAnalyticsData);
            setBreedsAnalytics(breedsAnalyticsData);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load species and breeds');
        } finally {
            setLoading(false);
        }
    };

    const handleAddSpecies = async () => {
        if (newSpeciesName.trim()) {
            try {
                const response = await createSpecies({
                    speciesName: newSpeciesName.trim(),
                    category: 'Mammal', // Default category
                });
                setSpecies([...species, response.species]);
                setNewSpeciesName('');
                setShowAddSpeciesDialog(false);
                toast.success(`Species "${response.species.name}" added successfully!`);
            } catch (error) {
                console.error('Error adding species:', error);
                toast.error('Failed to add species');
            }
        }
    };

    const handleAddBreed = async () => {
        if (newBreedName.trim() && selectedSpeciesForBreed) {
            try {
                // Get category and name from selected species
                const selectedSpecies = species.find(s => (s._id || s.id) === selectedSpeciesForBreed);
                const speciesName = selectedSpecies?.name || selectedSpecies?.speciesName || '';
                const category = selectedSpecies?.category || 'Mammal';
                const legalStatus = 'Allowed'; // Default to Allowed for quick add

                const response = await createBreed(
                    newBreedName.trim(),
                    speciesName, // Send species name instead of ID
                    category,
                    legalStatus,
                    undefined, // origin
                    false,     // isNative
                    undefined  // description
                );
                setBreeds([...breeds, response.breed]);
                setSpecies(species.map(s =>
                    s.id === selectedSpeciesForBreed
                        ? { ...s, breedCount: (s.breedCount ?? 0) + 1 }
                        : s
                ));
                setNewBreedName('');
                setSelectedSpeciesForBreed('');
                setShowAddBreedDialog(false);
                toast.success(`Breed "${response.breed.name}" added successfully!`);
            } catch (error) {
                console.error('Failed to create breed:', error);
                toast.error('Failed to add breed');
            }
        }
    };

    const handleDeleteSpecies = async (id: string) => {
        try {
            await deleteSpeciesAPI(id);
            setSpecies(species.filter(s => s.id !== id));
            setBreeds(breeds.filter(b => b.speciesId !== id));
            setDeleteDialog({ open: false, type: null, id: null, name: null });
            toast.success('Species deleted successfully');
        } catch (error) {
            console.error('Failed to delete species:', error);
            toast.error('Failed to delete species');
        }
    };

    const handleDeleteBreed = async (id: string) => {
        try {
            const breed = breeds.find(b => b.id === id);
            await deleteBreedAPI(id);
            if (breed) {
                setBreeds(breeds.filter(b => b.id !== id));
                setSpecies(species.map(s =>
                    s.id === breed.speciesId
                        ? { ...s, breedCount: Math.max(0, (s.breedCount ?? 0) - 1) }
                        : s
                ));
            }
            setDeleteDialog({ open: false, type: null, id: null, name: null });
            toast.success('Breed deleted successfully');
        } catch (error) {
            console.error('Failed to delete breed:', error);
            toast.error('Failed to delete breed');
        }
    };

    const filteredBreeds = (breeds || []).filter(breed =>
        breed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (breed.speciesName ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                <h1 className="text-3xl font-bold text-gray-900">Species & Breeds</h1>
                <p className="text-gray-600 mt-1">Manage available species and breeds on the platform</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Species</p>
                                <p className="text-3xl font-bold text-blue-600">{species.length}</p>
                            </div>
                            <Database className="w-10 h-10 text-blue-600 opacity-20" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Breeds</p>
                                <p className="text-3xl font-bold text-purple-600">{breeds.length}</p>
                            </div>
                            <List className="w-10 h-10 text-purple-600 opacity-20" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="species" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[300px]">
                    <TabsTrigger value="species">Species</TabsTrigger>
                    <TabsTrigger value="breeds">Breeds</TabsTrigger>
                </TabsList>

                {/* Species Tab */}
                <TabsContent value="species" className="mt-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">All Species</h3>
                        <div className="flex gap-2">
                            <Button onClick={() => router.push('/admin/species-breeds/add-species')}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Species
                            </Button>
                            <Button onClick={() => setShowAddSpeciesDialog(true)} variant="outline">
                                <Plus className="w-4 h-4 mr-2" />
                                Quick Add
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(species || []).map((item) => {
                            // Find analytics for this species
                            const analytics = speciesAnalytics.find(a => a._id === (item._id || item.id));

                            return (
                                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                <PawPrint className="w-5 h-5 text-primary" />
                                                <CardTitle className="text-lg">{item.name}</CardTitle>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => setDeleteDialog({
                                                    open: true,
                                                    type: 'species',
                                                    id: item.id || item._id || null,
                                                    name: item.name,
                                                })}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Total Breeds:</span>
                                                <Badge variant="secondary">
                                                    {analytics?.totalBreeds ?? 0}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Total Listings:</span>
                                                <Badge variant="secondary">
                                                    {analytics?.totalListings ?? 0}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Verified:</span>
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                    {analytics?.verifiedListings ?? 0}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Pending:</span>
                                                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                                    {analytics?.pendingListings ?? 0}
                                                </Badge>
                                            </div>
                                            {item.category && (
                                                <div className="pt-2 border-t">
                                                    <Badge variant="outline" className="text-xs">{item.category}</Badge>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>

                {/* Breeds Tab */}
                <TabsContent value="breeds" className="mt-6 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search breeds..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={() => router.push('/admin/species-breeds/add-breed')}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Breed
                            </Button>
                            <Button onClick={() => setShowAddBreedDialog(true)} variant="outline">
                                <Plus className="w-4 h-4 mr-2" />
                                Quick Add
                            </Button>
                        </div>
                    </div>

                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-0">
                            {filteredBreeds.length === 0 ? (
                                <div className="text-center py-12">
                                    <List className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No breeds found</p>
                                    <p className="text-gray-400 text-sm mt-2">
                                        {searchQuery ? 'Try adjusting your search' : 'Add your first breed to get started'}
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50 hover:bg-gray-50">
                                                <TableHead>Breed Name</TableHead>
                                                <TableHead>Species</TableHead>
                                                <TableHead>Total Listings</TableHead>
                                                <TableHead>Verified</TableHead>
                                                <TableHead>Pending</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredBreeds.map((breed) => {
                                                // Find analytics for this breed
                                                const analytics = breedsAnalytics.find(a => a._id === (breed._id || breed.id));

                                                return (
                                                    <TableRow key={breed.id} className="hover:bg-gray-50 transition-colors">
                                                        <TableCell>
                                                            <span className="font-medium text-gray-900">{breed.name}</span>
                                                        </TableCell>
                                                        <TableCell>
                                                            {analytics?.species?.name ? (
                                                                <Badge variant="outline">{analytics.species.name}</Badge>
                                                            ) : breed.speciesName ? (
                                                                <Badge variant="outline">{breed.speciesName}</Badge>
                                                            ) : (
                                                                <Badge variant="secondary" className="bg-gray-100 text-gray-500">Not Linked</Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="font-medium text-gray-900">
                                                                {analytics?.totalListings ?? 0}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                                {analytics?.verifiedListings ?? 0}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                                                {analytics?.pendingListings ?? 0}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                onClick={() => setDeleteDialog({
                                                                    open: true,
                                                                    type: 'breed',
                                                                    id: breed.id || breed._id || null,
                                                                    name: breed.name,
                                                                })}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
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
                </TabsContent >
            </Tabs >

            {/* Add Species Dialog */}
            < AlertDialog open={showAddSpeciesDialog} onOpenChange={setShowAddSpeciesDialog} >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Add New Species</AlertDialogTitle>
                        <AlertDialogDescription>
                            Enter the name of the new species you want to add to the platform.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                        <Input
                            placeholder="Species name (e.g., Dog, Cat, Bird)"
                            value={newSpeciesName}
                            onChange={(e) => setNewSpeciesName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddSpecies();
                                }
                            }}
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setNewSpeciesName('')}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleAddSpecies}>Add Species</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog >

            {/* Add Breed Dialog */}
            < AlertDialog open={showAddBreedDialog} onOpenChange={setShowAddBreedDialog} >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Add New Breed</AlertDialogTitle>
                        <AlertDialogDescription>
                            Select a species and enter the breed name.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Species</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={selectedSpeciesForBreed}
                                onChange={(e) => setSelectedSpeciesForBreed(e.target.value)}
                            >
                                <option value="">Select a species</option>
                                {species.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Breed Name</label>
                            <Input
                                placeholder="Breed name (e.g., Golden Retriever, Persian)"
                                value={newBreedName}
                                onChange={(e) => setNewBreedName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && selectedSpeciesForBreed) {
                                        handleAddBreed();
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setNewBreedName('');
                            setSelectedSpeciesForBreed('');
                        }}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleAddBreed}
                            disabled={!selectedSpeciesForBreed || !newBreedName.trim()}
                        >
                            Add Breed
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog >

            {/* Delete Confirmation Dialog */}
            < AlertDialog
                open={deleteDialog.open}
                onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete {deleteDialog.type === 'species' ? 'Species' : 'Breed'}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {deleteDialog.type === 'species'
                                ? `Are you sure you want to delete "${deleteDialog.name}"? This will also delete all associated breeds. This action cannot be undone.`
                                : `Are you sure you want to delete "${deleteDialog.name}"? This action cannot be undone.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deleteDialog.id) {
                                    deleteDialog.type === 'species'
                                        ? handleDeleteSpecies(deleteDialog.id)
                                        : handleDeleteBreed(deleteDialog.id);
                                }
                            }}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog >
        </div >
    );
}

export default function SpeciesBreedsPage() {
    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <SpeciesBreedsContent />
        </ProtectedRoute>
    );
}
