"use client";

import { useEffect, useState } from "react";
import { Product } from "@/src/types/product";
import ProductCard from "../home/productCard";
import { getFilteredProducts } from "@/src/services/shopService";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useShop } from "@/src/context/ShopContext";
import ActiveFilters from "./ActiveFilters";
import ProductCardShop from "./ProductCardShop";

export default function ShopProducts() {
    const t = useTheme();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const { filters } = useShop();

    useEffect(() => {
        const fetchProducts = async () => {

            setLoading(true);
            setProducts([]); 

            const data = await getFilteredProducts(filters);

            setProducts(data);
            setLoading(false);
        };

        fetchProducts();
    }, [filters]);

    if (loading) {
        return (
            <div className="text-gray-400 text-sm">
                Loading products...
            </div>
        );
    }

    return (
        <div className="max-w-[1300px] flex items-start flex-col gap-8">

        {/* Title */}
        <div className="flex justify-between items-center w-full">
            <h2
                className="font-bold uppercase mb-0"
                style={{
                    color: t.colors.primary,
                    fontSize: t.typography.h3,
                }}
            >
                All Products
            </h2>
            <h3 className="font-medium mb-1" style={{
                color: t.colors.primary,
                fontSize: t.typography.h4,
            }}>
                {products.length} {products.length === 1 ? "product" : "products"}
            </h3>
        </div>

        {/* Active Filters */}
        <ActiveFilters />

        {/* No Products Found */}
        {products.length === 0 && (
            <div className="text-gray-400 text-center py-20">
                No products found with selected filters.
            </div>
        )}

        {/* Grid */}
        {products.length > 0 && (
            <div
                className="
                grid
                grid-cols-1
                sm:grid-cols-1
                md:grid-cols-3
                xl:grid-cols-4
                gap-8
                cards-grid
                "
            >
                {products.map((product) => (
                    <ProductCardShop
                        key={product._id}
                        product={product}
                    />
                ))}
            </div>
        )}

        </div>
    );
}