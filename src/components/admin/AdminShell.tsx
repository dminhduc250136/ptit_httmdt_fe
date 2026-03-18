"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users } from "lucide-react";

const LINKS = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Sản phẩm", icon: Package },
    { href: "/admin/orders", label: "Đơn hàng", icon: ShoppingCart },
    { href: "/admin/users", label: "Người dùng", icon: Users },
];

interface AdminShellProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
}

export default function AdminShell({ title, subtitle, children, actions }: AdminShellProps) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
            <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                                {title}
                            </h1>
                            <p className="text-sm text-muted mt-2 flex items-center gap-2">
                                <span className="inline-block w-1 h-1 rounded-full bg-accent"></span>
                                {subtitle}
                            </p>
                        </div>
                        {actions}
                    </div>

                    {/* Enhanced Navigation Tabs */}
                    <div className="mt-6 flex flex-wrap gap-2">
                        {LINKS.map((item) => {
                            const active = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`group relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                                        active
                                            ? "bg-gradient-to-r from-accent to-blue-600 text-white shadow-lg shadow-accent/25"
                                            : "bg-white border border-slate-200 text-primary hover:border-accent hover:shadow-md hover:-translate-y-0.5"
                                    }`}
                                >
                                    <Icon className={`w-4 h-4 transition-transform duration-200 ${active ? "" : "group-hover:scale-110"}`} />
                                    {item.label}
                                    {active && (
                                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full"></span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Content Section */}
                <div className="animate-in fade-in duration-300">{children}</div>
            </div>
        </div>
    );
}
