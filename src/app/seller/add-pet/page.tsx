'use client';

import { useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { petListingSchema, PetListingFormData } from '@/Validations/pet.validations';
import { Upload, Loader2, PawPrint, X } from 'lucide-react';
import { toast } from 'sonner';

const BREED_OPTIONS = [
    'Indian Dog',
    'Labrador',
    'German Shepherd',
    'Golden Retriever',
    'Bulldog',
    'Beagle',
    'Poodle',
    'Rottweiler',
    'Husky',
    'Pomeranian',
];

export default function AddPetPage() {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<PetListingFormData>({
        resolver: zodResolver(petListingSchema) as Resolver<PetListingFormData>,
        defaultValues: {
            currency: 'INR',
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const fileArray = Array.from(files);
            setSelectedImages(fileArray);
            setValue('images', files, { shouldValidate: true });
        }
    };

    const removeImage = (index: number) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        setSelectedImages(newImages);

        const dataTransfer = new DataTransfer();
        newImages.forEach((file) => dataTransfer.items.add(file));
        setValue('images', dataTransfer.files, { shouldValidate: true });
    };

    const onSubmit = async (data: PetListingFormData) => {
        try {
            setIsSubmitting(true);

            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('breedName', data.breedName);
            formData.append('gender', data.gender);
            formData.append('age', data.age.toString());
            formData.append('price', data.price.toString());
            formData.append('currency', data.currency);
            formData.append('location[city]', data.location.city);
            formData.append('location[state]', data.location.state);
            formData.append('location[pincode]', data.location.pincode);
            formData.append('description', data.description);
            if (data.vaccinationInfo) {
                formData.append('vaccinationInfo', data.vaccinationInfo);
            }

            Array.from(data.images).forEach((file: File) => {
                formData.append('images', file);
            });

            console.log('Form Data Ready:', Object.fromEntries(formData));
            toast.success('Pet listing created successfully!');

        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to create listing');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <PawPrint className="h-5 w-5 text-primary" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                            Add New Pet Listing
                        </h1>
                    </div>
                    <p className="text-slate-600">
                        Fill in the details below to list your pet for sale
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Card className="p-6 sm:p-8 mb-20 sm:mb-6">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                                    Basic Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Pet Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            placeholder="e.g., Bruno"
                                            {...register('name')}
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-500">{errors.name.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="breedName">
                                            Breed <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            onValueChange={(value) => setValue('breedName', value, { shouldValidate: true })}
                                        >
                                            <SelectTrigger className={errors.breedName ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Select breed" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {BREED_OPTIONS.map((breed) => (
                                                    <SelectItem key={breed} value={breed}>
                                                        {breed}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.breedName && (
                                            <p className="text-sm text-red-500">{errors.breedName.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="gender">
                                            Gender <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            onValueChange={(value) => setValue('gender', value as 'Male' | 'Female', { shouldValidate: true })}
                                        >
                                            <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Male">Male</SelectItem>
                                                <SelectItem value="Female">Female</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.gender && (
                                            <p className="text-sm text-red-500">{errors.gender.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="age">
                                            Age (months) <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="age"
                                            type="number"
                                            placeholder="e.g., 6"
                                            {...register('age')}
                                            className={errors.age ? 'border-red-500' : ''}
                                        />
                                        {errors.age && (
                                            <p className="text-sm text-red-500">{errors.age.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 mb-4">Pricing</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">
                                            Price <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            placeholder="e.g., 25000"
                                            {...register('price')}
                                            className={errors.price ? 'border-red-500' : ''}
                                        />
                                        {errors.price && (
                                            <p className="text-sm text-red-500">{errors.price.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="currency">Currency</Label>
                                        <Select
                                            defaultValue="INR"
                                            onValueChange={(value) => setValue('currency', value as 'INR' | 'USD')}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="INR">INR (₹)</SelectItem>
                                                <SelectItem value="USD">USD ($)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 mb-4">Location</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">
                                            City <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="city"
                                            placeholder="e.g., Mumbai"
                                            {...register('location.city')}
                                            className={errors.location?.city ? 'border-red-500' : ''}
                                        />
                                        {errors.location?.city && (
                                            <p className="text-sm text-red-500">{errors.location.city.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="state">
                                            State <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="state"
                                            placeholder="e.g., Maharashtra"
                                            {...register('location.state')}
                                            className={errors.location?.state ? 'border-red-500' : ''}
                                        />
                                        {errors.location?.state && (
                                            <p className="text-sm text-red-500">{errors.location.state.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="pincode">
                                            Pincode <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="pincode"
                                            placeholder="e.g., 400001"
                                            maxLength={6}
                                            {...register('location.pincode')}
                                            className={errors.location?.pincode ? 'border-red-500' : ''}
                                        />
                                        {errors.location?.pincode && (
                                            <p className="text-sm text-red-500">{errors.location.pincode.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                                    Health & Details
                                </h2>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="vaccinationInfo">Vaccination Information</Label>
                                        <Textarea
                                            id="vaccinationInfo"
                                            placeholder="List all vaccinations and dates (optional)"
                                            rows={3}
                                            {...register('vaccinationInfo')}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">
                                            Description <span className="text-red-500">*</span>
                                        </Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Describe your pet's personality, behavior, and any special care instructions"
                                            rows={5}
                                            {...register('description')}
                                            className={errors.description ? 'border-red-500' : ''}
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-red-500">{errors.description.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                                    Images <span className="text-red-500">*</span>
                                </h2>
                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                                        <input
                                            type="file"
                                            id="images"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="images"
                                            className="cursor-pointer flex flex-col items-center gap-2"
                                        >
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Upload className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">
                                                    Click to upload images
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    PNG, JPG up to 10MB each
                                                </p>
                                            </div>
                                        </label>
                                    </div>

                                    {selectedImages.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedImages.map((file, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="px-3 py-2 text-sm flex items-center gap-2"
                                                >
                                                    {file.name}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="hover:text-red-600 transition-colors"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}

                                    {errors.images && (
                                        <p className="text-sm text-red-500">{errors.images.message as string}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="fixed bottom-0 left-0 right-0 sm:relative bg-white border-t sm:border-0 p-4 sm:p-0 shadow-lg sm:shadow-none z-10">
                        <div className="max-w-4xl mx-auto flex gap-3 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isSubmitting}
                                className="flex-1 sm:flex-none"
                            >
                                Cancel
                            </Button>
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
                                    'Create Listing'
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
