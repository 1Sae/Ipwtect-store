"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import { useAppSelector, useAppDispatch } from "@/src/store/hooks";
import { useTheme } from "@/src/theme/ThemeProvider";
import WishlistProductCard from "@/src/components/wishlist/wishlistProductCard";
import { getWishlist } from "@/src/services/wishlistService";
import { setWishlist } from "@/src/store/wishlist/wishlistSlice";
import { showError, showSuccess } from "@/src/utils/toast";

export default function WishlistPage() {
  const t = useTheme();
  const dispatch = useAppDispatch();

  const items = useAppSelector((state) => state.wishlist?.items) || [];

  const [loading, setLoading] = useState(true);


  const fetchWishlist = async () => {
    try {
      const res = await getWishlist();
      dispatch(setWishlist(res)); 
      showSuccess("Wishlist loaded");
    } catch {
      console.log("error");
      showError("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <ProtectedRoute>
      <div className="max-w-[1300px] mx-auto px-6 mt-10 flex flex-col gap-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1
            className="font-bold"
            style={{
              color: t.colors.primary,
              fontSize: t.typography.h3,
            }}
          >
            Wishlist
          </h1>

          <span
            style={{
              color: t.colors.textPrimary,
              fontSize: t.typography.body,
            }}
          >
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-20 text-gray-400">
            Loading wishlist...
          </div>
        )}

        {/* EMPTY */}
        {!loading && items.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            Your wishlist is empty.
          </div>
        )}

        {/* GRID */}
        {!loading && items.length > 0 && (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              xl:grid-cols-4
              gap-8
            "
          >
            {items.map((product) => (
            <WishlistProductCard
              key={product._id}
              product={product}
            />
          ))}
          </div>
        )}

      </div>
    </ProtectedRoute>
  );
}