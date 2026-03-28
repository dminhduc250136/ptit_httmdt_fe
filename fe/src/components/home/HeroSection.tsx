"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ChevronRight,
    Laptop,
    ArrowRight,
    Cpu,
    Monitor,
    Zap,
} from "lucide-react";
import type { Brand } from "@/lib/types";

export default function HeroSection({ categories }: { categories: Brand[] }) {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    return (
        <section className="relative bg-gradient-to-br from-primary via-primary-light to-slate-800 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 right-20 w-96 h-96 bg-accent rounded-full blur-[120px]" />
                <div className="absolute bottom-10 left-10 w-64 h-64 bg-gold rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-6 py-6 lg:py-8">
                    {/* Category Sidebar - Desktop */}
                    <div className="hidden lg:block w-64 shrink-0">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
                            <div className="px-4 py-3 border-b border-white/10">
                                <h3
                                    className="text-sm font-semibold text-white/90 uppercase tracking-wider"
                                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                                >
                                    Danh mục sản phẩm
                                </h3>
                            </div>
                            <nav className="py-1">
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.slug}
                                        href={`/products?category=${encodeURIComponent(cat.slug)}`}
                                        className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors duration-200 ${activeCategory === cat.slug
                                                ? "bg-accent/20 text-white"
                                                : "text-white/70 hover:bg-white/5 hover:text-white"
                                            }`}
                                        onMouseEnter={() => setActiveCategory(cat.slug)}
                                        onMouseLeave={() => setActiveCategory(null)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-accent">
                                                <Laptop className="w-5 h-5" />
                                            </span>
                                            <span className="text-sm font-medium">{cat.name}</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 opacity-50" />
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Banner */}
                    <div className="flex-1 min-h-[320px] sm:min-h-[380px] lg:min-h-[400px] bg-gradient-to-br from-accent/20 to-transparent rounded-2xl border border-white/10 p-6 sm:p-8 lg:p-10 flex flex-col justify-center relative overflow-hidden">
                        {/* Floating tech icons */}
                        <div className="absolute top-6 right-6 opacity-20 hidden sm:block">
                            <Cpu className="w-24 h-24 text-white" strokeWidth={0.5} />
                        </div>
                        <div className="absolute bottom-8 right-24 opacity-10 hidden sm:block">
                            <Monitor className="w-16 h-16 text-white" strokeWidth={0.5} />
                        </div>

                        {/* Category pills - Mobile */}
                        <div className="flex gap-2 mb-6 lg:hidden flex-wrap">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.slug}
                                    href={`/products?category=${encodeURIComponent(cat.slug)}`}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium text-white/80 hover:bg-white/20 transition-colors duration-200 cursor-pointer"
                                >
                                    <Laptop className="w-4 h-4" />
                                    {cat.name}
                                </Link>
                            ))}
                        </div>

                        <div className="max-w-lg relative z-10">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/20 rounded-full text-gold text-xs font-semibold mb-4">
                                <Zap className="w-3.5 h-3.5" />
                                FLASH SALE MÙA HÈ 2026
                            </div>

                            <h1
                                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4"
                                style={{ fontFamily: "var(--font-space-grotesk)" }}
                            >
                                Laptop High-end
                                <br />
                                <span className="text-accent">Giá Tốt Nhất</span>
                            </h1>

                            <p className="text-sm sm:text-base text-white/60 mb-6 leading-relaxed max-w-md">
                                Khám phá bộ sưu tập laptop cao cấp từ các thương hiệu hàng
                                đầu. Giảm đến <span className="text-gold font-semibold">40%</span> cho
                                các dòng laptop Gaming và MacBook.
                            </p>

                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href="/laptops"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-xl transition-colors duration-200 cursor-pointer"
                                >
                                    Khám phá ngay
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/laptops"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl border border-white/20 transition-colors duration-200 cursor-pointer"
                                >
                                    Flash Sale
                                    <Zap className="w-4 h-4 text-gold" />
                                </Link>
                            </div>
                        </div>

                        {/* Trust badges */}
                        <div className="flex flex-wrap gap-4 sm:gap-6 mt-8 pt-6 border-t border-white/10">
                            {[
                                { label: "Chính hãng 100%", icon: "shield" },
                                { label: "Freeship toàn quốc", icon: "truck" },
                                { label: "Bảo hành 24 tháng", icon: "award" },
                            ].map((badge) => (
                                <div
                                    key={badge.label}
                                    className="flex items-center gap-2 text-xs text-white/50"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-success" />
                                    {badge.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
