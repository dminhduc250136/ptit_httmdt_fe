"use client";

import { ArrowUpDown, Grid3X3, LayoutList } from "lucide-react";

export type SortOption =
    | "popular"
    | "price-asc"
    | "price-desc"
    | "newest"
    | "rating";

interface SortBarProps {
    totalResults: number;
    sortBy: SortOption;
    onSortChange: (sort: SortOption) => void;
    viewMode: "grid" | "list";
    onViewModeChange: (mode: "grid" | "list") => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
    { value: "popular", label: "Phổ biến" },
    { value: "newest", label: "Mới nhất" },
    { value: "price-asc", label: "Giá: Thấp → Cao" },
    { value: "price-desc", label: "Giá: Cao → Thấp" },
    { value: "rating", label: "Đánh giá cao" },
];

export default function SortBar({
    totalResults,
    sortBy,
    onSortChange,
    viewMode,
    onViewModeChange,
}: SortBarProps) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-border">
            {/* Result count */}
            <div className="text-sm text-muted">
                Hiển thị{" "}
                <span className="font-semibold text-primary">{totalResults}</span> sản
                phẩm
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                    <ArrowUpDown className="w-4 h-4 text-muted shrink-0" />
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value as SortOption)}
                        className="w-full sm:w-auto text-sm bg-background border border-border rounded-xl px-3 py-2.5 min-h-[44px] text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors duration-200 cursor-pointer appearance-none"
                        aria-label="Sắp xếp theo"
                    >
                        {sortOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* View Mode Toggles */}
                <div className="hidden sm:flex items-center gap-1 border border-border rounded-xl p-1">
                    <button
                        onClick={() => onViewModeChange("grid")}
                        className={`p-2 rounded-lg transition-colors duration-200 cursor-pointer ${viewMode === "grid"
                                ? "bg-accent text-white"
                                : "text-muted hover:text-primary hover:bg-surface-hover"
                            }`}
                        aria-label="Hiển thị dạng lưới"
                        aria-pressed={viewMode === "grid"}
                    >
                        <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onViewModeChange("list")}
                        className={`p-2 rounded-lg transition-colors duration-200 cursor-pointer ${viewMode === "list"
                                ? "bg-accent text-white"
                                : "text-muted hover:text-primary hover:bg-surface-hover"
                            }`}
                        aria-label="Hiển thị dạng danh sách"
                        aria-pressed={viewMode === "list"}
                    >
                        <LayoutList className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
