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
 */
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 seconds
    withCredentials: true, // Send cookies with cross-origin requests
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request Interceptor
 * Automatically attaches JWT token to all requests if available
 */
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Get current auth state from Redux store
        const state = store.getState();
        let token = state.auth.token;

        // Fallback: If token not in Redux, check localStorage
        // This handles cases where Redux hasn't hydrated yet
        if (!token && typeof window !== 'undefined') {
            token = localStorage.getItem('token');
        }

        // Attach Authorization header if token exists
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
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
        // Handle 401 Unauthorized errors globally
        if (error.response?.status === 401) {
            // Dispatch logout action to clear auth state
            store.dispatch(logout());

            // Optional: Redirect to login page
            // This can be handled in the component or middleware
            if (typeof window !== 'undefined') {
                // Client-side redirect
                window.location.href = '/login';
            }
        }

        // Pass the error to the calling code for specific handling
        return Promise.reject(error);
    }
);

export default apiClient;
