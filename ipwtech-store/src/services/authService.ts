import { axiosInstance } from "../lib/axios";
import { API } from "@/src/config/api";

export const loginUser = async (email: string, password: string) => {
    const res = await axiosInstance.post(API.AUTH.LOGIN, {
        email,
        password,
    });

    return res.data;
};

export const registerUser = async (
    name: string,
    email: string,
    password: string,
    companyName?: string
) => {
    const res = await axiosInstance.post(API.AUTH.REGISTER, {
        name,
        email,
        password,
        companyName, // 👈 send to backend
    });

    return res.data;
};