"use client";

import { getCategories } from "@/src/services/categoryService";
import { useTheme } from "@/src/theme/ThemeProvider";
import { Category } from "@/src/types/category";
import { useEffect, useRef, useState } from "react";

interface Props {
    title: string;
}

export default function CategorySection({ title }: Props) {
    const t = useTheme();

    const containerRef = useRef<HTMLDivElement | null>(null);
    const animationRef = useRef<number | null>(null);

    const [categories, setCategories] = useState<Category[]>([]);
    const [isPaused, setIsPaused] = useState(false);

    // Duplicate only if we have data
    const extended =
        categories.length > 0
        ? [...categories, ...categories]
        : [];

    // ================= Fetch Categories =================
    useEffect(() => {
        const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error(error);
        }
        };

        fetchCategories();
    }, []);

    // ================= Infinite Smooth Slide =================
    useEffect(() => {
        const container = containerRef.current;
        if (!container || categories.length === 0) return;

        let scrollAmount = 0;

        const animate = () => {
        if (!isPaused) {
            scrollAmount += 0.4; // slower = smoother premium feel

            if (scrollAmount >= container.scrollWidth / 2) {
            scrollAmount = 0;
            }

            container.scrollLeft = scrollAmount;
        }

        animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
        if (animationRef.current !== null) {
            cancelAnimationFrame(animationRef.current);
        }
        };
    }, [categories, isPaused]);

    return (
        <section className="relative max-w-[1300px] mx-auto px-4 py-16">

        {/* Background Glow */}
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

            <div
                className="mt-2 h-[3px] w-14 rounded-full"
                style={{ backgroundColor: t.colors.primary }}
            />
            </div>
        </div>

        {/* Sliding Strip Wrapper */}
        <div
            ref={containerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="relative overflow-hidden"
        >


            <div className="flex gap-10 w-max">

            {extended.map((cat, index) => (
                <div
                key={`${cat._id}-${index}`}
                className="
                    shrink-0
                    px-12
                    py-6
                    rounded-2xl
                    border border-white/10
                    text-gray-400
                    font-semibold
                    tracking-widest
                    text-sm
                    hover:border-orange-500
                    hover:shadow-[0_10px_30px_rgba(255,106,0,0.25)]
                    transition-transform duration-500 ease-in-out
                    cursor-pointer
                    hover:text-orange-500
                "
                style={{
                    background: t.colors.headerBg,
                }}
                >
                {cat.name.toUpperCase()}
                </div>
            ))}

            </div>
        </div>

        </section>
    );
}