"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tag, X, Zap, ChevronRight } from "lucide-react";
import { useCart, type CartItem } from "@/context/CartContext";
import { getAuthToken } from "@/lib/authStorage";
import { formatPrice } from "@/lib/utils";

const VALID_COUPONS: Record<string, number> = {
    LAPTOP10: 10,
    SALE15: 15,
    NEWUSER20: 20,
    VIPLV5: 5,
};

interface CartSummaryProps {
    selectedItems: CartItem[];   // full CartItem[] for selected rows
    selectedTotal: number;
    selectedQty: number;
    hasSelection: boolean;
}

export default function CartSummary({ selectedItems, selectedTotal, selectedQty, hasSelection }: CartSummaryProps) {
    const router = useRouter();
    const { setCheckoutItems } = useCart();
    const [coupon, setCoupon] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; pct: number } | null>(null);
    const [couponError, setCouponError] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);

    const applyCoupon = async () => {
        const code = coupon.trim().toUpperCase();
        if (!code) return;
        setCouponLoading(true);
        setCouponError("");
        await new Promise((r) => setTimeout(r, 800));
        setCouponLoading(false);

        if (VALID_COUPONS[code]) {
            setAppliedCoupon({ code, pct: VALID_COUPONS[code] });
            setCouponError("");
            setCoupon("");
        } else {
            setCouponError("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
            setAppliedCoupon(null);
        }
    };

    const discount = appliedCoupon ? Math.round(selectedTotal * (appliedCoupon.pct / 100)) : 0;
    const shippingFee = selectedTotal >= 20000000 ? 0 : selectedTotal > 0 ? 150000 : 0;
    const finalTotal = selectedTotal - discount + shippingFee;

    return (
        <div className="bg-white rounded-2xl border border-border overflow-hidden sticky top-24">
            {/* Header */}
            <div className="px-5 py-4 border-b border-border">
                <h2
                    className="text-base font-bold text-primary"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                    Tóm tắt đơn hàng
                </h2>
                {hasSelection && (
                    <p className="text-xs text-muted mt-0.5">{selectedQty} sản phẩm được chọn</p>
                )}
            </div>

            <div className="p-5 space-y-4">
                {/* Coupon Input */}
                <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-2">
                        Mã giảm giá
                    </label>

                    {appliedCoupon ? (
                        <div className="flex items-center gap-2 bg-success/10 border border-success/30 rounded-xl px-3 py-2.5">
                            <Tag className="w-4 h-4 text-success shrink-0" />
                            <span className="text-sm font-bold text-success flex-1">{appliedCoupon.code}</span>
                            <span className="text-xs font-medium text-success">-{appliedCoupon.pct}%</span>
                            <button
                                onClick={() => setAppliedCoupon(null)}
                                className="p-0.5 rounded-md hover:bg-success/20 transition-colors cursor-pointer"
                                aria-label="Xóa mã giảm giá"
                            >
                                <X className="w-3.5 h-3.5 text-success" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={coupon}
                                onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponError(""); }}
                                onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                                placeholder="Nhập mã..."
                                className="flex-1 text-sm px-3 py-2.5 border border-border rounded-xl focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors duration-200 uppercase"
                            />
                            <button
                                onClick={applyCoupon}
                                disabled={!coupon.trim() || couponLoading}
                                className="px-4 py-2.5 text-sm font-semibold bg-accent text-white rounded-xl hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer whitespace-nowrap"
                            >
                                {couponLoading ? (
                                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : "Áp dụng"}
                            </button>
                        </div>
                    )}

                    {couponError && (
                        <p className="text-xs text-cta mt-1.5 flex items-center gap-1">
                            <X className="w-3 h-3 shrink-0" />{couponError}
                        </p>
                    )}
                    <p className="text-[10px] text-muted mt-1.5">
                        Gợi ý: <span className="font-mono text-accent/80">LAPTOP10</span> •{" "}
                        <span className="font-mono text-accent/80">NEWUSER20</span>
                    </p>
                </div>

                <div className="border-t border-border" />

                {/* Price breakdown — based on SELECTED items only */}
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-muted">
                        <span>
                            Tạm tính
                            {hasSelection ? ` (${selectedQty} đã chọn)` : " (chưa chọn)"}
                        </span>
                        <span className="font-medium text-primary">{formatPrice(selectedTotal)}</span>
                    </div>

                    {appliedCoupon && discount > 0 && (
                        <div className="flex justify-between text-success">
                            <span className="flex items-center gap-1">
                                <Tag className="w-3.5 h-3.5" />
                                Giảm giá ({appliedCoupon.pct}%)
                            </span>
                            <span className="font-semibold">-{formatPrice(discount)}</span>
                        </div>
                    )}

                    <div className="flex justify-between text-muted">
                        <span>Phí vận chuyển</span>
                        <span className={shippingFee === 0 ? "text-success font-medium" : "font-medium text-primary"}>
                            {selectedTotal === 0 ? "—" : shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
                        </span>
                    </div>

                    {selectedTotal > 0 && shippingFee > 0 && (
                        <p className="text-[11px] text-muted bg-slate-50 rounded-lg px-3 py-2">
                            Mua thêm{" "}
                            <span className="font-semibold text-accent">
                                {formatPrice(20000000 - selectedTotal)}
                            </span>{" "}
                            để được miễn phí vận chuyển
                        </p>
                    )}
                </div>

                <div className="border-t border-border" />

                {/* Grand Total */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">Tổng cộng</span>
                    <span
                        className="text-2xl font-black text-cta"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                        {formatPrice(finalTotal)}
                    </span>
                </div>

                {/* ═══ Checkout CTA ═══ */}
                {hasSelection ? (
                    <button
                        onClick={() => {
                            const token = getAuthToken();
                            if (!token) {
                                router.push("/auth/login?redirect=%2Fcart");
                                return;
                            }
                            setCheckoutItems(selectedItems);
                            router.push("/checkout");
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-cta hover:bg-cta-hover text-white text-base font-bold py-4 rounded-2xl transition-all duration-200 cursor-pointer shadow-lg shadow-cta/20 hover:shadow-cta/35 hover:-translate-y-0.5 active:translate-y-0"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                        <Zap className="w-5 h-5" />
                        Tiến hành thanh toán
                        <ChevronRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        disabled
                        className="w-full flex items-center justify-center gap-2 bg-slate-200 text-slate-400 text-base font-bold py-4 rounded-2xl cursor-not-allowed"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                        Chọn sản phẩm để thanh toán
                    </button>
                )}

                <p className="text-center text-[11px] text-muted">
                    🔒 Thanh toán an toàn • Bảo mật 256-bit SSL
                </p>
            </div>
        </div>
    );
}
