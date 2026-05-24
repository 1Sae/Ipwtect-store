import { axiosInstance } from "../lib/axios";
import { API } from "../config/api";

// GET PROFILE
export const getProfile = async () => {
    const res = await axiosInstance.get(API.user.GET_USER_DATA);
    return res.data.data;
};

// UPDATE PROFILE
export const updateProfile = async (data: {
    name?: string;
    email?: string;
    phone?: string;
    }) => {
    const res = await axiosInstance.put(API.user.UPDATE_USER_DATA, data);
    return res.data.data;
};

// CHANGE PASSWORD
export const changePassword = async (data: {
    oldPassword: string;
    newPassword: string;
    }) => {
    const res = await axiosInstance.put(API.user.CHANGE_USER_PASSWORD, data);
    return res.data;
};

// ADD ADDRESS
export const addAddress = async (data: any) => {
    const res = await axiosInstance.post(API.user.ADD_USER_ADDRESS, data);
    return res.data.data;
};

export const removeAddress = async (index: number) => {
    const res = await axiosInstance.delete(
        API.user.DELETE_USER_ADDRESS(index)
    );

    return res.data.data; // depends on backend
};

export const updateAddress = async (index: number, data: any) => {
    const res = await axiosInstance.put(
        API.user.UPDATE_USER_ADDRESS(index),
        data
    );

    return res.data.data; // ✅ important
};