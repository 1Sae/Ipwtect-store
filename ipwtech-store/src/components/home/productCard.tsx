"use client";

import Link from "next/link";
import { Product } from "@/src/types/product";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useEffect, useState } from "react";

interface Props {
    product: Product;
}   

export default function ProductCard({ product }: Props) {
    const t = useTheme();
    const images =
        product.images?.length > 0
        ? product.images
        : [product.image];

    const discountedPrice =
        product.discount > 0
        ? product.price -
            (product.price * product.discount) / 100
        : product.price;

    const [isPaused, setIsPaused] = useState(false);
    
    const [current, setCurrent] = useState(0);
    
        const nextSlide = () => {
            setCurrent((prev) =>
            prev === product.images.length - 1 ? 0 : prev + 1
            );
        };
    
        const prevSlide = () => {
            setCurrent((prev) =>
            prev === 0 ? product.images.length - 1 : prev - 1
            );
        };

        useEffect(() => {
                if (!product.images || product.images.length <= 1) return;
            
                const interval = setInterval(() => {
                if (!isPaused) {
                    setCurrent((prev) =>
                    prev === product.images.length - 1 ? 0 : prev + 1
                    );
                }
                }, 2000);
            
                return () => clearInterval(interval);
            }, [product.images, isPaused]);

    return (
        <Link
        href={`/product/${product._id}`}
        className="
            group
            relative
            w-[260px]
            rounded-2xl
            p-5
            flex
            flex-col
            gap-4
            transition-all
            duration-500
            bg-[#0f172a]
            border border-white/10
            hover:border-orange-500
            hover:-translate-y-2
            hover:shadow-[0_20px_40px_rgba(255,106,0,0.25)]
        "
        >

        {/* Subtle Glow Background */}
        <div
            className="
            absolute
            inset-0
            rounded-2xl
            opacity-0
            group-hover:opacity-100
            transition-opacity
            duration-500
            "
            style={{
            background:
                "radial-gradient(circle at top, rgba(255,106,0,0.15), transparent 70%)",
            }}
        />

       {/* Image Slider */}
        <div
        className="
            relative
            z-10
            w-full
            h-48
            overflow-hidden
            rounded-xl
        "
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        >
        <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{
            transform: `translateX(-${current * 100}%)`,
            }}
        >
            {images.map((img, index) => (
            <div
                key={index}
                className="
                min-w-full
                h-full
                flex
                items-center
                justify-center
                "
            >
                <img
                src={`http://localhost:3000/${img}`}
                alt={product.name}
                className="
                    max-h-full
                    max-w-full
                    object-contain
                    transition-transform
                    duration-500
                    group-hover:scale-105
                "
                />
            </div>
            ))}
        </div>

        {images.length > 1 && (
            <>
            <button
                onClick={(e) => {
                e.preventDefault();
                prevSlide();
                }}
                className="
                absolute
                left-2
                top-1/2
                -translate-y-1/2
                bg-black/40
                backdrop-blur-md
                text-white
                w-8
                h-8
                rounded-full
                flex
                items-center
                justify-center
                opacity-0
                group-hover:opacity-100
                transition
                "
            >
                ‹
            </button>

            <button
                onClick={(e) => {
                e.preventDefault();
                nextSlide();
                }}
                className="
                absolute
                right-2
                top-1/2
                -translate-y-1/2
                bg-black/40
                backdrop-blur-md
                text-white
                w-8
                h-8
                rounded-full
                flex
                items-center
                justify-center
                opacity-0
                group-hover:opacity-100
                transition
                "
            >
                ›
            </button>
            </>
        )}
        </div>
        {/* Product Info */}
        <div className="relative z-10 flex flex-col gap-2">

            {/* Name */}
            <h3
            className="
                text-sm
                font-semibold
                line-clamp-2
                group-hover:text-orange-500
                transition-colors
            "
            style={{
                color: t.colors.textPrimary,
            }}
            >
            {product.name.toUpperCase()}
            </h3>

            {/* Brand + Category */}
            <div className="text-xs flex flex-col gap-1" style={{ color: t.colors.textSecondary }}>
            <span>
                <span className="text-gray-500">Brand:</span>{" "}
                {product.brand?.name}
            </span>
            <span>
                <span className="text-gray-500">Category:</span>{" "}
                {product.category?.name}
            </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mt-2">

            <span className="text-lg font-bold" style={{ color: t.colors.primary }}>
                ${discountedPrice}
            </span>

            {product.discount > 0 && (
                <span className="text-sm line-through text-red-500">
                ${product.price}
                </span>
            )}

            </div>

        </div>

        {/* Discount Badge */}
        {product.discount > 0 && (
            <div className="
            absolute
            top-4
            right-4
            bg-orange-500
            text-white
            text-xs
            px-2
            py-1
            rounded-full
            font-semibold
            shadow-md
            ">
            -{product.discount}%
            </div>
        )}

        </Link>
    );
}