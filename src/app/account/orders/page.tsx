"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ReceiptText } from "lucide-react";
import { getMyOrders } from "@/lib/api";
import { getAuthToken } from "@/lib/authStorage";
import { formatPrice } from "@/lib/utils";
import type { OrderListItem } from "@/lib/types";

type OrderFilterKey =
    | "ALL"
    | "WAIT_PAYMENT"
    | "WAIT_CONFIRM"
    | "WAIT_SHIPPING"
    | "WAIT_RECEIVE"
    | "REVIEW"
    | "RETURN";

const ORDER_FILTERS: Array<{ key: OrderFilterKey; label: string }> = [
    { key: "ALL", label: "Tất cả" },
    { key: "WAIT_PAYMENT", label: "Chờ thanh toán" },
    { key: "WAIT_CONFIRM", label: "Chờ xác nhận" },
    { key: "WAIT_SHIPPING", label: "Chờ giao hàng" },
    { key: "WAIT_RECEIVE", label: "Chờ nhận" },
    { key: "REVIEW", label: "Đánh giá" },
    { key: "RETURN", label: "Hoàn trả" },
];

function getStatusLabel(order: OrderListItem): string {
    if (order.orderStatus === "PENDING" && order.paymentStatus === "PENDING" && order.paymentMethod === "VNPAY") {
        return "Chờ thanh toán";
    }

    const map: Record<string, string> = {
        PENDING: "Chờ xác nhận",
        CONFIRMED: "Đã xác nhận",
        CANCEL_REQUESTED: "Đang chờ duyệt hủy",
        PROCESSING: "Đang chuẩn bị hàng",
        SHIPPING: "Đang giao hàng",
        DELIVERED: "Đã giao hàng",
        COMPLETED: "Hoàn thành",
        CANCELLED: "Đã hủy",
        RETURNED: "Đã hoàn trả",
    };

    return map[order.orderStatus] || order.orderStatus;
}

function matchOrderFilter(order: OrderListItem, key: OrderFilterKey): boolean {
    if (key === "ALL") return true;
    if (key === "WAIT_PAYMENT") {
        return order.orderStatus === "PENDING" && order.paymentStatus === "PENDING" && order.paymentMethod === "VNPAY";
    }
    if (key === "WAIT_CONFIRM") {
        return order.orderStatus === "PENDING";
    }
    if (key === "WAIT_SHIPPING") {
        return order.orderStatus === "CONFIRMED" || order.orderStatus === "PROCESSING";
    }
    if (key === "WAIT_RECEIVE") {
        return order.orderStatus === "SHIPPING" || order.orderStatus === "DELIVERED";
    }
    if (key === "REVIEW") {
        return order.orderStatus === "COMPLETED";
    }
    return ["RETURNED", "CANCELLED", "CANCEL_REQUESTED"].includes(order.orderStatus);
}

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<OrderListItem[]>([]);
    const [activeFilter, setActiveFilter] = useState<OrderFilterKey>("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const filteredOrders = useMemo(
        () => orders.filter((order) => matchOrderFilter(order, activeFilter)),
        [orders, activeFilter]
    );

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            router.replace("/auth/login");
            return;
        }

        getMyOrders(token)
            .then(setOrders)
            .catch((err) => {
                const message = err instanceof Error ? err.message : "Không tải được danh sách đơn hàng";
                setError(message);
            })
            .finally(() => setLoading(false));
    }, [router]);

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10">
            <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Đơn hàng của tôi
            </h1>
            <p className="text-sm text-muted mt-1">Theo dõi trạng thái các đơn hàng đã đặt.</p>

            <div className="mt-4 flex flex-wrap gap-2">
                {ORDER_FILTERS.map((filter) => {
                    const count = orders.filter((order) => matchOrderFilter(order, filter.key)).length;
                    return (
                        <button
                            key={filter.key}
                            type="button"
                            onClick={() => setActiveFilter(filter.key)}
                            className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${activeFilter === filter.key
                                ? "bg-accent text-white"
                                : "bg-white border border-border text-primary hover:border-accent"
                                }`}
                        >
                            {filter.label} ({count})
                        </button>
                    );
                })}
            </div>

            <div className="mt-6 bg-white border border-border rounded-2xl overflow-hidden">
                {loading && (
                    <div className="p-6 flex items-center gap-2 text-muted">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang tải đơn hàng...
                    </div>
                )}

                {!loading && error && <p className="p-6 text-sm text-cta">{error}</p>}

                {!loading && !error && filteredOrders.length === 0 && (
                    <div className="p-8 text-center text-muted">
                        <ReceiptText className="w-8 h-8 mx-auto mb-2" />
                        Không có đơn hàng ở mục này.
                    </div>
                )}

                {!loading && !error && filteredOrders.length > 0 && (
                    <div className="divide-y divide-border">
                        {filteredOrders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/account/orders/${order.orderCode}`}
                                className="block p-4 sm:p-5 hover:bg-surface-hover transition-colors duration-200"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div>
                                        <p className="text-sm font-semibold text-primary">#{order.orderCode}</p>
                                        <p className="text-xs text-muted mt-1">
                                            {new Date(order.createdAt).toLocaleString("vi-VN")}
                                        </p>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <p className="text-sm font-semibold text-primary">{formatPrice(order.total)}</p>
                                        <p className="text-xs text-muted mt-1">
                                            {order.itemCount} sản phẩm • {getStatusLabel(order)}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
