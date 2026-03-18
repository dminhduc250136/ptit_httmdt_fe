import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

interface RelatedProductsProps {
    currentProduct: Product;
    allProducts: Product[];
}

export default function RelatedProducts({
    currentProduct,
    allProducts,
}: RelatedProductsProps) {
    const related = allProducts
        .filter((p) => p.id !== currentProduct.id)
        .slice(0, 4);

    if (related.length === 0) return null;

    return (
        <section className="mt-10" aria-labelledby="related-heading">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
                <h2
                    id="related-heading"
                    className="text-xl font-bold text-primary"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                    Sản phẩm tương tự
                </h2>
                <Link
                    href="/laptops"
                    className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-hover transition-colors duration-200 cursor-pointer"
                >
                    Xem tất cả
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {related.map((product) => (
                    <Link key={product.id} href={`/laptops/${product.id}`} className="block">
                        <ProductCard product={product} showDiscount />
                    </Link>
                ))}
            </div>
        </section>
    );
}
