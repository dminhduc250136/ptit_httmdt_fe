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
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {cards.map((card, index) => (
                    <Link
                        key={card.title}
                        href={card.href}
                        className="group relative bg-white border border-slate-200/60 rounded-2xl p-5 hover:border-accent transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        {/* Gradient Background Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <div className="relative flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted mb-2">{card.title}</p>
                                <p className="text-2xl font-bold text-primary mb-1 group-hover:text-accent transition-colors">{card.value}</p>
                                <p className="text-xs text-muted flex items-center gap-1.5">
                                    <span className="inline-block w-1 h-1 rounded-full bg-success"></span>
                                    {card.subtitle}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/10 to-blue-600/10 text-accent flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                                <card.icon className="w-6 h-6" />
                            </div>
                        </div>

                        {/* Shine Effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    </Link>
                ))}
            </div>

            {/* Enhanced Recent Orders Table */}
            <div className="mt-6 bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg">
                <div className="px-6 py-4 border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-blue-50/30">
                    <h2 className="text-base font-bold text-primary flex items-center gap-2">
                        <span className="inline-block w-1 h-5 bg-accent rounded-full"></span>
                        Đơn hàng mới nhất
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-sm">
                        <thead className="bg-gradient-to-r from-slate-50 to-blue-50/20 text-primary-light">
                            <tr>
                                <th className="text-left px-6 py-4 font-semibold">Mã đơn</th>
                                <th className="text-left px-6 py-4 font-semibold">Khách hàng</th>
                                <th className="text-left px-6 py-4 font-semibold">Tổng tiền</th>
                                <th className="text-left px-6 py-4 font-semibold">Trạng thái</th>
                                <th className="text-left px-6 py-4 font-semibold">Thời gian</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboard.recentOrders.map((order, index) => (
                                <tr
                                    key={order.id}
                                    className="border-t border-slate-100 hover:bg-blue-50/30 transition-colors"
                                    style={{ animationDelay: `${index * 30}ms` }}
                                >
                                    <td className="px-6 py-4 font-semibold text-accent">#{order.orderCode}</td>
                                    <td className="px-6 py-4 text-primary">{order.customerName}</td>
                                    <td className="px-6 py-4 font-semibold text-primary">{formatPrice(order.total)}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-muted">{new Date(order.createdAt).toLocaleString("vi-VN")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminShell>
    );
}
