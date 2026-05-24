"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getWishlist } from "@/src/services/wishlistService";
import { setWishlist } from "./wishlistSlice";

export default function WishlistInitializer({
    children,
    }: {
    children: React.ReactNode;
    }) {
    const dispatch = useAppDispatch();
    const { token, initialized } = useAppSelector((s) => s.auth);

    useEffect(() => {
        if (!initialized) return;
        if(!token) return;

        const fetchWishlist = async () => {
        try {
            const res = await getWishlist();
            dispatch(setWishlist(res.items));
        } catch (err) {
            console.error(err);
        }
        };

        fetchWishlist();
    }, [token, initialized]);

    return <>{children}</>;
}