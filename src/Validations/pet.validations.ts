import { z } from 'zod';

const fileListSchema = z
    .custom<FileList>((value) => value instanceof FileList && value.length > 0, {
        message: 'At least one image is required',
    })
    .refine(
        (files) => Array.from(files).every((file) => file.type?.startsWith('image/')),
        'Only image files are allowed'
    );

export const petListingSchema = z.object({
    name: z.string().min(2, 'Pet name must be at least 2 characters'),
    breedName: z.string().min(1, 'Please select a breed'),
    gender: z.enum(['Male', 'Female'], {
        required_error: 'Please select gender',
    }),
    age: z.coerce.number().positive('Age must be a positive number'),
    price: z.coerce.number().positive('Price must be a positive number'),
    currency: z.enum(['INR', 'USD']).default('INR'),
    location: z.object({
        city: z.string().min(1, 'City is required'),
        state: z.string().min(1, 'State is required'),
        pincode: z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
    }),
    vaccinationInfo: z.string().optional(),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    images: fileListSchema,
});

export type PetListingFormData = z.infer<typeof petListingSchema>;
