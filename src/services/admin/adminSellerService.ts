import apiClient from '@/lib/apiClient';

/**
 * Seller Verification type definition (matching backend structure)
 */
export interface SellerVerification {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        phoneNumber: string;
    };
    brandName: string;
    logoUrl?: string;
    bio?: string;
    whatsappNumber?: string;
    location?: {
        city?: string;
        state?: string;
        pincode?: string;
    };
    documents: {
        idProof: string;
        certificate: string;
        shopImage?: string;
    };
    status: 'pending' | 'verified' | 'rejected' | 'suspended';
    verificationNotes?: string;
    verificationDate?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Stats type definition
 */
export interface SellerVerificationStats {
    pending: number;
    approved: number;
    rejected: number;
    suspended: number;
    total: number;
}

/**
 * Get seller verification statistics
 * GET /v1/api/admin/dashboard/seller-verification-stats
 */
export const fetchSellerVerificationStats = async (): Promise<SellerVerificationStats> => {
    const response = await apiClient.get<{ success: boolean; data: SellerVerificationStats }>('/v1/api/admin/dashboard/seller-verification-stats');
    return response.data.data;
};

/**
 * Get sellers by status
 * GET /v1/api/admin/dashboard/sellers/:status
 */
export const fetchSellersByStatus = async (status: 'pending' | 'verified' | 'rejected'): Promise<SellerVerification[]> => {
    const response = await apiClient.get<{ success: boolean; count: number; data: SellerVerification[] }>(`/v1/api/admin/dashboard/sellers/${status}`);
    return response.data.data;
};

/**
 * Approve a seller verification request
 * PUT /v1/api/admin/seller-requests/:sellerRequestId/verified
 */
export const approveSellerVerification = async (sellerRequestId: string, notes?: string): Promise<any> => {
    const response = await apiClient.put(`/v1/api/admin/seller-requests/${sellerRequestId}/verified`, { notes });
    return response.data;
};

/**
 * Reject a seller verification request
 * PUT /v1/api/admin/seller-requests/:sellerRequestId/rejected
 */
export const rejectSellerVerification = async (sellerRequestId: string, notes?: string): Promise<any> => {
    const response = await apiClient.put(`/v1/api/admin/seller-requests/${sellerRequestId}/rejected`, { notes });
    return response.data;
};

/**
 * Suspend a seller
 * PUT /v1/api/admin/seller-requests/:sellerRequestId/suspended
 */
export const suspendSellerVerification = async (sellerRequestId: string, notes?: string): Promise<any> => {
    const response = await apiClient.put(`/v1/api/admin/seller-requests/${sellerRequestId}/suspended`, { notes });
    return response.data;
};

// Legacy functions (keeping for backward compatibility)

/**
 * API Response types for legacy functions
 */
interface GetPendingRequestsResponse {
    requests: SellerVerification[];
    total?: number;
}

interface GetVerifiedSellersResponse {
    sellers: SellerVerification[];
    total?: number;
}

interface GetAllVerificationsResponse {
    verifications: SellerVerification[];
    total?: number;
}

interface MessageResponse {
    message: string;
}

/**
 * Get all pending seller requests
 * GET /v1/api/admin/seller-requests/pending
 */
export const getAllPendingRequests = async (): Promise<GetPendingRequestsResponse> => {
    const response = await apiClient.get<GetPendingRequestsResponse>('/v1/api/admin/seller-requests/pending');
    return response.data;
};

/**
 * Get all verified sellers
 * GET /v1/api/admin/sellers/verified
 */
export const getAllVerifiedSellers = async (): Promise<GetVerifiedSellersResponse> => {
    const response = await apiClient.get<GetVerifiedSellersResponse>('/v1/api/admin/sellers/verified');
    return response.data;
};

/**
 * Get all seller verifications (pending, verified, rejected)
 * GET /v1/api/admin/seller-requests
 */
export const getAllSellerVerifications = async (): Promise<GetAllVerificationsResponse> => {
    const response = await apiClient.get<GetAllVerificationsResponse>('/v1/api/admin/seller-requests');
    return response.data;
};

/**
 * Verify/reject seller request
 * PUT /v1/api/admin/seller-requests/:sellerRequestId/:status
 */
export const verifySellerRequest = async (sellerRequestId: string, status: 'verified' | 'rejected'): Promise<MessageResponse> => {
    const response = await apiClient.put<MessageResponse>(`/v1/api/admin/seller-requests/${sellerRequestId}/${status}`);
    return response.data;
};
