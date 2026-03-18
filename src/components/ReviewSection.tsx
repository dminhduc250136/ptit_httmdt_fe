"use client";

import { useState } from "react";
import { Star, ThumbsUp, CheckCircle, ChevronDown } from "lucide-react";
import type { ProductReview } from "@/lib/types";

interface ReviewSectionProps {
    productId: number;
    reviews: ProductReview[];
    avgRating: number;
    totalReviews: number;
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
    const sizes = { sm: "w-3.5 h-3.5", md: "w-4 h-4", lg: "w-5 h-5" };
    return (
        <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={`${sizes[size]} ${i < Math.floor(rating) ? "fill-gold text-gold" : "fill-slate-200 text-slate-200"
                        }`}
                />
            ))}
        </div>
    );
}

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="flex items-center gap-2 text-xs">
            <span className="w-3 text-right text-muted font-medium">{star}</span>
            <Star className="w-3 h-3 fill-gold text-gold shrink-0" />
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gold rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="w-6 text-muted">{count}</span>
        </div>
    );
}

function ReviewCard({ review }: { review: ProductReview }) {
    const [helpful, setHelpful] = useState(review.helpful);
    const [voted, setVoted] = useState(false);

    const dateFormatted = new Date(review.date).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    return (
        <div className="py-6 border-b border-border last:border-b-0">
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {review.avatar}
                </div>

                <div className="flex-1 min-w-0">
                    {/* Author & Date */}
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-semibold text-primary">{review.author}</span>
                        {review.verified && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-success">
                                <CheckCircle className="w-3 h-3" />
                                Đã mua hàng
                            </span>
                        )}
                        <span className="text-xs text-muted ml-auto">{dateFormatted}</span>
                    </div>

                    {/* Stars + Title */}
                    <div className="flex items-center gap-2 mb-2">
                        <StarRating rating={review.rating} size="sm" />
                        <span className="text-sm font-semibold text-primary">{review.title}</span>
                    </div>

                    {/* Content */}
                    <p className="text-sm text-slate-600 leading-relaxed">{review.content}</p>

                    {/* Helpful */}
                    <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs text-muted">Hữu ích không?</span>
                        <button
                            onClick={() => {
                                if (!voted) {
                                    setHelpful((h) => h + 1);
                                    setVoted(true);
                                }
                            }}
                            disabled={voted}
                            className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors duration-200 cursor-pointer ${voted
                                    ? "border-accent bg-accent/10 text-accent"
                                    : "border-border hover:border-accent hover:text-accent text-muted"
                                }`}
                        >
                            <ThumbsUp className="w-3 h-3" />
                            Có ({helpful})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ReviewSection({
    reviews,
    avgRating,
    totalReviews,
}: ReviewSectionProps) {
    const [showAll, setShowAll] = useState(false);
    const [filterRating, setFilterRating] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<"newest" | "helpful">("newest");

    // Rating distribution
    const dist = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((r) => Math.floor(r.rating) === star).length,
    }));

    // Filter + sort
    let displayed = filterRating
        ? reviews.filter((r) => Math.floor(r.rating) === filterRating)
        : [...reviews];

    displayed =
        sortBy === "helpful"
            ? displayed.sort((a, b) => b.helpful - a.helpful)
            : displayed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const visible = showAll ? displayed : displayed.slice(0, 3);

    return (
        <section className="mt-10" aria-labelledby="reviews-heading">
            <div className="bg-white rounded-2xl border border-border overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-border">
                    <h2
                        id="reviews-heading"
                        className="text-xl font-bold text-primary"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                        Đánh giá & Nhận xét
                    </h2>
                </div>

                <div className="p-6">
                    {reviews.length === 0 ? (
                        <div className="text-center py-12">
                            <Star className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                            <p className="text-muted text-sm">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                        </div>
                    ) : (
                        <>
                            {/* Summary */}
                            <div className="flex flex-col sm:flex-row gap-8 mb-8 pb-8 border-b border-border">
                                {/* Overall score */}
                                <div className="flex flex-col items-center justify-center sm:w-40 shrink-0">
                                    <span
                                        className="text-6xl font-black text-primary"
                                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                                    >
                                        {avgRating.toFixed(1)}
                                    </span>
                                    <StarRating rating={avgRating} size="md" />
                                    <span className="text-xs text-muted mt-1">{totalReviews} đánh giá</span>
                                </div>

                                {/* Distribution bars */}
                                <div className="flex-1 space-y-2">
                                    {dist.map(({ star, count }) => (
                                        <button
                                            key={star}
                                            onClick={() =>
                                                setFilterRating(filterRating === star ? null : star)
                                            }
                                            className={`w-full cursor-pointer rounded-lg px-2 py-0.5 transition-colors duration-150 ${filterRating === star ? "bg-accent/5 ring-1 ring-accent/20" : "hover:bg-slate-50"
                                                }`}
                                        >
                                            <RatingBar star={star} count={count} total={reviews.length} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort & Filter toolbar */}
                            <div className="flex items-center gap-3 flex-wrap mb-4">
                                <span className="text-xs text-muted font-medium">Sắp xếp:</span>
                                {[
                                    { key: "newest" as const, label: "Mới nhất" },
                                    { key: "helpful" as const, label: "Hữu ích nhất" },
                                ].map(({ key, label }) => (
                                    <button
                                        key={key}
                                        onClick={() => setSortBy(key)}
                                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors duration-200 cursor-pointer ${sortBy === key
                                                ? "border-accent bg-accent/10 text-accent font-medium"
                                                : "border-border text-muted hover:border-accent hover:text-accent"
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}

                                {filterRating && (
                                    <button
                                        onClick={() => setFilterRating(null)}
                                        className="text-xs px-3 py-1.5 rounded-lg bg-cta/10 text-cta border border-cta/20 cursor-pointer ml-auto"
                                    >
                                        {filterRating} sao ×
                                    </button>
                                )}
                            </div>

                            {/* Review list */}
                            <div>
                                {visible.length > 0 ? (
                                    visible.map((review) => <ReviewCard key={review.id} review={review} />)
                                ) : (
                                    <p className="text-sm text-muted py-8 text-center">
                                        Không có đánh giá {filterRating} sao nào.
                                    </p>
                                )}
                            </div>

                            {/* Show more */}
                            {displayed.length > 3 && (
                                <button
                                    onClick={() => setShowAll(!showAll)}
                                    className="mt-4 w-full flex items-center justify-center gap-2 py-3 border border-border rounded-xl text-sm font-medium text-muted hover:border-accent hover:text-accent transition-colors duration-200 cursor-pointer"
                                >
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform duration-200 ${showAll ? "rotate-180" : ""}`}
                                    />
                                    {showAll ? "Thu gọn" : `Xem thêm ${displayed.length - 3} đánh giá`}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
