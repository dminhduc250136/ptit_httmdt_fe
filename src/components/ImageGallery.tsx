"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
    images: string[];
    productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const goNext = () => setActiveIndex((i) => (i + 1) % images.length);
    const goPrev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden group">
                <Image
                    src={images[activeIndex]}
                    alt={`${productName} - ảnh ${activeIndex + 1}`}
                    fill
                    className="object-cover transition-all duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                />

                {/* Image counter */}
                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-lg">
                    {activeIndex + 1} / {images.length}
                </div>

                {/* Navigation arrows (visible on hover) */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={goPrev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-white transition-all duration-200 shadow-md"
                            aria-label="Ảnh trước"
                        >
                            <ChevronLeft className="w-5 h-5 text-primary" />
                        </button>
                        <button
                            onClick={goNext}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-white transition-all duration-200 shadow-md"
                            aria-label="Ảnh tiếp theo"
                        >
                            <ChevronRight className="w-5 h-5 text-primary" />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
                <div className="flex gap-2 sm:gap-3">
                    {images.map((src, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`relative flex-1 aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${index === activeIndex
                                    ? "ring-2 ring-accent ring-offset-2"
                                    : "opacity-60 hover:opacity-100"
                                }`}
                            aria-label={`Xem ảnh ${index + 1}`}
                            aria-pressed={index === activeIndex}
                        >
                            <Image
                                src={src}
                                alt={`${productName} thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
