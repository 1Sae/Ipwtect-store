import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AdminContext } from "../providers/AdminProvider";

const PublicRoute = () => {
    const { isAuthenticated, loading } = useContext(AdminContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    // ✅ Already logged in → redirect to dashboard
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    // ❌ Not logged in → allow access to auth
    return <Outlet />;
};

export default PublicRoute;
