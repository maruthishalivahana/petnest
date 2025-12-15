import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    isVerified: boolean;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.isLoading = false;

            // Persist to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            }
        },

        updateUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;

            // Update localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(action.payload));
            }
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.isLoading = false;

            // Clear localStorage
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        restoreSession: (state, action: PayloadAction<{ user: User; token: string } | null>) => {
            if (action.payload) {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            }
            state.isLoading = false;
        },
    },
});

export const { setCredentials, updateUser, logout, setLoading, restoreSession } = authSlice.actions;
export default authSlice.reducer;
