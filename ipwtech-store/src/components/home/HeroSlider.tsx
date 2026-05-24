"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function HeroSlider() {
    const slides = [
        {
        tag: "New Arrivals",
        title: "Unleash Your",
        highlight: "Inner Gamer",
        description:
            "Up to 40% off on gaming headsets, keyboards, and accessories.",
        image: "/banners/hero1.jpeg",
        },
        {
        tag: "New Arrivals",
        title: "Level Up Your",
        highlight: "Tech Game",
        description:
            "Discover laptops, smartphones, and accessories at unbeatable prices.",
        image: "/banners/hero2.jpeg",
        },
        {
        tag: "New Arrivals",
        title: "Level Up Your",
        highlight: "Tech Game",
        description:
            "Discover laptops, smartphones, and accessories at unbeatable prices.",
        image: "/banners/hero3.jpeg",
        },
    ];

    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
        nextSlide();
        }, 3000);

        return () => clearInterval(interval);
    }, [current]);

    const nextSlide = () => {
        setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    return (
        <section className="hidden lg:block w-full">
        <div
            className="
            relative mx-auto mt-10 overflow-hidden rounded-3xl
            w-[1150px] h-[580px]
            max-[1300px]:w-[980px]
            max-[1300px]:h-[500px]
            max-[1090px]:w-[900px]
            max-[1090px]:h-[460px]
            "
        >
            {slides.map((slide, index) => (
            <div
                key={index}
                className={`
                absolute inset-0 transition-opacity duration-1000 ease-in-out
                ${index === current ? "opacity-100 z-20" : "opacity-0 z-10"}
                `}
            >
                <img
                src={slide.image}
                alt="Hero"
                className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

                <div className="relative z-10 h-full flex items-center px-16 max-[1300px]:px-12 max-[1090px]:px-10">
                <div className="max-w-[520px] text-white space-y-6 max-[1090px]:space-y-4">
                    <span className="bg-orange-500/20 text-orange-400 px-4 py-1 rounded-full text-sm font-medium max-[1090px]:text-xs">
                    {slide.tag}
                    </span>

                    <h1 className="text-5xl font-bold leading-tight max-[1300px]:text-4xl max-[1090px]:text-[2rem]">
                    {slide.title} <br />
                    <span className="text-orange-500">{slide.highlight}</span>
                    </h1>

                    <p className="text-gray-300 text-lg max-[1300px]:text-base max-[1090px]:text-sm">
                    {slide.description}
                    </p>

                    <Link
                    href="/shop"
                    className="inline-block bg-orange-500 hover:bg-orange-600 transition-colors px-6 py-3 rounded-full font-medium text-white cursor-pointer max-[1090px]:px-5 max-[1090px]:py-2.5 max-[1090px]:text-sm"
                    >
                    Shop Now
                    </Link>
                </div>
                </div>
            </div>
            ))}

            <button
            onClick={prevSlide}
            className="absolute cursor-pointer hover:text-orange-500 left-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-3 rounded-full text-white transition z-30 max-[1090px]:p-2"
            >
            <FiChevronLeft size={22} />
            </button>

            <button
            onClick={nextSlide}
            className="absolute cursor-pointer hover:text-orange-500 right-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-3 rounded-full text-white transition z-30 max-[1090px]:p-2"
            >
            <FiChevronRight size={22} />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
            {slides.map((_, index) => (
                <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`
                    h-2 rounded-full transition-all duration-300
                    ${index === current ? "w-8 bg-orange-500" : "w-3 bg-white/60"}
                `}
                />
            ))}
            </div>
        </div>
        </section>
    );
}