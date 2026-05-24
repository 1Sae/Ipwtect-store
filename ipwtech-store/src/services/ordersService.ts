import { API } from "../config/api";
import { axiosInstance } from "../lib/axios";




export const getOrders = async () => {
    const res = await axiosInstance.get(API.Order.GET);
    return res.data.data;
};

export const createOrder = async (address: number, paymentMethod: string) => {
    const res = await axiosInstance.post(
        API.Order.CREATE_ORDER_FROM_CART,
        {
            addressIndex: address,
            paymentMethod: paymentMethod,
        }
    );

    return res.data.data;
};

export const deleteOrder = async (orderId: string) => {
    const res = await axiosInstance.delete(API.Order.DELETE(orderId));
    return res.data.data;
}

export const updateOrder = async (orderId: string, status: string, address: number) => {
    const res = await axiosInstance.put(API.Order.UPDATE(orderId), { status });
    return res.data.data;
}

export const cancelOrder = async (orderId: string) => {
    const res = await axiosInstance.put(API.Order.CANCEL(orderId));
    return res.data.data;
}