import { notFound } from "next/navigation";
import { Star, Zap, Shield, Truck, RotateCcw, Gift, CheckCircle2 } from "lucide-react";
import {
    getProductById,
    getProductReviews,
    getProductReviewSummary,
    getRelatedProducts,
} from "@/lib/api";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import Breadcrumb from "@/components/Breadcrumb";
import ImageGallery from "@/components/ImageGallery";
import AddToCartButton from "@/components/AddToCartButton";
import ReviewSection from "@/components/ReviewSection";
import RelatedProducts from "@/components/RelatedProducts";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { id } = await params;
    const product = await getProductById(Number(id)).catch(() => null);
    if (!product) {
        return { title: "Không tìm thấy sản phẩm" };
    }

    return {
        title: `${product.name} | LaptopVerse`,
        description: product.description?.slice(0, 160),
    };
}

export default async function ProductDetailPage({ params }: Props) {
    const { id } = await params;
    const productId = Number(id);

    if (Number.isNaN(productId)) {
        notFound();
    }

    const [product, reviews, reviewSummary, relatedProducts] = await Promise.all([
        getProductById(productId).catch(() => null),
        getProductReviews(productId).catch(() => []),
        getProductReviewSummary(productId).catch(() => ({ avgRating: 0, totalReviews: 0 })),
        getRelatedProducts(productId).catch(() => []),
    ]);

    if (!product) {
        notFound();
    }

    const discount = calculateDiscount(product.originalPrice, product.price);
    const gallery = product.gallery ?? [product.image];

    return (
        <div className="bg-background min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb
                        items={[
                            { label: "Laptop", href: "/laptops" },
                            { label: product.name },
                        ]}
                    />
                </div>

                {/* ═══════════════════════════════════════════════════
            TOP HALF — Gallery (left) + Purchase Info (right)
        ═══════════════════════════════════════════════════ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
                    {/* LEFT: Image Gallery */}
                    <div>
                        <ImageGallery images={gallery} productName={product.name} />
                    </div>

                    {/* RIGHT: Product Info */}
                    <div className="flex flex-col gap-5">
                        {/* Brand + Badge */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-accent uppercase tracking-wider">
                                {product.brand}
                            </span>
                            <span className="text-sm text-muted">•</span>
                            <span className="text-sm text-muted">{product.category}</span>
                            {product.badge && (
                                <span
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold text-white ${product.badge === "Hot" ? "bg-cta" : product.badge === "New" ? "bg-accent" : "bg-gold"
                                        }`}
                                >
                                    {product.badge}
                                </span>
                            )}
                        </div>

                        {/* H1 Product Name */}
                        <h1
                            className="text-2xl sm:text-3xl font-bold text-primary leading-tight"
                            style={{ fontFamily: "var(--font-space-grotesk)" }}
                        >
                            {product.name}
                        </h1>

                        {/* Rating Row */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < Math.floor(product.rating)
                                            ? "fill-gold text-gold"
                                            : "fill-slate-200 text-slate-200"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-semibold text-primary">{product.rating}</span>
                            <span className="text-sm text-muted">({product.reviewCount} đánh giá)</span>
                            <span className="text-sm text-muted">•</span>
                            <span className="text-sm text-muted">
                                Đã bán <span className="font-semibold text-primary">{product.soldCount.toLocaleString("vi-VN")}</span>
                            </span>
                        </div>

                        {/* ═══ Price Block — Visual Hierarchy Focus ═══
                Design rules applied (ui-ux-pro-max):
                - Sale price: largest, cta color, bold → Highest visual weight
                - Original price: smallest, muted, strikethrough → Lowest weight
                - Discount badge: accent contrast, pill shape → Mid weight
            */}
                        <div className="bg-gradient-to-r from-cta/5 to-transparent rounded-2xl p-4 border border-cta/10">
                            <div className="flex items-end gap-3 flex-wrap">
                                {/* PRIMARY: Sale price — largest, red, loudest */}
                                <span
                                    className="text-4xl sm:text-5xl font-black text-cta tracking-tight"
                                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                                >
                                    {formatPrice(product.price)}
                                </span>

                                {discount > 0 && (
                                    <div className="flex flex-col gap-1 pb-1">
                                        {/* SECONDARY: Original price — muted, crossed out */}
                                        <span className="text-base text-muted line-through">
                                            {formatPrice(product.originalPrice)}
                                        </span>
                                        {/* TERTIARY: Discount % — accent badge */}
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-cta text-white text-sm font-bold rounded-full">
                                            <Zap className="w-3 h-3" />
                                            -{discount}% OFF
                                        </span>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-muted mt-2">
                                Đã bao gồm VAT • Tiết kiệm{" "}
                                <span className="font-semibold text-cta">
                                    {formatPrice(product.originalPrice - product.price)}
                                </span>
                            </p>
                        </div>

                        {/* Quick Specs */}
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { label: "CPU", value: product.specs.cpu.split(" ").slice(-2).join(" ") },
                                { label: "RAM", value: product.specs.ram },
                                { label: "Ổ cứng", value: product.specs.storage },
                                { label: "Màn hình", value: product.specs.display },
                            ].map((spec) => (
                                <div key={spec.label} className="flex flex-col gap-0.5 bg-slate-50 rounded-xl px-3 py-2.5">
                                    <span className="text-[11px] font-semibold text-muted uppercase tracking-wide">
                                        {spec.label}
                                    </span>
                                    <span className="text-xs font-semibold text-primary leading-snug">
                                        {spec.value}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Gifts Block */}
                        {product.gifts && product.gifts.length > 0 && (
                            <div className="bg-gradient-to-br from-gold/5 to-transparent rounded-2xl p-4 border border-gold/20">
                                <div className="flex items-center gap-2 mb-3">
                                    <Gift className="w-4 h-4 text-gold" />
                                    <span
                                        className="text-sm font-bold text-primary"
                                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                                    >
                                        Quà tặng kèm
                                    </span>
                                    <span className="ml-auto text-xs font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                                        {product.gifts.length} quà
                                    </span>
                                </div>
                                <ul className="space-y-2">
                                    {product.gifts.map((gift, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-primary leading-snug">
                                            <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                                            <span>{gift}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* ═══ CTA Buttons — Visual Hierarchy ═══
                "MUA NGAY" = Primary Action: highest contrast, full-width on mobile
                "THÊM VÀO GIỎ" = Secondary: outlined, lower visual weight
                Ratio rule: Primary must be visually dominant (size, color, fill)
            */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            {/* SECONDARY CTA */}
                            <AddToCartButton product={product} />

                            {/* PRIMARY CTA — undeniably the most prominent element */}
                            <button
                                className="flex-1 flex items-center justify-center gap-2 bg-cta hover:bg-cta-hover text-white text-base font-bold py-4 px-6 rounded-2xl transition-all duration-200 cursor-pointer shadow-lg shadow-cta/25 hover:shadow-cta/40 hover:-translate-y-0.5 active:translate-y-0"
                                style={{ fontFamily: "var(--font-space-grotesk)" }}
                            >
                                <Zap className="w-5 h-5" />
                                MUA NGAY
                            </button>
                        </div>

                        {/* Trust badges below CTAs */}
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
                            {[
                                { icon: Shield, label: "Bảo hành 24T" },
                                { icon: Truck, label: "Freeship toàn quốc" },
                                { icon: RotateCcw, label: "Đổi trả 30 ngày" },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                                    <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center">
                                        <Icon className="w-4 h-4 text-accent" />
                                    </div>
                                    <span className="text-[10px] font-medium text-muted leading-tight">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════
            BOTTOM HALF — Description (left) + Specs (right)
        ═══════════════════════════════════════════════════ */}
                <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
                    {/* LEFT: Description */}
                    <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
                        <h2
                            className="text-xl font-bold text-primary mb-5"
                            style={{ fontFamily: "var(--font-space-grotesk)" }}
                        >
                            Mô tả sản phẩm
                        </h2>
                        <div className="prose prose-slate max-w-none">
                            {product.description ? (
                                product.description.split("\n\n").map((para, i) => (
                                    <p
                                        key={i}
                                        className="text-sm text-slate-600 leading-relaxed mb-4 last:mb-0"
                                    >
                                        {para.trim()}
                                    </p>
                                ))
                            ) : (
                                <p className="text-sm text-muted">Chưa có mô tả chi tiết.</p>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Specs Table with Zebra Striping */}
                    <div className="bg-white rounded-2xl border border-border overflow-hidden">
                        <div className="px-6 py-5 border-b border-border">
                            <h2
                                className="text-xl font-bold text-primary"
                                style={{ fontFamily: "var(--font-space-grotesk)" }}
                            >
                                Thông số kỹ thuật
                            </h2>
                        </div>
                        {product.detailedSpecs && product.detailedSpecs.length > 0 ? (
                            <table className="w-full text-sm" role="table" aria-label="Thông số kỹ thuật">
                                <tbody>
                                    {product.detailedSpecs.map((spec, i) => (
                                        <tr
                                            key={spec.label}
                                            /* Zebra striping: alternating row backgrounds */
                                            className={i % 2 === 0 ? "bg-slate-50" : "bg-white"}
                                        >
                                            <td className="px-6 py-3.5 font-semibold text-muted w-[38%] align-top">
                                                {spec.label}
                                            </td>
                                            <td className="px-6 py-3.5 text-primary font-medium align-top">
                                                {spec.value}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="px-6 py-8 text-sm text-muted">Chưa có thông số chi tiết.</div>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                <ReviewSection
                    productId={product.id}
                    reviews={reviews}
                    avgRating={reviewSummary.avgRating || product.rating}
                    totalReviews={reviewSummary.totalReviews || product.reviewCount}
                />

                {/* Related Products */}
                <RelatedProducts currentProduct={product} allProducts={relatedProducts} />
            </div>
        </div>
    );
}
