'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { getAllBreedNames, addPetListing } from '@/services/petApi';
import { getCurrentSellerDetails } from '@/services/seller';

export default function AddPetPage() {
    const router = useRouter();
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [breedNames, setBreedNames] = useState<string[]>([]);
    const [isLoadingBreeds, setIsLoadingBreeds] = useState(true);
    const [sellerVerified, setSellerVerified] = useState<boolean | null>(null);
    const [checkingStatus, setCheckingStatus] = useState(true);

    useEffect(() => {
        // Check seller verification status
        const checkSellerStatus = async () => {
            try {
                const sellerData = await getCurrentSellerDetails();
                console.log('Seller details:', sellerData);

                const status = sellerData?.status;
                console.log('Seller status:', status, 'Is verified:', status === 'verified');

                setSellerVerified(status === 'verified');
            } catch (error) {
                console.error('Error checking seller status:', error);
                // If no seller profile exists, they're not verified
                setSellerVerified(false);
            } finally {
                setCheckingStatus(false);
            }
        };

        checkSellerStatus();

        getAllBreedNames().then((names) => {
            console.log('All breed names:', names);
            setBreedNames(names);
            setIsLoadingBreeds(false);
        });
    }, []);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<PetListingFormData>({
        resolver: zodResolver(petListingSchema) as Resolver<PetListingFormData>,
        mode: 'onChange',
        defaultValues: {
            currency: 'INR',
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFileArray = Array.from(files);
            // Append new files to existing ones
            const updatedImages = [...selectedImages, ...newFileArray];
            setSelectedImages(updatedImages);

            // Create preview URLs for new images
            const newPreviews = newFileArray.map(file => URL.createObjectURL(file));
            setImagePreviews([...imagePreviews, ...newPreviews]);

            // Update form value with all images
            const dataTransfer = new DataTransfer();
            updatedImages.forEach((file) => dataTransfer.items.add(file));
            setValue('images', dataTransfer.files, { shouldValidate: true });
        }

        // Reset input value to allow selecting the same file again
        e.target.value = '';
    };

    const removeImage = (index: number) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);

        // Revoke the URL to free memory
        URL.revokeObjectURL(imagePreviews[index]);

        setSelectedImages(newImages);
        setImagePreviews(newPreviews);

        const dataTransfer = new DataTransfer();
        newImages.forEach((file) => dataTransfer.items.add(file));
        setValue('images', dataTransfer.files, { shouldValidate: true });
    };

    const onSubmit = async (data: PetListingFormData) => {
        // Check if seller is verified
        if (sellerVerified === false) {
            toast.error('Your seller account is not verified yet. Please wait for admin approval before adding pets.', {
                duration: 5000,
                description: 'You can check your verification status in the Verification section.'
            });
            return;
        }

        if (sellerVerified === null) {
            toast.error('Unable to verify seller status. Please try again.', {
                duration: 5000
            });
            return;
        }

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

            // Submit to backend
            const response = await addPetListing(formData);

            if (response.success) {
                toast.success(response.message);
                // Redirect to listings page
                setTimeout(() => {
                    router.push('/seller/listings');
                }, 1000);
            } else {
                toast.error(response.message);
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to create listing');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading while checking status
    if (checkingStatus) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

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
                    {sellerVerified === false && (
                        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm text-amber-800">
                                <strong>⚠️ Verification Required:</strong> Your seller account is pending verification.
                                You won't be able to publish listings until approved by admin.
                            </p>
                        </div>
                    )}
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
                                            disabled={isLoadingBreeds}
                                        >
                                            <SelectTrigger className={errors.breedName ? 'border-red-500' : ''}>
                                                <SelectValue placeholder={isLoadingBreeds ? 'Loading breeds...' : 'Select breed'} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {breedNames.length > 0 ? (
                                                    breedNames.map((breed) => (
                                                        <SelectItem key={breed} value={breed}>
                                                            {breed}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <div className="p-2 text-sm text-slate-500">
                                                        {isLoadingBreeds ? 'Loading breeds...' : 'No breeds available'}
                                                    </div>
                                                )}
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
                                            onValueChange={(value) => setValue('gender', value as 'male' | 'female', { shouldValidate: true })}
                                        >
                                            <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">male</SelectItem>
                                                <SelectItem value="female">female</SelectItem>
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
                                        <div>
                                            <p className="text-sm text-slate-600 mb-3">
                                                {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected
                                            </p>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                                {selectedImages.map((file, index) => (
                                                    <div key={index} className="relative group">
                                                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-slate-200">
                                                            <img
                                                                src={imagePreviews[index]}
                                                                alt={`Preview ${index + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                        <p className="text-xs text-slate-500 mt-1 truncate">{file.name}</p>
                                                    </div>
                                                ))}
                                            </div>
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
