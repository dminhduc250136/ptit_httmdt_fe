"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, AlertTriangle, Check, Square } from "lucide-react";
import { useCart, type CartItem } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

interface CartItemRowProps {
    item: CartItem;
    selected: boolean;
    onToggleSelect: () => void;
    onRemoved?: () => void;
}

export default function CartItemRow({ item, selected, onToggleSelect, onRemoved }: CartItemRowProps) {
    const { removeItem, updateQty } = useCart();
    const [removing, setRemoving] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleRemove = () => {
        setRemoving(true);
        setTimeout(() => {
            removeItem(item.product.id);
            onRemoved?.();
        }, 350);
    };

    const subtotal = item.product.price * item.quantity;

    return (
        <div
            className={`flex gap-3 sm:gap-4 py-5 border-b border-border last:border-b-0 transition-all duration-350 ${removing ? "opacity-0 -translate-x-4 scale-95 pointer-events-none" : "opacity-100 translate-x-0 scale-100"
                } ${!selected ? "opacity-60" : ""}`}
            style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
        >
            {/* Checkbox */}
            <button
                onClick={onToggleSelect}
                className="shrink-0 self-start mt-1 cursor-pointer group"
                aria-label={selected ? "Bỏ chọn sản phẩm" : "Chọn sản phẩm"}
                aria-pressed={selected}
            >
                {selected ? (
                    <div className="w-5 h-5 rounded bg-accent flex items-center justify-center transition-colors duration-150">
                        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                    </div>
                ) : (
                    <Square className="w-5 h-5 text-muted group-hover:text-accent transition-colors duration-150" />
                )}
            </button>

            {/* Product Image */}
            <div className="relative w-20 h-16 sm:w-28 sm:h-24 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col gap-2">
                <div>
                    <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                        {item.product.brand}
                    </span>
                    <p
                        className="text-sm font-semibold text-primary leading-snug line-clamp-2"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                        {item.product.name}
                    </p>
                    <p className="text-[11px] text-muted mt-0.5">
                        {item.product.specs.cpu.split(" ").slice(-2).join(" ")} •{" "}
                        {item.product.specs.ram} • {item.product.specs.storage}
                    </p>
                </div>

                {/* Bottom row: qty counter + price + delete */}
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap mt-auto">
                    {/* Quantity Counter */}
                    <div className="flex items-center gap-1 bg-slate-50 rounded-xl p-1 border border-border">
                        <button
                            onClick={() => updateQty(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            aria-label="Giảm số lượng"
                        >
                            <Minus className="w-3.5 h-3.5 text-primary" />
                        </button>

                        <span
                            className="w-8 text-center text-sm font-bold text-primary tabular-nums"
                            style={{ fontFamily: "var(--font-space-grotesk)" }}
                        >
                            {item.quantity}
                        </span>

                        <button
                            onClick={() => updateQty(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= 10}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            aria-label="Tăng số lượng"
                        >
                            <Plus className="w-3.5 h-3.5 text-primary" />
                        </button>
                    </div>

                    {/* Subtotal */}
                    <span
                        className="text-sm font-bold text-cta ml-auto"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                        {formatPrice(subtotal)}
                    </span>

                    {/* Destructive Delete — 2-step safe pattern */}
                    {!confirmDelete ? (
                        <button
                            onClick={() => setConfirmDelete(true)}
                            className="p-1.5 rounded-lg text-muted hover:text-cta hover:bg-cta/5 transition-all duration-200 cursor-pointer"
                            aria-label="Xóa sản phẩm"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    ) : (
                        <div className="flex items-center gap-1.5 bg-cta/5 border border-cta/20 rounded-xl px-2.5 py-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-cta shrink-0" />
                            <span className="text-xs text-cta font-medium whitespace-nowrap">Xóa?</span>
                            <button
                                onClick={handleRemove}
                                className="text-xs font-bold text-white bg-cta hover:bg-cta-hover px-2 py-0.5 rounded-lg transition-colors duration-150 cursor-pointer"
                            >
                                Có
                            </button>
                            <button
                                onClick={() => setConfirmDelete(false)}
                                className="text-xs font-medium text-muted hover:text-primary px-1 py-0.5 rounded-lg transition-colors duration-150 cursor-pointer"
                            >
                                Không
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
