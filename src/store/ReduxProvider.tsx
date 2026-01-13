"use client";

import { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { restoreSession } from "./slices/authSlice";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    // Use ref to ensure store is created only once
    const storeRef = useRef(store);
    const initialized = useRef(false);

    useEffect(() => {
        // Restore session from localStorage on mount (client-side only)
        // Note: Token is in HTTP-only cookie, we only restore user data
        if (!initialized.current && typeof window !== 'undefined') {
            initialized.current = true;

            try {
                const userStr = localStorage.getItem('user');

                if (userStr) {
                    const user = JSON.parse(userStr);
                    // Use dummy token since real auth is in cookie
                    storeRef.current.dispatch(restoreSession({ user, token: 'cookie-auth' }));
                } else {
                    // No session to restore
                    storeRef.current.dispatch(restoreSession(null));
                }
            } catch (error) {
                console.error('Failed to restore session:', error);
                storeRef.current.dispatch(restoreSession(null));
            }
        }
    }, []);

    return <Provider store={storeRef.current}>{children}</Provider>;
}
