"use client";

import React from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

/**
 * Example component showing how to use Redux Toolkit
 * You can use this as a reference for other components
 */
export function UserProfile() {
    const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleLogout = () => {
        dispatch(logout());
        router.push('/login');
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated || !user) {
        return <div>Not authenticated</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                    <p><strong>Verified:</strong> {user.isVerified ? 'Yes' : 'No'}</p>
                    <Button onClick={handleLogout} variant="destructive" className="mt-4">
                        Logout
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
