"use client";

import Image from "next/image";

export default function HeroSection() {
    return (
        <section className="max-w-[1300px] mx-auto px-4 mt-6">

        <div className="
            relative
            h-[520px]
            rounded-2xl
            overflow-hidden
            bg-gradient-to-r
            from-[#0F172A]
            via-[#1E293B]
            to-[#111827]
            text-white
            flex
            items-center
        ">

            {/* Content */}
            <div className="pl-16 max-w-[500px] space-y-6">

            <span className="bg-orange-500 text-sm px-4 py-1 rounded-full">
                New Arrivals 2026
            </span>

            <h1 className="text-5xl font-bold leading-tight">
                Level Up Your <br />
                <span className="text-orange-500">Tech Game</span>
            </h1>

            <p className="text-gray-300 text-lg">
                Discover the latest gaming gear, laptops,
                and smartphones at unbeatable prices.
            </p>

            <button className="
                bg-orange-500
                hover:bg-orange-600
                px-6
                py-3
                rounded-full
                font-medium
                transition-colors
            ">
                Shop Now →
            </button>

            </div>

            {/* Right Image */}
            <div className="absolute right-10 bottom-0">
            <Image
                src="/banners/banner1.jpeg"
                alt="Banner"
                width={700}
                height={500}
                className="object-contain"
            />
            </div>

        </div>
        </section>
    );
}