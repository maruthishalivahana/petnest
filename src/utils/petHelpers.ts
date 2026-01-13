/**
 * Utility function to format location data consistently across the app
 * Handles different location formats: object, JSON string, or plain string
 */

export interface LocationObject {
    city?: string;
    state?: string;
    pincode?: string;
}

export type LocationData = LocationObject | string | null | undefined;

/**
 * Formats location data into a readable string "City, State"
 * @param location - Location data in various formats
 * @param includePin - Whether to include pincode (default: false)
 * @returns Formatted location string or fallback message
 */
export function formatLocation(location: LocationData, includePin: boolean = false): string {
    // Handle null/undefined
    if (!location) {
        return 'Location not specified';
    }

    // Handle string type
    if (typeof location === 'string') {
        try {
            // Try to parse if it's a JSON string
            const parsed = JSON.parse(location);
            if (typeof parsed === 'object' && parsed !== null) {
                const parts = [parsed.city, parsed.state];
                if (includePin && parsed.pincode) {
                    parts.push(parsed.pincode);
                }
                return parts.filter(Boolean).join(', ') || 'Location not specified';
            }
        } catch {
            // If not JSON, treat as already formatted string
            return location;
        }
    }

    // Handle object format
    if (typeof location === 'object' && location !== null) {
        const parts = [location.city, location.state];
        if (includePin && location.pincode) {
            parts.push(location.pincode);
        }
        return parts.filter(Boolean).join(', ') || 'Location not specified';
    }

    return 'Location not specified';
}

/**
 * Safely extract breed name from pet data
 * @param pet - Pet object with possible breedName or breedId
 * @returns Breed name or fallback
 */
export function getBreedName(pet: any): string {
    if (pet.breedName) return pet.breedName;
    if (pet.breedId?.name) return pet.breedId.name;
    if (pet.breed) return pet.breed;
    return 'Unknown Breed';
}

/**
 * Safely extract category from pet data
 * @param pet - Pet object with possible category or breedId.species.category
 * @returns Category name or fallback
 */
export function getCategory(pet: any): string {
    if (pet.breedId?.species?.category) return pet.breedId.species.category;
    // Check if category is not an ObjectId (24 char hex string)
    if (pet.category && !pet.category.match(/^[0-9a-fA-F]{24}$/)) {
        return pet.category;
    }
    return 'Pet';
}

/**
 * Format price with currency symbol
 * @param price - Price value
 * @param currency - Currency type (default: 'INR')
 * @returns Formatted price string
 */
export function formatPrice(price: number | undefined | null, currency: string = 'INR'): string {
    if (price === null || price === undefined || isNaN(price)) {
        return '₹0';
    }

    const symbol = currency === 'INR' || currency === 'indian' ? '₹' : '₹';
    return `${symbol}${price.toLocaleString('en-IN')}`;
}

/**
 * Safe image URL getter with fallback
 * @param images - Array of image URLs
 * @param index - Index of image to get (default: 0)
 * @returns Image URL or fallback
 */
export function getImageUrl(images: string[] | undefined, index: number = 0): string {
    const fallback = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80';

    if (!images || !Array.isArray(images) || images.length === 0) {
        return fallback;
    }

    const image = images[index];
    if (!image || image.trim() === '') {
        return fallback;
    }

    return image;
}
