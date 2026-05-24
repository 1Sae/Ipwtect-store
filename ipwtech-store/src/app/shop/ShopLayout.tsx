"use client";

import { ShopProvider } from "@/src/context/ShopContext";

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ShopProvider>
            <div className="max-w-[1500px] mx-auto px-4 py-10">
                {children}
            </div>
        </ShopProvider>
    );
}