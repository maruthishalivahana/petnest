"use client";

import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { restoreSession } from './slices/authSlice';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;

            // Restore session from localStorage on mount
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('token');
                const userStr = localStorage.getItem('user');

                if (token && userStr) {
                    try {
                        const user = JSON.parse(userStr);
                        store.dispatch(restoreSession({ user, token }));
                    } catch (error) {
                        console.error('Failed to restore session:', error);
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        store.dispatch(restoreSession(null));
                    }
                } else {
                    store.dispatch(restoreSession(null));
                }
            }
        }
    }, []);

    return <Provider store={store}>{children}</Provider>;
}
