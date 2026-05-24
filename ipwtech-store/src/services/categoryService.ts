import { API } from "@/src/config/api";
import { Category } from "@/src/types/category";
import { axiosInstance } from "../lib/axios";

export const getCategories = async (): Promise<Category[]> => {
    const response = await axiosInstance.get(API.Categories.GET_ALL);

    return response.data.data.map((cat: any) => ({
        _id: cat._id,
        name: cat.name,
        image: cat.image,
    }));
};