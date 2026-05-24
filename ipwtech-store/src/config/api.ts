export const API = {
    BASE_URL: "http://localhost:3000/api",

    AUTH: {
        LOGIN: "/user/auth/login",
        REGISTER: "/user/auth/register",
    },

    PRODUCTS: {
        GET_ALL: "/products/",
        GET_ONE: (id: string) => `/products/${id}`,
        GET_PRODUCTS_BY_CATEGORY_NAME: (categoryName: string) => `/products/category/${categoryName}`,
        GET_PRODUCTS_BY_BRAND_NAME: (brandName: string) => `/products/brand/${brandName}`,
        GET_PRODUCTS_BY_SPECs: '/products/filter',
        GET_PRODUCTS_BY_STATUS: (status: string) => `/products/status/${status}`,
        GET_LOW_STOCK_PRODUCTS: "/products/low",
        GET_OUT_OF_STOCK_PRODUCTS: "/products/out",
        GET_TOP_SELLING: "/products/top-selling-user",
        GET_NEWEST_PRODUCTS: "/products/newest",
        GET_DISCOUNTED_PRODUCTS: "/products/discounted",
        GET_FILTERED_PRODUCTS: "/products/filter",
        GET_PRODUCTS_SPECIFICATIONS: "/products/specifications",
        GET_SHOP_SPECS: `/products/shop-specs`,
        SEARCH_PRODUCTS: (q: string) => `/products/search?q=${q}`,
    },

    Brands: {
        GET_ALL: "/brands/",
        GET_ONE: (id: string) => `/brands/${id}`,
    },

    Categories: {
        GET_ALL: "/categories/",
        GET_ONE: (id: string) => `/categories/${id}`,
    },

    WISHLIST: {
        GET: "/wishlist/",
        ADD: (id: string) => `/wishlist/add/${id}`,
        REMOVE: (id: string) => `/wishlist/remove/${id}`,
    },

    CART: {
        GET: "/cart/",
        ADD: "/cart/add",
        UPDATE: "/cart/update",
        REMOVE: "/cart/remove",
        CLEAR: "/cart/clear",
    },

    Order: {
        CREATE_ORDER_FROM_CART: "/orders/create",
        GET: "/orders/",
        UPDATE: (id: string) => `/orders/${id}`,
        DELETE: (id: string) => `/orders/${id}`,
        CANCEL: (id: string) => `/orders/cancel/${id}`,
    },

    user: {
        CHANGE_USER_PASSWORD: "/user/change-user-password",
        GET_USER_DATA: "/user/get-user-data",
        UPDATE_USER_DATA: "/user/update-user-data",
        ADD_USER_ADDRESS: "/user/address",
        UPDATE_USER_ADDRESS: (index: number) => `/user/address/${index}`,
        DELETE_USER_ADDRESS: (index: number) => `/user/address/${index}`,
        GET_USER_ADDRESSES: "/user/addresses",
    },
    REVIEWS: {
        ADD_REVIEW: (id: string) => `/reviews/${id}`,
        GET_REVIEWS: (id: string) => `/reviews/${id}`,
    }


};  