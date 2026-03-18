"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { clearAuthSession, getStoredUser } from "@/lib/authStorage";
import type { AuthUser } from "@/lib/types";

interface AppChromeProps {
    children: React.ReactNode;
}

const ADMIN_LINKS = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/products", label: "Sản phẩm" },
    { href: "/admin/orders", label: "Đơn hàng" },
    { href: "/admin/users", label: "Người dùng" },
];

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
    const [user] = useState<AuthUser | null>(() => getStoredUser());

    const handleLogout = () => {
        clearAuthSession();
        router.replace("/auth/login");
    };

    return (
        <div className="min-h-screen bg-[#f6f8fc] flex flex-col">
            <header className="sticky top-0 z-30 border-b border-[#dbe3ef] bg-white/95 backdrop-blur">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-[11px] tracking-[0.14em] uppercase text-muted">LaptopVerse</p>
                        <h1 className="text-lg font-bold text-primary leading-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                            Admin Console
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="hidden sm:inline text-sm text-muted">
                            {user?.fullName || user?.email || "Quản trị viên"}
                        </span>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="px-3 py-2 rounded-lg border border-border text-sm font-semibold text-primary hover:border-accent"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 pb-3 flex flex-wrap gap-2">
                    {ADMIN_LINKS.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                                    active
                                        ? "bg-primary text-white"
                                        : "bg-white border border-border text-primary hover:border-accent"
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="mt-8 border-t border-[#dbe3ef] bg-white">
                <div className="max-w-7xl mx-auto px-4 py-3 text-sm text-muted flex flex-wrap items-center justify-between gap-2">
                    <p>Admin panel for operations and monitoring.</p>
                    <p>© {new Date().getFullYear()} LaptopVerse</p>
                </div>
            </footer>
        </div>
    );
}
