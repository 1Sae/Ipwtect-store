import axios from "axios";
import { API } from "../config/api"; 

// Create Axios Instance
export const axiosInstance = axios.create({
    baseURL: API.BASE_URL,
    withCredentials: true, // needed if using cookies / sessions
    timeout: 10000,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});


// =============================
// 🔐 REQUEST INTERCEPTOR
// Attach user token automatically
// =============================
axiosInstance.interceptors.request.use(
    (config) => {
        // Next.js runs on server too → check window
        if (typeof window !== "undefined") {
        const token = localStorage.getItem("user_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        }

        return config;
    },
    (error) => Promise.reject(error)
);


// =============================
// 🌍 RESPONSE INTERCEPTOR
// Global error handling
// =============================
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
        const status = error.response.status;

        switch (status) {
            case 401:
            if (typeof window !== "undefined") {
                localStorage.removeItem("user_token");
                localStorage.removeItem("user");
            }
            break;

            case 403:
            console.warn("Forbidden request");
            break;

            case 404:
            console.warn("Resource not found");
            break;

            case 500:
            console.error("Server error. Please try again later.");
            break;

            default:
            console.error("Unexpected error occurred");
        }
        }

        // Timeout handling
        if (error.code === "ECONNABORTED") {
        console.error("Request timeout.");
        }

        return Promise.reject(error);
    }
);
