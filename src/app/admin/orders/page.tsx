"use client";

import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminShell from "@/components/admin/AdminShell";
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
            <div className="bg-white border border-border rounded-2xl p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="relative sm:col-span-2">
                        <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            value={searchDraft}
                            onChange={(e) => setSearchDraft(e.target.value)}
                            placeholder="Tìm theo mã đơn, email, tên khách"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent"
                        />
                    </div>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent">
                        <option value="">Tất cả trạng thái</option>
                        {ORDER_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                </div>
                <button type="button" onClick={applyFilter} className="mt-3 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-light">Áp dụng</button>
            </div>

            {error && <p className="mt-4 text-sm text-cta">{error}</p>}

            <div className="mt-4 bg-white border border-border rounded-2xl overflow-x-auto">
                <table className="w-full min-w-[1120px] text-sm">
                    <thead className="bg-slate-50 text-primary-light">
                        <tr>
                            <th className="px-4 py-3 text-left">Đơn hàng</th>
                            <th className="px-4 py-3 text-left">Khách hàng</th>
                            <th className="px-4 py-3 text-left">Tổng tiền</th>
                            <th className="px-4 py-3 text-left">Trạng thái</th>
                            <th className="px-4 py-3 text-left">Ngày tạo</th>
                            <th className="px-4 py-3 text-left">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-t border-border">
                                <td className="px-4 py-3">
                                    <p className="font-semibold text-primary">#{order.orderCode}</p>
                                    <p className="text-xs text-muted mt-0.5">{order.itemCount} sản phẩm</p>
                                </td>
                                <td className="px-4 py-3">
                                    <p className="text-primary-light">{order.customerName}</p>
                                    <p className="text-xs text-muted">{order.customerEmail}</p>
                                </td>
                                <td className="px-4 py-3 text-primary font-semibold">{formatPrice(order.total)}</td>
                                <td className="px-4 py-3">
                                    <p className="text-primary-light">{order.orderStatus}</p>
                                    <p className="text-xs text-muted">Thanh toán: {order.paymentStatus}</p>
                                </td>
                                <td className="px-4 py-3 text-muted">{new Date(order.createdAt).toLocaleString("vi-VN")}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => openDetail(order.orderCode)}
                                            className="px-3 py-1.5 rounded-lg border border-border text-primary hover:border-accent"
                                        >
                                            Chi tiết
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => openUpdateModal(order)}
                                            className="px-3 py-1.5 rounded-lg bg-slate-100 text-primary hover:bg-slate-200"
                                        >
                                            Cập nhật
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AdminPagination currentPage={pageIndex} totalPages={totalPages} onPageChange={handlePageChange} disabled={loading} />
            <p className="mt-2 text-xs text-muted">Tổng {totalElements} đơn hàng</p>

            {editingOrder && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setEditingOrder(null)} />
                    <div className="relative w-full max-w-lg bg-white rounded-2xl border border-border p-5 sm:p-6">
                        <h2 className="text-lg font-bold text-primary" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                            Cập nhật trạng thái đơn #{editingOrder.orderCode}
                        </h2>
                        <div className="mt-4 space-y-3">
                            <label className="block text-sm text-primary-light">
                                Trạng thái đơn
                                <select
                                    value={orderStatusDraft}
                                    onChange={(e) => setOrderStatusDraft(e.target.value)}
                                    className="mt-1 w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent"
                                >
                                    {ORDER_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
                                </select>
                            </label>
                            <label className="block text-sm text-primary-light">
                                Trạng thái thanh toán
                                <select
                                    value={paymentStatusDraft}
                                    onChange={(e) => setPaymentStatusDraft(e.target.value)}
                                    className="mt-1 w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent"
                                >
                                    {PAYMENT_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
                                </select>
                            </label>
                        </div>
                        <div className="mt-4 flex items-center justify-end gap-2">
                            <button type="button" onClick={() => setEditingOrder(null)} className="px-4 py-2 rounded-xl border border-border text-primary">
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={submitUpdate}
                                disabled={updating}
                                className="px-4 py-2 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover disabled:opacity-70"
                            >
                                {updating ? "Đang lưu..." : "Lưu cập nhật"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {detail && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setDetail(null)} />
                    <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-border p-5 sm:p-6">
                        <h2 className="text-lg font-bold text-primary" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                            Chi tiết đơn #{detail.orderCode}
                        </h2>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <p className="text-primary-light"><span className="font-semibold text-primary">Trạng thái đơn:</span> {detail.orderStatus}</p>
                            <p className="text-primary-light"><span className="font-semibold text-primary">Thanh toán:</span> {detail.paymentStatus}</p>
                            <p className="text-primary-light"><span className="font-semibold text-primary">Phương thức:</span> {detail.paymentMethod}</p>
                            <p className="text-primary-light"><span className="font-semibold text-primary">Ngày tạo:</span> {new Date(detail.createdAt).toLocaleString("vi-VN")}</p>
                        </div>

                        <div className="mt-4 p-3 rounded-xl border border-border bg-slate-50 text-sm text-primary-light">
                            <p className="font-semibold text-primary mb-1">Địa chỉ giao hàng</p>
                            <p>{detail.shippingAddress.fullName} - {detail.shippingAddress.phone}</p>
                            <p>{detail.shippingAddress.address}, {detail.shippingAddress.district}, {detail.shippingAddress.province}</p>
                        </div>

                        <div className="mt-4 border border-border rounded-xl overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-primary-light">
                                    <tr>
                                        <th className="px-3 py-2 text-left">Sản phẩm</th>
                                        <th className="px-3 py-2 text-left">SL</th>
                                        <th className="px-3 py-2 text-left">Đơn giá</th>
                                        <th className="px-3 py-2 text-left">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detail.items.map((item) => (
                                        <tr key={`${item.productId}-${item.productName}`} className="border-t border-border">
                                            <td className="px-3 py-2 text-primary-light">{item.productName}</td>
                                            <td className="px-3 py-2 text-primary-light">{item.quantity}</td>
                                            <td className="px-3 py-2 text-primary-light">{formatPrice(item.price)}</td>
                                            <td className="px-3 py-2 text-primary">{formatPrice(item.subtotal)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 text-sm text-primary-light space-y-1">
                            <p>Tạm tính: <span className="text-primary">{formatPrice(detail.subtotal)}</span></p>
                            <p>Phí ship: <span className="text-primary">{formatPrice(detail.shippingFee)}</span></p>
                            <p className="font-semibold text-primary">Tổng: {formatPrice(detail.total)}</p>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button type="button" onClick={() => setDetail(null)} className="px-4 py-2 rounded-xl bg-primary text-white">
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {detailLoading && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/30">
                    <div className="bg-white border border-border rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-primary">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang tải chi tiết đơn hàng...
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
