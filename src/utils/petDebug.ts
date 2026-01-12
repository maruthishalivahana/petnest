/**
 * Debug utility for tracking pet data flow from seller update to buyer display
 * Use these functions to identify data inconsistencies
 */

interface PetDebugInfo {
    source: string;
    petId: string;
    name?: string;
    breedName?: string;
    location?: any;
    price?: number;
    age?: string;
    timestamp: string;
}

/**
 * Log pet data for debugging
 * @param source - Where the data is coming from (e.g., "API Response", "Redux Store", "Component Render")
 * @param petData - The pet data object
 */
export function debugPetData(source: string, petData: any): void {
    if (!petData) {
        console.warn(`🔍 [${source}] No pet data available`);
        return;
    }

    const debugInfo: PetDebugInfo = {
        source,
        petId: petData._id || petData.id || 'unknown',
        name: petData.name,
        breedName: petData.breedName || petData.breedId?.name,
        location: petData.location,
        price: petData.price,
        age: petData.age,
        timestamp: new Date().toISOString()
    };

    console.group(`🔍 Pet Data Debug: ${source}`);
    console.log('Pet ID:', debugInfo.petId);
    console.log('Name:', debugInfo.name);
    console.log('Breed:', debugInfo.breedName);
    console.log('Location (raw):', debugInfo.location);
    console.log('Location (type):', typeof debugInfo.location);

    // Check if location is JSON string
    if (typeof debugInfo.location === 'string') {
        try {
            const parsed = JSON.parse(debugInfo.location);
            console.log('Location (parsed):', parsed);
        } catch {
            console.log('Location is a plain string:', debugInfo.location);
        }
    } else if (typeof debugInfo.location === 'object' && debugInfo.location !== null) {
        console.log('Location (object):', {
            city: debugInfo.location.city,
            state: debugInfo.location.state,
            pincode: debugInfo.location.pincode
        });
    }

    console.log('Price:', debugInfo.price);
    console.log('Age:', debugInfo.age);
    console.log('Timestamp:', debugInfo.timestamp);
    console.groupEnd();
}

/**
 * Compare old and new pet data to identify what changed
 * @param oldData - Previous pet data
 * @param newData - Updated pet data
 */
export function comparePetData(oldData: any, newData: any): void {
    console.group('🔄 Pet Data Comparison');

    const changes: string[] = [];

    if (oldData?.name !== newData?.name) {
        changes.push(`Name: "${oldData?.name}" → "${newData?.name}"`);
    }

    if (oldData?.breedName !== newData?.breedName) {
        changes.push(`Breed: "${oldData?.breedName}" → "${newData?.breedName}"`);
    }

    if (JSON.stringify(oldData?.location) !== JSON.stringify(newData?.location)) {
        changes.push(`Location: ${JSON.stringify(oldData?.location)} → ${JSON.stringify(newData?.location)}`);
    }

    if (oldData?.price !== newData?.price) {
        changes.push(`Price: ₹${oldData?.price} → ₹${newData?.price}`);
    }

    if (oldData?.age !== newData?.age) {
        changes.push(`Age: "${oldData?.age}" → "${newData?.age}"`);
    }

    if (changes.length === 0) {
        console.log('✅ No changes detected');
    } else {
        console.log('📝 Changes detected:');
        changes.forEach(change => console.log(`  - ${change}`));
    }

    console.groupEnd();
}

/**
 * Validate pet data structure
 * @param petData - Pet data to validate
 * @returns Array of validation errors
 */
export function validatePetData(petData: any): string[] {
    const errors: string[] = [];

    if (!petData) {
        errors.push('Pet data is null or undefined');
        return errors;
    }

    if (!petData._id && !petData.id) {
        errors.push('Missing pet ID');
    }

    if (!petData.name || typeof petData.name !== 'string') {
        errors.push('Invalid or missing name');
    }

    if (petData.price === null || petData.price === undefined || isNaN(petData.price)) {
        errors.push('Invalid or missing price');
    }

    // Check location format
    if (petData.location) {
        if (typeof petData.location === 'string') {
            try {
                JSON.parse(petData.location);
                console.warn('⚠️ Location is a JSON string - should be parsed');
            } catch {
                // It's a plain string, which is fine
            }
        } else if (typeof petData.location === 'object') {
            if (!petData.location.city && !petData.location.state) {
                errors.push('Location object has no city or state');
            }
        } else {
            errors.push('Location has invalid type');
        }
    }

    if (errors.length > 0) {
        console.group('❌ Pet Data Validation Errors');
        errors.forEach(error => console.error(`  - ${error}`));
        console.groupEnd();
    } else {
        console.log('✅ Pet data validation passed');
    }

    return errors;
}

/**
 * Log API response for debugging
 * @param endpoint - API endpoint called
 * @param response - API response
 */
export function debugApiResponse(endpoint: string, response: any): void {
    console.group(`📡 API Response: ${endpoint}`);
    console.log('Success:', response.success);
    console.log('Message:', response.message);

    if (response.data) {
        if (Array.isArray(response.data)) {
            console.log('Data type: Array');
            console.log('Count:', response.data.length);
            if (response.data.length > 0) {
                console.log('First item:', response.data[0]);
            }
        } else {
            console.log('Data type: Object');
            console.log('Data:', response.data);
        }
    } else {
        console.warn('No data in response');
    }

    console.groupEnd();
}
