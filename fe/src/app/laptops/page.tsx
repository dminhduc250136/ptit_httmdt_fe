"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Search } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import FilterSidebar, { type FilterState } from "@/components/FilterSidebar";
import SortBar, { type SortOption } from "@/components/SortBar";
import ProductCard from "@/components/ProductCard";
import { getBrands, getProducts } from "@/lib/api";
import type { Brand, Product } from "@/lib/types";

const priceRanges = [
    { label: "Dưới 20 triệu", min: 0, max: 20000000 },
    { label: "20 - 40 triệu", min: 20000000, max: 40000000 },
    { label: "40 - 60 triệu", min: 40000000, max: 60000000 },
    { label: "Trên 60 triệu", min: 60000000, max: Number.MAX_SAFE_INTEGER },
];

export default function LaptopsPage() {
    const searchParams = useSearchParams();
    const categoryFromQuery = searchParams.get("category") || undefined;
    const searchFromQuery = searchParams.get("search") || undefined;
    const [products, setProducts] = useState<Product[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<FilterState>({
        brands: [],
        priceRange: [],
        cpuFamily: [],
        ram: [],
    });
    const [sortBy, setSortBy] = useState<SortOption>("popular");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    useEffect(() => {
        let active = true;
        Promise.all([
            getProducts({ size: 100, search: searchFromQuery }),
            getBrands(),
        ])
            .then(([productRes, brandRes]) => {
                if (!active) return;
                setProducts(productRes);
                setBrands(brandRes);

                const matchedBrand = categoryFromQuery
                    ? brandRes.find((brand) => brand.slug === categoryFromQuery)
                    : null;

                setFilters((prev) => ({
                    ...prev,
                    brands: matchedBrand ? [matchedBrand.name] : [],
                }));
            })
            .catch(() => {
                if (!active) return;
                setProducts([]);
                setBrands([]);
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [categoryFromQuery, searchFromQuery]);

    // Filter logic
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Brand filter
        if (filters.brands.length > 0) {
            result = result.filter((p) => filters.brands.includes(p.brand));
        }

        // Price range filter
        if (filters.priceRange.length > 0) {
            const selectedRanges = priceRanges.filter((r) =>
                filters.priceRange.includes(r.label)
            );
            result = result.filter((p) =>
                selectedRanges.some((r) => p.price >= r.min && p.price < r.max)
            );
        }

        // CPU filter
        if (filters.cpuFamily.length > 0) {
            result = result.filter((p) =>
                filters.cpuFamily.some((cpu) => p.specs.cpu.includes(cpu))
            );
        }

        // RAM filter
        if (filters.ram.length > 0) {
            result = result.filter((p) => filters.ram.includes(p.specs.ram));
        }

        // Sort
        switch (sortBy) {
            case "popular":
                result.sort((a, b) => b.soldCount - a.soldCount);
                break;
            case "newest":
                result.sort((a, b) => b.id - a.id);
                break;
            case "price-asc":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                result.sort((a, b) => b.price - a.price);
                break;
            case "rating":
                result.sort((a, b) => b.rating - a.rating);
                break;
        }

        return result;
    }, [filters, sortBy, products]);

    const activeFilterCount =
        filters.brands.length +
        filters.priceRange.length +
        filters.cpuFamily.length +
        filters.ram.length;

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb items={[{ label: "Laptop" }]} />
                </div>

                {/* Page Title */}
                <div className="mb-6">
                    <h1
                        className="text-2xl sm:text-3xl font-bold text-primary"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                        {searchFromQuery ? `Kết quả tìm kiếm` : "Tất cả Laptop"}
                    </h1>
                    <p className="text-sm text-muted mt-1">
                        {searchFromQuery
                            ? `Hiển thị kết quả cho: "${searchFromQuery}"`
                            : "Khám phá bộ sưu tập laptop cao cấp từ các thương hiệu hàng đầu"}
                    </p>
                    {searchFromQuery && (
                        <Link
                            href="/laptops"
                            className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-white border border-border rounded-xl text-sm font-medium text-primary hover:border-accent transition-colors cursor-pointer"
                        >
                            <X className="w-3.5 h-3.5" />
                            Xóa tìm kiếm
                        </Link>
                    )}
                </div>

                {/* Mobile Filter Button */}
                <div className="lg:hidden mb-4">
                    <button
                        onClick={() => setMobileFilterOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-xl text-sm font-medium text-primary hover:border-accent transition-colors duration-200 cursor-pointer"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Bộ lọc
                        {activeFilterCount > 0 && (
                            <span className="w-5 h-5 bg-accent text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* 2-Column Layout */}
                <div className="flex gap-6 lg:gap-8">
                    {/* Sidebar — Desktop (25%) */}
                    <div className="hidden lg:block w-[280px] shrink-0">
                        <div className="sticky top-[96px] bg-white rounded-2xl border border-border p-5">
                            <FilterSidebar
                                products={products}
                                brands={brands}
                                priceRanges={priceRanges}
                                filters={filters}
                                onFilterChange={setFilters}
                            />
                        </div>
                    </div>

                    {/* Mobile Filter Drawer */}
                    {mobileFilterOpen && (
                        <div className="fixed inset-0 z-50 lg:hidden">
                            {/* Overlay */}
                            <div
                                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                                onClick={() => setMobileFilterOpen(false)}
                            />
                            {/* Drawer */}
                            <div className="absolute left-0 top-0 bottom-0 w-[320px] max-w-[85vw] bg-white overflow-y-auto"
                                style={{ boxShadow: "var(--shadow-dropdown)" }}
                            >
                                <div className="sticky top-0 bg-white border-b border-border px-5 py-4 flex items-center justify-between z-10">
                                    <h2
                                        className="text-base font-bold text-primary"
                                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                                    >
                                        Bộ lọc
                                    </h2>
                                    <button
                                        onClick={() => setMobileFilterOpen(false)}
                                        className="p-2 rounded-xl hover:bg-surface-hover transition-colors duration-200 cursor-pointer"
                                        aria-label="Đóng bộ lọc"
                                    >
                                        <X className="w-5 h-5 text-primary" />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <FilterSidebar
                                        products={products}
                                        brands={brands}
                                        priceRanges={priceRanges}
                                        filters={filters}
                                        onFilterChange={setFilters}
                                    />
                                </div>
                                <div className="sticky bottom-0 bg-white border-t border-border p-4">
                                    <button
                                        onClick={() => setMobileFilterOpen(false)}
                                        className="w-full py-3 bg-accent text-white text-sm font-semibold rounded-xl hover:bg-accent-hover transition-colors duration-200 cursor-pointer"
                                    >
                                        Xem {filteredProducts.length} kết quả
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Content (75%) */}
                    <div className="flex-1 min-w-0">
                        {/* Sort Bar */}
                        <SortBar
                            totalResults={filteredProducts.length}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                        />

                        {loading ? (
                            <div className="mt-10 flex items-center justify-center py-14">
                                <div className="flex flex-col items-center gap-3 text-muted">
                                    <span className="inline-block w-9 h-9 border-4 border-slate-200 border-t-accent rounded-full animate-spin" />
                                    <p className="text-sm">Đang tải sản phẩm...</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Product Grid */}
                                {filteredProducts.length > 0 ? (
                                    <div
                                        className={`mt-6 ${viewMode === "grid"
                                            ? "grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
                                            : "flex flex-col gap-4"
                                            }`}
                                    >
                                        {filteredProducts.map((product) => (
                                            <Link key={product.id} href={`/laptops/${product.id}`} className="block h-full">
                                                <ProductCard product={product} />
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    /* Empty State */
                                    <div className="mt-12 text-center py-16">
                                        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
                                            <SlidersHorizontal className="w-7 h-7 text-muted" />
                                        </div>
                                        <h3
                                            className="text-lg font-semibold text-primary mb-2"
                                            style={{ fontFamily: "var(--font-space-grotesk)" }}
                                        >
                                            Không tìm thấy sản phẩm
                                        </h3>
                                        <p className="text-sm text-muted mb-4">
                                            Hãy thử thay đổi bộ lọc để tìm sản phẩm phù hợp
                                        </p>
                                        <button
                                            onClick={() =>
                                                setFilters({
                                                    brands: [],
                                                    priceRange: [],
                                                    cpuFamily: [],
                                                    ram: [],
                                                })
                                            }
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-xl hover:bg-accent-hover transition-colors duration-200 cursor-pointer"
                                        >
                                            Xóa bộ lọc
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
