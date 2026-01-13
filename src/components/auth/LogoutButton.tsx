'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { toast } from 'sonner';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

interface LogoutButtonProps {
    variant?: 'default' | 'outline' | 'ghost' | 'destructive';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
}

export function LogoutButton({
    variant = 'destructive',
    size = 'default',
    className = '',
}: LogoutButtonProps) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);

            // Call logout API
            await axios.post(`${BASE_URL}/v1/api/auth/logout`, {}, {
                withCredentials: true
            });

            // Clear Redux state and localStorage
            dispatch(logout());

            toast.success('Logged out successfully');

            // Redirect to login
            router.push('/login');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Logout error:', error);
            toast.error('Failed to logout');
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <Button
            variant={variant}
            size={size}
            className={className}
            disabled={isLoggingOut}
            onClick={handleLogout}
        >
            {isLoggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <LogOut className="w-4 h-4" />
            )}
        </Button>
    );
}
