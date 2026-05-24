"use client";

import { useAppSelector } from "@/src/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const { token, initialized } = useAppSelector((state) => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (!initialized) return; // ✅ WAIT

        if (!token) {
            router.replace("/login");
        }
    }, [token, initialized]);

    // ⛔ WAIT UNTIL AUTH READY
    if (!initialized) {
        return (
            <div className="p-10 text-white">
                Loading...
            </div>
        );
    }

    if (!token) return null;

    return <>{children}</>;
}