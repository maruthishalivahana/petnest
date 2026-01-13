import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { store } from '@/store/store';
import { logout } from '@/store/slices/authSlice';

/**
 * Base API URL from environment variable
 * Falls back to localhost if not set
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/';

/**
 * Create Axios instance with default configuration
 * Backend uses HTTP-only cookies for authentication
 */
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 seconds
    withCredentials: true, // CRITICAL: Required for HTTP-only cookie authentication
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request Interceptor (no manual token handling needed - cookies sent automatically)
 */
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Cookie is automatically sent by browser when withCredentials: true
        // No need to manually add Authorization header

        // Fix for FormData: Remove Content-Type header to let browser/axios set it with boundary
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor
 * Handles global error responses, particularly 401 Unauthorized
 */
apiClient.interceptors.response.use(
    (response) => {
        // Return successful responses as-is
        return response;
    },
    (error: AxiosError) => {
        // Log detailed error information
        console.error('API Error:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
            method: error.config?.method,
            isCorsError: error.message === 'Network Error' || error.code === 'ERR_NETWORK'
        });

        // Handle 401 Unauthorized errors globally
        if (error.response?.status === 401) {
            console.warn('🔒 Unauthorized - redirecting to login');
            // Dispatch logout action to clear auth state
            store.dispatch(logout());

            // Optional: Redirect to login page
            // This can be handled in the component or middleware
            if (typeof window !== 'undefined') {
                // Client-side redirect
                window.location.href = '/login';
            }
        }

        // Handle 403 Forbidden errors
        if (error.response?.status === 403) {
            console.warn('🚫 Forbidden - insufficient permissions');
        }

        // Pass the error to the calling code for specific handling
        return Promise.reject(error);
    }
);

export default apiClient;
