"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setCredentials, setInitialized } from "./authSlice";

export default function AuthInitializer({
    children,
}: {
    children: React.ReactNode;
}) {
    const dispatch = useAppDispatch();
    const { initialized } = useAppSelector((s) => s.auth);

    useEffect(() => {
        try {
        const token = localStorage.getItem("user_token");
        const user = localStorage.getItem("user");

        if (token && user) {
            dispatch(
            setCredentials({
                token,
                user: JSON.parse(user),
            })
            );
        }
        } catch (err) {
        console.error("Auth init error:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("user_token");
        } finally {
        dispatch(setInitialized());
        }
    }, []);

    // 🔥 block app until auth is ready
    if (!initialized) return null;

    return <>{children}</>;
}