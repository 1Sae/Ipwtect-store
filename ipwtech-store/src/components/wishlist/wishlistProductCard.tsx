"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/src/types/product";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useEffect, useState } from "react";
import {
    AiOutlineShoppingCart,
} from "react-icons/ai";
import {
    IoIosArrowBack,
    IoIosArrowForward,
} from "react-icons/io";
import { FiTrash2 } from "react-icons/fi";

import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { addToCart, getCart } from "@/src/services/cartServices";
import { setCart } from "@/src/store/cart/cartSlice";

import { removeFromWishlist } from "@/src/services/wishlistService";
import { removeWishlistItem } from "@/src/store/wishlist/wishlistSlice";
import { showError, showSuccess } from "@/src/utils/toast";

interface Props {
    product: Product;
}

export default function WishlistProductCard({ product }: Props) {
    const t = useTheme();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { token } = useAppSelector((state) => state.auth);

    const images =
        product.images?.length > 0
        ? product.images
        : [product.image];

    const discountedPrice =
        product.discount > 0
        ? product.price - (product.price * product.discount) / 100
        : product.price;

    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // ================= SLIDER =================
    const nextSlide = () => {
        setCurrent((prev) =>
        prev < images.length - 1 ? prev + 1 : prev
        );
    };

    const prevSlide = () => {
        setCurrent((prev) =>
        prev > 0 ? prev - 1 : prev
        );
    };

    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
        if (!isPaused) {
            setCurrent((prev) =>
            prev < images.length - 1 ? prev + 1 : prev
            );
        }
        }, 2500);

        return () => clearInterval(interval);
    }, [images.length, isPaused]);

    // ================= ADD TO CART =================
    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!token) {
        router.push(`/login?redirect=${window.location.pathname}`);
        return;
        }

        try {
        await addToCart(product._id, 1);

        const cart = await getCart();
        dispatch(setCart(cart.items));

        } catch (err) {
        console.error(err);
        }
    };

    // ================= REMOVE FROM WISHLIST =================
    const handleRemove = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!token) {
        router.push(`/login?redirect=${window.location.pathname}`);
        return;
        }

        try {
        dispatch(removeWishlistItem(product._id));

        await removeFromWishlist(product._id);
        showSuccess("Removed from wishlist");
        } catch (err) {
        showError("Failed to remove from wishlist");
        console.error(err);
        }
    };

    return (
        <Link
        href={`/product/${product._id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="
            group relative w-full min-h-[360px]
            rounded-2xl p-5 flex flex-col gap-6
            transition-all duration-500
            bg-[#0f172a]
            border border-white/10
            hover:border-orange-500
            hover:-translate-y-2
            hover:shadow-[0_20px_40px_rgba(255,106,0,0.25)]
        "
        >
        {/* Glow */}
        <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition"
            style={{
            background:
                "radial-gradient(circle at top, rgba(255,106,0,0.15), transparent 70%)",
            }}
        />

        {/* REMOVE BUTTON */}
        <button
            onClick={handleRemove}
            className="
            absolute top-3 left-3 z-20
            w-9 h-9 flex items-center justify-center
            rounded-full
            bg-red-500/10 border border-red-500/30
            text-red-500
            hover:bg-red-500/20
            transition
            cursor-pointer
            "
        >
            <FiTrash2 size={16} />
        </button>

        {/* IMAGE SLIDER */}
        <div
            className="relative z-10 w-full aspect-[4/3] overflow-hidden rounded-xl"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div
            className="flex h-full transition-transform duration-700"
            style={{
                transform: `translateX(-${current * 100}%)`,
            }}
            >
            {images.map((img, index) => (
                <div
                key={index}
                className="min-w-full flex items-center justify-center"
                >
                <img
                    src={`https://ipwtech-backend.onrender.com/${img}`}
                    className="max-h-full object-contain"
                />
                </div>
            ))}
            </div>

            {/* LEFT */}
            {current > 0 && (
            <button
                onClick={(e) => {
                e.preventDefault();
                prevSlide();
                }}
                className="
                absolute left-1 top-1/2 -translate-y-1/2
                bg-black/40 w-9 h-9 rounded-full
                flex items-center justify-center
                "
                style={{ color: t.colors.primary }}
            >
                <IoIosArrowBack />
            </button>
            )}

            {/* RIGHT */}
            {current < images.length - 1 && (
            <button
                onClick={(e) => {
                e.preventDefault();
                nextSlide();
                }}
                className="
                absolute right-1 top-1/2 -translate-y-1/2
                bg-black/40 w-9 h-9 rounded-full
                flex items-center justify-center
                "
                style={{ color: t.colors.primary }}
            >
                <IoIosArrowForward />
            </button>
            )}
        </div>

        {/* INFO */}
        <div className="flex flex-col gap-2 z-10">

            {/* NAME */}
            <h3 className="text-sm font-semibold text-gray-200 line-clamp-2">
            {product.name.toUpperCase()}
            </h3>

            {/* BRAND + CATEGORY */}
            <div className="text-xs text-gray-400 flex flex-col gap-1">
            <span>
                <span className="text-gray-500">Brand:</span>{" "}
                {product.brand?.name}
            </span>
            <span>
                <span className="text-gray-500">Category:</span>{" "}
                {product.category?.name}
            </span>
            </div>

            {/* PRICE */}
            <div className="flex items-center gap-2 mt-2">
            <span
                className="text-lg font-bold"
                style={{ color: t.colors.primary }}
            >
                ${discountedPrice}
            </span>

            {product.discount > 0 && (
                <span className="text-sm line-through text-red-500">
                ${product.price}
                </span>
            )}
            </div>

            {/* ADD TO CART */}
            <button
            onClick={handleAddToCart}
            className="
                mt-2 w-full py-2.5 rounded-xl text-sm font-semibold
                flex items-center justify-center gap-2
                transition active:scale-[0.97]
            "
            style={{
                background: t.colors.primary,
                color: t.colors.surface,
            }}
            >
            <AiOutlineShoppingCart />
            Add to Cart
            </button>
        </div>

        {/* DISCOUNT BADGE */}
        {product.discount > 0 && (
            <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
            -{product.discount}%
            </div>
        )}
        </Link>
    );
}