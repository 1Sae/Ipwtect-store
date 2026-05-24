import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AdminContext } from "../providers/AdminProvider";

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useContext(AdminContext);

    // ⏳ Wait until auth state is resolved
    if (loading) {
        return <div>Loading...</div>; // later replace with spinner
    }

    // ❌ Not logged in → go to auth
    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    // ✅ Logged in → allow access
    return <Outlet />;
};

export default ProtectedRoute;
