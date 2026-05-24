import axios from "axios";
import { BASE_URL } from "../config/apiPaths";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
    timeout: 10000,
    headers: {
        Accept: "application/json",
    },
});

// 🔐 Attach token automatically
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("admin_token");
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 🌍 Global response handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
        if (error.response.status === 401) {
            console.warn("Unauthorized – token expired or invalid");
            // later: AdminContext.logout()
        }
        if (error.response.status === 500) {
            console.error("Server error. Please try again later.");
        }
        }

        if (error.code === "ECONNABORTED") {
        console.error("Request timeout.");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
