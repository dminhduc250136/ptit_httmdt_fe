import Image from "next/image";
import { Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, calculateDiscount } from "@/lib/utils";

interface ProductCardProps {
    product: Product;
    showDiscount?: boolean;
}

export default function ProductCard({
    product,
    showDiscount = true,
}: ProductCardProps) {
    const discount = calculateDiscount(product.originalPrice, product.price);
    const cpuTag = product.specs?.cpu?.split(" ").slice(-1)[0] || "CPU";
    const ramTag = product.specs?.ram || "RAM";
    const storageTag = product.specs?.storage || "SSD";

    return (
        <div className="group relative h-full bg-white rounded-2xl border border-border overflow-hidden cursor-pointer card-hover flex flex-col">
            {/* Badge */}
            {product.badge && (
                <div
                    className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg text-xs font-bold text-white ${product.badge === "Hot"
                            ? "bg-cta"
                            : product.badge === "New"
                                ? "bg-accent"
                                : "bg-gold"
                        }`}
                >
                    {product.badge}
                </div>
            )}

            {/* Discount Badge */}
            {showDiscount && discount > 0 && (
                <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded-lg text-xs font-bold text-white bg-cta/90">
                    -{discount}%
                </div>
            )}

            {/* Image Container */}
            <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col gap-3">
                {/* Brand */}
                <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                    {product.brand}
                </span>

                {/* Name */}
                <h3 className="text-sm font-semibold text-primary leading-snug line-clamp-2 min-h-[2.5rem]"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                    {product.name}
                </h3>

                {/* Specs Preview */}
                <div className="flex flex-wrap gap-1.5 min-h-[2.2rem] content-start">
                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-muted rounded-md font-medium">
                        {cpuTag}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-muted rounded-md font-medium">
                        {ramTag}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-muted rounded-md font-medium">
                        {storageTag}
                    </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < Math.floor(product.rating)
                                        ? "fill-gold text-gold"
                                        : "fill-slate-200 text-slate-200"
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-muted">
                        ({product.reviewCount})
                    </span>
                </div>

                {/* Price */}
                <div className="flex items-end gap-2 pt-1 mt-auto min-h-[2rem]">
                    <span className="text-lg font-bold text-cta" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        {formatPrice(product.price)}
                    </span>
                </div>
                <span className="text-xs text-muted line-through -mt-2 block min-h-[1rem]">
                    {product.originalPrice > product.price ? formatPrice(product.originalPrice) : "\u00a0"}
                </span>

                {/* Sold count */}
                <div className="text-xs text-muted">
                    Đã bán{" "}
                    <span className="font-semibold text-primary">
                        {product.soldCount.toLocaleString("vi-VN")}
                    </span>
                </div>
            </div>
        </div>
    );
}
