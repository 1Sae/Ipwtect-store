"use client";

import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getDiscountedProducts, getNewestProducts, getTopSellingProducts } from "@/src/services/productsService";
import { Product } from "@/src/types/product";
import ProductCard from "./productCard";
import { useTheme } from "@/src/theme/ThemeProvider";

interface Props {
    title: string;
    type: "Newest" | "top-selling" | "discounted";
}
export default function ProductSection({ title , type }: Props) {
    const t = useTheme();
    const scrollRef = useRef<HTMLDivElement>(null);

    const [products, setProducts] = useState<Product[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const itemsPerView = 3; // adjust if needed

    // Fetch products
useEffect(() => {
    const fetch = async () => {
        let data: Product[] = [];
        
        if (type === "Newest") {
                data = await getNewestProducts();
        } else if (type === "top-selling") {
                data = await getTopSellingProducts();
        } else if (type === "discounted") {
                data = await getDiscountedProducts();
        }
        
        
        setProducts(data);
    };
        
        fetch();
    }, [type]);

    // Scroll
    const scrollLeft = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? 0 : prev - 1
        );
    };
    
    const scrollRight = () => {
        if (currentIndex + itemsPerView >= products.length) return;
        setCurrentIndex((prev) => prev + 1);
    };

    return (
        <section className="max-w-[1300px] w-full mx-auto px-4 py-16 relative">
        
            {/* Decorative Background Glow */}
            <div
                className="
                absolute
                -top-10
                -left-20
                w-[300px]
                h-[300px]
                rounded-full
                blur-[120px]
                opacity-20
                pointer-events-none
                "
                style={{ background: t.colors.primary }}
            />
        
            {/* Header */}
            <div className="flex items-center justify-between mb-10 relative z-10">
        
                <div>
                <h2
                    className="font-bold tracking-wide uppercase"
                    style={{
                    color: t.colors.primary,
                    fontSize: t.typography.h3,
                    }}
                >
                    {title}
                </h2>
        
                {/* Accent underline */}
                <div
                    className="mt-2 h-[3px] w-14 rounded-full"
                    style={{ backgroundColor: t.colors.primary }}
                />
                </div>
        
                {/* Arrows */}
                <div className="flex gap-3">
        
                <button
                    onClick={scrollLeft}
                    className="
                    w-10
                    h-10
                    rounded-full
                    border
                    text-xl
                    flex
                    items-center
                    justify-center
                    transition-all
                    duration-300
                    hover:scale-110
                    hover:shadow-lg
                    cursor-pointer
                    "
                    style={{
                    background:t.colors.headerBg,
                    color: t.colors.primary,
                    }}
                >
                    <FiChevronLeft />
                </button>
        
                <button
                    onClick={scrollRight}
                    className="
                    w-10
                    h-10
                    rounded-full
                    border
                    text-xl
                    flex
                    items-center
                    justify-center
                    transition-all
                    duration-300
                    hover:scale-110
                    hover:shadow-lg
                    cursor-pointer
                    "
                    style={{
                    background:t.colors.headerBg,
                    color: t.colors.primary,
                    }}
                >
                    <FiChevronRight />
                </button>
        
                </div>
            </div>
        
        
        
          {/* Products Container */}
        <div
            className="
                flex
                w-full
                rounded-3xl
                p-6
                overflow-hidden
            "
            style={{ backgroundColor: t.colors.headerBg }}
            >

            {/* Slider Track */}
            <div
                className="flex gap-6 transition-transform duration-500 ease-in-out"
                style={{
                transform: `translateX(-${currentIndex * 280}px)`,
                }}
            >
                {products.map((product) => (
                <div
                    key={product._id}
                    className="
                    min-w-[260px]
                    transition-all
                    duration-300
                    hover:-translate-y-2
                    "
                >
                    <ProductCard product={product} />
                </div>
                ))}
            </div>

        </div>
    
        </section>
    );
}