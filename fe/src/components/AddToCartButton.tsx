"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getAuthToken } from "@/lib/authStorage";
import type { Product } from "@/lib/types";

export default function AddToCartButton({ product }: { product: Product }) {
    const router = useRouter();
    const pathname = usePathname();
    const { addItem } = useCart();
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        const token = getAuthToken();
        if (!token) {
            const redirect = pathname || "/";
            router.push(`/auth/login?redirect=${encodeURIComponent(redirect)}`);
            return;
        }

        addItem(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <button
            onClick={handleAdd}
            className={`flex-1 flex items-center justify-center gap-2 text-base font-semibold py-4 px-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${added
                    ? "bg-success/10 border-success text-success"
                    : "bg-white hover:bg-slate-50 text-primary border-primary/20 hover:border-primary/40"
                }`}
            style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
            {added ? (
                <>
                    <Check className="w-5 h-5" />
                    Đã thêm vào giỏ!
                </>
            ) : (
                <>
                    <ShoppingCart className="w-5 h-5" />
                    Thêm vào giỏ
                </>
            )}
        </button>
    );
}
