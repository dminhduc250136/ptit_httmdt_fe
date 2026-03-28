"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    LogOut,
    Menu,
    X,
    Laptop,
    ChevronRight,
    ExternalLink,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { clearAuthSession, getStoredUser, AUTH_CHANGED_EVENT } from "@/lib/authStorage";
import type { AuthUser } from "@/lib/types";

interface AppChromeProps {
    children: React.ReactNode;
}

const ADMIN_NAV = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Sản phẩm", icon: Package },
    { href: "/admin/orders", label: "Đơn hàng", icon: ShoppingBag },
    { href: "/admin/users", label: "Người dùng", icon: Users },
];

const PAGE_TITLES: Record<string, string> = {
    "/admin": "Dashboard",
    "/admin/products": "Quản lý sản phẩm",
    "/admin/orders": "Quản lý đơn hàng",
    "/admin/users": "Quản lý người dùng",
};

export default function AppChrome({ children }: AppChromeProps) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith("/admin") ?? false;

    if (!isAdminRoute) {
        return (
            <>
                <Header />
                <main className="min-h-screen pt-[72px]">{children}</main>
                <Footer />
            </>
        );
    }

    return <AdminChrome>{children}</AdminChrome>;
}

function AdminChrome({ children }: AppChromeProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const syncAuth = () => setUser(getStoredUser());
        window.addEventListener("storage", syncAuth);
        window.addEventListener(AUTH_CHANGED_EVENT, syncAuth);
        return () => {
            window.removeEventListener("storage", syncAuth);
            window.removeEventListener(AUTH_CHANGED_EVENT, syncAuth);
        };
    }, []);

    const handleLogout = () => {
        clearAuthSession();
        router.replace("/auth/login");
    };

    const pageTitle = PAGE_TITLES[pathname ?? ""] || "Admin";
    const initials = user?.fullName
        ?.trim()
        .split(/\s+/)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "A";

    return (
        <div className="min-h-screen bg-[#F1F5F9] flex">
            {/* ─── Desktop Sidebar ─── */}
            <aside className="admin-sidebar hidden lg:flex flex-col w-[260px] shrink-0 bg-[#0F172A] text-white fixed top-0 left-0 bottom-0 z-40">
                {/* Brand */}
                <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                        <Laptop className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold tracking-tight truncate" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                            LaptopVerse
                        </p>
                        <p className="text-[11px] text-slate-400 -mt-0.5">Admin Console</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {ADMIN_NAV.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href} className={`admin-nav-item ${active ? "active" : ""}`}>
                                <item.icon className="w-[18px] h-[18px] shrink-0" />
                                <span className="truncate">{item.label}</span>
                                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar footer */}
                <div className="border-t border-white/10 px-4 py-3 space-y-3">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-[13px] text-slate-400 hover:text-slate-200 transition-colors"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Xem cửa hàng
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-slate-200 truncate">{user?.fullName || "Admin"}</p>
                            <p className="text-[11px] text-slate-500 truncate">{user?.email || ""}</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-red-400 cursor-pointer"
                            title="Đăng xuất"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* ─── Mobile Sidebar ─── */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="admin-sidebar-overlay absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <aside className="admin-sidebar absolute top-0 left-0 bottom-0 w-[280px] bg-[#0F172A] text-white flex flex-col">
                        {/* Brand + close */}
                        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                                    <Laptop className="w-4.5 h-4.5 text-white" />
                                </div>
                                <p className="text-sm font-bold tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                                    LaptopVerse
                                </p>
                            </div>
                            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Nav */}
                        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                            {ADMIN_NAV.map((item) => {
                                const active = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`admin-nav-item ${active ? "active" : ""}`}
                                    >
                                        <item.icon className="w-[18px] h-[18px] shrink-0" />
                                        <span className="truncate">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Footer */}
                        <div className="border-t border-white/10 px-4 py-3 space-y-3">
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-[13px] text-slate-400 hover:text-slate-200 transition-colors"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Xem cửa hàng
                            </Link>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                                    {initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-medium text-slate-200 truncate">{user?.fullName || "Admin"}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-red-400 cursor-pointer"
                                    title="Đăng xuất"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            )}

            {/* ─── Main area ─── */}
            <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
                {/* Topbar */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/80">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <div>
                                <h1
                                    className="text-lg font-bold text-slate-900 leading-tight"
                                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                                >
                                    {pageTitle}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="hidden sm:block text-sm text-slate-500">
                                {user?.fullName || "Quản trị viên"}
                            </span>
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold lg:hidden">
                                {initials}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>

                {/* Footer */}
                <footer className="border-t border-slate-200/80 bg-white/60">
                    <div className="px-4 sm:px-6 lg:px-8 py-3 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
                        <p>LaptopVerse Admin Console</p>
                        <p>© {new Date().getFullYear()} LaptopVerse</p>
                    </div>
                </footer>
            </div>
        </div>
    );
}
