"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { hasRouteAccess, getRoleRoute } from "@/utils/roleRoutes";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/auth/me`,
                    { withCredentials: true }
                );

                if (!isMounted) return;

                const loggedUser = res.data.user;
                setUser(loggedUser);

                // 1. If allowedRoles is provided, enforce it
                if (allowedRoles && !allowedRoles.includes(loggedUser.role)) {
                    setRedirecting(true);
                    router.push(getRoleRoute(loggedUser.role));
                    return;
                }

                // 2. If route access is not allowed
                if (!hasRouteAccess(loggedUser.role, pathname)) {
                    setRedirecting(true);
                    router.push(getRoleRoute(loggedUser.role));
                    return;
                }
            } catch (err) {
                // Not authenticated - send to login with redirect
                setRedirecting(true);
                router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        checkAuth();

        return () => {
            isMounted = false;
        };
    }, [pathname, router, allowedRoles]);

    if (loading || redirecting) {
        return (
            <div className="h-screen flex justify-center items-center">
                <div className="animate-spin h-10 w-10 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return <>{children}</>;
}
