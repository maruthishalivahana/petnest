import { UserRole } from "@/contexts/AuthContext";

/**
 * Role-based route configuration
 */
export const ROLE_ROUTES: Record<UserRole, string> = {
    buyer: "/home",
    seller: "/seller/dashboard",
    admin: "/admin/dashboard",
};

/**
 * Get the default route for a given role
 */
export function getRoleRoute(role: UserRole): string {
    return ROLE_ROUTES[role] || "/";
}

/**
 * Check if a user has permission to access a specific route
 */
export function hasRouteAccess(userRole: UserRole, pathname: string): boolean {
    // Public routes accessible by all (unauthenticated users)
    const publicRoutes = ["/", "/login", "/signup", "/verify-otp", "/comingsoon"];

    if (publicRoutes.some(route => pathname.startsWith(route))) {
        return true;
    }

    // Buyer-specific routes
    if (pathname.startsWith("/home")) {
        return userRole === "buyer";
    }

    // Admin routes
    if (pathname.startsWith("/admin")) {
        return userRole === "admin";
    }

    // Seller routes
    if (pathname.startsWith("/seller")) {
        return userRole === "seller";
    }

    // Default: deny access
    return false;
}

/**
 * Get redirect path if user doesn't have access
 */
export function getRedirectPath(userRole: UserRole, attemptedPath: string): string {
    // If user doesn't have access to the attempted path, redirect to their role's home
    if (!hasRouteAccess(userRole, attemptedPath)) {
        return getRoleRoute(userRole);
    }
    return attemptedPath;
}
