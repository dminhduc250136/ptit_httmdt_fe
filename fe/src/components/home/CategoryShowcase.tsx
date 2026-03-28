import Link from "next/link";
import { TrendingUp } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

export default function CategoryShowcase({ products }: { products: Product[] }) {
    return (
        <section className="py-10 sm:py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2
                            className="text-xl sm:text-2xl font-bold text-primary"
                            style={{ fontFamily: "var(--font-space-grotesk)" }}
                        >
                            Top Laptop Bán Chạy
                        </h2>
                        <p className="text-xs text-muted mt-0.5">
                            Sản phẩm được yêu thích nhất
                        </p>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                    {products.map((product) => (
                        <Link key={product.id} href={`/laptops/${product.id}`} className="block h-full">
                            <ProductCard
                                product={product}
                                showDiscount={false}
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
