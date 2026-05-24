"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/src/types/product";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useEffect, useState } from "react";
import { AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { BiArrowBack, BiArrowToLeft } from "react-icons/bi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { addToCart, getCart } from "@/src/services/cartServices";
import { addItem, setCart } from "@/src/store/cart/cartSlice";
import { addToWishlist, getWishlist, removeFromWishlist } from "@/src/services/wishlistService";
import { showError, showSuccess } from "@/src/utils/toast";
import { addWishlistItem, removeWishlistItem, setWishlist } from "@/src/store/wishlist/wishlistSlice";


interface Props {
    product: Product;
}   

export default function ProductCardShop({ product }: Props) {
    const t = useTheme();
    const { token } = useAppSelector((state) => state.auth);
    const router = useRouter();
    const wishlistItems = useAppSelector(
        (state) => state.wishlist?.items || []
    );

    const isLiked = wishlistItems.some(
        (item) => item._id === product._id
    );
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

    const dispatch = useAppDispatch();

    const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
        router.push(`/login?redirect=${window.location.pathname}`);
        return;
    }

    try {
        await addToCart(product._id, 1);
        const items = await getCart();
        dispatch(setCart(items));
        showSuccess("Product added to cart");
    } catch (err) {
        showError("Failed to add to cart.");
    }
    };
    
    const handleAddToWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
            if (!token) {
            router.push(`/login?redirect=${window.location.pathname}`);
            return;
            }
        
            try {
            let updated;
        
            if (isLiked) {
                updated = await removeFromWishlist(product._id);
                showSuccess("Product removed from wishlist");
            } else {
                updated = await addToWishlist(product._id);
                showSuccess("Product added to wishlist");
            }
        
            // 🔥 IMPORTANT: sync from backend
            dispatch(setWishlist(updated));
        
            } catch {
            showError("Failed to update wishlist.");
            }
        };
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
            }, 2000);
        
            return () => clearInterval(interval);
    }, [images.length, isPaused]);

    return (
        <Link
        href={`/product/${product._id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="
            group
            relative
            w-full
            min-h-[360px]
            rounded-2xl
            p-5
            flex
            flex-col
            gap-6
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
            aspect-[4/3]
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
                src={`https://ipwtech-backend.onrender.com/${img}`}
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

        <>
        {/* LEFT BUTTON */}
        {current > 0 && (
            <button
            onClick={(e) => {
                e.preventDefault();
                prevSlide();
            }}
            className="
                absolute left-1 top-1/2 -translate-y-1/2
                bg-black/40 backdrop-blur-md
                w-10 h-10 rounded-full
                flex items-center justify-center
                opacity-0 group-hover:opacity-100
                transition cursor-pointer
            "
            style={{ color: t.colors.primary }}
            >
            <IoIosArrowBack size={18} />
            </button>
        )}

        {/* RIGHT BUTTON */}
        {current < images.length - 1 && (
            <button
            onClick={(e) => {
                e.preventDefault();
                nextSlide();
            }}
            className="
                absolute right-1 top-1/2 -translate-y-1/2
                bg-black/40 backdrop-blur-md
                w-10 h-10 rounded-full
                flex items-center justify-center
                opacity-0 group-hover:opacity-100
                transition cursor-pointer
            "
            style={{ color: t.colors.primary }}
            >
            <IoIosArrowForward size={18} />
            </button>
        )}
        </>
        </div>

        {/* Product Info */}
        <div className="relative z-10 flex flex-col gap-2">

            {/* Name */}
            <h3
            className="
                text-sm
                font-semibold
                text-gray-200
                line-clamp-2
                group-hover:text-orange-500
                transition-colors
            "
            >
            {product.name.toUpperCase()}
            </h3>

            {/* Brand + Category */}
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

            {/* Add to Cart + Wishlist */}
            <div className="flex items-center gap-3">
            
            {/* ADD TO CART */}
            <button
            onClick={handleAddToCart}
            className="
                relative w-full py-2.5 rounded-xl text-sm font-semibold
                flex items-center justify-center gap-2
                overflow-hidden transition-all duration-300
                active:scale-[0.97] group cursor-pointer
            "
            style={{
                background: t.colors.primary,
                boxShadow: t.shadow.button,
                color: t.colors.surface,
            }}
            >
            <span className="absolute inset-0 overflow-hidden rounded-xl">
                <span
                className="
                    absolute -left-20 top-0 h-full w-20
                    bg-white/20 skew-x-12
                    transition-all duration-700
                    group-hover:left-[120%]
                "
                />
            </span>

            <AiOutlineShoppingCart className="text-lg transition-transform duration-300 group-hover:scale-110" />
            <span className="tracking-wide">Add to Cart</span>
            </button>
            {/* ADD TO WISHLIST */}
            <button
            type="button"
            onClick={handleAddToWishlist}
            className="
                relative p-2.5 rounded-xl
                flex items-center justify-center
                transition-all duration-300
                active:scale-90 group cursor-pointer
            "
            style={{
                background: isLiked
                ? "rgba(255, 0, 0, 0.16)"
                : "rgba(255,255,255,0.05)",
            
                border: isLiked
                ? "1px solid rgb(255, 0, 8)"
                : "1px solid rgb(255, 123, 0)",
                backdropFilter: "blur(6px)",
            }}
            >
            <AiOutlineHeart
            className={`
                text-lg transition-all duration-300
                ${isLiked ? "scale-125 text-red-500" : "text-orange-400"}
            `}
            />
            </button>
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