import axiosInstance from "./axiosinstance";
import { API } from "../config/apiPaths";

export const productsService = {
    getAll: () => axiosInstance.get(API.PRODUCTS.GET_ALL),

    getByCategoryName: (categoryName) =>
        axiosInstance.get(API.PRODUCTS.GET_PRODUCTS_BY_CATEGORY_NAME(categoryName)),

    getProductById: (productId) =>
        axiosInstance.get(API.PRODUCTS.GET_BY_ID(productId)),

    getByBrandName: (brandName) =>
        axiosInstance.get(API.PRODUCTS.GET_PRODUCTS_BY_BRAND_NAME(brandName)),

    getByStatus: (status) =>
        axiosInstance.get(API.PRODUCTS.FILTER_PRODUCTS_BY_STATUS(status)),

    getLowStock: () => axiosInstance.get(API.PRODUCTS.GET_LOW_STOCK_PRODUCTS),

    getOutOfStock: () => axiosInstance.get(API.PRODUCTS.GET_OUT_OF_STOCK_PRODUCTS),

    getTopSelling: () =>
        axiosInstance.get(API.PRODUCTS.GET_TOP_SELLING),

    updateProduct: (productId, payload) =>
        axiosInstance.put(API.PRODUCTS.UPDATE(productId), payload),

    deleteProduct: (productId) =>
        axiosInstance.delete(API.PRODUCTS.DELETE(productId)),

    createProduct: (payload) => axiosInstance.post(API.PRODUCTS.CREATE, payload),


    uploadProductImages: async (files) => {
        const formData = new FormData();
        files.forEach((f) => formData.append("images", f));
        return await axiosInstance.post(API.UPLOADS.PRODUCT_IMAGE, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

};

export const categoriesService = {
    getAllCategories: () => axiosInstance.get(API.CATEGORIES.GET_ALL),
    createCategory: async ({ name, description, imageFile }) => {
    const formData = new FormData();
    formData.append("name", name);
    if (description) formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);

    return axiosInstance.post(API.CATEGORIES.CREATE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    },
    getCategoryById: (id) => axiosInstance.get(API.CATEGORIES.GET_BY_ID(id)),
    updateCategory: (id, payload) => axiosInstance.put(API.CATEGORIES.UPDATE(id), payload),
    deleteCategory: (id) => axiosInstance.delete(API.CATEGORIES.DELETE(id)),
    getProductByName: (name) => axiosInstance.get(API.PRODUCTS.GET_PRODUCTS_BY_CATEGORY_NAME(name)),
};

export const brandsService = {
    getAllBrands: () => axiosInstance.get(API.BRANDS.GET_ALL),
    createBrand: async ({ name, description, imageFile }) => {
        const formData = new FormData();
        formData.append("name", name);
        if (description) formData.append("description", description);
        if (imageFile) formData.append("image", imageFile); 

        return axiosInstance.post(API.BRANDS.CREATE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        });
    },
    deleteBrand: (id) => axiosInstance.delete(API.BRANDS.DELETE(id)),
    getBrandById: (id) => axiosInstance.get(API.BRANDS.GET_BY_ID(id)),
    updateBrand: (id, payload) => axiosInstance.put(API.BRANDS.UPDATE(id), payload),
};

export const usersService = {
    getAllUsers: () =>
    axiosInstance.get(API.ADMIN.GET_ALL_USERS_DATA),

    getAllNewUsers: () =>
    axiosInstance.get(API.ADMIN.GET_NEW_USERS),

    getUserById: (id) => axiosInstance.get(API.ADMIN.GET_USER_DATA(id))
};  


export const ordersService = {
    getOrders: () => axiosInstance.get(API.ORDERS.GET_ALL_ORDERS_ADMIN),
    getOrderById: (id) => axiosInstance.get(API.ORDERS.GET_ORDER_BY_ID_ADMIN(id)),
    updateOrderStatus: (id, status) => axiosInstance.put(API.ORDERS.UPDATE_ORDER_STATUS_ADMIN(id), { status }),
    getOrderStatusCounts: () => axiosInstance.get(API.ORDERS.GET_ORDER_STATUS_COUNTS_ADMIN),
};  

export const adminService = {
    getTopSellingProducts: () => axiosInstance.get(API.PRODUCTS.GET_TOP_SELLING),
    getLowStockProducts: () => axiosInstance.get(API.PRODUCTS.GET_LOW_STOCK_PRODUCTS),
    getOutOfStockProducts: () => axiosInstance.get(API.PRODUCTS.GET_OUT_OF_STOCK_PRODUCTS),
    getAllNewUsers: () => axiosInstance.get(API.ADMIN.GET_NEW_USERS),
    getAllAdmins: () => axiosInstance.get(API.ADMIN.GET_ALL),
    getAllBrands: () => axiosInstance.get(API.BRANDS.GET_ALL),
    getAllProducts: () => axiosInstance.get(API.PRODUCTS.GET_ALL),
    getAllCategories: () => axiosInstance.get(API.CATEGORIES.GET_ALL),
    getDashboardData: () => axiosInstance.get(API.ADMIN.GET_DASHBOARD_DATA),
    updateAdmin : (payload) => axiosInstance.put(API.ADMIN.UPDATE, payload),
    changeAdminPassword : () => axiosInstance.put(API.ADMIN.CHANGEPASSWORD),
    deleteAdmin : () => axiosInstance.delete(API.ADMIN.DELETE),
}