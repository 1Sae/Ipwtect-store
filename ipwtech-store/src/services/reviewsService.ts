import { API } from "../config/api";
import { axiosInstance } from "../lib/axios";


export const addReview = async (productId: string, rating: number, comment: string) => {
    const res = await axiosInstance.post(API.REVIEWS.ADD_REVIEW(productId), { rating, comment });
    return res.data.data;
}

export const getProductReviews = async (productId: string) => {
    const res = await axiosInstance.get(API.REVIEWS.GET_REVIEWS(productId));
    return res.data.data;
}
