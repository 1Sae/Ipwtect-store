import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppThemeProvider } from "./contexts/ThemeContexts";
import AdminProvider from "./providers/AdminProvider";
import AlertProvider from "./providers/AlertProvider";

import AuthPage from "./pages/Auth/AuthPage";
import DashboardLayout from "./layout/Dashboardlayout";

import DashboardHome from "./pages/Dashboard/DashboardHome";
import OrdersPage from "./pages/Dashboard/OrdersPage";
import ProductsPage from "./pages/Dashboard/ProductsPage";
import AddProductPage from "./pages/Dashboard/AddProductPage";
import CustomersPage from "./pages/Dashboard/CustomersPage";
import SettingsPage from "./pages/Dashboard/SettingsPage";
import NotFound from "./pages/NotFound";

import Alert from "./components/Alerts/Alert";
import PublicRoute from "./routers/publicRouter";
import ProtectedRoute from "./routers/ProtectedRouter";
import Categories from "./pages/Dashboard/Categories";
import Brands from "./pages/Dashboard/Brands";

export default function App() {
    return (
        <AppThemeProvider>
        <AlertProvider>
            <AdminProvider>
            <BrowserRouter>
                <Alert />

                {/* ✅ ROUTES WRAPPER IS REQUIRED */}
                <Routes>

                {/* 🔓 PUBLIC ROUTES */}
                <Route element={<PublicRoute />}>
                    <Route path="/auth" element={<AuthPage />} />
                </Route>

                {/* 🔒 PROTECTED ROUTES */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<DashboardHome />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/add" element={<AddProductPage />} />
                    <Route path="/customers" element={<CustomersPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/brands" element={<Brands />} />
                    </Route>
                </Route>

                {/* Default */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />

                </Routes>
            </BrowserRouter>
            </AdminProvider>
        </AlertProvider>
        </AppThemeProvider>
    );
}
