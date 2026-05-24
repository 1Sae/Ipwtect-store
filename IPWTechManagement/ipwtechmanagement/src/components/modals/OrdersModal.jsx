import React, { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContexts";
import { useAlert } from "../../providers/AlertProvider";
import { ordersService } from "../../services/Services";
import { LuBox, LuBuilding2, LuCalendar, LuCreditCard, LuPackage, LuX } from "react-icons/lu";
import IconButton2 from "../../constants/IconButton2";
import {
    LuUser,
    LuMail,
    LuPhone,
    LuMapPin,
    LuBookText,
} from "react-icons/lu";

const API_BASE = "https://ipwtech-backend.onrender.com";

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

export default function OrdersModal({ open, orderId, onClose}) {
    const t = useTheme();
    const { showAlert } = useAlert();

    const [loadingOrder, setLoadingOrder] = useState(false);
    const [order, setOrder] = useState(null);

    const [showAllItems, setShowAllItems] = useState(false);

    const visibleItems = showAllItems
        ? order?.items || []
        : (order?.items || []).slice(0, 3);


    /* ================= FETCH ORDER ================= */
    useEffect(() => {
        if (!open || !orderId) return;

        const fetchOrder = async () => {
            setLoadingOrder(true);
            try {
                const res = await ordersService.getOrderById(orderId);
                setOrder(res?.data?.data || null);
            } catch (err) {
                showAlert("error", "Failed to load order");
                onClose?.();
            } finally {
                setLoadingOrder(false);
            }
        };

        fetchOrder();
    }, [open, orderId]);

    /* ================= LOCK SCROLL ================= */
    useEffect(() => {
        if (!open) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = original;
        };
    }, [open]);

    /* ================= SAFE EXIT ================= */
    if (!open) return null;
    if (loadingOrder) {
        return (
            <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
                <div
                    className="px-6 py-4 rounded-xl font-semibold"
                    style={{ background: t.colors.surface }}
                >
                    Loading order...
                </div>
            </div>
        );
    }
    if (!open) return null;
    const cfg = STATUS_CONFIG[order?.status] || STATUS_CONFIG.default;
    return (
            <div
            className="fixed inset-0 z-[999] flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose?.();
            }}
        >
            <div
                className="w-full max-w-3xl flex flex-col border shadow-xl"
                style={{
                    background: t.colors.inputBackground,
                    borderColor: t.colors.borderColor,
                    borderRadius: t.radius.lg,
                    maxHeight: "85vh",
                    maxWidth: "70vw",
                }}
            >
                {/* ================= HEADER ================= */}
                <div
                className="flex items-center justify-between px-5 py-4"
                >
                <div className="flex items-center gap-4">

                    {/* ICON BADGE */}
                    <div
                    className={`w-11 h-11 flex items-center justify-center rounded-xl ml-1`}
                    style={{
                        color: t.colors.primary,
                    }}
                    >
                    <LuBox size={25} />
                    </div>

                    {/* TEXT */}
                    <div className="flex flex-col">
                    <div
                        className="font-semibold text-sm"
                        style={{ color: t.colors.textPrimary }}
                    >
                        Order {order?._id}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* STATUS PILL */}
                        <div
                            className={`inline-flex w-fit mt-1 px-3 py-0.5 text-xs font-semibold rounded-full ${cfg.textClass}`}
                            style={{ background: cfg.bgColor }}
                        >
                            {cfg.label}
                        </div>
                        {/* STATUS PILL */}
                        <div
                            className={`inline-flex w-fit mt-1 px-3 py-0.5 text-xs font-semibold rounded-full ${cfg.textClass}`}
                            style={{ color: "#236e1e", background: "#42e336" }}

                        >
                            {order?.paid ? "Paid" : "Unpaid"}
                        </div>
                    </div>
                    
                    </div>
                </div>

                <IconButton2 onClick={onClose}>
                <LuX size={20} style={{ color: t.colors.primary }}/>
                </IconButton2>

                </div>


                {/* ================= BODY ================= */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5">

                {/* ================= CUSTOMER INFO ================= */}
                <div
                    className="rounded-2xl p-5"
                    style={{
                    background: t.colors.surface,
                    boxShadow: "0 8px 25px rgba(0,0,0,0.04)",
                    }}
                >
                    {/* Header */}
                    <div className="flex items-center gap-1 mb-4">
                    <div
                        className="w-8 h-8 flex items-center justify-center rounded-full"
                        style={{ background: t.colors.surface, color: t.colors.primary }}
                    >
                        <LuBookText size={18} />
                    </div>

                    <h3
                        className="font-semibold text-lg"
                        style={{ color: t.colors.textPrimary }}
                    >
                        Customer Information
                    </h3>
                    </div>

                    {/* Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-2">
                    {/* Name */}
                    <div className="flex items-center gap-3">
                        <LuUser size={16} style={{
                            color: t.colors.primary
                        }}/>
                        <div>
                        <div className="font-semibold">{order?.user?.name}</div>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-3">
                        <LuMail size={16} style={{
                            color: t.colors.primary
                        }} />
                        <div>
                        <div className="font-semibold">{order?.user?.email}</div>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-3">
                        <LuPhone size={16} style={{
                            color: t.colors.primary
                        }} />
                        <div>
                        <div className="font-semibold">{order?.user?.phone}</div>
                        </div>
                    </div>
                    {/* referralCode */}
                    <div className="flex items-center gap-3">
                        <LuPhone size={16} style={{
                            color: t.colors.primary
                        }} />
                        <div>
                        <div className="font-semibold">{order?.user?.referralCode}</div>
                        </div>
                    </div>
                    </div>
                </div>

                {/* ================= SHIPPING ADDRESS ================= */}
                <div
                    className="rounded-2xl p-5"
                    style={{
                    background: t.colors.surface,
                    boxShadow: "0 8px 25px rgba(0,0,0,0.04)",
                    }}
                >
                    {/* Header */}
                    <div className="flex items-center gap-1 mb-4">
                    <div
                        className="w-8 h-8 flex items-center justify-center rounded-full"
                        style={{ background: t.colors.surface, color: t.colors.primary }}
                    >
                        <LuMapPin size={18} />
                    </div>

                    <h3
                        className="font-semibold text-lg"
                        style={{ color: t.colors.textPrimary }}
                    >
                        Address Of Order
                    </h3>
                    </div>

                    {/* Content */}
                    <div className="ml-2">
                    <div className="font-semibold flex items-center gap-2">
                        <LuBuilding2 size={14} style={{
                            color: t.colors.primary
                        }}/>
                        {order?.address?.fullAddress}, {order?.address?.label} •{" "}
                        {order?.address?.city}, {order?.address?.country} {order?.address?.postalCode}
                    </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div>
                        <LuPackage size={16} style={{
                            color: t.colors.primary
                        }}
                        />
                    </div>
                    <div>
                        <div className="font-semibold">Order Items ({order?.items?.length})</div>
                    </div>
                </div>
                {/* ================= ORDER ITEMS ================= */}
                <div
                    className="rounded-2xl p-5 space-y-4"
                    style={{
                        background: t.colors.surface,
                        boxShadow: "0 8px 25px rgba(0,0,0,0.04)",
                    }}
                >
                    {visibleItems.map((item) => {
                        const p = item.product;

                        const productName = p?.name || "Product not found";
                        const productImg = toFullUrl(pickImage(p), API_BASE);

                        const brandName = p?.brand?.name || "-";
                        const categoryName = p?.category?.name || "-";

                        return (
                            <div
                                key={item._id}
                                className="flex gap-4 p-4 rounded-xl border"
                                style={{ borderColor: t.colors.borderColor }}
                            >
                                {/* IMAGE */}
                                <div
                                    className="w-20 h-20 flex items-center justify-center rounded-xl shrink-0"
                                    style={{ background: t.colors.inputBackground }}
                                >
                                    {productImg ? (
                                        <img
                                            src={productImg}
                                            alt={productName}
                                            className="w-16 h-16 object-contain"
                                        />
                                    ) : (
                                        <LuPackage size={28} style={{ color: t.colors.textSecondary }} />
                                    )}
                                </div>

                                {/* CONTENT */}
                                <div className="flex flex-col flex-1 gap-2">
                                    {/* NAME */}
                                    <div
                                        className="font-semibold"
                                        style={{ color: t.colors.textPrimary }}
                                    >
                                        {productName}
                                    </div>

                                    {/* META */}
                                    <div
                                        className="text-sm flex flex-wrap gap-3"
                                        style={{ color: t.colors.textSecondary }}
                                    >
                                        <span>Brand: <b>{brandName}</b></span>
                                        <span>Category: <b>{categoryName}</b></span>
                                    </div>

                                    {/* ================= SPECS ================= */}
                                    {Array.isArray(p?.specifications) && p.specifications.length > 0 && (
                                        <div className="flex flex-wrap gap-2 max-h-24 overflow-hidden">
                                            {p.specifications.map((spec) => (
                                                <div
                                                    key={spec._id}
                                                    className="px-3 py-1 rounded-full text-xs font-medium border"
                                                    style={{
                                                        background: t.colors.inputBackground,
                                                        borderColor: t.colors.borderColor,
                                                        color: t.colors.textPrimary,
                                                    }}
                                                >
                                                    <span className="font-semibold">{spec.key}:</span>{" "}
                                                    <span>{spec.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}


                                    {/* PRICE INFO */}
                                    <div className="flex items-center justify-between mt-2">
                                        <div
                                            className="text-sm"
                                            style={{ color: t.colors.textSecondary }}
                                        >
                                            Qty: <b>{item.quantity}</b> &nbsp;•&nbsp;
                                            Unit: <b>${item.unitPrice}</b>
                                        </div>

                                        <div
                                            className="text-lg font-bold"
                                            style={{ color: t.colors.primary }}
                                        >
                                            ${item.subtotal.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* SEE MORE */}
                    {order?.items?.length > 3 && !showAllItems && (
                        <div className="flex justify-center pt-3">
                            <button
                                onClick={() => setShowAllItems(true)}
                                className="
                                    px-6 py-2
                                    rounded-xl
                                    text-sm font-semibold
                                    border
                                    transition-all
                                    hover:shadow-md
                                "
                                style={{
                                    borderColor: t.colors.borderColor,
                                    background: t.colors.surface,
                                    color: t.colors.textPrimary,
                                }}
                            >
                                See More
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="border-t w-full" style={{ borderColor: t.colors.borderColor }} />


                {/* ================= ORDER INFO ================= */}
                <div className="space-y-4">

                {/* ===== TOP ROW ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* ===== PAYMENT ===== */}
                    <div
                        className="rounded-2xl p-5"
                        style={{
                            background: t.colors.surface,
                            boxShadow: "0 8px 25px rgba(0,0,0,0.04)",
                        }}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <LuCreditCard size={18} style={{ color: t.colors.primary }} />
                            <h3
                                className="font-semibold text-lg"
                                style={{ color: t.colors.textPrimary }}
                            >
                                Payment
                            </h3>
                        </div>

                        <div className="text-sm" style={{ color: t.colors.textSecondary }}>
                            Method:
                            <span
                                className="ml-2 font-semibold"
                                style={{ color: t.colors.textPrimary }}
                            >
                                {order?.paymentMethod || "-"}
                            </span>
                        </div>
                    </div>

                    {/* ===== DATES ===== */}
                    <div
                        className="rounded-2xl p-5"
                        style={{
                            background: t.colors.surface,
                            boxShadow: "0 8px 25px rgba(0,0,0,0.04)",
                        }}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <LuCalendar size={18} style={{ color: t.colors.primary }} />
                            <h3
                                className="font-semibold text-lg"
                                style={{ color: t.colors.textPrimary }}
                            >
                                Dates
                            </h3>
                        </div>

                        <div className="space-y-1 text-sm">
                            <div style={{ color: t.colors.textSecondary }}>
                                Created:
                                <span
                                    className="ml-2 font-semibold"
                                    style={{ color: t.colors.textPrimary }}
                                >
                                    {new Date(order?.createdAt).toLocaleString()}
                                </span>
                            </div>

                            <div style={{ color: t.colors.textSecondary }}>
                                Updated:
                                <span
                                    className="ml-2 font-semibold"
                                    style={{ color: t.colors.textPrimary }}
                                >
                                    {new Date(order?.updatedAt).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* ===== TOTAL AMOUNT ===== */}
                <div
                    className="rounded-2xl px-6 py-5 flex items-center justify-between"
                    style={{
                        background: t.colors.inputBackground,
                        boxShadow: "0 8px 25px rgba(0,0,0,0.04)",
                    }}
                >
                    <div className="flex items-center gap-2">
                        <span
                            className="text-2xl font-bold"
                            style={{ color: t.colors.primary }}
                        >
                            $
                        </span>
                        <span
                            className="text-lg font-semibold"
                            style={{ color: t.colors.textPrimary }}
                        >
                            Total Amount
                        </span>
                    </div>

                    <div
                        className="text-3xl font-bold"
                        style={{ color: t.colors.primary }}
                    >
                        ${order?.totalAmount?.toLocaleString()}
                    </div>
                </div>

                </div>

                </div>

            </div>
        </div>
        
    );

}

function pickImage(entity) {
    if (!entity) return ""; // if no entity, return empty string
    const fromImages = // if entity has images, return first image, else return empty string
        Array.isArray(entity?.images) && entity.images.length > 0
        ? entity.images[0]?.url || entity.images[0]
        : "";
    const fromImageObj = entity?.image?.url || "";
    const fromImageStr = typeof entity?.image === "string" ? entity.image : "";
    return fromImages || fromImageObj || fromImageStr || "";
}

function toFullUrl(src, base) {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    if (!base) return src;
    if (src.startsWith("/")) return `${base}${src}`;
    return `${base}/${src}`;
}