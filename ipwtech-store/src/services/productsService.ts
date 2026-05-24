import { axiosInstance } from "../lib/axios";
import { API } from "@/src/config/api";
import { Product } from "@/src/types/product";

export const getNewestProducts = async (): Promise<Product[]> => {
    const response = await axiosInstance.get(API.PRODUCTS.GET_NEWEST_PRODUCTS);
    
        return response.data.data.products.map((p: any) =>
        mapProduct(p)
        );
    };
export const getTopSellingProducts = async (): Promise<Product[]> => {
    const response = await axiosInstance.get(API.PRODUCTS.GET_TOP_SELLING);
    
        return response.data.data.products.map((p: any) =>
        mapProduct(p)
        );
    };
    
    
    // ================= Product Mapper =================
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

export const getDiscountedProducts = async (): Promise<Product[]> => {
    const response = await axiosInstance.get(API.PRODUCTS.GET_DISCOUNTED_PRODUCTS);
    
        return response.data.data.products.map((p: any) =>
        mapProduct(p)
        );
    }

export const getProductById = async (id: string): Promise<Product> => {
    const response = await axiosInstance.get(API.PRODUCTS.GET_ONE(id));
    
    return mapProduct(response.data.data); // ✅ FIXED
    };

export const searchProducts = async (query: string) => {
    const res = await axiosInstance.get(
        API.PRODUCTS.SEARCH_PRODUCTS(query)
    );
    
    return res.data.data;
    };