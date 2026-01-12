import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    isVerified: boolean;
}

type UserWithMongoId = User & { _id?: string };

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

const normalizeUser = (user: UserWithMongoId): User => {
    const { _id, ...rest } = user;
    return { ...rest, id: user.id ?? _id ?? rest.id };
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: UserWithMongoId; token: string }>) => {
            const normalizedUser = normalizeUser(action.payload.user);

            state.user = normalizedUser;
            state.token = action.payload.token; // Just for Redux state, actual auth is in cookie
            state.isAuthenticated = true;
            state.isLoading = false;

            // Only persist user data (not token - it's in HTTP-only cookie)
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(normalizedUser));
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

            // Clear localStorage (cookie will be cleared by backend logout endpoint)
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
            }
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        restoreSession: (state, action: PayloadAction<{ user: UserWithMongoId; token: string } | null>) => {
            if (action.payload) {
                state.user = normalizeUser(action.payload.user);
                state.token = action.payload.token;
                state.isAuthenticated = true;
            }
            state.isLoading = false;
        },
    },
});

export const { setCredentials, updateUser, logout, setLoading, restoreSession } = authSlice.actions;
export default authSlice.reducer;
