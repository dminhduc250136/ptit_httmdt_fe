"use client";

import { useState } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import FilterCheckbox from "@/components/FilterCheckbox";
import type { Brand, Product } from "@/lib/types";

export interface FilterState {
    brands: string[];
    priceRange: string[];
    cpuFamily: string[];
    ram: string[];
}

interface FilterSidebarProps {
    products: Product[];
    brands: Brand[];
    priceRanges: Array<{ label: string; min: number; max: number }>;
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
}

interface FilterGroupProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

function FilterGroup({ title, children, defaultOpen = true }: FilterGroupProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-border last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full py-4 text-sm font-semibold text-primary cursor-pointer group"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
                aria-expanded={isOpen}
            >
                {title}
                <ChevronDown
                    className={`w-4 h-4 text-muted group-hover:text-accent transition-all duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>
            {isOpen && <div className="pb-4 space-y-0.5">{children}</div>}
        </div>
    );
}

export default function FilterSidebar({
    products,
    brands,
    priceRanges,
    filters,
    onFilterChange,
}: FilterSidebarProps) {
    const toggleFilter = (
        key: keyof FilterState,
        value: string
    ) => {
        const current = filters[key];
        const updated = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value];
        onFilterChange({ ...filters, [key]: updated });
    };

    const clearAll = () => {
        onFilterChange({ brands: [], priceRange: [], cpuFamily: [], ram: [] });
    };

    const activeCount =
        filters.brands.length +
        filters.priceRange.length +
        filters.cpuFamily.length +
        filters.ram.length;

    // Count products per brand
    const brandOptions = brands.map((b) => b.name);
    const ramOptions = Array.from(new Set(products.map((p) => p.specs.ram))).sort();
    const cpuFamilies = Array.from(
        new Set(
            products
                .map((p) => {
                    const words = p.specs.cpu.split(" ").filter(Boolean);
                    return words.slice(0, Math.min(3, words.length)).join(" ");
                })
                .filter(Boolean)
        )
    );

    const brandCounts = brandOptions.reduce((acc, brand) => {
        acc[brand] = products.filter((p) => p.brand === brand).length;
        return acc;
    }, {} as Record<string, number>);

    // Count products per RAM
    const ramCounts = ramOptions.reduce((acc, ram) => {
        acc[ram] = products.filter((p) => p.specs.ram === ram).length;
        return acc;
    }, {} as Record<string, number>);

    return (
        <aside className="w-full" role="complementary" aria-label="Bộ lọc sản phẩm">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
                <h2
                    className="text-base font-bold text-primary"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                    Bộ lọc
                </h2>
                {activeCount > 0 && (
                    <button
                        onClick={clearAll}
                        className="flex items-center gap-1 text-xs text-cta hover:text-cta-hover font-medium transition-colors duration-200 cursor-pointer"
                    >
                        <RotateCcw className="w-3 h-3" />
                        Xóa tất cả ({activeCount})
                    </button>
                )}
            </div>

            {/* Brand Filter */}
            <FilterGroup title="Thương hiệu">
                {brandOptions.map((brand) => (
                    <FilterCheckbox
                        key={brand}
                        id={`brand-${brand}`}
                        label={brand}
                        checked={filters.brands.includes(brand)}
                        onChange={() => toggleFilter("brands", brand)}
                        count={brandCounts[brand]}
                    />
                ))}
            </FilterGroup>

            {/* Price Range Filter */}
            <FilterGroup title="Khoảng giá">
                {priceRanges.map((range) => (
                    <FilterCheckbox
                        key={range.label}
                        id={`price-${range.label}`}
                        label={range.label}
                        checked={filters.priceRange.includes(range.label)}
                        onChange={() => toggleFilter("priceRange", range.label)}
                    />
                ))}
            </FilterGroup>

            {/* CPU Filter */}
            <FilterGroup title="Dòng CPU">
                {cpuFamilies.map((cpu) => (
                    <FilterCheckbox
                        key={cpu}
                        id={`cpu-${cpu}`}
                        label={cpu}
                        checked={filters.cpuFamily.includes(cpu)}
                        onChange={() => toggleFilter("cpuFamily", cpu)}
                    />
                ))}
            </FilterGroup>

            {/* RAM Filter */}
            <FilterGroup title="RAM">
                {ramOptions.map((ram) => (
                    <FilterCheckbox
                        key={ram}
                        id={`ram-${ram}`}
                        label={ram}
                        checked={filters.ram.includes(ram)}
                        onChange={() => toggleFilter("ram", ram)}
                        count={ramCounts[ram]}
                    />
                ))}
            </FilterGroup>
        </aside>
    );
}
