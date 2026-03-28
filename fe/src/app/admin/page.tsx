"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2, Package, ShoppingBag, Users, Wallet } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { useAdminGuard } from "@/components/admin/useAdminGuard";
import { getAdminDashboard } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import type { AdminDashboard } from "@/lib/types";

export default function AdminDashboardPage() {
    const { token, checking } = useAdminGuard();
    const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) return;
        getAdminDashboard(token)
            .then(setDashboard)
            .catch((err) => setError(err instanceof Error ? err.message : "Không tải được dashboard"))
            .finally(() => setLoading(false));
    }, [token]);

    if (checking || loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-12 flex items-center justify-center gap-2 text-muted">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang tải dashboard admin...
            </div>
        );
    }

    if (error || !dashboard) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-12">
                <p className="text-sm text-cta">{error || "Không có dữ liệu dashboard"}</p>
            </div>
        );
    }

    const cards = [
        { title: "Người dùng", value: dashboard.totalUsers, subtitle: `${dashboard.activeUsers} đang hoạt động`, icon: Users, href: "/admin/users" },
        { title: "Sản phẩm", value: dashboard.totalProducts, subtitle: `${dashboard.lowStockProducts} sắp hết hàng`, icon: Package, href: "/admin/products" },
        { title: "Đơn hàng", value: dashboard.totalOrders, subtitle: `${dashboard.pendingOrders} cần xử lý`, icon: ShoppingBag, href: "/admin/orders" },
        { title: "Doanh thu", value: formatPrice(dashboard.totalRevenue), subtitle: "Đơn đã giao/hoàn thành", icon: Wallet, href: "/admin/orders" },
    ];

    return (
        <AdminShell title="Admin Dashboard" subtitle="Tổng quan nhanh hoạt động hệ thống">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {cards.map((card) => (
                    <Link
                        key={card.title}
                        href={card.href}
                        className="bg-white border border-border rounded-2xl p-4 hover:border-accent transition-colors"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-sm text-muted">{card.title}</p>
                                <p className="text-xl font-bold text-primary mt-1">{card.value}</p>
                                <p className="text-xs text-muted mt-1">{card.subtitle}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                                <card.icon className="w-5 h-5" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-6 bg-white border border-border rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                    <h2 className="text-sm font-semibold text-primary">Đơn hàng mới nhất</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-sm">
                        <thead className="bg-slate-50 text-primary-light">
                            <tr>
                                <th className="text-left px-4 py-3">Mã đơn</th>
                                <th className="text-left px-4 py-3">Khách hàng</th>
                                <th className="text-left px-4 py-3">Tổng tiền</th>
                                <th className="text-left px-4 py-3">Trạng thái</th>
                                <th className="text-left px-4 py-3">Thời gian</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboard.recentOrders.map((order) => (
                                <tr key={order.id} className="border-t border-border">
                                    <td className="px-4 py-3 font-semibold text-primary">#{order.orderCode}</td>
                                    <td className="px-4 py-3 text-primary-light">{order.customerName}</td>
                                    <td className="px-4 py-3 text-primary">{formatPrice(order.total)}</td>
                                    <td className="px-4 py-3 text-primary-light">{order.orderStatus}</td>
                                    <td className="px-4 py-3 text-muted">{new Date(order.createdAt).toLocaleString("vi-VN")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminShell>
    );
}
