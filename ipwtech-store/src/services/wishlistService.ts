import { axiosInstance } from "../lib/axios";
import { API } from "../config/api";

export const getWishlist = async () => {
    const res = await axiosInstance.get(API.WISHLIST.GET);
    return res.data.data;
};


export const addToWishlist = async (productId: string) => {
    const res = await axiosInstance.post(
        API.WISHLIST.ADD(productId)
    );
    return res.data.data;
};


export const removeFromWishlist = async (productId: string) => {
    const res = await axiosInstance.delete(
        API.WISHLIST.REMOVE(productId)
    );
    return res.data.data;
};