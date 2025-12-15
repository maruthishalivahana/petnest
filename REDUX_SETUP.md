# Redux Toolkit State Management

This project uses Redux Toolkit for centralized state management.

## 📁 Structure

```
src/
├── store/
│   ├── store.ts              # Redux store configuration
│   ├── hooks.ts              # Typed Redux hooks
│   ├── ReduxProvider.tsx     # Client-side Redux Provider wrapper
│   └── slices/
│       └── authSlice.ts      # Authentication state slice
```

## 🚀 Usage

### Accessing State

Use the typed hooks instead of plain `useSelector` and `useDispatch`:

```typescript
import { useAppSelector, useAppDispatch } from '@/store/hooks';

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  
  // Your component logic
}
```

### Auth Slice Actions

```typescript
import { setCredentials, logout, updateUser } from '@/store/slices/authSlice';

// Login
dispatch(setCredentials({ 
  user: { id, name, email, role, isVerified }, 
  token: 'jwt-token' 
}));

// Logout
dispatch(logout());

// Update user
dispatch(updateUser({ id, name, email, role, isVerified }));
```

### Auth State Structure

```typescript
{
  auth: {
    user: User | null,           // Current user object
    token: string | null,        // JWT token
    isAuthenticated: boolean,    // Authentication status
    isLoading: boolean          // Loading state
  }
}
```

## 🔐 Authentication Flow

1. **Login**: Dispatch `setCredentials` with user and token
2. **Session Persistence**: Automatically saves to localStorage
3. **Session Restore**: On app load, restores from localStorage
4. **Logout**: Dispatch `logout` to clear state and localStorage

## 📝 Adding New Slices

Create a new slice in `src/store/slices/`:

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MyState {
  // your state shape
}

const initialState: MyState = {
  // initial values
};

const mySlice = createSlice({
  name: 'myFeature',
  initialState,
  reducers: {
    myAction: (state, action: PayloadAction<any>) => {
      // reducer logic
    },
  },
});

export const { myAction } = mySlice.actions;
export default mySlice.reducer;
```

Then add it to the store:

```typescript
// src/store/store.ts
import myReducer from './slices/mySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    myFeature: myReducer, // Add here
  },
});
```

## 🛠️ DevTools

Redux DevTools are automatically enabled in development mode. Install the browser extension to inspect state changes.

## 📦 Installed Packages

- `@reduxjs/toolkit` - Redux Toolkit core
- `react-redux` - React bindings for Redux
