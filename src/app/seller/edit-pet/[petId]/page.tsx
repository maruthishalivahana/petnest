'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2, PawPrint, Upload, X, ArrowLeft } from 'lucide-react';
import { getPetById, updatePetListing, getAllBreedNames, type Pet } from '@/services/petApi';
import { getSellerPetById } from '@/services/seller';
import { editPetListingSchema, type EditPetListingFormData } from '@/Validations/pet.validations';
import Link from 'next/link';

export default function EditPetPage() {
    const router = useRouter();
    const params = useParams();
    const petId = params?.petId as string;

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [petData, setPetData] = useState<Pet | null>(null);
    const [breedNames, setBreedNames] = useState<string[]>([]);
    const [isLoadingBreeds, setIsLoadingBreeds] = useState(false);

    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [removedImages, setRemovedImages] = useState<string[]>([]);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<EditPetListingFormData>({
        resolver: zodResolver(editPetListingSchema) as Resolver<EditPetListingFormData>,
        mode: 'onChange',
        defaultValues: {
            currency: 'INR',
        },
    });

    useEffect(() => {
        const fetchPetData = async () => {
            try {
                setIsLoading(true);
                console.log('Fetching seller pet with ID:', petId);

                // Try seller endpoint (auth via cookie)
                const pet = await getSellerPetById(petId);
                console.log('Seller pet fetch response:', pet);

                if (pet) {
                    console.log('Pet data received:', pet);
                    console.log('Location data:', pet.location);
                    console.log('Location type:', typeof pet.location);
                    setPetData(pet);
                    setExistingImages(pet.images || []);

                    // Pre-populate form with safeguards
                    if (pet.name) setValue('name', pet.name);
                    if (pet.breedName) setValue('breedName', pet.breedName);
                    if (pet.gender) setValue('gender', pet.gender as 'male' | 'female');
                    if (pet.age) setValue('age', parseInt(String(pet.age)) || 0);
                    if (pet.price) setValue('price', pet.price);
                    if (pet.currency) setValue('currency', pet.currency as 'INR' | 'USD');

                    // Handle location - parse if it's a JSON string
                    if (pet.location) {
                        let locationData = pet.location;

                        // If location is a string, try to parse it
                        if (typeof pet.location === 'string') {
                            try {
                                locationData = JSON.parse(pet.location);
                                console.log('✅ Parsed location from JSON string:', locationData);
                            } catch (e) {
                                console.error('❌ Failed to parse location JSON:', e);
                                console.log('Location string value:', pet.location);
                            }
                        }

                        // Now set the values if we have a valid object
                        if (locationData && typeof locationData === 'object') {
                            if (locationData.city) {
                                setValue('location.city', locationData.city);
                                console.log('✅ Set city:', locationData.city);
                            }
                            if (locationData.state) {
                                setValue('location.state', locationData.state);
                                console.log('✅ Set state:', locationData.state);
                            }
                            if (locationData.pincode) {
                                setValue('location.pincode', locationData.pincode);
                                console.log('✅ Set pincode:', locationData.pincode);
                            }
                        } else {
                            console.warn('⚠️ Location data is not in expected format:', locationData);
                        }
                    } else {
                        console.warn('⚠️ No location data available in pet object');
                    }

                    if (pet.description) setValue('description', pet.description);
                    if (pet.vaccinationInfo) setValue('vaccinationInfo', pet.vaccinationInfo);
                } else {
                    console.error('Pet not found or does not belong to seller');
                    toast.error('Pet not found or you do not have permission to edit it');
                    setTimeout(() => router.push('/seller/listings'), 2000);
                }
            } catch (error: any) {
                console.error('Error fetching pet:', error);

                // Handle specific error cases
                if (error.response?.status === 401) {
                    toast.error('Session expired. Please login again.');
                    setTimeout(() => router.push('/login'), 2000);
                } else if (error.response?.status === 403) {
                    toast.error('Access denied. You may not be registered as a seller or this pet does not belong to you.');
                    setTimeout(() => router.push('/seller/listings'), 2000);
                } else if (error.response?.data?.message) {
                    toast.error(error.response.data.message);
                    setTimeout(() => router.push('/seller/listings'), 2000);
                } else {
                    toast.error('Failed to load pet details. Please try again.');
                    setTimeout(() => router.push('/seller/listings'), 2000);
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (petId) {
            fetchPetData();
        }
    }, [petId, router, setValue]);

    useEffect(() => {
        const fetchBreeds = async () => {
            try {
                setIsLoadingBreeds(true);
                const names = await getAllBreedNames();
                setBreedNames(names);
            } catch (error) {
                console.error('Error fetching breeds:', error);
            } finally {
                setIsLoadingBreeds(false);
            }
        };

        fetchBreeds();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files);
        setSelectedImages((prev) => [...prev, ...newFiles]);

        newFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeNewImage = (index: number) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);

        URL.revokeObjectURL(imagePreviews[index]);

        setSelectedImages(newImages);
        setImagePreviews(newPreviews);
    };

    const removeExistingImage = (imageUrl: string) => {
        setRemovedImages((prev) => [...prev, imageUrl]);
        setExistingImages((prev) => prev.filter((url) => url !== imageUrl));
    };

    const onSubmit = async (data: EditPetListingFormData) => {
        console.log('Update button clicked - Form submitted');
        console.log('Form data:', data);
        console.log('Existing images:', existingImages.length);
        console.log('New images to upload:', selectedImages.length);

        try {
            setIsSubmitting(true);

            // Check if at least one image exists (existing or new)
            if (existingImages.length === 0 && selectedImages.length === 0) {
                toast.error('Please keep at least one image or upload a new one');
                setIsSubmitting(false);
                return;
            }

            const formData = new FormData();

            // Append all form fields
            formData.append('name', data.name);
            formData.append('breedName', data.breedName);
            formData.append('gender', data.gender);
            formData.append('age', data.age.toString());
            formData.append('price', data.price.toString());
            formData.append('currency', data.currency);

            // Send location as JSON string
            formData.append('location', JSON.stringify({
                city: data.location.city,
                state: data.location.state,
                pincode: data.location.pincode
            }));

            formData.append('description', data.description);

            // Append vaccination info if provided
            if (data.vaccinationInfo && data.vaccinationInfo.trim()) {
                formData.append('vaccinationInfo', data.vaccinationInfo);
            }

            // Send existing images that weren't removed
            if (existingImages.length > 0) {
                formData.append('existingImages', JSON.stringify(existingImages));
            }

            // Append new images if any were selected
            if (selectedImages.length > 0) {
                selectedImages.forEach((file) => {
                    formData.append('images', file);
                });
            }

            // Send removed images if any
            if (removedImages.length > 0) {
                formData.append('removedImages', JSON.stringify(removedImages));
            }

            // Log FormData for debugging
            console.log('FormData contents:');
            for (const pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            console.log('Calling updatePetListing API with petId:', petId);
            const response = await updatePetListing(petId, formData);
            console.log('Update response:', response);

            if (response.success) {
                toast.success('Pet listing updated successfully!');
                // Refresh router to clear cache and refetch data
                router.refresh();
                setTimeout(() => {
                    router.push('/seller/listings');
                }, 1000);
            } else {
                toast.error(response.message || 'Failed to update listing');
            }
        } catch (error: any) {
            console.error('Error updating listing:', error);
            console.error('Error response:', error.response?.data);
            toast.error(error.response?.data?.message || 'Failed to update listing');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-slate-600">Loading pet details...</p>
                <p className="text-sm text-slate-500">Pet ID: {petId}</p>
            </div>
        );
    }

    if (!petData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-slate-900 mb-2">Pet Not Found</h2>
                    <p className="text-slate-600 mb-4">Unable to load pet details</p>
                    <Link href="/seller/listings">
                        <Button>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Listings
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link
                        href="/seller/listings"
                        className="inline-flex items-center text-sm text-slate-600 hover:text-primary mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Listings
                    </Link>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <PawPrint className="h-5 w-5 text-primary" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                            Edit Pet Listing
                        </h1>
                    </div>
                    <p className="text-slate-600">Update the details of your pet listing</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {Object.keys(errors).length > 0 && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="font-semibold text-red-800">Please fix the following errors:</p>
                            <ul className="list-disc list-inside text-sm text-red-600 mt-2">
                                {errors.name && <li>{errors.name.message}</li>}
                                {errors.breedName && <li>{errors.breedName.message}</li>}
                                {errors.gender && <li>{errors.gender.message}</li>}
                                {errors.age && <li>{errors.age.message}</li>}
                                {errors.price && <li>{errors.price.message}</li>}
                                {errors.description && <li>{errors.description.message}</li>}
                                {errors.location?.city && <li>{errors.location.city.message}</li>}
                                {errors.location?.state && <li>{errors.location.state.message}</li>}
                                {errors.location?.pincode && <li>{errors.location.pincode.message}</li>}
                                {errors.images && <li>{errors.images.message as string}</li>}
                            </ul>
                        </div>
                    )}
                    <Card className="p-6 sm:p-8 mb-20 sm:mb-6">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Pet Name <span className="text-red-500">*</span></Label>
                                        <Input id="name" placeholder="e.g., Bruno" {...register('name')} className={errors.name ? 'border-red-500' : ''} />
                                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="breedName">Breed <span className="text-red-500">*</span></Label>
                                        <Select value={watch('breedName')} onValueChange={(value) => setValue('breedName', value, { shouldValidate: true })} disabled={isLoadingBreeds}>
                                            <SelectTrigger className={errors.breedName ? 'border-red-500' : ''}>
                                                <SelectValue placeholder={isLoadingBreeds ? 'Loading breeds...' : 'Select breed'} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {breedNames.length > 0 ? (
                                                    breedNames.map((breed) => <SelectItem key={breed} value={breed}>{breed}</SelectItem>)
                                                ) : (
                                                    <div className="p-2 text-sm text-slate-500">{isLoadingBreeds ? 'Loading breeds...' : 'No breeds available'}</div>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {errors.breedName && <p className="text-sm text-red-500">{errors.breedName.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="gender">Gender <span className="text-red-500">*</span></Label>
                                        <Select value={watch('gender')} onValueChange={(value) => setValue('gender', value as 'male' | 'female', { shouldValidate: true })}>
                                            <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">male</SelectItem>
                                                <SelectItem value="female">female</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="age">Age (months) <span className="text-red-500">*</span></Label>
                                        <Input id="age" type="number" placeholder="e.g., 6" {...register('age')} className={errors.age ? 'border-red-500' : ''} />
                                        {errors.age && <p className="text-sm text-red-500">{errors.age.message}</p>}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 mb-4">Pricing</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price <span className="text-red-500">*</span></Label>
                                        <Input id="price" type="number" placeholder="e.g., 25000" {...register('price')} className={errors.price ? 'border-red-500' : ''} />
                                        {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="currency">Currency</Label>
                                        <Select value={watch('currency')} onValueChange={(value) => setValue('currency', value as 'INR' | 'USD')}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
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
                                        <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                                        <Input id="city" placeholder="e.g., Mumbai" {...register('location.city')} className={errors.location?.city ? 'border-red-500' : ''} />
                                        {errors.location?.city && <p className="text-sm text-red-500">{errors.location.city.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
                                        <Input id="state" placeholder="e.g., Maharashtra" {...register('location.state')} className={errors.location?.state ? 'border-red-500' : ''} />
                                        {errors.location?.state && <p className="text-sm text-red-500">{errors.location.state.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="pincode">Pincode <span className="text-red-500">*</span></Label>
                                        <Input id="pincode" placeholder="e.g., 400001" maxLength={6} {...register('location.pincode')} className={errors.location?.pincode ? 'border-red-500' : ''} />
                                        {errors.location?.pincode && <p className="text-sm text-red-500">{errors.location.pincode.message}</p>}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 mb-4">Health & Details</h2>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="vaccinationInfo">Vaccination Information</Label>
                                        <Textarea id="vaccinationInfo" placeholder="List all vaccinations and dates (optional)" rows={3} {...register('vaccinationInfo')} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                                        <Textarea id="description" placeholder="Describe your pet's personality, behavior, and any special care instructions" rows={5} {...register('description')} className={errors.description ? 'border-red-500' : ''} />
                                        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 mb-4">Images</h2>
                                <p className="text-sm text-slate-600 mb-4">You can keep existing images, add new ones, or remove unwanted images. At least one image is required.</p>

                                {existingImages.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-sm font-semibold text-slate-700 mb-3">Current Images ({existingImages.length})</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {existingImages.map((imageUrl, index) => (
                                                <div key={index} className="relative group">
                                                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-slate-200">
                                                        <img src={imageUrl} alt={`Existing ${index + 1}`} className="w-full h-full object-cover" />
                                                    </div>
                                                    <button type="button" onClick={() => removeExistingImage(imageUrl)} className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-md">
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                                        <input type="file" id="images" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                                        <label htmlFor="images" className="cursor-pointer flex flex-col items-center gap-2">
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Upload className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">Click to upload new images</p>
                                                <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 10MB each</p>
                                            </div>
                                        </label>
                                    </div>

                                    {selectedImages.length > 0 && (
                                        <div>
                                            <p className="text-sm text-slate-600 mb-3">{selectedImages.length} new image{selectedImages.length !== 1 ? 's' : ''} to upload</p>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                                {selectedImages.map((file, index) => (
                                                    <div key={index} className="relative group">
                                                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-primary">
                                                            <img src={imagePreviews[index]} alt={`New ${index + 1}`} className="w-full h-full object-cover" />
                                                        </div>
                                                        <button type="button" onClick={() => removeNewImage(index)} className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-md">
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                        <p className="text-xs text-slate-500 mt-1 truncate">{file.name}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {existingImages.length === 0 && selectedImages.length === 0 && (
                                        <p className="text-sm text-red-500">At least one image is required</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="fixed bottom-0 left-0 right-0 sm:relative bg-white border-t sm:border-0 p-4 sm:p-0 shadow-lg sm:shadow-none z-10">
                        <div className="max-w-4xl mx-auto flex gap-3 justify-end">
                            <Button type="button" variant="outline" disabled={isSubmitting} className="flex-1 sm:flex-none" onClick={() => router.push('/seller/listings')}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 sm:flex-none"
                                onClick={() => console.log('Update button clicked, validation errors:', errors)}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Listing'
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
