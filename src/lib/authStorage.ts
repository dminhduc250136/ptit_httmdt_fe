import type { AuthUser } from "@/lib/types";

const TOKEN_KEY = "laptopverse_token";
const USER_KEY = "laptopverse_user";
export const AUTH_CHANGED_EVENT = "laptopverse-auth-changed";

function emitAuthChanged(): void {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function saveAuthSession(user: AuthUser): void {
    if (typeof window === "undefined") return;
    if (user.token) localStorage.setItem(TOKEN_KEY, user.token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    emitAuthChanged();
}

export function clearAuthSession(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    emitAuthChanged();
}

export function getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as AuthUser;
    } catch {
        return null;
    }
}