import apiClient from '@/lib/apiClient';

/**
 * User type definition
 */
export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'seller' | 'buyer';
    status: 'active' | 'banned';
    joinedDate: string;
    lastActive?: string;
    isBanned?: boolean;
}

/**
 * API Response types
 */
interface GetUsersResponse {
    users: AdminUser[];
    total?: number;
}

interface GetUserResponse {
    user: AdminUser;
}

interface MessageResponse {
    message: string;
}

/**
 * Get all users
 * GET /v1/api/admin/users
 */
export const getAllUsers = async (): Promise<GetUsersResponse> => {
    const response = await apiClient.get<GetUsersResponse>('/v1/api/admin/users');
    return response.data;
};

/**
 * Get user by ID
 * GET /v1/api/admin/users/:userId
 */
export const getUserById = async (userId: string): Promise<GetUserResponse> => {
    const response = await apiClient.get<GetUserResponse>(`/v1/api/admin/users/${userId}`);
    return response.data;
};

/**
 * Get users by role
 * GET /v1/api/admin/users/role/:role
 */
export const getUsersByRole = async (role: string): Promise<GetUsersResponse> => {
    const response = await apiClient.get<GetUsersResponse>(`/v1/api/admin/users/role/${role}`);
    return response.data;
};

/**
 * Ban user
 * PATCH /v1/api/admin/users/:userId/ban
 */
export const banUser = async (userId: string): Promise<MessageResponse> => {
    const response = await apiClient.patch<MessageResponse>(`/v1/api/admin/users/${userId}/ban`);
    return response.data;
};

/**
 * Unban user
 * PATCH /v1/api/admin/users/:userId/unban
 */
export const unbanUser = async (userId: string): Promise<MessageResponse> => {
    const response = await apiClient.patch<MessageResponse>(`/v1/api/admin/users/${userId}/unban`);
    return response.data;
};

/**
 * Delete user by ID
 * DELETE /v1/api/admin/users/:userId
 */
export const deleteUser = async (userId: string): Promise<MessageResponse> => {
    const response = await apiClient.delete<MessageResponse>(`/v1/api/admin/users/${userId}`);
    return response.data;
};
