    import { API } from "../config/api";
    import { axiosInstance } from "../lib/axios";
    import { Product } from "../types/product";
    import  React  from "react";
    interface ProductFilters {
        categoryName?: string;
        brandName?: string;
        minPrice?: number;
        maxPrice?: number;
        specs?: Record<string, string[]>;
    }

    // Product mapper
    const mapProduct = (p: any): Product => ({
    _id: p._id,
    name: p.name,
    description: p.description,
    price: p.price,
    image: p.image,
    images: p.images,
    category: p.category,
    brand: p.brand,
    stock: p.stock,
    sold: p.sold,
    discount: p.discount,
    status: p.status,
    specs: p.specifications?.map((s: any) => ({
        key: s.key,
        value: s.value,
        })) || [],
    });

    // Get filtered products
export const getFilteredProducts = async (filters: any): Promise<Product[]> => {

            const params: any = {
            categoryName: filters.categoryName,
            brandName: filters.brandName,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            };
        
            if (filters.specs) {
                params.specs = JSON.stringify(filters.specs);
            }
        
            const response = await axiosInstance.get(
            API.PRODUCTS.GET_FILTERED_PRODUCTS,
            { params }
            );
        
            return response.data.data.products.map((p: any) =>
            mapProduct(p)
            );
        };
    // Get specifications
export const getSpecifications = async (params: any) => {

        const response = await axiosInstance.get(
            API.PRODUCTS.GET_PRODUCTS_SPECIFICATIONS,
            { params }
            );
        
            return response.data.data || [];
    };

    
    export const getProductsByCategory = async (name: string, filters: any) => {
        const params: any = {};
    
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    
        if (filters.specs && Object.keys(filters.specs).length > 0) {
            params.specs = JSON.stringify(filters.specs);
        }
    
        const res = await axiosInstance.get(
            API.PRODUCTS.GET_PRODUCTS_BY_CATEGORY_NAME(name),
            { params }
        );
    
        return res.data.data.products;
    };
    
    export const getProductsByBrand = async (name: string, filters: any) => {
        const params: any = {};
    
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    
        if (filters.specs && Object.keys(filters.specs).length > 0) {
            params.specs = JSON.stringify(filters.specs);
        }
    
        const res = await axiosInstance.get(
            API.PRODUCTS.GET_PRODUCTS_BY_BRAND_NAME(name),
            { params }
        );
    
        return res.data.data.products;
    };
    
    /* ================= SPECS ================= */
    
    export const getShopSpecs = async (params: {
        categoryName?: string;
        brandName?: string;
    }) => {
        const res = await axiosInstance.get(
            API.PRODUCTS.GET_SHOP_SPECS,
            { params }
        );
    
        return res.data.data || [];
    };
