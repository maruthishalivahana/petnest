"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { hasRouteAccess, getRoleRoute } from "@/utils/roleRoutes";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setCredentials, logout, setLoading } from "@/store/slices/authSlice";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();

    const { user, isLoading, isAuthenticated } = useAppSelector((state) => state.auth);
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            // If already authenticated, check access
            if (isAuthenticated && user && !isLoading) {
                // 1. If allowedRoles is provided, enforce it
                if (allowedRoles && !allowedRoles.includes(user.role)) {
                    setRedirecting(true);
                    router.push(getRoleRoute(user.role));
                    return;
                }

                // 2. If route access is not allowed
                if (!hasRouteAccess(user.role, pathname)) {
                    setRedirecting(true);
                    router.push(getRoleRoute(user.role));
                    return;
                }
                return;
            }

            // If not authenticated, verify with backend
            if (!isLoading) {
                try {
                    dispatch(setLoading(true));
                    const res = await axios.get(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/auth/me`,
                        { withCredentials: true }
                    );

                    if (!isMounted) return;

                    const loggedUser = res.data.user;
                    const token = localStorage.getItem('token') || '';

                    dispatch(setCredentials({ user: loggedUser, token }));

                    // Check access after setting credentials
                    if (allowedRoles && !allowedRoles.includes(loggedUser.role)) {
                        setRedirecting(true);
                        router.push(getRoleRoute(loggedUser.role));
                        return;
                    }

                    if (!hasRouteAccess(loggedUser.role, pathname)) {
                        setRedirecting(true);
                        router.push(getRoleRoute(loggedUser.role));
                        return;
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (_err) {
                    // Not authenticated - send to login with redirect
                    dispatch(logout());
                    setRedirecting(true);
                    router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
                }
            }
        };

        checkAuth();

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, isAuthenticated, user]);

    if (isLoading || redirecting || !isAuthenticated || !user) {
        return (
            <div className="h-screen flex justify-center items-center">
                <div className="animate-spin h-10 w-10 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return <>{children}</>;
}
