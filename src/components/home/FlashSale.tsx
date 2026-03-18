"use client";

import { useRef } from "react";
import Link from "next/link";
import { Zap, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import CountdownTimer from "@/components/CountdownTimer";
import type { Product } from "@/lib/types";

interface FlashSaleProps {
    products: Product[];
    endTime?: string | null;
}

export default function FlashSale({ products, endTime }: FlashSaleProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const saleEndTime = new Date(endTime || "2099-01-01T00:00:00.000Z");

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="py-10 sm:py-14 bg-gradient-to-b from-white to-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cta rounded-xl flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2
                                className="text-xl sm:text-2xl font-bold text-primary"
                                style={{ fontFamily: "var(--font-space-grotesk)" }}
                            >
                                Flash Sale
                            </h2>
                            <p className="text-xs text-muted mt-0.5">
                                Kết thúc sau
                            </p>
                        </div>
                        <div className="ml-2">
                            <CountdownTimer targetDate={saleEndTime} />
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="hidden sm:flex items-center gap-2">
                        <button
                            onClick={() => scroll("left")}
                            className="w-9 h-9 rounded-xl border border-border hover:border-accent hover:text-accent flex items-center justify-center transition-colors duration-200 cursor-pointer"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="w-9 h-9 rounded-xl border border-border hover:border-accent hover:text-accent flex items-center justify-center transition-colors duration-200 cursor-pointer"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Product Carousel */}
                {products.length === 0 ? (
                    <div className="bg-white border border-border rounded-2xl px-6 py-10 text-center text-sm text-muted">
                        Hiện chưa có chương trình Flash Sale đang diễn ra.
                    </div>
                ) : (
                    <div className="relative">
                        <div
                            ref={scrollRef}
                            className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 flash-sale-scroll snap-x snap-mandatory"
                            style={{ scrollbarGutter: "stable" }}
                        >
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="min-w-[220px] sm:min-w-[260px] lg:min-w-[280px] snap-start"
                                >
                                    <Link href={`/laptops/${product.id}`} className="block">
                                        <ProductCard product={product} showDiscount />
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {/* Gradient fade edges */}
                        <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-white to-transparent pointer-events-none hidden lg:block" />
                        <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-white to-transparent pointer-events-none hidden lg:block" />
                    </div>
                )}
            </div>
        </section>
    );
}
