"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2, Package, ShoppingBag, Users, Wallet, ArrowUpRight } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { useAdminGuard } from "@/components/admin/useAdminGuard";
import { getAdminDashboard } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import type { AdminDashboard } from "@/lib/types";

const STATUS_BADGE: Record<string, string> = {
    PENDING: "badge-pending",
    CONFIRMED: "badge-confirmed",
    PROCESSING: "badge-processing",
    SHIPPING: "badge-shipping",
    DELIVERED: "badge-delivered",
    COMPLETED: "badge-completed",
    CANCELLED: "badge-cancelled",
    RETURNED: "badge-returned",
    CANCEL_REQUESTED: "badge-cancel_requested",
};

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
            <div className="flex items-center justify-center py-20 gap-2 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Đang tải dashboard...</span>
            </div>
        );
    }

    if (error || !dashboard) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-sm text-red-500">{error || "Không có dữ liệu dashboard"}</p>
            </div>
        );
    }

    const cards = [
        {
            title: "Người dùng",
            value: dashboard.totalUsers,
            subtitle: `${dashboard.activeUsers} đang hoạt động`,
            icon: Users,
            href: "/admin/users",
            accent: "blue" as const,
            iconBg: "bg-blue-50 text-blue-500",
        },
        {
            title: "Sản phẩm",
            value: dashboard.totalProducts,
            subtitle: `${dashboard.lowStockProducts} sắp hết hàng`,
            icon: Package,
            href: "/admin/products",
            accent: "emerald" as const,
            iconBg: "bg-emerald-50 text-emerald-500",
        },
        {
            title: "Đơn hàng",
            value: dashboard.totalOrders,
            subtitle: `${dashboard.pendingOrders} cần xử lý`,
            icon: ShoppingBag,
            href: "/admin/orders",
            accent: "amber" as const,
            iconBg: "bg-amber-50 text-amber-500",
        },
        {
            title: "Doanh thu",
            value: formatPrice(dashboard.totalRevenue),
            subtitle: "Đơn đã giao/hoàn thành",
            icon: Wallet,
            href: "/admin/orders",
            accent: "violet" as const,
            iconBg: "bg-violet-50 text-violet-500",
        },
    ];

    return (
        <AdminShell title="Dashboard" subtitle="Tổng quan nhanh hoạt động hệ thống">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {cards.map((card) => (
                    <Link
                        key={card.title}
                        href={card.href}
                        className="admin-stat-card bg-white rounded-2xl border border-slate-200/80 p-5 group"
                        data-accent={card.accent}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[13px] font-medium text-slate-500">{card.title}</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1.5" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                                    {card.value}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">{card.subtitle}</p>
                            </div>
                            <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                                <card.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-1 text-xs font-medium text-slate-400 group-hover:text-blue-500 transition-colors">
                            <span>Xem chi tiết</span>
                            <ArrowUpRight className="w-3 h-3" />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="mt-6 bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2
                        className="text-sm font-bold text-slate-900"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                        Đơn hàng mới nhất
                    </h2>
                    <Link
                        href="/admin/orders"
                        className="text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                    >
                        Xem tất cả
                        <ArrowUpRight className="w-3 h-3" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-sm">
                        <thead>
                            <tr className="bg-slate-50/80">
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mã đơn</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Khách hàng</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng tiền</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Thời gian</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboard.recentOrders.map((order) => (
                                <tr key={order.id} className="admin-table-row border-t border-slate-100">
                                    <td className="px-5 py-3.5">
                                        <span className="font-semibold text-slate-900">#{order.orderCode}</span>
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-600">{order.customerName}</td>
                                    <td className="px-5 py-3.5 font-semibold text-slate-900">{formatPrice(order.total)}</td>
                                    <td className="px-5 py-3.5">
                                        <span className={`badge-status ${STATUS_BADGE[order.orderStatus] || "badge-pending"}`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-400 text-[13px]">
                                        {new Date(order.createdAt).toLocaleString("vi-VN")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminShell>
    );
}
