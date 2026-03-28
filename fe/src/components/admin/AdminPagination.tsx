"use client";

interface AdminPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (nextPage: number) => void;
    disabled?: boolean;
}

export default function AdminPagination({ currentPage, totalPages, onPageChange, disabled = false }: AdminPaginationProps) {
    if (totalPages <= 1) return null;

    const safeCurrent = Math.min(Math.max(currentPage, 0), totalPages - 1);
    const start = Math.max(0, safeCurrent - 2);
    const end = Math.min(totalPages, start + 5);
    const pages = Array.from({ length: end - start }, (_, idx) => start + idx);

    return (
        <div className="mt-4 flex items-center justify-between gap-3 text-sm">
            <p className="text-slate-400">
                Trang {safeCurrent + 1}/{totalPages}
            </p>
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    disabled={disabled || safeCurrent === 0}
                    onClick={() => onPageChange(safeCurrent - 1)}
                    className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    Trước
                </button>
                {pages.map((page) => (
                    <button
                        key={page}
                        type="button"
                        disabled={disabled}
                        onClick={() => onPageChange(page)}
                        className={`px-3.5 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                            page === safeCurrent
                                ? "border-blue-500 bg-blue-500 text-white shadow-sm"
                                : "border-slate-200 text-slate-700 hover:bg-slate-50"
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                        {page + 1}
                    </button>
                ))}
                <button
                    type="button"
                    disabled={disabled || safeCurrent >= totalPages - 1}
                    onClick={() => onPageChange(safeCurrent + 1)}
                    className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    Sau
                </button>
            </div>
        </div>
    );
}
