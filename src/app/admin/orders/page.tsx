"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, Eye, Edit2, X, Package } from "lucide-react";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminShell from "@/components/admin/AdminShell";
import Badge from "@/components/admin/Badge";
import { useAdminGuard } from "@/components/admin/useAdminGuard";
import { getAdminOrderByCode, getAdminOrders, updateAdminOrder } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import type { AdminOrder, OrderDetail } from "@/lib/types";

const ORDER_STATUSES = [
    "PENDING",
    "CONFIRMED",
    "CANCEL_REQUESTED",
    "PROCESSING",
    "SHIPPING",
    "DELIVERED",
    "COMPLETED",
    "CANCELLED",
    "RETURNED",
];

const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"];
const PAGE_SIZE = 10;

// Helper function to get badge variant for order status
const getOrderStatusVariant = (status: string): "success" | "warning" | "danger" | "info" | "default" => {
    switch (status) {
        case "COMPLETED":
        case "DELIVERED":
            return "success";
        case "PENDING":
        case "CONFIRMED":
            return "warning";
        case "CANCELLED":
        case "RETURNED":
            return "danger";
        case "PROCESSING":
        case "SHIPPING":
            return "info";
        default:
            return "default";
    }
};

const getPaymentStatusVariant = (status: string): "success" | "danger" | "warning" | "default" => {
    switch (status) {
        case "PAID":
            return "success";
        case "FAILED":
            return "danger";
        case "PENDING":
            return "warning";
        default:
            return "default";
    }
};

export default function AdminOrdersPage() {
    const { token, checking } = useAdminGuard();
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");
    const [searchDraft, setSearchDraft] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [detail, setDetail] = useState<OrderDetail | null>(null);
    const [editingOrder, setEditingOrder] = useState<AdminOrder | null>(null);
    const [orderStatusDraft, setOrderStatusDraft] = useState("PENDING");
    const [paymentStatusDraft, setPaymentStatusDraft] = useState("PENDING");

    const loadOrders = async (authToken: string, opts?: { search?: string; status?: string; page?: number }) => {
        const result = await getAdminOrders(authToken, {
            size: PAGE_SIZE,
            search: opts?.search,
            status: opts?.status,
            page: opts?.page ?? 0,
        });
        setOrders(result.content || []);
        setPageIndex(result.number || 0);
        setTotalPages(Math.max(1, result.totalPages || 1));
        setTotalElements(result.totalElements || 0);
    };

    useEffect(() => {
        if (!token) return;
        loadOrders(token, { page: 0 })
            .catch((err) => setError(err instanceof Error ? err.message : "Không tải được đơn hàng"))
            .finally(() => setLoading(false));
    }, [token]);

    const applyFilter = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const keyword = searchDraft.trim();
            setSearch(keyword);
            await loadOrders(token, {
                search: keyword || undefined,
                status: status || undefined,
                page: 0,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Không lọc được đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = async (nextPage: number) => {
        if (!token) return;
        setLoading(true);
        try {
            await loadOrders(token, {
                search: search || undefined,
                status: status || undefined,
                page: nextPage,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Không chuyển trang được");
        } finally {
            setLoading(false);
        }
    };

    const openUpdateModal = (order: AdminOrder) => {
        setEditingOrder(order);
        setOrderStatusDraft(order.orderStatus);
        setPaymentStatusDraft(order.paymentStatus);
    };

    const submitUpdate = async () => {
        if (!token || !editingOrder) return;
        setUpdating(true);
        if (!token) return;
        try {
            const updated = await updateAdminOrder(
                editingOrder.orderCode,
                { orderStatus: orderStatusDraft, paymentStatus: paymentStatusDraft },
                token
            );
            setOrders((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
            setEditingOrder(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Không cập nhật được trạng thái");
        } finally {
            setUpdating(false);
        }
    };

    const openDetail = async (orderCode: string) => {
        if (!token) return;
        setDetailLoading(true);
        try {
            const data = await getAdminOrderByCode(orderCode, token);
            setDetail(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Không tải được chi tiết đơn hàng");
        } finally {
            setDetailLoading(false);
        }
    };

    if (checking || loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-12 flex items-center justify-center gap-2 text-muted">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang tải đơn hàng...
            </div>
        );
    }

    return (
        <AdminShell title="Quản lý đơn hàng" subtitle="Theo dõi, phân loại, xem chi tiết và cập nhật trạng thái đơn">
            {/* Enhanced Search & Filter Section */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="relative sm:col-span-2">
                        <Search className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            value={searchDraft}
                            onChange={(e) => setSearchDraft(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && applyFilter()}
                            placeholder="Tìm theo mã đơn, email, tên khách"
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                        />
                    </div>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                    >
                        <option value="">Tất cả trạng thái</option>
                        {ORDER_STATUSES.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="button"
                    onClick={applyFilter}
                    className="mt-3 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-light hover:shadow-md transition-all duration-200"
                >
                    Áp dụng
                </button>
            </div>

            {error && (
                <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Enhanced Orders Table */}
            <div className="mt-6 bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1120px] text-sm">
                        <thead className="bg-gradient-to-r from-slate-50 to-blue-50/20 text-primary">
                            <tr>
                                <th className="px-6 py-4 text-left font-semibold">Đơn hàng</th>
                                <th className="px-6 py-4 text-left font-semibold">Khách hàng</th>
                                <th className="px-6 py-4 text-left font-semibold">Tổng tiền</th>
                                <th className="px-6 py-4 text-left font-semibold">Trạng thái</th>
                                <th className="px-6 py-4 text-left font-semibold">Ngày tạo</th>
                                <th className="px-6 py-4 text-left font-semibold">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-t border-slate-100 hover:bg-blue-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-accent">#{order.orderCode}</p>
                                        <p className="text-xs text-muted mt-1 flex items-center gap-1.5">
                                            <Package className="w-3 h-3" />
                                            {order.itemCount} sản phẩm
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-primary font-medium">{order.customerName}</p>
                                        <p className="text-xs text-muted mt-0.5">{order.customerEmail}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-primary">{formatPrice(order.total)}</p>
                                        <p className="text-xs text-muted mt-0.5">{order.paymentMethod}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={getOrderStatusVariant(order.orderStatus)} size="sm">
                                            {order.orderStatus}
                                        </Badge>
                                        <div className="mt-1.5">
                                            <Badge variant={getPaymentStatusVariant(order.paymentStatus)} size="sm">
                                                {order.paymentStatus}
                                            </Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted text-xs">
                                        {new Date(order.createdAt).toLocaleString("vi-VN")}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openDetail(order.orderCode)}
                                                className="p-2 rounded-lg border border-slate-200 text-accent hover:border-accent hover:bg-accent/5 transition-all"
                                                title="Xem chi tiết"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => openUpdateModal(order)}
                                                className="p-2 rounded-lg border border-slate-200 text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-all"
                                                title="Cập nhật trạng thái"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AdminPagination currentPage={pageIndex} totalPages={totalPages} onPageChange={handlePageChange} disabled={loading} />
            <p className="mt-2 text-xs text-muted">Tổng {totalElements} đơn hàng</p>

            {/* Enhanced Update Modal */}
            {editingOrder && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !updating && setEditingOrder(null)} />
                    <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200/60 shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-white border-b border-slate-200/60 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                                Cập nhật trạng thái #{editingOrder.orderCode}
                            </h2>
                            <button
                                onClick={() => !updating && setEditingOrder(null)}
                                disabled={updating}
                                className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700 disabled:opacity-50"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-4">
                            <label className="block">
                                <span className="text-sm font-semibold text-primary mb-2 block">Trạng thái đơn hàng</span>
                                <select
                                    value={orderStatusDraft}
                                    onChange={(e) => setOrderStatusDraft(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                                >
                                    {ORDER_STATUSES.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="block">
                                <span className="text-sm font-semibold text-primary mb-2 block">Trạng thái thanh toán</span>
                                <select
                                    value={paymentStatusDraft}
                                    onChange={(e) => setPaymentStatusDraft(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                                >
                                    {PAYMENT_STATUSES.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-slate-50 border-t border-slate-200/60 px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
                            <button
                                type="button"
                                onClick={() => setEditingOrder(null)}
                                disabled={updating}
                                className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-primary font-medium hover:bg-slate-50 transition-all disabled:opacity-50"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={submitUpdate}
                                disabled={updating}
                                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-accent/25 transition-all disabled:opacity-70 flex items-center gap-2"
                            >
                                {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                                {updating ? "Đang lưu..." : "Lưu cập nhật"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Detail Modal */}
            {detail && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDetail(null)} />
                    <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-slate-200/60 shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-slate-200/60 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                                Chi tiết đơn #{detail.orderCode}
                            </h2>
                            <button
                                onClick={() => setDetail(null)}
                                className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {/* Order Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-start gap-3">
                                    <span className="font-semibold text-primary min-w-[100px]">Trạng thái đơn:</span>
                                    <Badge variant={getOrderStatusVariant(detail.orderStatus)}>{detail.orderStatus}</Badge>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="font-semibold text-primary min-w-[100px]">Thanh toán:</span>
                                    <Badge variant={getPaymentStatusVariant(detail.paymentStatus)}>{detail.paymentStatus}</Badge>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="font-semibold text-primary min-w-[100px]">Phương thức:</span>
                                    <span className="text-primary-light">{detail.paymentMethod}</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="font-semibold text-primary min-w-[100px]">Ngày tạo:</span>
                                    <span className="text-primary-light">{new Date(detail.createdAt).toLocaleString("vi-VN")}</span>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="mt-6 p-4 rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50/50 to-slate-50">
                                <p className="font-semibold text-primary mb-3 flex items-center gap-2">
                                    <span className="inline-block w-1 h-5 bg-accent rounded-full"></span>
                                    Địa chỉ giao hàng
                                </p>
                                <div className="text-sm text-primary-light space-y-1">
                                    <p className="font-medium text-primary">{detail.shippingAddress.fullName} - {detail.shippingAddress.phone}</p>
                                    <p>{detail.shippingAddress.address}</p>
                                    <p>{detail.shippingAddress.district}, {detail.shippingAddress.province}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden">
                                <div className="bg-gradient-to-r from-slate-50 to-blue-50/20 px-4 py-3 border-b border-slate-200">
                                    <p className="text-sm font-semibold text-primary">Sản phẩm đặt hàng</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50 text-primary-light">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-semibold">Sản phẩm</th>
                                                <th className="px-4 py-3 text-left font-semibold">SL</th>
                                                <th className="px-4 py-3 text-left font-semibold">Đơn giá</th>
                                                <th className="px-4 py-3 text-left font-semibold">Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {detail.items.map((item) => (
                                                <tr key={`${item.productId}-${item.productName}`} className="border-t border-slate-100 hover:bg-blue-50/30 transition-colors">
                                                    <td className="px-4 py-3 text-primary font-medium">{item.productName}</td>
                                                    <td className="px-4 py-3 text-primary-light">
                                                        <Badge variant="info" size="sm">
                                                            {item.quantity}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3 text-primary-light">{formatPrice(item.price)}</td>
                                                    <td className="px-4 py-3 font-semibold text-accent">{formatPrice(item.subtotal)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted">Tạm tính:</span>
                                    <span className="text-primary font-medium">{formatPrice(detail.subtotal)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted">Phí vận chuyển:</span>
                                    <span className="text-primary font-medium">{formatPrice(detail.shippingFee)}</span>
                                </div>
                                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                                    <span className="font-bold text-primary">Tổng cộng:</span>
                                    <span className="font-bold text-accent text-lg">{formatPrice(detail.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200/60 px-6 py-4 flex justify-end rounded-b-2xl">
                            <button
                                type="button"
                                onClick={() => setDetail(null)}
                                className="px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-light transition-all"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Loading State */}
            {detailLoading && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 flex items-center gap-3 shadow-2xl">
                        <Loader2 className="w-5 h-5 animate-spin text-accent" />
                        <span className="text-sm font-medium text-primary">Đang tải chi tiết đơn hàng...</span>
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
