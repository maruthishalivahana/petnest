import apiClient from '@/lib/apiClient';

export interface SellerVerificationStats {
    pending: number;
    approved: number;
    rejected: number;
}

export interface PetVerificationStats {
    pending: number;
    approved: number;
    rejected: number;
}

export interface UserManagementStats {
    totalUsers: number;
    activeUsers: number;
    bannedUsers: number;
    sellers: number;
}

export interface DashboardStats {
    totalUsers: number;
    activeSellers: number;
    pendingSellerRequests: number;
    verifiedPets: number;
    pendingPetVerifications: number;
    pendingAds: number;
    activeListings: number;
    totalReports: number;
}

export interface Activity {
    id: string;
    type: string;
    description: string;
    timestamp: string;
    status: 'success' | 'pending' | 'failed';
}

/**
 * Get seller verification statistics
 * GET /v1/api/admin/dashboard/seller-verification-stats
 */
export const getSellerVerificationStats = async () => {
    const response = await apiClient.get<{ success: boolean; data: SellerVerificationStats }>(
        '/v1/api/admin/dashboard/seller-verification-stats'
    );
    return response.data.data;
};

/**
 * Get pet verification statistics
 * GET /v1/api/admin/dashboard/pet-verification-stats
 */
export const getPetVerificationStats = async () => {
    const response = await apiClient.get<{ success: boolean; data: PetVerificationStats }>(
        '/v1/api/admin/dashboard/pet-verification-stats'
    );
    return response.data.data;
};

/**
 * Get user management statistics
 * GET /v1/api/admin/dashboard/user-management-stats
 */
export const getUserManagementStats = async () => {
    const response = await apiClient.get<{ success: boolean; data: UserManagementStats }>(
        '/v1/api/admin/dashboard/user-management-stats'
    );
    return response.data.data;
};

/**
 * Get combined dashboard statistics
 * Aggregates data from multiple endpoints with individual error handling
 */
export const getDashboardStats = async (): Promise<{ stats: DashboardStats }> => {
    // Fetch all stats with individual error handling - don't let one failure break everything
    const [sellerStats, petStats, userStats] = await Promise.allSettled([
        getSellerVerificationStats(),
        getPetVerificationStats(),
        getUserManagementStats()
    ]);

    // Extract values with fallbacks
    const seller = sellerStats.status === 'fulfilled' ? sellerStats.value : { pending: 0, approved: 0, rejected: 0 };
    const pet = petStats.status === 'fulfilled' ? petStats.value : { pending: 0, approved: 0, rejected: 0 };
    const user = userStats.status === 'fulfilled' ? userStats.value : { totalUsers: 0, activeUsers: 0, bannedUsers: 0, sellers: 0 };

    return {
        stats: {
            totalUsers: user.totalUsers,
            activeSellers: user.sellers,
            pendingSellerRequests: seller.pending,
            verifiedPets: pet.approved,
            pendingPetVerifications: pet.pending,
            pendingAds: 0, // This would need an advertisement stats endpoint
            activeListings: 0, // This would need a listings stats endpoint
            totalReports: 0 // This would need a reports stats endpoint
        }
    };
};

/**
 * Get recent activity
 * Mock data for now - backend endpoint would be needed
 */
export const getRecentActivity = async (limit?: number): Promise<{ activities: Activity[] }> => {
    // This would be replaced with actual backend endpoint when available
    return { activities: [] };
};
