import apiClient from '@/lib/apiClient';

export interface Report {
    id: string;
    reportType: 'user' | 'listing' | 'seller';
    reportedItemId: string;
    reportedItem: string; // Display name/title of the reported item
    reportedBy: string;
    reason: string;
    description: string;
    status: 'pending' | 'resolved' | 'dismissed';
    reportedDate: string;
    createdDate: string; // Alias for reportedDate
}

interface GetReportsResponse {
    reports: Report[];
    total?: number;
}

interface MessageResponse {
    message: string;
}

/**
 * Get all reports
 * GET /v1/api/admin/reports
 */
export const getAllReports = async (): Promise<GetReportsResponse> => {
    const response = await apiClient.get<GetReportsResponse>('/v1/api/admin/reports');
    return response.data;
};

/**
 * Resolve report
 * PATCH /v1/api/admin/reports/:reportId/resolve
 */
export const resolveReport = async (reportId: string): Promise<MessageResponse> => {
    const response = await apiClient.patch<MessageResponse>(`/v1/api/admin/reports/${reportId}/resolve`);
    return response.data;
};

/**
 * Dismiss report
 * PATCH /v1/api/admin/reports/:reportId/dismiss
 */
export const dismissReport = async (reportId: string): Promise<MessageResponse> => {
    const response = await apiClient.patch<MessageResponse>(`/v1/api/admin/reports/${reportId}/dismiss`);
    return response.data;
};
