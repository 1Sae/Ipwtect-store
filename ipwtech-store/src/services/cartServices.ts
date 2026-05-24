import { API } from "../config/api"
import { axiosInstance } from "../lib/axios"



export const addToCart = async (productId: string, quantity: number) => {
    const response = await axiosInstance.post(API.CART.ADD, { productId, quantity });
    return response.data;
}

export const getCart = async () => {
    const res = await axiosInstance.get(API.CART.GET);
    return res.data.data;
};

export const updateCartItem = async (productId: string, quantity: number) => {
    const res = await axiosInstance.put(API.CART.UPDATE, {
        productId,
        quantity,
    });

    return res.data.data;
};

export const removeCartItem = async (productId: string) => {
    const res = await axiosInstance.delete(API.CART.REMOVE, {
        data: { productId },
        });
    
        return res.data.data;
    };