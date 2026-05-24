import { Outlet } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContexts";
import SideMenu from "./SideMenu";

export default function DashboardLayout() {
    const t = useTheme();

    return (
        <div
        className="min-h-screen w-full flex"
        style={{ background: t.colors.background }}
        >
        {/* LEFT: Side menu from top to bottom */}
        <aside
            className="w-64 min-h-screen border-r"
            style={{
            background: t.colors.surface,
            borderColor: t.colors.borderColor,
            }}
        >
            <SideMenu />
        </aside>

        {/* RIGHT: Page content */}
        <main className="flex-1 p-6">
            <Outlet />
        </main>
        </div>
    );
}
