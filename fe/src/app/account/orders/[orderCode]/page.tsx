"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cancelOrder, getOrderByCode } from "@/lib/api";
import { getAuthToken } from "@/lib/authStorage";
import { formatPrice } from "@/lib/utils";
import type { OrderDetail } from "@/lib/types";

export default function OrderDetailPage() {
    const router = useRouter();
    const params = useParams<{ orderCode: string }>();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [submittingCancel, setSubmittingCancel] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            router.replace("/auth/login");
            return;
        }

        if (!params?.orderCode) return;

        getOrderByCode(params.orderCode, token)
            .then(setOrder)
            .catch((err) => {
                const message = err instanceof Error ? err.message : "Không tải được chi tiết đơn hàng";
                setError(message);
            })
            .finally(() => setLoading(false));
    }, [params?.orderCode, router]);

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-10 flex items-center gap-2 text-muted">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang tải chi tiết đơn hàng...
            </div>
        );
    }

    if (!order) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-10">
                <p className="text-sm text-cta">{error || "Không tìm thấy đơn hàng"}</p>
            </div>
        );
    }

    const canCancelImmediately = order.orderStatus === "PENDING";
    const canRequestCancel = order.orderStatus === "CONFIRMED";

    const handleCancel = async () => {
        const token = getAuthToken();
        if (!token) {
            router.replace("/auth/login");
            return;
        }

        setSubmittingCancel(true);
        setError("");
        try {
            const updated = await cancelOrder(order.orderCode, token);
            setOrder(updated);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Không thể hủy đơn hàng";
            setError(message);
        } finally {
            setSubmittingCancel(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                    Chi tiết đơn #{order.orderCode}
                </h1>
                <p className="text-sm text-muted mt-1">
                    {new Date(order.createdAt).toLocaleString("vi-VN")} • {order.orderStatus}
                </p>

                {(canCancelImmediately || canRequestCancel) && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={submittingCancel}
                        className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cta text-white text-sm font-semibold hover:bg-cta-hover disabled:opacity-70"
                    >
                        {submittingCancel
                            ? "Đang xử lý..."
                            : canCancelImmediately
                                ? "Hủy đơn ngay"
                                : "Gửi yêu cầu hủy đơn"}
                    </button>
                )}

                {order.orderStatus === "CANCEL_REQUESTED" && (
                    <p className="mt-3 text-sm text-amber-600">
                        Yêu cầu hủy đã được gửi, đang chờ người bán phê duyệt.
                    </p>
                )}
            </div>

            <div className="bg-white border border-border rounded-2xl p-4 sm:p-6">
                <h2 className="text-base font-semibold text-primary mb-3">Sản phẩm</h2>
                <div className="space-y-4">
                    {order.items.map((item) => (
                        <div key={`${item.productId}-${item.productName}`} className="flex items-start gap-3">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-surface-hover shrink-0">
                                <Image src={item.productImage} alt={item.productName} fill className="object-cover" sizes="64px" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-primary line-clamp-2">{item.productName}</p>
                                <p className="text-xs text-muted mt-1">SL: {item.quantity}</p>

                                {order.orderStatus === "COMPLETED" && (
                                    <Link
                                        href={`/laptops/${item.productId}`}
                                        className="inline-block mt-2 text-xs font-semibold text-accent hover:text-accent-hover"
                                    >
                                        Đánh giá sản phẩm
                                    </Link>
                                )}
                            </div>
                            <p className="text-sm font-semibold text-primary">{formatPrice(item.subtotal)}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-border rounded-2xl p-4 sm:p-6">
                    <h2 className="text-base font-semibold text-primary mb-3">Giao hàng</h2>
                    <p className="text-sm text-primary-light">{order.shippingAddress.fullName}</p>
                    <p className="text-sm text-primary-light mt-1">{order.shippingAddress.phone}</p>
                    <p className="text-sm text-primary-light mt-1">
                        {order.shippingAddress.address}, {order.shippingAddress.district}, {order.shippingAddress.province}
                    </p>
                </div>

                <div className="bg-white border border-border rounded-2xl p-4 sm:p-6">
                    <h2 className="text-base font-semibold text-primary mb-3">Thanh toán</h2>
                    <div className="text-sm text-primary-light space-y-1.5">
                        <p>Tạm tính: {formatPrice(order.subtotal)}</p>
                        <p>Phí vận chuyển: {formatPrice(order.shippingFee)}</p>
                        <p className="font-semibold text-primary">Tổng cộng: {formatPrice(order.total)}</p>
                        <p>Phương thức: {order.paymentMethod}</p>
                        <p>Trạng thái thanh toán: {order.paymentStatus}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
