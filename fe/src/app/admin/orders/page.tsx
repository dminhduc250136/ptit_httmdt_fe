"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, Eye, Pencil } from "lucide-react";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminShell from "@/components/admin/AdminShell";
import { useAdminGuard } from "@/components/admin/useAdminGuard";
import { getAdminOrderByCode, getAdminOrders, updateAdminOrder } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import type { AdminOrder, OrderDetail } from "@/lib/types";

const ORDER_STATUSES = ["PENDING", "CONFIRMED", "CANCEL_REQUESTED", "PROCESSING", "SHIPPING", "DELIVERED", "COMPLETED", "CANCELLED", "RETURNED"];
const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"];
const PAGE_SIZE = 10;

const ORDER_BADGE: Record<string, string> = {
    PENDING: "badge-pending", CONFIRMED: "badge-confirmed", PROCESSING: "badge-processing",
    SHIPPING: "badge-shipping", DELIVERED: "badge-delivered", COMPLETED: "badge-completed",
    CANCELLED: "badge-cancelled", RETURNED: "badge-returned", CANCEL_REQUESTED: "badge-cancel_requested",
};

const PAYMENT_BADGE: Record<string, string> = {
    PENDING: "badge-pending", PAID: "badge-paid", FAILED: "badge-failed", REFUNDED: "badge-refunded",
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
        const result = await getAdminOrders(authToken, { size: PAGE_SIZE, search: opts?.search, status: opts?.status, page: opts?.page ?? 0 });
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
        try { const keyword = searchDraft.trim(); setSearch(keyword); await loadOrders(token, { search: keyword || undefined, status: status || undefined, page: 0 }); }
        catch (err) { setError(err instanceof Error ? err.message : "Không lọc được"); }
        finally { setLoading(false); }
    };

    const handlePageChange = async (nextPage: number) => {
        if (!token) return;
        setLoading(true);
        try { await loadOrders(token, { search: search || undefined, status: status || undefined, page: nextPage }); }
        catch (err) { setError(err instanceof Error ? err.message : "Không chuyển trang được"); }
        finally { setLoading(false); }
    };

    const openUpdateModal = (order: AdminOrder) => { setEditingOrder(order); setOrderStatusDraft(order.orderStatus); setPaymentStatusDraft(order.paymentStatus); };

    const submitUpdate = async () => {
        if (!token || !editingOrder) return;
        setUpdating(true);
        try {
            const updated = await updateAdminOrder(editingOrder.orderCode, { orderStatus: orderStatusDraft, paymentStatus: paymentStatusDraft }, token);
            setOrders((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
            setEditingOrder(null);
        } catch (err) { setError(err instanceof Error ? err.message : "Không cập nhật được"); } finally { setUpdating(false); }
    };

    const openDetail = async (orderCode: string) => {
        if (!token) return;
        setDetailLoading(true);
        try { const data = await getAdminOrderByCode(orderCode, token); setDetail(data); }
        catch (err) { setError(err instanceof Error ? err.message : "Không tải được chi tiết"); }
        finally { setDetailLoading(false); }
    };

    if (checking || loading) {
        return (
            <div className="flex items-center justify-center py-20 gap-2 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Đang tải đơn hàng...</span>
            </div>
        );
    }

    return (
        <AdminShell title="Quản lý đơn hàng" subtitle="Theo dõi, phân loại, xem chi tiết và cập nhật trạng thái đơn">
            {/* Filter bar */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-4">
                <form onSubmit={(e) => { e.preventDefault(); applyFilter(); }} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div className="relative sm:col-span-2">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input value={searchDraft} onChange={(e) => setSearchDraft(e.target.value)}
                            placeholder="Tìm theo mã đơn, email, tên khách..."
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm" />
                    </div>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}
                        className="px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm">
                        <option value="">Tất cả trạng thái</option>
                        {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button type="submit" className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer">
                        Áp dụng
                    </button>
                </form>
            </div>

            {error && <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1020px] text-sm">
                        <thead>
                            <tr className="bg-slate-50/80">
                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Đơn hàng</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Khách hàng</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng tiền</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Thanh toán</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngày tạo</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="admin-table-row border-t border-slate-100">
                                    <td className="px-5 py-3.5">
                                        <p className="font-semibold text-slate-900">#{order.orderCode}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{order.itemCount} sản phẩm</p>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <p className="text-slate-700">{order.customerName}</p>
                                        <p className="text-xs text-slate-400">{order.customerEmail}</p>
                                    </td>
                                    <td className="px-5 py-3.5 font-semibold text-slate-900">{formatPrice(order.total)}</td>
                                    <td className="px-5 py-3.5">
                                        <span className={`badge-status ${ORDER_BADGE[order.orderStatus] || "badge-pending"}`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`badge-status ${PAYMENT_BADGE[order.paymentStatus] || "badge-pending"}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-400 text-[13px]">
                                        {new Date(order.createdAt).toLocaleString("vi-VN")}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-1.5">
                                            <button type="button" onClick={() => openDetail(order.orderCode)} className="admin-action-btn" title="Chi tiết">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button type="button" onClick={() => openUpdateModal(order)} className="admin-action-btn" title="Cập nhật">
                                                <Pencil className="w-4 h-4" />
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
            <p className="mt-2 text-xs text-slate-400">Tổng {totalElements} đơn hàng</p>

            {/* Update status modal */}
            {editingOrder && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditingOrder(null)} />
                    <div className="admin-modal-enter relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                            Cập nhật đơn #{editingOrder.orderCode}
                        </h2>
                        <div className="mt-5 space-y-4">
                            <label className="block">
                                <span className="text-xs font-medium text-slate-500">Trạng thái đơn</span>
                                <select value={orderStatusDraft} onChange={(e) => setOrderStatusDraft(e.target.value)}
                                    className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm">
                                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </label>
                            <label className="block">
                                <span className="text-xs font-medium text-slate-500">Trạng thái thanh toán</span>
                                <select value={paymentStatusDraft} onChange={(e) => setPaymentStatusDraft(e.target.value)}
                                    className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm">
                                    {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </label>
                        </div>
                        <div className="mt-5 flex items-center justify-end gap-2">
                            <button type="button" onClick={() => setEditingOrder(null)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer">Hủy</button>
                            <button type="button" onClick={submitUpdate} disabled={updating} className="px-5 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 disabled:opacity-60 transition-colors cursor-pointer">
                                {updating ? "Đang lưu..." : "Lưu cập nhật"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Order detail modal */}
            {detail && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDetail(null)} />
                    <div className="admin-modal-enter relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                            Chi tiết đơn #{detail.orderCode}
                        </h2>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-slate-400 text-xs">Trạng thái đơn</span>
                                <p><span className={`badge-status ${ORDER_BADGE[detail.orderStatus] || "badge-pending"}`}>{detail.orderStatus}</span></p>
                            </div>
                            <div>
                                <span className="text-slate-400 text-xs">Thanh toán</span>
                                <p><span className={`badge-status ${PAYMENT_BADGE[detail.paymentStatus] || "badge-pending"}`}>{detail.paymentStatus}</span></p>
                            </div>
                            <div><span className="text-slate-400 text-xs">Phương thức</span><p className="font-medium text-slate-700">{detail.paymentMethod}</p></div>
                            <div><span className="text-slate-400 text-xs">Ngày tạo</span><p className="font-medium text-slate-700">{new Date(detail.createdAt).toLocaleString("vi-VN")}</p></div>
                        </div>

                        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Địa chỉ giao hàng</p>
                            <p className="text-sm text-slate-700">{detail.shippingAddress.fullName} - {detail.shippingAddress.phone}</p>
                            <p className="text-sm text-slate-500">{detail.shippingAddress.address}, {detail.shippingAddress.district}, {detail.shippingAddress.province}</p>
                        </div>

                        <div className="mt-4 rounded-xl border border-slate-200 overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50/80">
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Sản phẩm</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">SL</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Đơn giá</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detail.items.map((item) => (
                                        <tr key={`${item.productId}-${item.productName}`} className="admin-table-row border-t border-slate-100">
                                            <td className="px-4 py-2.5 text-slate-700">{item.productName}</td>
                                            <td className="px-4 py-2.5 text-slate-600">{item.quantity}</td>
                                            <td className="px-4 py-2.5 text-slate-600">{formatPrice(item.price)}</td>
                                            <td className="px-4 py-2.5 font-semibold text-slate-900">{formatPrice(item.subtotal)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 text-sm space-y-1 text-right">
                            <p className="text-slate-500">Tạm tính: <span className="text-slate-700">{formatPrice(detail.subtotal)}</span></p>
                            <p className="text-slate-500">Phí ship: <span className="text-slate-700">{formatPrice(detail.shippingFee)}</span></p>
                            <p className="text-base font-bold text-slate-900">Tổng: {formatPrice(detail.total)}</p>
                        </div>

                        <div className="mt-5 flex justify-end">
                            <button type="button" onClick={() => setDetail(null)} className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer">
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {detailLoading && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 flex items-center gap-2 text-sm text-slate-700 shadow-lg">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang tải chi tiết đơn hàng...
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
