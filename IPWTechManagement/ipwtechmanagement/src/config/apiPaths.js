export const BASE_URL = "http://localhost:3000/api";
export const IMAGE_BASE_URL = "http://localhost:3000";


export const API = {
    AUTH: {
        LOGIN: "/api/admin/auth/login",
        REGISTER: "/api/admin/auth/register",
        PROFILE: "/get-all-admin-data",
    },
    ADMIN: {
        GET_ALL: "/api/admin/",
        UPDATE: "/api/admin/update-admin",
        DELETE: "/api/admin/delete-admin",   
        GET_ALL_USERS_DATA: "/api/admin/get-all-users-data",
        GET_NEW_USERS: "/api/admin/users/new",
        GET_USER_DATA: (id) => `/api/admin/userdata/${id}`,
        GET_DASHBOARD_DATA: "/api/admin/get-dashboard-data",
        CHANGEPASSWORD: "/api/admin/change-password",
    },
    BRANDS: {
        GET_ALL: "/api/brands/",
        GET_BY_ID: (id) => `/api/brands/${id}`,
        CREATE: "/api/brands/",
        UPDATE: (id) => `/api/brands/${id}`,
        DELETE: (id) => `/api/brands/${id}`,
    },
    CATEGORIES: {
        GET_ALL: "/api/categories/",
        GET_BY_ID: (id) => `/api/categories/${id}`,
        CREATE: "/api/categories/",
        UPDATE: (id) => `/api/categories/${id}`,
        DELETE: (id) => `/api/categories/${id}`,
    },
    PRODUCTS: {
        GET_PRODUCTS_BY_CATEGORY_NAME: (categoryName) => `/api/products/category/${categoryName}`,
        GET_PRODUCTS_BY_BRAND_NAME: (brandName) => `/api/products/brand/${brandName}`,
        FILTER_PRODUCTS_BY_SPECS: "/api/products/filter",
        FILTER_PRODUCTS_BY_STATUS: (status) => `/api/products/status/${status}`,
        GET_LOW_STOCK_PRODUCTS: "/api/products/stock/low",
        GET_OUT_OF_STOCK_PRODUCTS: "/api/products/stock/out",
        GET_ALL: "/api/products/",
        GET_BY_ID: (id) => `/api/products/${id}`,
        CREATE: "/api/products/",
        UPDATE: (id) => `/api/products/${id}`,
        DELETE: (id) => `/api/products/${id}`,
        GET_TOP_SELLING: "/api/products/admin/top-selling",
    },
    WISHLIST: {
        GET_ALL: "/api/wishlist/",
        ADD_TO_WISHLIST: (id) => `/api/wishlist/${id}`,
    },
    ORDERS: {
        GET_ORDER_STATUS_COUNTS_ADMIN: "/api/orders/admin/stats",
        GET_ALL_ORDERS_ADMIN: "/api/orders/admin",
        GET_ORDER_BY_ID_ADMIN: (id) => `/api/orders/admin/${id}`,
        UPDATE_ORDER_STATUS_ADMIN: (id) => `/api/orders/status/${id}`,
    },
    UPLOADS: {
        PRODUCT_IMAGE: "/api/products/upload",   
        BRAND_IMAGE: "/api/brands",               
        CATEGORY_IMAGE: "/api/categories",        
    },
    IMAGES: {
        PRODUCT: (filename) => `${BASE_URL}/uploads/products/${filename}`,
        BRAND: (filename) => `${BASE_URL}/uploads/brands/${filename}`,
        CATEGORY: (filename) => `${BASE_URL}/uploads/categories/${filename}`,
    },
};  