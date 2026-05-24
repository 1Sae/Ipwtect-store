"use client";

import { createContext, useContext, useState } from "react";

interface ShopFilters {
    categoryName?: string;
    brandName?: string;
    minPrice?: number;
    maxPrice?: number;
    specs?: Record<string, string[]>;
}

interface ShopContextType {
    filters: ShopFilters;
    setFilters: React.Dispatch<React.SetStateAction<ShopFilters>>;
}

const ShopContext = createContext<ShopContextType | null>(null);

export function ShopProvider({ children }: { children: React.ReactNode }) {

    const [filters, setFilters] = useState<ShopFilters>({
        categoryName: "",
        brandName: "",
        minPrice: undefined,
        maxPrice: undefined,
        specs: {}
    });

    return (
        <ShopContext.Provider value={{ filters, setFilters }}>
            {children}
        </ShopContext.Provider>
    );
}

export function useShop() {
    const context = useContext(ShopContext);
    if (!context) throw new Error("useShop must be used inside ShopProvider");
    return context;
}