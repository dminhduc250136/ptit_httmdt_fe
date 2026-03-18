"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowLeft, Trash2, CheckSquare, Square } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartItemRow from "@/components/cart/CartItemRow";
import CartSummary from "@/components/cart/CartSummary";
import Breadcrumb from "@/components/Breadcrumb";
import { getAuthToken } from "@/lib/authStorage";

export default function CartPage() {
    const router = useRouter();
    const { items, clearCart } = useCart();
    const token = getAuthToken();

    useEffect(() => {
        if (!token) {
            router.replace("/auth/login?redirect=%2Fcart");
        }
    }, [router, token]);

    // ── Selection state: set of selected product IDs ──
    // By default, all items are selected
    const [selectedIds, setSelectedIds] = useState<Set<number>>(
        () => new Set(items.map((i) => i.product.id))
    );

    // Sync: if a new item is added to cart, select it by default
    // (runs when items changes)
    const allIds = items.map((i) => i.product.id);
    const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.has(id));
    const someSelected = allIds.some((id) => selectedIds.has(id));

    const toggleAll = () => {
        if (allSelected) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(allIds));
        }
    };

    const toggleItem = (id: number) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    // Remove deselected IDs when an item is removed from cart
    const handleItemRemoved = (id: number) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    };

    // Compute selected-only totals
    const selectedItems = items.filter((i) => selectedIds.has(i.product.id));
    const selectedTotal = useMemo(
        () => selectedItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
        [selectedItems]
    );
    const selectedQty = selectedItems.reduce((sum, i) => sum + i.quantity, 0);

    const totalQty = items.reduce((s, i) => s + i.quantity, 0);

    if (!token) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <span className="inline-block w-9 h-9 border-4 border-slate-200 border-t-accent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb items={[{ label: "Giỏ hàng" }]} />
                </div>

                {/* Title row */}
                <div className="flex items-center justify-between mb-6">
                    <h1
                        className="text-2xl sm:text-3xl font-bold text-primary"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                        Giỏ hàng{" "}
                        {items.length > 0 && (
                            <span className="text-lg font-normal text-muted">
                                ({totalQty} sản phẩm)
                            </span>
                        )}
                    </h1>

                    {items.length > 0 && (
                        <button
                            onClick={() => { clearCart(); setSelectedIds(new Set()); }}
                            className="flex items-center gap-1.5 text-sm text-muted hover:text-cta transition-colors duration-200 cursor-pointer"
                        >
                            <Trash2 className="w-4 h-4" />
                            Xóa tất cả
                        </button>
                    )}
                </div>

                {items.length === 0 ? (
                    /* ── Empty Cart State ── */
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
                            <ShoppingBag className="w-12 h-12 text-slate-300" />
                        </div>
                        <h2
                            className="text-xl font-bold text-primary mb-2"
                            style={{ fontFamily: "var(--font-space-grotesk)" }}
                        >
                            Giỏ hàng trống
                        </h2>
                        <p className="text-sm text-muted mb-6 max-w-xs">
                            Hãy khám phá các laptop cao cấp và thêm vào giỏ hàng ngay!
                        </p>
                        <Link
                            href="/laptops"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white text-sm font-semibold rounded-2xl hover:bg-accent-hover transition-all duration-200 cursor-pointer shadow-md shadow-accent/20 hover:-translate-y-0.5"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                ) : (
                    /* ── 2-Column Layout ── */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8 items-start">
                        {/* LEFT: Cart Items (2/3 width) */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl border border-border overflow-hidden">
                                {/* Select All header */}
                                <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-slate-50/60">
                                    <button
                                        onClick={toggleAll}
                                        className="flex items-center gap-2 text-sm font-medium text-primary cursor-pointer hover:text-accent transition-colors duration-200"
                                        aria-label={allSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                                    >
                                        {allSelected ? (
                                            <CheckSquare className="w-5 h-5 text-accent" />
                                        ) : someSelected ? (
                                            /* Indeterminate: partially selected */
                                            <div className="w-5 h-5 rounded border-2 border-accent bg-accent/20 flex items-center justify-center">
                                                <div className="w-2.5 h-0.5 bg-accent rounded" />
                                            </div>
                                        ) : (
                                            <Square className="w-5 h-5 text-muted" />
                                        )}
                                        Chọn tất cả ({totalQty} sản phẩm)
                                    </button>

                                    {someSelected && (
                                        <span className="ml-auto text-xs text-muted">
                                            Đã chọn{" "}
                                            <span className="font-semibold text-accent">{selectedQty}</span>
                                            /{totalQty} sản phẩm
                                        </span>
                                    )}
                                </div>

                                {/* Item rows */}
                                <div className="px-5">
                                    {items.map((item) => (
                                        <CartItemRow
                                            key={item.product.id}
                                            item={item}
                                            selected={selectedIds.has(item.product.id)}
                                            onToggleSelect={() => toggleItem(item.product.id)}
                                            onRemoved={() => handleItemRemoved(item.product.id)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Continue shopping link */}
                            <div className="mt-4">
                                <Link
                                    href="/laptops"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-accent transition-colors duration-200 cursor-pointer"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Tiếp tục mua sắm
                                </Link>
                            </div>
                        </div>

                        {/* RIGHT: Order Summary (1/3 width) */}
                        <div className="lg:col-span-1">
                            <CartSummary
                                selectedItems={selectedItems}
                                selectedTotal={selectedTotal}
                                selectedQty={selectedQty}
                                hasSelection={selectedIds.size > 0}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
