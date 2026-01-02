import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AdminUser, getAllUsers, banUser, unbanUser, deleteUser } from '@/services/admin/adminUserService';

interface AdminUsersState {
    users: AdminUser[];
    loading: boolean;
    error: string | null;
}

const initialState: AdminUsersState = {
    users: [],
    loading: false,
    error: null,
};

// Async thunks
export const fetchAllUsers = createAsyncThunk(
    'adminUsers/fetchAll',
    async () => {
        const response = await getAllUsers();
        return response.users;
    }
);

export const banUserThunk = createAsyncThunk(
    'adminUsers/ban',
    async (userId: string) => {
        await banUser(userId);
        return userId;
    }
);

export const unbanUserThunk = createAsyncThunk(
    'adminUsers/unban',
    async (userId: string) => {
        await unbanUser(userId);
        return userId;
    }
);

export const deleteUserThunk = createAsyncThunk(
    'adminUsers/delete',
    async (userId: string) => {
        await deleteUser(userId);
        return userId;
    }
);

const adminUsersSlice = createSlice({
    name: 'adminUsers',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all users
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<AdminUser[]>) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch users';
            })
            // Ban user
            .addCase(banUserThunk.fulfilled, (state, action: PayloadAction<string>) => {
                const user = state.users.find(u => u.id === action.payload);
                if (user) {
                    user.status = 'banned';
                    user.isBanned = true;
                }
            })
            // Unban user
            .addCase(unbanUserThunk.fulfilled, (state, action: PayloadAction<string>) => {
                const user = state.users.find(u => u.id === action.payload);
                if (user) {
                    user.status = 'active';
                    user.isBanned = false;
                }
            })
            // Delete user
            .addCase(deleteUserThunk.fulfilled, (state, action: PayloadAction<string>) => {
                state.users = state.users.filter(u => u.id !== action.payload);
            });
    },
});

export const { clearError } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;
