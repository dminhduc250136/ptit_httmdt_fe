"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/products", label: "Sản phẩm" },
    { href: "/admin/orders", label: "Đơn hàng" },
    { href: "/admin/users", label: "Người dùng" },
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
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-primary" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        {title}
                    </h1>
                    <p className="text-sm text-muted mt-1">{subtitle}</p>
                </div>
                {actions}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
                {LINKS.map((item) => {
                    const active = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
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

            <div className="mt-6">{children}</div>
        </div>
    );
}
