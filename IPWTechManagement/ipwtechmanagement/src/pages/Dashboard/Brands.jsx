import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../contexts/ThemeContexts";
import { useAlert } from "../../providers/AlertProvider";
import { brandsService } from "../../services/Services";
import { IMAGE_BASE_URL } from "../../config/apiPaths";
import CustomDropdown from "../../components/buttons/CustomDropDown";
import SaveButtons from "../../constants/SaveButtons";
import {
    LuSearch,
    LuTrendingUp,
    LuTimerReset,
    LuTable,
    LuLayoutGrid,
    LuChartBarStacked,
    LuPencil,
    LuTrash2,
} from "react-icons/lu";
import BrandEditModal from "../../components/modals/BrandEditModal";


export default function Brands() {
    const t = useTheme();
    const { showAlert } = useAlert();

    // brands
    const [brands, setBrands] = useState([]);
    const [loadingBrands, setLoadingBrands] = useState(false);

    // controls
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState("all"); // all | newest | oldest
    const [dateFilter, setDateFilter] = useState("all"); // all | today | last7 | last30
    const [deletingId, setDeletingId] = useState(null);
    const [layout, setLayout] = useState("table"); // "table" | "grid"

    // ✅ modal
    const [selectedEditId, setSelectedEditId] = useState(null);
    const openEditModal = Boolean(selectedEditId);

    const openBrandModal = (brand) => setSelectedEditId(brand?._id || null);
    const closeBrandModal = () => setSelectedEditId(null);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "";
        const s = String(imagePath);
        if (s.startsWith("http")) return s;
        return `${IMAGE_BASE_URL}/${s.replace(/^\/+/, "")}`;
    };

    const normalizeBrands = (res) => {
        const payload = res?.data?.data;
        return Array.isArray(payload) ? payload : [];
    };

    const fetchBrands = async () => {
        setLoadingBrands(true);
        try {
        const res = await brandsService.getAllBrands();
        setBrands(normalizeBrands(res));
        showAlert("success", "Brands loaded successfully");
        } catch (err) {
        showAlert("error", err?.response?.data?.message || "Failed to load brands");
        setBrands([]);
        } finally {
        setLoadingBrands(false);
        }
    };

    const handleDeleteBrand = async (brandId) => {
        setDeletingId(brandId);
        try {
        await brandsService.deleteBrand(brandId);
        showAlert("success", "Brand deleted successfully");
        await fetchBrands();
        } catch (err) {
        showAlert("error", err?.response?.data?.message || "Failed to delete brand");
        } finally {
        setDeletingId(null);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const filteredSortedBrands = useMemo(() => {
        let list = Array.isArray(brands) ? [...brands] : [];

        // search
        const q = query.trim().toLowerCase();
        if (q) list = list.filter((b) => String(b?.name || "").toLowerCase().includes(q));

        // date filter
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (dateFilter === "today") {
        list = list.filter((b) => new Date(b?.createdAt || 0) >= startOfToday);
        } else if (dateFilter === "last7") {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        list = list.filter((b) => new Date(b?.createdAt || 0) >= d);
        } else if (dateFilter === "last30") {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        list = list.filter((b) => new Date(b?.createdAt || 0) >= d);
        }

        // sort
        if (sort === "newest") list.sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
        if (sort === "oldest") list.sort((a, b) => new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0));

        return list;
    }, [brands, query, sort, dateFilter]);

    const handleReset = () => {
        setQuery("");
        setSort("all");
        setDateFilter("all");
    };

return (
        <div className="mt-0">
        <BrandEditModal
            open={openEditModal}
            brandId={selectedEditId}
            onClose={closeBrandModal}
            getImageUrl={getImageUrl}
            onRefetch={fetchBrands}
        />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 px-2 py-2 w-full justify-between rounded-lg">
            <div className="mb-1">
            <h1 className="font-bold" style={{ color: t.colors.primary, fontSize: t.typography.h3 }}>
                Manage Brands
            </h1>
            <p style={{ color: t.colors.textSecondary, fontSize: t.typography.small }}>
                Manage your Brands, filter Brands, and monitor the way you want
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
            {/* Sort */}
            <div className="w-full sm:w-48">
                <CustomDropdown
                label="Quick Filter"
                value={sort}
                icon={<LuTrendingUp size={14} />}
                onChange={setSort}
                options={[
                    { value: "all", label: "All" },
                    { value: "newest", label: "Newest" },
                    { value: "oldest", label: "Oldest" },
                ]}
                />
            </div>

            {/* Date */}
            <div className="w-full sm:w-48">
                <CustomDropdown
                label="Filter by Date"
                value={dateFilter}
                icon={<LuTimerReset size={14} />}
                onChange={setDateFilter}
                options={[
                    { value: "all", label: "All" },
                    { value: "today", label: "Today" },
                    { value: "last7", label: "Last 7 Days" },
                    { value: "last30", label: "Last 30 Days" },
                ]}
                />
            </div>

            {/* Search */}
            <div
                className="w-full sm:w-72 flex items-center scale-100 hover:scale-105 transition duration-300 ease-in-out gap-2 border px-3 py-2"
                style={{ borderColor: t.colors.borderColor, borderRadius: t.radius.md, background: "white" }}
            >
                <LuSearch style={{ color: t.colors.primary }} />
                <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search brand by name..."
                className="w-full outline-none bg-transparent text-sm"
                style={{ color: t.colors.textPrimary }}
                />
            </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="px-2 mt-3 flex items-center gap-2 justify-between" style={{ color: t.colors.textSecondary }}>
            <div className="flex items-center gap-2">
            <TabButton active={layout === "table"} onClick={() => setLayout("table")} label="Table" icon={<LuTable size={14} />} />
            <TabButton active={layout === "grid"} onClick={() => setLayout("grid")} label="Grid" icon={<LuLayoutGrid size={14} />} />
            </div>
            {layout === "grid" && (
                <div className="items-end text-sm font-medium flex gap-2 mt-3" style={{ color: t.colors.primary }}>
                {loadingBrands ? "...loading" : `Loaded ${filteredSortedBrands.length} Brand(s)`}
                </div>
            )}
        </div>

        {/* Table */}
        {layout === "table" && (
            <div
            className="mt-6 border overflow-hidden shadow-sm"
            style={{ borderColor: t.colors.borderColor, background: t.colors.surface, borderRadius: t.radius.lg }}
            >
            <div className="px-4 py-3 border-b" style={{ borderColor: t.colors.borderColor }}>
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <LuChartBarStacked style={{ color: t.colors.primary }} />
                    <div className="font-semibold" style={{ color: t.colors.textPrimary }}>
                    Brands List
                    </div>
                </div>

                <div className="text-sm font-medium" style={{ color: t.colors.primary }}>
                    {loadingBrands ? "Loading..." : `Loaded ${filteredSortedBrands.length} Brand(s)`}
                </div>
                </div>
            </div>

            <div className="overflow-x-hidden">
                <div className="max-h-[620px] md:max-h-[620px] lg:max-h-[740px] overflow-y-auto">
                <table className="w-full text-sm">
                    <thead className="sticky top-0 z-10">
                    <tr className="text-left" style={{ background: t.colors.inputBackground, color: t.colors.textSecondary }} key="header">
                        <th className="px-4 py-3 font-semibold" style={{ color: t.colors.primary }}>
                        #Num
                        </th>
                        <th className="px-4 py-3 font-semibold" style={{ color: t.colors.primary }}>
                        Name
                        </th>
                        <th className="px-4 py-3 font-semibold" style={{ color: t.colors.primary }}>
                        Image
                        </th>
                        <th className="px-4 py-3 font-semibold" style={{ color: t.colors.primary }}>
                        Description
                        </th>
                        <th className="px-4 py-3 font-semibold" style={{ color: t.colors.primary }}>
                        Actions
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredSortedBrands.map((b, index) => (
                        <tr key={b?._id || index}>
                        <td className="px-4 py-3">{index + 1}</td>

                        <td className="px-4 py-3">
                            <div className="font-semibold">{b?.name}</div>
                        </td>

                        <td className="px-4 py-3">
                            <img
                            src={getImageUrl(b?.image)}
                            alt={b?.name}
                            className="w-14 h-14 object-contain"
                            style={{ borderRadius: t.radius.md }}
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "https://via.placeholder.com/150";
                            }}
                            />
                        </td>

                        <td className="px-4 py-3">
                            <div className="font-semibold">{b?.description || "-"}</div>
                        </td>

                        <td className="px-2 py-3">
                            <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="inline-flex items-center px-2 py-1.5 border text-xs font-semibold transition cursor-pointer"
                                style={{
                                borderRadius: t.radius.md,
                                borderColor: t.colors.borderColor,
                                background: "white",
                                color: t.colors.primary,
                                }}
                                onClick={() => openBrandModal(b)}
                                title="Edit"
                            >
                                <LuPencil size={14} />
                            </button>

                            <button
                                type="button"
                                className="inline-flex items-center px-2 py-1.5 border text-xs font-semibold transition cursor-pointer"
                                style={{
                                borderRadius: t.radius.md,
                                borderColor: t.colors.borderColor,
                                background: "white",
                                color: deletingId === b?._id ? "#9CA3AF" : t.colors.primary,
                                opacity: deletingId === b?._id ? 0.7 : 1,
                                }}
                                disabled={deletingId === b?._id}
                                onClick={() => handleDeleteBrand(b?._id)}
                                title="Delete"
                            >
                                <LuTrash2 size={14} />
                            </button>
                            </div>
                        </td>
                        </tr>
                    ))}

                    {!loadingBrands && filteredSortedBrands.length === 0 && (
                        <tr>
                        <td className="px-4 py-10 text-center" colSpan={5}>
                            <div className="font-semibold" style={{ color: t.colors.textPrimary }}>
                            No brands found
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
            </div>
        )}

        {layout === "grid" && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 px-2">
                    {filteredSortedBrands.map((b) => (
                    <div
                    key={b?._id}
                    className="border p-4 flex flex-col"
                    style={{
                        borderRadius: t.radius.md,
                        background: t.colors.surface,
                        borderColor: t.colors.borderColor,
                        minHeight: 150,
                    }}
                    >          
                        {/* Image (smaller + centered) */}
                        <div className="w-full flex justify-center">
                        <div
                            className="flex items-center justify-center"
                            style={{
                            width: 190,
                            height: 170,
                            }}
                        >
                            <img
                            src={getImageUrl(b?.image)}
                            alt={b?.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "https://via.placeholder.com/200";
                            }}
                            />
                        </div>
                        </div>
        
                        {/* Name + description */}
                        <div className="mt-3 text-left">
                        <div
                            className="font-bold truncate"
                            style={{
                            color: t.colors.textPrimary,
                            fontSize: 16,
                            }}
                        >
                            {b?.name || "-"}
                        </div>
        
                        <div
                            className="mt-1 line-clamp-2"
                            style={{
                            color: t.colors.textSecondary,
                            fontSize: 13,
                            }}
                        >
                            {b?.description || "-"}
                        </div>
                        </div>
        
                        {/* Actions (bottom-right) */}
                        <div className="mt-auto pt-3 flex items-center justify-end gap-1.5">
                        <button
                            type="button"
                            className="inline-flex items-center px-2 py-1.5 text-xs font-semibold cursor-pointer"
                            style={{
                            borderRadius: t.radius.sm,
                            background: "transparent",
                            color: t.colors.primary,
                            }}
                            onClick={() => openBrandModal(b)}
                            title="Edit"
                        >
                            <LuPencil size={14} />
                        </button>
        
                        <button
                            type="button"
                            className="inline-flex items-center px-2 py-1.5 text-xs font-semibold cursor-pointer"
                            style={{
                            borderRadius: t.radius.sm,
                            borderColor: t.colors.borderColor,
                            background: "transparent",
                            color: deletingId === b?._id ? "#9CA3AF" : t.colors.primary,
                            }}
                            disabled={deletingId === b?._id}
                            onClick={() => handleDeleteBrand(b?._id)}
                            title="Delete"
                        >
                            <LuTrash2 size={14} />
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
                )}


        </div>
    );
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
