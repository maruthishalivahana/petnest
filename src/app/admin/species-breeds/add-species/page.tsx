'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { createSpecies, type CreateSpeciesPayload } from '@/services/admin/adminSpeciesService';

export default function AddSpeciesPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<CreateSpeciesPayload>({
        speciesName: '',
        category: 'Mammal',
        scientificName: '',
        protectionLevel: 'Not protected',
        allowedForTrade: true,
        referenceAct: '',
        notes: '',
    });

    const [errors, setErrors] = useState<{ speciesName?: string }>({});

    const handleInputChange = (field: keyof CreateSpeciesPayload, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (field === 'speciesName' && value) {
            setErrors(prev => ({ ...prev, speciesName: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { speciesName?: string } = {};

        if (!formData.speciesName.trim()) {
            newErrors.speciesName = 'Species name is required';
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
            // Prepare payload - only include fields with values
            const payload: CreateSpeciesPayload = {
                speciesName: formData.speciesName.trim(),
                category: formData.category,
            };

            if (formData.scientificName?.trim()) {
                payload.scientificName = formData.scientificName.trim();
            }

            if (formData.protectionLevel) {
                payload.protectionLevel = formData.protectionLevel;
            }

            payload.allowedForTrade = formData.allowedForTrade;

            if (formData.referenceAct?.trim()) {
                payload.referenceAct = formData.referenceAct.trim();
            }

            if (formData.notes?.trim()) {
                payload.notes = formData.notes.trim();
            }

            await createSpecies(payload);

            toast.success('Species created successfully!');

            // Reset form
            setFormData({
                speciesName: '',
                category: 'Mammal',
                scientificName: '',
                protectionLevel: 'Not protected',
                allowedForTrade: true,
                referenceAct: '',
                notes: '',
            });

            // Redirect to species list after short delay
            setTimeout(() => {
                router.push('/admin/species-breeds');
            }, 1000);

        } catch (error: any) {
            console.error('Error creating species:', error);
            const errorMessage = error?.response?.data?.message || 'Failed to create species';
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
            <div className="max-w-3xl mx-auto">
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
                    <h1 className="text-3xl font-bold text-gray-900">Add New Species</h1>
                    <p className="text-gray-600 mt-2">Create a new species entry for the platform</p>
                </div>

                {/* Form Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Species Information</CardTitle>
                        <CardDescription>
                            Fill in the details below. Fields marked with * are required.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Basic Information Section */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                                </div>

                                {/* Species Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="speciesName">
                                        Species Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="speciesName"
                                        placeholder="e.g., Dog, Cat, Parrot"
                                        value={formData.speciesName}
                                        onChange={(e) => handleInputChange('speciesName', e.target.value)}
                                        className={errors.speciesName ? 'border-red-500' : ''}
                                    />
                                    {errors.speciesName && (
                                        <p className="text-sm text-red-500">{errors.speciesName}</p>
                                    )}
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
                                    <p className="text-sm text-gray-500">Animal classification category</p>
                                </div>

                                {/* Scientific Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="scientificName">Scientific Name</Label>
                                    <Input
                                        id="scientificName"
                                        placeholder="e.g., Canis familiaris"
                                        value={formData.scientificName}
                                        onChange={(e) => handleInputChange('scientificName', e.target.value)}
                                    />
                                    <p className="text-sm text-gray-500">Optional: Latin or scientific classification</p>
                                </div>
                            </div>

                            {/* Legal & Trade Information Section */}
                            <div className="space-y-4 pt-6 border-t">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Legal & Trade Information</h3>
                                    <p className="text-sm text-gray-600">
                                        Specify legal restrictions and trade permissions for this species
                                    </p>
                                </div>

                                {/* Protection Level */}
                                <div className="space-y-2">
                                    <Label htmlFor="protectionLevel">Protection Level</Label>
                                    <Select
                                        value={formData.protectionLevel}
                                        onValueChange={(value) => handleInputChange('protectionLevel', value)}
                                    >
                                        <SelectTrigger id="protectionLevel">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Not protected">Not Protected</SelectItem>
                                            <SelectItem value="Protected">Protected</SelectItem>
                                            <SelectItem value="Endangered">Endangered</SelectItem>
                                            <SelectItem value="Restricted">Restricted</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-gray-500">
                                        Legal protection status under wildlife conservation laws
                                    </p>
                                </div>

                                {/* Allowed for Trade */}
                                <div className="flex items-center justify-between space-x-4 py-2">
                                    <div className="space-y-0.5 flex-1">
                                        <Label htmlFor="allowedForTrade">Allowed for Trade</Label>
                                        <p className="text-sm text-gray-500">
                                            Can this species be legally bought and sold on the platform?
                                        </p>
                                    </div>
                                    <Switch
                                        id="allowedForTrade"
                                        checked={formData.allowedForTrade}
                                        onCheckedChange={(checked) => handleInputChange('allowedForTrade', checked)}
                                    />
                                </div>

                                {/* Reference Act */}
                                <div className="space-y-2">
                                    <Label htmlFor="referenceAct">Reference Act / Regulation</Label>
                                    <Input
                                        id="referenceAct"
                                        placeholder="e.g., Wildlife Protection Act 1972"
                                        value={formData.referenceAct}
                                        onChange={(e) => handleInputChange('referenceAct', e.target.value)}
                                    />
                                    <p className="text-sm text-gray-500">
                                        Legal document or act governing this species
                                    </p>
                                </div>

                                {/* Notes */}
                                <div className="space-y-2">
                                    <Label htmlFor="notes">
                                        Additional Notes
                                    </Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="Any additional information about this species..."
                                        value={formData.notes}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 300) {
                                                handleInputChange('notes', e.target.value);
                                            }
                                        }}
                                        rows={4}
                                        className="resize-none"
                                    />
                                    <p className="text-sm text-gray-500 text-right">
                                        {formData.notes?.length || 0}/300 characters
                                    </p>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center gap-4 pt-6 border-t">
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
                                        'Create Species'
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
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
