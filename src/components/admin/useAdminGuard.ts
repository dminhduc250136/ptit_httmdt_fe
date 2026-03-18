"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { getAuthToken, getStoredUser } from "@/lib/authStorage";

export function useAdminGuard() {
    const router = useRouter();
    const pathname = usePathname();
    const token = getAuthToken();
    const user = getStoredUser();
    const isAdmin = !!token && user?.role === "ADMIN";

    useEffect(() => {
        if (!token) {
            router.replace(`/auth/login?redirect=${encodeURIComponent(pathname || "/admin")}`);
            return;
        }

        if (!isAdmin) {
            router.replace("/");
        }
    }, [isAdmin, pathname, router, token]);

    return { token: isAdmin ? token : null, checking: false };
}
