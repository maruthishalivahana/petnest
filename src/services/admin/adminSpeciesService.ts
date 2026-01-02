import apiClient from '@/lib/apiClient';

/**
 * Species type definition
 */
export interface Species {
    id?: string;
    _id?: string;
    name: string;
    speciesName?: string;
    category?: string;
    scientificName?: string;
    protectionLevel?: string;
    allowedForTrade?: boolean;
    referenceAct?: string;
    notes?: string;
    breedCount?: number;
    totalListing?: number;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

/**
 * Breed type definition
 */
export interface Breed {
    id?: string;
    _id?: string;
    name: string;
    speciesId?: string;
    speciesName?: string;
    species?: {
        _id: string;
        name: string;
    };
    totalListing?: number;
    totalListings?: number;
    verifiedListings?: number;
    pendingListings?: number;
}

/**
 * Species Analytics type
 */
export interface SpeciesAnalytics {
    _id: string;
    name: string;
    totalBreeds: number;
    totalListings: number;
    verifiedListings: number;
    pendingListings: number;
}

/**
 * Breed Analytics type
 */
export interface BreedAnalytics {
    _id: string;
    name: string;
    species: {
        _id: string;
        name: string;
    };
    totalListings: number;
    verifiedListings: number;
    pendingListings: number;
}

/**
 * Backend response types
 */
interface BackendDataResponse<T> {
    message: string;
    data: T[];
}

interface BackendSingleResponse<T> {
    message?: string;
    data: T;
}

/**
 * API Response types
 */
interface GetSpeciesResponse {
    species: Species[];
    total?: number;
}

interface GetSingleSpeciesResponse {
    species: Species;
}

interface GetBreedsResponse {
    breeds: Breed[];
    total?: number;
}

interface GetSingleBreedResponse {
    breed: Breed;
}

interface CreateSpeciesResponse {
    message?: string;
    species: Species;
}

interface CreateBreedResponse {
    message?: string;
    breed: Breed;
}

interface MessageResponse {
    message: string;
}

/**
 * Get all species
 * GET /v1/api/admin/species
 */
export const getAllSpecies = async (): Promise<GetSpeciesResponse> => {
    const response = await apiClient.get<BackendDataResponse<Species>>('/v1/api/admin/species');
    const speciesData = (response.data.data || []).map(item => ({
        ...item,
        id: item._id || item.id || '',
        name: item.speciesName || item.name || 'Unknown'
    }));
    return {
        species: speciesData,
        total: speciesData.length
    };
};

/**
 * Get species by ID
 * GET /v1/api/admin/species/:id
 */
export const getSpeciesById = async (id: string): Promise<GetSingleSpeciesResponse> => {
    const response = await apiClient.get<GetSingleSpeciesResponse>(`/v1/api/admin/species/${id}`);
    return response.data;
};

/**
 * Create species payload type
 */
export interface CreateSpeciesPayload {
    speciesName: string;
    category: string;
    scientificName?: string;
    protectionLevel?: string;
    allowedForTrade?: boolean;
    referenceAct?: string;
    notes?: string;
}

/**
 * Add species
 * POST /v1/api/admin/species
 */
export const createSpecies = async (payload: CreateSpeciesPayload): Promise<CreateSpeciesResponse> => {
    const response = await apiClient.post<CreateSpeciesResponse>('/v1/api/admin/species', payload);
    return response.data;
};

/**
 * Delete species by ID
 * DELETE /v1/api/admin/species/:id
 */
export const deleteSpecies = async (id: string): Promise<MessageResponse> => {
    const response = await apiClient.delete<MessageResponse>(`/v1/api/admin/species/${id}`);
    return response.data;
};

/**
 * Get all breeds
 * GET /v1/api/admin/breeds
 */
export const getAllBreeds = async (): Promise<GetBreedsResponse> => {
    const response = await apiClient.get<BackendDataResponse<Breed>>('/v1/api/admin/breeds');
    const breedsData = (response.data.data || []).map(item => ({
        ...item,
        id: item._id || item.id || ''
    }));
    return {
        breeds: breedsData,
        total: breedsData.length
    };
};

/**
 * Get breed by ID
 * GET /v1/api/admin/breeds/:id
 */
export const getBreedById = async (id: string): Promise<GetSingleBreedResponse> => {
    const response = await apiClient.get<GetSingleBreedResponse>(`/v1/api/admin/breeds/${id}`);
    return response.data;
};

/**
 * Add breed
 * POST /v1/api/admin/breeds
 */
export const createBreed = async (
    name: string,
    speciesId: string,
    category: string,
    legalStatus: string,
    origin?: string,
    isNative?: boolean,
    description?: string
): Promise<CreateBreedResponse> => {
    const payload: any = {
        name,
        species: speciesId,
        category,
        legalStatus,
        isNative: isNative ?? false,
    };

    if (origin) payload.origin = origin;
    if (description) payload.description = description;

    const response = await apiClient.post<CreateBreedResponse>('/v1/api/admin/breeds', payload);
    return response.data;
};

/**
 * Delete breed by ID
 * DELETE /v1/api/admin/breeds/:id
 */
export const deleteBreed = async (id: string): Promise<MessageResponse> => {
    const response = await apiClient.delete<MessageResponse>(`/v1/api/admin/breeds/${id}`);
    return response.data;
};

/**
 * Get species analytics
 * GET /v1/api/admin/species/analytics
 */
export const fetchSpeciesAnalytics = async (): Promise<SpeciesAnalytics[]> => {
    const response = await apiClient.get<{ success: boolean; count: number; data: SpeciesAnalytics[] }>('/v1/api/admin/species/analytics');
    return response.data.data || [];
};

/**
 * Get breeds analytics
 * GET /v1/api/admin/breeds/analytics
 */
export const fetchBreedsAnalytics = async (): Promise<BreedAnalytics[]> => {
    const response = await apiClient.get<{ success: boolean; count: number; data: BreedAnalytics[] }>('/v1/api/admin/breeds/analytics');
    return response.data.data || [];
};
