'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, PawPrint } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { createBreed, getAllSpecies, type Species } from '@/services/admin/adminSpeciesService';

interface CreateBreedPayload {
    name: string;
    speciesId: string;
    category: string;
    legalStatus: string;
    origin?: string;
    isNative: boolean;
    description?: string;
}

export default function AddBreedPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingSpecies, setIsLoadingSpecies] = useState(true);
    const [species, setSpecies] = useState<Species[]>([]);

    const [formData, setFormData] = useState<CreateBreedPayload>({
        name: '',
        speciesId: '',
        category: 'Mammal',
        legalStatus: 'Allowed',
        origin: '',
        isNative: false,
        description: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof CreateBreedPayload, string>>>({});

    // Load species on mount
    useEffect(() => {
        fetchSpecies();
    }, []);

    const fetchSpecies = async () => {
        try {
            setIsLoadingSpecies(true);
            const response = await getAllSpecies();
            setSpecies(response.species || []);
        } catch (error) {
            console.error('Error fetching species:', error);
            toast.error('Failed to load species list');
        } finally {
            setIsLoadingSpecies(false);
        }
    };

    const handleInputChange = (field: keyof CreateBreedPayload, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof CreateBreedPayload, string>> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Breed name is required';
        }

        if (!formData.speciesId) {
            newErrors.speciesId = 'Species selection is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Get species name from selected species
            const selectedSpecies = species.find(s => (s._id || s.id) === formData.speciesId);
            const speciesName = selectedSpecies?.name || selectedSpecies?.speciesName || '';

            await createBreed(
                formData.name.trim(),
                speciesName, // Send species name instead of ID
                formData.category,
                formData.legalStatus,
                formData.origin?.trim() || undefined,
                formData.isNative,
                formData.description?.trim() || undefined
            );

            toast.success(`Breed "${formData.name}" added to ${selectedSpecies?.name || 'species'}!`);

            // Reset form
            setFormData({
                name: '',
                speciesId: '',
                category: 'Mammal',
                legalStatus: 'Allowed',
                origin: '',
                isNative: false,
                description: '',
            });

            // Redirect to species list after short delay
            setTimeout(() => {
                router.push('/admin/species-breeds?tab=breeds');
            }, 1000);

        } catch (error: any) {
            console.error('Error creating breed:', error);
            const errorMessage = error?.response?.data?.message || 'Failed to create breed';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push('/admin/species-breeds');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={handleCancel}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Species & Breeds
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900">Add New Breed</h1>
                    <p className="text-gray-600 mt-2">Create a new breed entry for an existing species</p>
                </div>

                {/* Form Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Breed Information</CardTitle>
                        <CardDescription>
                            Fill in the details below. All fields are required.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoadingSpecies ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                <span className="ml-2 text-gray-600">Loading species...</span>
                            </div>
                        ) : species.length === 0 ? (
                            <div className="text-center py-8">
                                <PawPrint className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600 mb-4">No species found. Please add a species first.</p>
                                <Button onClick={() => router.push('/admin/species-breeds/add-species')}>
                                    Add Species
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Species Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="speciesId">
                                        Species <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={formData.speciesId}
                                        onValueChange={(value) => handleInputChange('speciesId', value)}
                                    >
                                        <SelectTrigger
                                            id="speciesId"
                                            className={errors.speciesId ? 'border-red-500' : ''}
                                        >
                                            <SelectValue placeholder="Select a species" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {species.map((sp) => (
                                                <SelectItem
                                                    key={sp._id || sp.id}
                                                    value={sp._id || sp.id || ''}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span>{sp.name}</span>
                                                        {sp.category && (
                                                            <span className="text-xs text-gray-500">({sp.category})</span>
                                                        )}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.speciesId && (
                                        <p className="text-sm text-red-500">{errors.speciesId}</p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        Select the species this breed belongs to
                                    </p>
                                </div>

                                {/* Breed Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Breed Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g., Labrador Retriever, Persian, African Grey"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name}</p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        Enter the specific breed name
                                    </p>
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label htmlFor="category">
                                        Category <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => handleInputChange('category', value)}
                                    >
                                        <SelectTrigger id="category">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Mammal">Mammal</SelectItem>
                                            <SelectItem value="Bird">Bird</SelectItem>
                                            <SelectItem value="Reptile">Reptile</SelectItem>
                                            <SelectItem value="Fish">Fish</SelectItem>
                                            <SelectItem value="Amphibian">Amphibian</SelectItem>
                                            <SelectItem value="Invertebrate">Invertebrate</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-gray-500">
                                        Animal classification category
                                    </p>
                                </div>

                                {/* Legal Status */}
                                <div className="space-y-2">
                                    <Label htmlFor="legalStatus">
                                        Legal Status <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={formData.legalStatus}
                                        onValueChange={(value) => handleInputChange('legalStatus', value)}
                                    >
                                        <SelectTrigger id="legalStatus">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Allowed">Allowed</SelectItem>
                                            <SelectItem value="Restricted">Restricted</SelectItem>
                                            <SelectItem value="Protected">Protected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-gray-500">
                                        Legal trade status for this breed
                                    </p>
                                </div>

                                {/* Origin */}
                                <div className="space-y-2">
                                    <Label htmlFor="origin">Origin / Country</Label>
                                    <Input
                                        id="origin"
                                        placeholder="e.g., Canada, India, Africa"
                                        value={formData.origin}
                                        onChange={(e) => handleInputChange('origin', e.target.value)}
                                    />
                                    <p className="text-sm text-gray-500">
                                        Country or region where this breed originated
                                    </p>
                                </div>

                                {/* Is Native */}
                                <div className="flex items-center justify-between space-x-4 py-2">
                                    <div className="space-y-0.5 flex-1">
                                        <Label htmlFor="isNative">Native to Region</Label>
                                        <p className="text-sm text-gray-500">
                                            Is this breed native to your local region?
                                        </p>
                                    </div>
                                    <Switch
                                        id="isNative"
                                        checked={formData.isNative}
                                        onCheckedChange={(checked) => handleInputChange('isNative', checked)}
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Brief description of the breed's characteristics..."
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        rows={3}
                                        className="resize-none"
                                    />
                                    <p className="text-sm text-gray-500">
                                        Optional: Key characteristics or traits of this breed
                                    </p>
                                </div>

                                {/* Preview */}
                                {formData.speciesId && formData.name && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-sm text-blue-700 font-medium mb-1">Preview:</p>
                                        <p className="text-blue-900">
                                            <span className="font-semibold">{formData.name}</span>
                                            {' - '}
                                            <span className="text-blue-700">
                                                {species.find(s => (s._id || s.id) === formData.speciesId)?.name}
                                            </span>
                                        </p>
                                    </div>
                                )}

                                {/* Form Actions */}
                                <div className="flex items-center gap-4 pt-4 border-t">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 sm:flex-none"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            'Create Breed'
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCancel}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
