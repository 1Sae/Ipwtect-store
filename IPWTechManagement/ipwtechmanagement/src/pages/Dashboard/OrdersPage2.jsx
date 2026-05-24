import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../contexts/ThemeContexts";
import { useAlert } from "../../providers/AlertProvider";
import { ordersService } from "../../services/Services";
import CustomDropdown from "../../components/buttons/CustomDropDown";
import SaveButtons from "../../constants/SaveButtons";
import {
LuTimerReset,LuTrendingUp,LuChartArea,
LuSearch,
LuLayoutGrid,
LuTable,
LuChartBarStacked,
LuPencil,
LuTrash2
} from "react-icons/lu";

const OrdersPage2 = () => {
    const t = useTheme();
    const { showAlert } = useAlert();
    
        // brands
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    
        // controls
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState("all"); // all | newest | oldest
    const [dateFilter, setDateFilter] = useState("all"); // all | today | last7 | last30
    const [statusFilter, setStatusFilter] = useState("all");
    const [layout, setLayout] = useState("table"); // "table" | "grid"

        // ✅ modal
    const [selectedViewId, setSelectedViewId] = useState(null);
    const openViewModal = Boolean(selectedViewId);

    const openOrderModal = (order) => setSelectedViewId(order?._id || null);
    const closeOrderModal = () => setSelectedViewId(null);
        
    const fetchOrders = async () => {
        setLoadingOrders(true);
            
        try {
            const res = await ordersService.getAllOrders();
        
            // 👉 extract from object root
            const list = res?.data?.data?.orders || [];
        
            setOrders(list);
        
            } catch (err) {
        
            showAlert(
                "error",
                err?.response?.data?.message || "Failed to load orders"
            );
        
            setOrders([]);
        
            } finally {
            setLoadingOrders(false);
            }            
    };                   

    
    useEffect(() => {
        fetchOrders();
    }, []);
    
    const filteredSortedOrders = useMemo(() => {

        let list = [...orders];

            if (statusFilter !== "all") {
            list = list.filter(
                o => o.status === statusFilter
            );
            }
        

            if (query.trim()) {
        
            const q = query.toLowerCase();
        
            list = list.filter(o => {
        
                const id = o._id?.toLowerCase();
                const name = o.user?.name?.toLowerCase();
                const email = o.user?.email?.toLowerCase();
                const phone = o.user?.phone?.toLowerCase();
        
                return (
                id?.includes(q) ||
                name?.includes(q) ||
                email?.includes(q) ||
                phone?.includes(q)
                );
            });
            }
        
            // date based
            if (sort === "newest") {
            list.sort(
                (a,b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            }
        
            if (sort === "oldest") {
            list.sort(
                (a,b) =>
                new Date(a.createdAt) - new Date(b.createdAt)
            );
            }
        
            // amount based
            if (sort === "amountHigh") {
            list.sort(
                (a,b) =>
                (b.totalAmount || 0) - (a.totalAmount || 0)
            );
            }
        
            if (sort === "amountLow") {
            list.sort(
                (a,b) =>
                (a.totalAmount || 0) - (b.totalAmount || 0)
            );
            }

        
            if (dateFilter === "today") {
            list = list.filter(
                o => isToday(o.createdAt)
            );
            }
        
            if (dateFilter === "last7") {
            list = list.filter(
                o => isLastDays(o.createdAt, 7)
            );
            }
        
            if (dateFilter === "last30") {
            list = list.filter(
                o => isLastDays(o.createdAt, 30)
            );
            }
        
            if (dateFilter === "paidOnly") {
            list = list.filter(
                o => o.paid === true
            );
            }
        
            if (dateFilter === "unpaidOnly") {
            list = list.filter(
                o => o.paid === false
            );
            }        

        return list || [];
    
    }, [
        orders,
        query,
        sort,
        dateFilter,
        statusFilter
    ]);
    
    const handleReset = () => {
        setQuery("");
        setSort("all");
        setDateFilter("all");            
    };
    


return (
        <div className="mt-0">
            {/* header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between rounded-lg gap-2 px-2 py-2 w-full ">
                <div className="mb-1">
                    <h1 className="font-bold" style={{ color: t.colors.textPrimary, fontSize: t.typography.h3 }}>
                        Manage Orders
                    </h1>
                    <p style={{ color: t.colors.textSecondary, fontSize: t.typography.small }}>
                        Manage Customer's Orders, filter,monitor,search and update the statuses of them
                    </p>
                </div>
                <div className="mb-1 flex flex-col sm:flex-row gap-3 sm:items-end">
                    <SaveButtons handle={handleReset} title="Reset" />
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
                            {value: "paidOnly", label: "Paid Only"},
                            {value: "unpaidOnly", label: "Unpaid Only"},
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
                            {value: "pending", label: "Pending"},
                            {value: "delivered", label: "Delivered"},
                            {value: "cancelled", label: "Cancelled"},
                        ]}
                        />
                    </div>
                    <div className="w-full sm:w-72 flex items-center gap-2 border px-3 py-2" style={{ borderColor: t.colors.borderColor, borderRadius: t.radius.md, background: "white" }}>
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
        </div>
)
}

function TabButton({ active, onClick, icon, label }) {
    const t = useTheme();
    return (
        <button
        type="button"
        onClick={onClick}
        className="px-4 py-2 text-sm font-semibold inline-flex items-center gap-2 transition-colors"
        style={{
            borderBottom: `2px solid ${active ? t.colors.primary : t.colors.borderColor}`,
            borderLeft: "none",
            borderRight: "none",
            borderTop: "none",
            background: "transparent",
            color: active ? t.colors.primary : t.colors.textPrimary,
        }}
        >
        {icon}
        {label}
        </button>
    );
}
export default OrdersPage2