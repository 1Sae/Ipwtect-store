import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContexts";
import { useContext } from "react";
import { AdminContext } from "../providers/AdminProvider";
import logo from "../assets/logo.png";

import {
    LuLayoutDashboard,
    LuUsers,
    LuBaggageClaim,
    LuPackagePlus,
    LuSettings,
    LuLogOut,
    LuChartBarStacked,
    LuChartBar,
    LuPackage,
} from "react-icons/lu";

export default function SideMenu() {
    const t = useTheme();
    const navigate = useNavigate();
    const { logoutAdmin } = useContext(AdminContext);

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg border transition duration-300
        ${
        isActive
            ? "bg-orange-400 text-white border-orange-300"
            : "text-gray-700 border-transparent hover:bg-gray-100"
        }`;

    const iconClass = "text-base";

    const handleLogout = () => {
        logoutAdmin();
        navigate("/auth", { replace: true });
    };

    return (
        <aside
        className="w-64 min-h-screen border-r flex flex-col"
        style={{
            background: t.colors.surface,
            borderColor: t.colors.borderColor,
        }}
        >
        {/* 🔹 LOGO */}
        <div
            className="px-4 py-6 flex items-center gap-3 border-b"
            style={{ borderColor: t.colors.borderColor }}
        >
            <img src={logo} alt="IPW Tech" className="w-12 h-12 object-contain" />
            <div>
            <div className="font-semibold" style={{ color: t.colors.textPrimary }}>
                IPW Tech
            </div>
            <div className="text-xs" style={{ color: t.colors.textSecondary }}>
                Management
            </div>
            </div>
        </div>

        {/* 🔹 MAIN NAV */}
        <nav className="px-4 py-6 space-y-2">
            <NavLink to="/dashboard" className={linkClass}>
            <LuLayoutDashboard className={iconClass} />
            <span>Dashboard</span>
            </NavLink>

            <NavLink to="/orders" className={linkClass}>
            <LuBaggageClaim className={iconClass} />
            <span>Orders</span>
            </NavLink>

            <NavLink to="/products" end className={linkClass}>
            <LuPackage className={iconClass} />
            <span>Products</span>
            </NavLink>

            <NavLink to="/products/add" className={linkClass}>
            <LuPackagePlus className={iconClass} />
            <span>Add Products</span>
            </NavLink>

            <NavLink to="/categories" className={linkClass}>
            <LuChartBarStacked className={iconClass} />
            <span>Categories</span>
            </NavLink>

            <NavLink to="/brands" className={linkClass}>
            <LuChartBar className={iconClass} />
            <span>Brands</span>
            </NavLink>

            <NavLink to="/customers" className={linkClass}>
            <LuUsers className={iconClass} />
            <span>Customers</span>
            </NavLink>

        </nav>

        {/* 🔹 BOTTOM SECTION */}
        <div className="mt-auto px-4 py-6 border-t space-y-2"
            style={{ borderColor: t.colors.borderColor }}
        >
            <NavLink to="/settings" className={linkClass}>
            <LuSettings className={iconClass} />
            <span>Settings</span>
            </NavLink>

            <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg border border-transparent
                        text-red-600 hover:bg-red-50 transition"
            >
            <LuLogOut className="text-base" />
            <span>Logout</span>
            </button>
        </div>
        </aside>
    );
}
