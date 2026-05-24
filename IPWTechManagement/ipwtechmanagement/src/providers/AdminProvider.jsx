import { createContext, useEffect, useMemo, useState } from "react";
import axiosInstance from "../services/axiosInstance"; // ✅ match your file name
import { API } from "../config/apiPaths";

export const AdminContext = createContext(null);

const ADMIN_TOKEN_KEY = "admin_token";
const ADMIN_DATA_KEY = "admin";

export default function AdminProvider({ children }) {
    const [admin, setAdmin] = useState(() => {
        const saved = localStorage.getItem(ADMIN_DATA_KEY);
        return saved ? JSON.parse(saved) : null;
    });

    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!admin;

    useEffect(() => {
        const token = localStorage.getItem(ADMIN_TOKEN_KEY);

        if (!token) {
        setLoading(false);
        return;
        }

        const fetchProfile = async () => {
        try {
            const res = await axiosInstance.get(API.AUTH.PROFILE);

            const adminData = res.data?.data || res.data;

            setAdmin(adminData);
            localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(adminData));
        } catch (err) {
            console.error("Profile load failed:", err);
            logoutAdmin();
        } finally {
            setLoading(false);
        }
        };

        fetchProfile();
    }, []);

    const loginAdmin = async (payload) => {
        try {
        const res = await axiosInstance.post(API.AUTH.LOGIN, payload);

        const token = res.data?.data?.token;
        const adminData = res.data?.data?.admin;

        if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
        if (adminData) {
            localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(adminData));
            setAdmin(adminData);
        }

        return { success: true };
        } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || "Login failed",
        };
        }
    };

    const registerAdmin = async (payload) => {
        try {
        const res = await axiosInstance.post(API.AUTH.REGISTER, payload);

        const token = res.data?.data?.token;
        const adminData = res.data?.data?.admin;

        if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
        if (adminData) {
            localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(adminData));
            setAdmin(adminData);
        }

        return { success: true };
        } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || "Register failed",
        };
        }
    };

    const updateAdminProfile = async (payload) => {
        try {
            const response = await axiosInstance.put(API.ADMIN.UPDATE, payload);
    
            const updatedAdmin = response.data?.data;
            
            if (updatedAdmin) {
                setAdmin(updatedAdmin);
                localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(updatedAdmin));
            }
    
            return {
                success: true,
                message: "Profile updated successfully",
            };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || "Failed to update profile",
            };
        }
    };
    
    const changeAdminPassword = async (payload) => {
        try {
            const res = await axiosInstance.put(API.ADMIN.CHANGEPASSWORD, payload);
    
            return {
                success: true,
                message: "Password changed successfully",
            };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || "Failed to change password",
            };
        }
    };

    const deleteAdminAccount = async () => {
        try {
            const res = await axiosInstance.delete(API.ADMIN.DELETE);
    
            logoutAdmin();
    
            return {
                success: true,
                message: "Account deleted successfully",
            };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || "Failed to delete account",
            };
        }
    };
    

    const logoutAdmin = () => {
        setAdmin(null);
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(ADMIN_DATA_KEY);
    };

    const getProductsDependingOnFilter = async () => {};

    const value = useMemo(
        () => ({
            admin,
            loading,
            isAuthenticated,
            loginAdmin,
            registerAdmin,
            updateAdminProfile,
            changeAdminPassword,
            deleteAdminAccount,
            logoutAdmin,
            setAdmin,
        }),
        [admin, loading, isAuthenticated]
    );
    

    return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}
