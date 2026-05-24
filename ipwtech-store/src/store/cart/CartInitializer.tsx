"use client";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../hooks";
import { getCart } from "@/src/services/cartServices";
import { setCart } from "./cartSlice";

export default function CartInitializer({
    children,
    }: {
    children: React.ReactNode;
    }) {
    const { token, initialized } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (!initialized) return; 

        if (!token) return; 

        const fetchCart = async () => {
            try {
                const res = await getCart();
            
                dispatch(setCart(res.items)); 
            
                } catch (err) {
                console.error(err);
                }
            };

        fetchCart();
    }, [token, initialized]);

    return <>{children}</>;
}