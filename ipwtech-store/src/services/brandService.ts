import { API } from "@/src/config/api";
import { Brand } from "@/src/types/brand";
import { axiosInstance } from "../lib/axios";

export const getBrands = async (): Promise<Brand[]> => {
    const response = await axiosInstance.get(API.Brands.GET_ALL);

    return response.data.data.map((cat: any) => ({
        _id: cat._id,
        name: cat.name,
        image: cat.image,
    }));
};