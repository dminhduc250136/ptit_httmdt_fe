"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (nextPage: number) => void;
    disabled?: boolean;
}

export default function AdminPagination({
    currentPage,
    totalPages,
    onPageChange,
    disabled = false,
}: AdminPaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const safeCurrent = Math.min(Math.max(currentPage, 0), totalPages - 1);
    const start = Math.max(0, safeCurrent - 2);
    const end = Math.min(totalPages, start + 5);
    const pages = Array.from({ length: end - start }, (_, idx) => start + idx);

    return (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted font-medium">
                Trang <span className="text-accent font-semibold">{safeCurrent + 1}</span>
                <span className="mx-1">/</span>
                <span className="font-semibold">{totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    disabled={disabled || safeCurrent === 0}
                    onClick={() => onPageChange(safeCurrent - 1)}
                    className="group px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
                >
                    <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                    Trước
                </button>
                <div className="flex items-center gap-1.5">
                    {pages.map((page) => (
                        <button
                            key={page}
                            type="button"
                            disabled={disabled}
                            onClick={() => onPageChange(page)}
                            className={`min-w-[40px] h-10 px-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                page === safeCurrent
                                    ? "bg-gradient-to-r from-accent to-blue-600 text-white shadow-lg shadow-accent/25 scale-105"
                                    : "bg-white border border-slate-200 text-primary hover:border-accent hover:shadow-md hover:scale-105 disabled:opacity-40"
                            }`}
                        >
                            {page + 1}
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    disabled={disabled || safeCurrent >= totalPages - 1}
                    onClick={() => onPageChange(safeCurrent + 1)}
                    className="group px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
                >
                    Sau
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
            </div>
        </div>
    );
}
