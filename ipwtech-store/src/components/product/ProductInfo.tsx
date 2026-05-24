"use client";

import { Product } from "@/src/types/product";
import { useTheme } from "@/src/theme/ThemeProvider";
import { AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { useState } from "react";
import { IoMdHeart } from "react-icons/io";
import { useAppDispatch } from "@/src/store/hooks";
import { addToCart } from "@/src/services/cartServices";
import { addItem } from "@/src/store/cart/cartSlice";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/src/store/hooks";
import { FiMinus, FiPlus } from "react-icons/fi";
import { showSuccess, showError } from "@/src/utils/toast";
import { addWishlistItem, removeWishlistItem, setWishlist } from "@/src/store/wishlist/wishlistSlice";
import { addToWishlist, removeFromWishlist } from "@/src/services/wishlistService";

interface Props {
  product: Product;
}

export default function ProductInfo({ product }: Props) {
  const t = useTheme();
  const dispatch = useAppDispatch();
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const increaseQuantity = () => setQuantity((prev) => (prev < product.stock ? prev + 1 : prev));
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const { token } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const finalPrice =
    product.discount > 0
      ? product.price - (product.price * product.discount) / 100
      : product.price;

      const wishlistItems = useAppSelector(
        (state) => state.wishlist?.items || []
      );
      
      const isLiked = wishlistItems.some(
        (item) => item._id === product._id
      );

      const handleAddToWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
      
        if (!token) {
          router.push(`/login?redirect=${window.location.pathname}`);
          return;
        }
      
        try {
          setWishlistLoading(true);
      
          let updated;
      
          if (isLiked) {
            updated = await removeFromWishlist(product._id);
            showSuccess("Removed from wishlist");
          } else {
            updated = await addToWishlist(product._id);
            showSuccess("Added to wishlist");
          }
      
          dispatch(setWishlist(updated));
      
        } catch {
          showError("Failed to update wishlist");
        } finally {
          setWishlistLoading(false);
        }
      };
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  
    if (!token) {
      showError("You must be logged in to add to cart");
      router.push(`/login?redirect=${window.location.pathname}`);
      return;
    }
  
    try {
      await addToCart(product._id, quantity);
  
      dispatch(
        addItem({
          _id: product._id,
          product,
          quantity: quantity,
        })
      );
  
      setQuantity(1);
      showSuccess("Added to cart successfully");
  
    } catch (err) {
      console.error(err);
      showError("Failed to add to cart");
    }
  };
  return (
    <div className="flex flex-col gap-2">

      <div className="flex items-center gap-1">

      <p 
      style={{ fontSize: t.typography.h3 , color: t.colors.primary }}
      >
      {product.brand?.name}
      </p>

      <div className="flex items-center gap-3">
      <h1 className="font-bold"
      style={{ color: t.colors.textPrimary, fontSize: t.typography.h4 }}
      >
        {product.name}
      </h1>

      {/* ADD TO WISHLIST */}
      <button
        type="button"
        onClick={handleAddToWishlist}
        disabled={wishlistLoading}
        className="
          relative p-2.5 rounded-xl
          flex items-center justify-center
          transition-all duration-300
          active:scale-90 group cursor-pointer
          disabled:opacity-50
        "
        style={{
          backdropFilter: "blur(6px)",
        }}
      >

      <IoMdHeart
        className={`
          text-xl transition-all duration-300 cursor-pointer
          ${
            isLiked
              ? "text-red-500 scale-110"
              : "text-gray-400 hover:text-red-400"
          }
        `}
      />
        </button>     
      </div>      
      </div>

      {/* PRICE */}
      <div className="flex items-center gap-3 mt-1 rounded-xl px-3 py-1 w-max"
      style={{ background: t.colors.headerBg }}> 
        <span
          className="font-bold"
          style={{ color: t.colors.primary , fontSize: t.typography.h2 }}
        >
          ${finalPrice}
        </span>

        {product.discount > 0 && (
          <span className="line-through text-red-500">
            ${product.price}
          </span>
        )}
      </div>
      
      {/* PRODUCT META INFO */}
      <div className="flex flex-wrap gap-3 mt-3">

      {/* DISCOUNT */}
      {product.discount > 0 && (
        <div className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400">
          -{product.discount}% OFF
        </div>
      )}
      

      {/* STOCK */}
      <div className="px-3 py-1 rounded-full text-xs bg-white/5 text-gray-300">
        Stock: {product.stock}
      </div>

      {/* SOLD */}
      <div className="px-3 py-1 rounded-full text-xs bg-white/5 text-gray-300">
        Sold: {product.sold}
      </div>

      {/* STATUS */}
      <div
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          product.status === "available"
            ? "bg-green-500/10 text-green-400"
            : "bg-red-500/10 text-red-400"
        }`}
      >
        {product.status === "available" ? "Available" : "Out of Stock"}
      </div>
      <div className="flex items-center gap-2 text-sm mt-1">
        <span className="text-yellow-400">★★★★★</span>
        <span className="text-gray-400">(120 reviews)</span>
      </div>

      <div className="px-3 py-1 rounded-full text-xs bg-white/5 text-gray-300">
      🚚 Free delivery in 2–4 days
      </div>
      
      </div>
      {/* DESCRIPTION */}
      <p className="leading-relaxed" style={{ color: t.colors.textPrimary, fontSize: t.typography.body }}>
        {product.description}
      </p>

      {/* BUTTONS */}
      <div className="flex gap-3 mt-4">

        {/* Quantity selector */}
        <div className="flex items-center gap-2 rounded-full px-3 py-1 w-max"
        style={{ background: t.colors.headerBg }}
        >
          <button
            onClick={decreaseQuantity}
            className="w-8 h-8 rounded-full cursor-pointer flex items-center justify-center"
            style={{
              color: t.colors.primary,
            }}
          >
            <FiMinus size={22}/>
          </button>
          <span className="font-bold text-lg" style={{ color: t.colors.primary }}>
            {quantity}
          </span>
          <button
            onClick={increaseQuantity}
            className="w-8 h-8 rounded-full cursor-pointer flex items-center justify-center"
            style={{
              color: t.colors.primary,
            }}
          >
            <FiPlus size={22} />
          </button>
        </div>
        {/* ADD TO CART */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="
            w-full
            h-11
            cursor-pointer
            rounded-lg
            flex items-center justify-center gap-2
            text-md font-semibold
            transition-all duration-200
            hover:opacity-90
            active:scale-[0.97]
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          style={{
            background: t.colors.primary,
            color: t.colors.surface,
          }}
        >
          <AiOutlineShoppingCart size={25} />
          <span>
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </span>
        </button>
        {/* STOCK MESSAGE */}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="flex items-center gap-2 text-xs text-yellow-400">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            Only {product.stock} left in stock
          </div>
        )}
      </div>

    </div>
  );
}