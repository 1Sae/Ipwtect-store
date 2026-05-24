"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import { useTheme } from "@/src/theme/ThemeProvider";
import { showError, showSuccess } from "@/src/utils/toast";
import { cancelOrder, getOrders } from "@/src/services/ordersService";


export default function OrdersPage() {
    const t = useTheme();

    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    const fetchOrders = async () => {
        try {
        const res = await getOrders();
        setOrders(res.orders || []);
        } catch {
        showError("Failed to load orders");
        } finally {
        setLoading(false);
        }
    };

    const cancelOneOrder = async (orderId: string) => {
        try {
            setCancellingId(orderId);
        
            await cancelOrder(orderId);
        
            showSuccess("Order cancelled");
            fetchOrders();
            } catch {
            showError("Failed to cancel order");
            } finally {
            setCancellingId(null);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <ProtectedRoute>
        <div className="max-w-[1300px] mx-auto px-6 mt-10 flex flex-col gap-8">

            {/* HEADER */}
            <div className="flex justify-between items-center">
            <h1
                className="font-bold"
                style={{ color: t.colors.primary, fontSize: t.typography.h3 }}
            >
                My Orders
            </h1>

            <span style={{ color: t.colors.primary, fontSize: t.typography.h4 }} className="font-medium">
                {orders.length} {orders.length === 1 ? "order" : "orders"}
            </span>
            </div>

            {/* LOADING */}
            {loading && (
            <div className="text-center text-gray-400 py-20">
                Loading orders...
            </div>
            )}

            {/* EMPTY */}
            {!loading && orders.length === 0 && (
            <div className="text-center text-gray-400 py-20">
                You have no orders yet.
            </div>
            )}

            {/* ORDERS LIST */}
            <div className="flex flex-col gap-6">
            {orders.map((order, i) => (
                <OrderCard key={order._id} order={order} index={i} cancelOneOrder={cancelOneOrder} cancellingId={cancellingId} />
            ))}
            </div>

        </div>
        </ProtectedRoute>
    );
}

function OrderCard({ order, index, cancelOneOrder, cancellingId }: { order: any , index: number, cancelOneOrder: (orderId: string) => void, cancellingId: string | null }) {
    const t = useTheme();
    const statusStyles: Record<string, string> = {
        Pending: "bg-yellow-500/10 text-yellow-400",
        Processing: "bg-blue-500/10 text-blue-400",
        Shipped: "bg-indigo-500/10 text-indigo-400",
        Delivered: "bg-green-500/10 text-green-400",
        Cancelled: "bg-red-500/10 text-red-400",
    };
    return (
        <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
    
            {/* HEADER */}
            <div className="flex justify-between items-center">
            <div>
                <p style={{ color: t.colors.primary, fontSize: t.typography.h4 }} className="font-semibold">Order {index + 1}</p>
            </div>
    
            <div className="text-right flex gap-2 items-center">
                <p style={{ color: t.colors.primary, fontSize: t.typography.h4 }} className="font-semibold">Status:</p>
                <span
                className={`
                    text-sm px-3 py-1 rounded-full
                    ${statusStyles[order.status] || "bg-gray-500/10 text-gray-400"}
                `}
                >
                {order.status}
                </span>
            </div>
            </div>
    
            {/* ITEMS */}
            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto px-2 py-3">
            {order.items.map((item: any) => (
                <div
                key={item._id}
                className="flex items-center gap-4 border-b border-white/5 pb-3"
                >
                <img
                    src={`https://ipwtech-backend.onrender.com/${item.product.image}`}
                    className="w-16 h-16 object-contain bg-black/20 rounded-lg"
                />
    
                <div className="flex flex-col flex-1">
                    <span className="font-semibold" style={{ color: t.colors.primary, fontSize: t.typography.body }}>
                    {item.product.name}
                    </span>
    
                    <span style={{ color: t.colors.textSecondary, fontSize: t.typography.small }}>
                    Qty: {item.quantity}
                    </span>
                </div>
    
                <span className="text-orange-500 font-semibold">
                    ${item.subtotal}
                </span>
                </div>
            ))}
            </div>
    
            {/* ADDRESS */}
            <div style={{ color: t.colors.textPrimary, fontSize: t.typography.body }} className="font-medium">
            <p style={{ color: t.colors.primary, fontSize: t.typography.body }} className="font-medium mb-1">Shipping Address</p>
            {order.address.label} - {order.address.city}, {order.address.country}
            </div>
    
            {/* FOOTER */}
            <div className="flex justify-between items-center pt-2 border-t border-white/10">
    
            <div className="font-semibold flex items-center gap-2" style={{ color: t.colors.primary, fontSize: t.typography.body }}>
                <div className="flex flex-col gap-1">
                    <div>
                    <p>
                        Order Date:
                    </p>
                    <span style={{ fontSize: t.typography.small , color: t.colors.textPrimary }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    </div>

                    <div>
                    <p>
                        Payment Method:
                    </p>
                    <span style={{ fontSize: t.typography.small , color: t.colors.textPrimary }}>
                        {order.paymentMethod}
                    </span>
                    </div>
                </div>
            </div>
    
            <div className="font-semibold flex items-center gap-2">
                <p style={{ color: t.colors.primary, fontSize: t.typography.h4 }}>Total:</p>
                <p style={{ color: t.colors.primary, fontSize: t.typography.h4 }} className="font-bold">
                ${order.totalAmount}
                </p>
                {(order.status === "Pending" || order.status === "Processing") && (
                    <button
                    onClick={() => cancelOneOrder(order._id)}
                    disabled={cancellingId === order._id}
                    className="
                        ml-4 px-4 py-2 rounded-lg
                        bg-red-500/10 text-red-400
                        hover:bg-red-500/40 transition
                        disabled:opacity-50 disabled:cursor-not-allowed
                        cursor-pointer
                    "
                    >
                    {cancellingId === order._id ? "Cancelling..." : "Cancel Order"}
                    </button>
                )}
            </div>
            </div>
        </div>
        );
    }