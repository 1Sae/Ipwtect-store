import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../contexts/ThemeContexts";
import { useAlert } from "../../providers/AlertProvider";
import { ordersService } from "../../services/Services";
import CustomDropdown from "../../components/buttons/CustomDropDown";
import {
LuTimerReset,LuTrendingUp,LuChartArea,
LuSearch,
LuLayoutGrid,
LuTable,
LuEye,
LuArrowUpDown,
LuBox,
LuUser,
LuCreditCard,
LuCalendar,
LuClock,
LuPackage,
LuTruck,
LuPackageCheck,
LuListX,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import OrdersModal from "../../components/modals/OrdersModal";
import StatusMenu from "../../components/orders/StatusMenu";

const STATUS_ICONS = {
    Pending: LuClock,
    Processing: LuPackage,
    Shipped: LuTruck,
    Delivered: LuPackageCheck,
    Cancelled: LuListX,
};

const cardStyle = (cfg, active = false) => ({
    background: `linear-gradient(
        135deg,
        ${cfg.bgColor} 0%,
        rgba(255,255,255,0.65) 60%,
        #ffffff 100%
    )`,
    border: active
        ? `2px solid ${cfg.borderColor}`
        : "1px solid rgba(0,0,0,0.06)",
    boxShadow: active
        ? `0 0 0 1px ${cfg.borderColor}, 0 14px 30px -12px ${cfg.borderColor}88`
        : "0 10px 22px -14px rgba(0,0,0,0.18)",
});


const StatusCard = React.memo(function StatusCard({
    status, count, cfg, active, onClick
}) {
    const Icon = STATUS_ICONS[status] || LuBox; // ✅ SAFE FALLBACK

    return (
        <button
            type="button"
            onClick={onClick}
            className="relative w-full scale-100 hover:scale-105 hover:-translate-y-0.5 cursor-pointer rounded-2xl px-6 py-5 flex items-center justify-between transition-all duration-300 hover:-translate-y-0.5"
            style={cardStyle(cfg, active)}
        >
            {/* LEFT */}
            <div className="flex flex-col items-start">
                <span className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    {cfg.label}
                </span>
                <span
                    className="text-4xl font-bold mt-1"
                    style={{ color: cfg.borderColor }}
                >
                    {count}
                </span>
            </div>

            {/* RIGHT ICON */}
            <div
                className="h-14 w-14 rounded-full flex items-center justify-center"
                style={{
                    background: `radial-gradient(
                        circle at top left,
                        #ffffff 0%,
                        ${cfg.bgColor} 70%
                    )`,
                }}
            >
                <Icon size={26} className={cfg.textClass} />
            </div>
        </button>
    );
});

const STATUS_CONFIG = {
    Pending: {
    label: "Pending",
    textClass: "text-yellow-500",
    bgColor: "#FEF3C7",          // badge background
    borderColor: "#f59e0b",      // card / footer / button border
    shadow: "0 10px 25px -10px rgba(234,179,8,0.45)",
    iconColor: "text-yellow-500",
    },

    Processing: {
    label: "Processing",
    textClass: "text-blue-600",
    bgColor: "#DBEAFE",
    borderColor: "#3b82f6",
    shadow: "0 10px 25px -10px rgba(59,130,246,0.45)",
    iconColor: "text-blue-600",
    },

    Shipped: {
    label: "Shipped",
    textClass: "text-orange-600",
    bgColor: "#FFEDD5",
    borderColor: "#ea580c",
    shadow: "0 10px 25px -10px rgba(232,135,31,0.45)",
    iconColor: "text-orange-600",
    },

    Delivered: {
    label: "Delivered",
    textClass: "text-green-600",
    bgColor: "#DCFCE7",
    borderColor: "#22c55e",
    shadow: "0 10px 25px -10px rgba(16,185,129,0.45)",
    iconColor: "text-green-600",
    },

    Cancelled: {
    label: "Cancelled",
    textClass: "text-red-600",
    bgColor: "#FEE2E2",
    borderColor: "#ef4444",
    shadow: "0 10px 25px -10px rgba(239,68,68,0.45)",
    iconColor: "text-red-600",
    },

    default: {
    label: "Unknown",
    textClass: "text-gray-600",
    bgColor: "#F3F4F6",
    borderColor: "#9ca3af",
    shadow: "0 4px 10px rgba(0,0,0,0.05)",
    iconColor: "text-gray-500",
    },
}; 
export default function OrdersPage () {
    const t = useTheme();
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    
        // brands
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [statusMenu, setStatusMenu] = useState({
        orderId: null,
        x: 0,
        y: 0,
    });
    
    
    
        // controls
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState("all"); // all | newest | oldest
    const [dateFilter, setDateFilter] = useState("all"); // all | today | last7 | last30
    const [statusFilter, setStatusFilter] = useState("all");
    const [layout, setLayout] = useState("table"); // "table" | "grid"

        // ✅ modal
    const [selectedViewId, setSelectedViewId] = useState(null);
    const openViewModal = Boolean(selectedViewId);

    const openOrderModal = (orderOrId) =>
        setSelectedViewId(
            typeof orderOrId === "string"
                ? orderOrId
                : orderOrId?._id || null
    );
    
    const closeOrderModal = () => setSelectedViewId(null);     
    
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await ordersService.updateOrderStatus(orderId, newStatus);
    
            setOrders((prev) =>
                prev.map((o) =>
                    o._id === orderId ? { ...o, status: newStatus } : o
                )
            );
    
            showAlert("success", "Order status updated");
        } catch (err) {
            showAlert(
                "error",
                err?.response?.data?.message || "Failed to update status"
            );
        } finally {
            setStatusMenu({ orderId: null, x: 0, y: 0 });
        }        
    };
    
    
    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const response = await ordersService.getOrders();
            const list = response?.data?.data?.orders || [];
            setOrders(list);
            showAlert("success", "Orders loaded successfully");
        } catch (error) {
            showAlert("error", error?.response?.data?.message || "Failed to load orders");
            setOrders([]);
        } finally {
            setLoadingOrders(false);
        }
    }                   

    
    useEffect(() => {
        fetchOrders();
    }, []);
    
    const filteredSortedOrders = useMemo(() => {
        if (!orders.length) return [];
    
        let list = orders;
    
        if (statusFilter !== "all") {
            list = list.filter(o => o.status === statusFilter);
        }
    
        if (query.trim()) {
            const q = query.toLowerCase();
            list = list.filter(o =>
                o._id?.toLowerCase().includes(q) ||
                o.user?.name?.toLowerCase().includes(q) ||
                o.user?.email?.toLowerCase().includes(q) ||
                o.user?.phone?.toLowerCase().includes(q)
            );
        }
    
        if (dateFilter !== "all") {
            const now = Date.now();
            list = list.filter(o => {
                const time = new Date(o.createdAt).getTime();
                if (dateFilter === "today")
                    return new Date(o.createdAt).toDateString() === new Date().toDateString();
                if (dateFilter === "last7") return now - time <= 7 * 86400000;
                if (dateFilter === "last30") return now - time <= 30 * 86400000;
                return true;
            });
        }
    
        if (sort === "newest") list = [...list].sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt));
        if (sort === "oldest") list = [...list].sort((a,b)=> new Date(a.createdAt)-new Date(b.createdAt));
        if (sort === "amountHigh") list = [...list].sort((a,b)=> b.totalAmount-a.totalAmount);
        if (sort === "amountLow") list = [...list].sort((a,b)=> a.totalAmount-b.totalAmount);
        if (sort === "paidOnly") list = list.filter(o=>o.paid);
        if (sort === "unpaidOnly") list = list.filter(o=>!o.paid);
    
        return list;
    }, [orders, query, sort, dateFilter, statusFilter]);
    
    
    const handleReset = () => {
        setQuery("");
        setSort("all");
        setDateFilter("all");
        setStatusFilter("all");
    };
    
    
    const statusCounts = useMemo(() => {
        return {
            Pending: orders.filter(o => o.status === "Pending").length,
            Processing: orders.filter(o => o.status === "Processing").length,
            Shipped: orders.filter(o => o.status === "Shipped").length,
            Delivered: orders.filter(o => o.status === "Delivered").length,
            Cancelled: orders.filter(o => o.status === "Cancelled").length,
        };
    }, [orders]);          


return (
        <div className="h-screen flex flex-col">
            {/* header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 px-2 py-2 shrink-0">
                <div className="mb-1">
                    <h1 className="font-bold" style={{ color: t.colors.primary, fontSize: t.typography.h3 }}>
                        Manage Orders
                    </h1>
                    <p style={{ color: t.colors.secondColor, fontSize: t.typography.small }}>
                        Manage Customer's Orders, filter,monitor,search and update the statuses of them
                    </p>
                </div>
                <div className="mb-1 flex flex-col sm:flex-row gap-3 sm:items-end">
                <button
                type="button"
                onClick={handleReset}
                className="
                    text-orange-400
                    cursor-pointer
                    px-5 py-2 mb-0 text-sm font-semibold
                    rounded-md
                    transition-all duration-600 ease-out
                    hover:-translate-y-1
                    hover:shadow-[0_8px_15px_-6px_rgba(255,162,96,0.8)]
                    hover:bg-orange-400 hover:text-white
                    hover:border-orange-400
                    focus:outline-none
                "
                >
                Reset
                </button>
                    <div className="w-full sm:w-48">
                        <CustomDropdown
                        label="Quick Filter"
                        value={sort}
                        icon={<LuTrendingUp size={14}/>}
                        onChange={setSort}
                        options={[
                            {value: "all", label: "All"},
                            {value: "newest", label: "Newest"},
                            {value: "oldest", label: "Oldest"},
                            {value: "amountHigh", label: "Amount High"},
                            {value: "amountLow", label: "Amount Low"},
                            {value: "paidOnly", label: "Paid Only"},
                            {value: "unpaidOnly", label: "Unpaid Only"},
                        ]}
                        />
                    </div>
                    <div className="w-full sm:w-48">
                    <CustomDropdown
                        label="Date Filter"
                        value={dateFilter}
                        icon={<LuTimerReset size={14}/>}
                        onChange={setDateFilter}
                        options={[
                            {value: "all", label: "All"},
                            {value: "today", label: "Today"},
                            {value: "last7", label: "Last 7 days"},
                            {value: "last30", label: "Last 30 days"},
                        ]}
                        />
                    </div>
                    <div className="w-full sm:w-48">
                    <CustomDropdown
                        label="Status Filter"
                        value={statusFilter}
                        icon={<LuChartArea size={14}/>}
                        onChange={setStatusFilter}
                        options={[
                            {value: "all", label: "All"},
                            {value: "Pending", label: "Pending"},
                            {value: "Processing", label: "Processing"},
                            {value: "Shipped", label: "Shipped"},
                            {value: "Delivered", label: "Delivered"},
                            {value: "Cancelled", label: "Cancelled"},
                        ]}
                        />
                    </div>
                    <div className="w-full sm:w-72 flex items-center scale-100 hover:scale-105 transition duration-300 gap-2 border px-3 py-2" style={{ borderColor: t.colors.borderColor, borderRadius: t.radius.md, background: "white" }}>
                        <LuSearch style={{ color: t.colors.primary }} size={14} />
                        <input
                        type="text"
                        placeholder="Search by Order ID, Customer Name, Email or Phone"
                        className="w-full rounded-lg outline-none bg-transparent text-sm"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        style={{ color: t.colors.textPrimary }}
                        />
                    </div>
                </div>
            </div>


            <div className="flex-1 overflow-y-auto scroll-smooth">

            {/* status badges */}
            <div className="mt-6 px-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {Object.keys(statusCounts).map((status) => {
                    const cfg = STATUS_CONFIG[status];

                    return (
                    <StatusCard
                        key={status}
                        status={status}
                        count={statusCounts[status]}
                        cfg={cfg}
                        active={statusFilter === status}
                        onClick={() =>
                        setStatusFilter(prev =>
                            prev === status ? "all" : status
                        )
                        }
                    />
                    );
                })}
            </div>
                    
            <div className="px-2 mt-3 flex items-center gap-2 justify-between" style={{ color: t.colors.textSecondary }}>
            <div className="flex items-center gap-2">
            <TabButton active={layout === "table"} onClick={() => setLayout("table")} label="Table" icon={<LuTable size={14} />} />
            <TabButton active={layout === "grid"} onClick={() => setLayout("grid")} label="Grid" icon={<LuLayoutGrid size={14} />} />
            </div>


            {layout === "grid" && (
                <div className="items-end text-sm font-medium flex gap-2 mt-3" style={{ color: t.colors.primary }}>
                {loadingOrders ? "...loading" : `Loaded ${filteredSortedOrders.length} Order(s)`}
                </div>
            )}
            </div>

            {layout === "table" && (
                        <div
                        className="mt-6 border overflow-hidden shadow-sm"
                        style={{ borderColor: t.colors.borderColor, background: t.colors.surface, borderRadius: t.radius.lg }}
                        >
                        <div className="px-4 py-3 border-b" style={{ borderColor: t.colors.borderColor }}>
                            <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <LuTable style={{ color: t.colors.primary }} />
                                <div className="font-semibold" style={{ color: t.colors.textPrimary }}>
                                Orders List
                                </div>
                            </div>
            
                            <div className="text-sm font-medium" style={{ color: t.colors.primary }}>
                                {loadingOrders ? "Loading..." : `Loaded ${filteredSortedOrders.length} Order(s)`}
                            </div>
                            </div>
                        </div>
            
                        <div
                            className="w-full overflow-auto"
                            style={{
                                maxHeight: "calc(100vh - 400px)", // responsive height
                            }}
                        >
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 z-10">
                                <tr className="text-left" style={{ background: t.colors.inputBackground, color: t.colors.primary,  }} key="header">
                                    <th className="px-4 py-3">Order ID</th>
                                    <th className="px-4 py-3">Customer</th>
                                    <th className="px-4 py-3">Items</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">Payment</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                                </thead>
            
                                <tbody>
                                {loadingOrders ? (
                                    <tr>
                                    <td className="px-4 py-10 text-center" colSpan={8}>
                                        <div className="font-semibold" style={{ color: t.colors.textPrimary }}>
                                        Loading Orders...
                                        </div>
                                    </td>
                                    </tr>
                                ) : (
                                    filteredSortedOrders.map((o, index) => {
                                        const cfg = STATUS_CONFIG[o.status] || STATUS_CONFIG.default;
                                        return (
                                            <tr key={o?._id || index}>
                                            <td className="px-4 py-3 font-semibold cursor-pointer" style={{ color: t.colors.textPrimary }} onClick={() => setSelectedViewId(o._id)}>
                                            {o._id.slice(0, 8)}..... 
                                            </td>
                                            <td className="px-4 py-3">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-semibold" style={{ color: t.colors.textPrimary }}>
                                                {o.user.name.slice(0, 9)}.....
                                                </span>
                                                <span className="text-xs" style={{ color: t.colors.textSecondary }}>
                                                {o.user.email.slice(0, 9)}....
                                                </span>
                                            </div>
                                            </td>
                                            <td className="px-8 py-3 font-semibold" style={{ color: t.colors.textPrimary }}>{o.itemsCount}</td>
                                            <td className="px-6 py-3 font-semibold" style={{ color: t.colors.textPrimary }}>{o.totalAmount}</td>
                                            <td className="text-sm px-1 py-3 font-semibold" style={{ color: t.colors.textPrimary }}>{o.paymentMethod}</td>
                                            <td className="px-2 py-3">
                                            <span
                                                className={`inline-flex items-center justify-center shadow-sm
                                                text-xs font-semibold px-2 py-1 rounded-full ${cfg.textClass} ${cfg.shadow}`}
                                                style={{ background: cfg.bgColor }}
                                            >
                                                {cfg.label}
                                            </span>
                                            </td>
                                            <td className="px-2 py-3 text-xs font-semibold" style={{ color: t.colors.textPrimary }}>
                                            {new Date(o.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-2 py-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                type="button"
                                                className={`inline-flex items-center px-2 py-1.5 border text-xs font-semibold transition cursor-pointer scale-100 hover:scale-105 rounded-md ${cfg.textClass} ${cfg.borderColor} ${cfg.shadow} `}
                                                onClick={() => setSelectedViewId(o._id)}
                                                style={{ background: cfg.bgColor }}
                                                >
                                                <LuEye size={14} />
                                                </button>
                                                <div className="relative">
                                                <button
                                                    type="button"
                                                    className={`
                                                        inline-flex items-center px-2 py-1.5 border
                                                        text-xs font-semibold rounded-md cursor-pointer scale-100 hover:scale-105
                                                        ${cfg.textClass}
                                                    `}
                                                    style={{
                                                        background: cfg.bgColor,
                                                        borderColor: cfg.borderColor,
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();

                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const MENU_WIDTH = 220;
                                                        const MENU_HEIGHT = 170;

                                                        let x = rect.left;
                                                        let y = rect.bottom + 6;

                                                        if (x + MENU_WIDTH > window.innerWidth) {
                                                            x = window.innerWidth - MENU_WIDTH - 12;
                                                        }

                                                        if (y + MENU_HEIGHT > window.innerHeight) {
                                                            y = rect.top - MENU_HEIGHT - 6;
                                                        }

                                                        setStatusMenu({
                                                            orderId: o._id,
                                                            x,
                                                            y,
                                                        });
                                                    }}
                                                >
                                                    <LuArrowUpDown size={14} />
                                                </button>

                                                </div>

                                            </div>
                                            </td>
                                        </tr>
                                        );
                                    })
                                )}
            
                                {!loadingOrders && filteredSortedOrders.length === 0 && (
                                    <tr>
                                    <td className="px-4 py-10 text-center" colSpan={8}>
                                        <div className="font-semibold" style={{ color: t.colors.textPrimary }}>
                                        No Orders found
                                        </div>
                                        <div className="text-sm" style={{ color: t.colors.textSecondary }}>
                                        Try changing filters or reset.
                                        </div>
                                    </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                            </div>
                        </div>
                    )}

                    {layout === "grid" && (
                    <div
                    className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    style={{
                      paddingBottom: "calc(12vh)", // responsive bottom space
                    }}
                    >
                        {loadingOrders ? (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3">
                            <div className="font-semibold" style={{ color: t.colors.textPrimary }}>
                            Loading Orders...
                            </div>
                        </div>
                        ) : (
                        filteredSortedOrders.map((o, index) => {
                            const cfg = STATUS_CONFIG[o.status] || STATUS_CONFIG.default;

                            return(
                            <div
                            key={o._id || index}
                            className="border flex flex-col p-4 mb-4 "
                            style={{
                                ...cardStyle(cfg),
                                minHeight: 300,
                            }}
                            >

                            {/* ===== HEADER ===== */}
                            <div className="flex items-start justify-between">

                                <div className="flex gap-3">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center"
                                    style={{
                                        background: `radial-gradient(
                                            circle at top left,
                                            #ffffff 0%,
                                            ${cfg.bgColor} 70%
                                        )`,
                                    }}
                                    >
                                    {React.createElement(STATUS_ICONS[o.status] || LuBox, {
                                        size: 22,
                                        className: cfg.textClass,
                                    })}
                                </div>


                                <div className="flex flex-col">
                                    <div
                                    className="text-sm font-semibold"
                                    style={{ color: t.colors.textPrimary }}
                                    >
                                    {o._id.slice(0, 8)}....
                                    </div>
                                    <div
                                    className="text-xs"
                                    style={{ color: t.colors.textSecondary }}
                                    >
                                    {o.itemsCount} item{o.itemsCount > 1 ? "s" : ""}
                                    </div>
                                </div>
                                </div>

                                <span
                                className={`inline-flex items-center justify-center
                                    text-sm font-semibold px-3 py-1 rounded-full ${cfg.textClass}`}
                                style={{ background: cfg.bgColor }}
                                >
                                {cfg.label}
                                </span>

                            </div>

                            {/* ===== BODY ===== */}
                            <div className="mt-5 flex flex-col gap-4">

                                {/* USER */}
                                <div className={`flex gap-3 items-center ${cfg.textClass}`}>
                                <LuUser size={18} />
                                <div className="flex flex-col">
                                    <span
                                    className="text-sm font-semibold"
                                    style={{ color: t.colors.textPrimary }}
                                    >
                                    {o.user.name}
                                    </span>
                                    <span
                                    className="text-xs"
                                    style={{ color: t.colors.textSecondary }}
                                    >
                                    {o.user.email}
                                    </span>
                                </div>
                                </div>

                                {/* PAYMENT */}
                                <div className={`flex gap-3 items-center ${cfg.textClass}`}>
                                <LuCreditCard size={18}/>
                                <span
                                    className="text-sm font-medium"
                                    style={{ color: t.colors.textPrimary }}
                                >
                                    {o.paymentMethod}
                                </span>

                                <span
                                    className="ml-auto text-sm font-bold"
                                    style={{ color: t.colors.textPrimary }}
                                >
                                    ${o.totalAmount.toLocaleString()}
                                </span>
                                </div>

                                {/* DATE */}
                                <div className={`flex gap-3 items-center ${cfg.textClass}`}>
                                <LuCalendar size={18}/>
                                <span
                                    className="text-sm"
                                    style={{ color: t.colors.textPrimary }}
                                >
                                    {new Date(o.createdAt).toLocaleDateString()}
                                </span>
                                </div>

                            </div>

                            {/* ===== FOOTER ===== */}
                            <div
                            className="mt-auto pt-4 flex gap-3 border-t"
                            style={{
                                borderColor: cfg.borderColor,
                            }}
                            >
                            <button
                                className={`flex-1 py-2 rounded-lg text-sm font-semibold border cursor-pointer scale-100 hover:scale-105
                                    inline-flex items-center justify-center gap-2 ${cfg.textClass}`}
                                style={{ borderColor: cfg.borderColor, background: cfg.bgColor }}
                                onClick={() => openOrderModal(o)}
                            >
                                <LuEye size={18} />
                                View
                            </button>

                            <div className="relative flex-1 cursor-pointer scale-100 hover:scale-105">
                            <button
                                className={`w-full py-2 rounded-lg text-sm font-semibold border
                                            inline-flex items-center justify-center gap-2 cursor-pointer ${cfg.textClass}`}
                                style={{
                                    borderColor: cfg.borderColor,
                                    background: cfg.bgColor,
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setStatusMenu({
                                    orderId: o._id,
                                    x: rect.left,
                                    y: rect.bottom + 8,
                                    });
                                }}
                                >
                                <LuArrowUpDown size={18} />
                                Update
                                </button>
                            </div>

                            </div>


                            </div>
                        );
                    })
                    )}
                    </div>
                )}                        


            </div>
                    

            {statusMenu.orderId && (
            <StatusMenu
                orderId={statusMenu.orderId}
                currentStatus={
                orders.find(o => o._id === statusMenu.orderId)?.status
                }
                onChange={handleStatusChange}
                onClose={() =>
                setStatusMenu({ orderId: null, x: 0, y: 0 })
                }
                STATUS_CONFIG={STATUS_CONFIG}
                style={{
                position: "fixed",
                top: statusMenu.y,
                left: statusMenu.x,
                zIndex: 99999,
                }}
            />
            )}



            <OrdersModal open={openViewModal} orderId={selectedViewId} onClose= {() => setSelectedViewId(null)} />
        </div>
)
}

function TabButton({ active, onClick, icon, label }) {
    const t = useTheme();
    return (
        <button
        type="button"
        onClick={onClick}
        className={`
            group relative px-4 py-2 text-sm font-semibold cursor-pointer
            inline-flex items-center gap-2
            transition-colors duration-200
            ${active ? "text-orange-500" : "text-gray-700 hover:text-orange-400"}
        `}
        >

        {icon}
        {label}

        <span
            className={`
            absolute left-0 -bottom-0.5 h-0.5 bg-orange-400
            transition-all duration-300
            ${active ? "w-full" : "w-0 group-hover:w-full"}
            `}
        />
        </button>

    );
}

function DropDownStatus ({handleStatusChange}) {
    const t = useTheme();
    return (
        <select
        onChange={handleStatusChange}
        className="px-4 py-2 text-sm font-semibold inline-flex items-center gap-2 transition-colors"
        style={{
            borderBottom: `2px solid ${t.colors.primary}`,
            borderLeft: "none",
            borderRight: "none",
            borderTop: "none",
            background: "transparent",
            color: t.colors.primary,
        }}
        >
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
        </select>
    );  
}

