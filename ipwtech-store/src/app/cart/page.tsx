"use client";

import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import { useEffect, useState } from "react";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { CartItem } from "@/src/types/cart";
import { getCart, removeCartItem, updateCartItem } from "@/src/services/cartServices";
import {
    FiMinus,
    FiPlus,
    FiRotateCcw,
    FiShield,
    FiShoppingCart,
    FiTrash2,
    FiTruck,
} from "react-icons/fi";
import { showSuccess, showError } from "@/src/utils/toast";
import { setCart } from "@/src/store/cart/cartSlice";
import { createOrder } from "@/src/services/ordersService";

export default function CartPage() {
    const t = useTheme();
    const dispatch = useAppDispatch();

    const [items, setItems] = useState<CartItem[]>([]);
    const [total, setTotal] = useState(0);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const {user} = useAppSelector((s) => s.auth);

    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const paymentMethods = ["CreditCard", "PayPal", "CashOnDelivery"];

    const [paymentMethod, setPaymentMethod] = useState<string>(paymentMethods[0]);



    const fetchCart = async () => {
        try {
        const res = await getCart();

        setItems(res.items);
        setTotal(res.totalPrice);

        dispatch(setCart(res.items)); 

        } catch (error) {
        showError("Failed to load cart");
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleCheckout = async (address: number, paymentMethod: string) => {
        if (!user?.addresses?.[address]) {
            showError("Please select a valid address");
            return;
        }
    
        try {
            setCheckoutLoading(true);
            await createOrder(address, paymentMethod);
            showSuccess("Order created");
            fetchCart();
        } catch {
            showError("Failed to create order");
        } finally {
            setCheckoutLoading(false);
        }
    };

    const handleUpdate = async (id: string, qty: number) => {
        if (qty < 1) return;

        let price = 0;
        let oldQty = 0;


        setItems((prev) =>
        prev.map((item) => {
            if (item.product._id === id) {
            price = item.product.price;
            oldQty = item.quantity;
            return { ...item, quantity: qty };
            }
            return item;
        })
        );

        setTotal((prev) => prev + (qty - oldQty) * price);

        try {
        setUpdatingId(id);

        await updateCartItem(id, qty);


        const updated = await getCart();

        setItems(updated.items);
        setTotal(updated.totalPrice);
        dispatch(setCart(updated.items)); 

        setUpdatingId(null);
        } catch {
        fetchCart(); 
        }
    };


    const totalItems = items.reduce(
        (acc, item) => acc + item.quantity,
        0
    );


    const handleRemove = async (id: string) => {
        try {

            setItems((prev) => prev.filter((item) => item.product._id !== id));
        
            const removedItem = items.find((i) => i.product._id === id);
        
            if (removedItem) {
                setTotal((prev) => prev - removedItem.product.price * removedItem.quantity);
            }
        
            await removeCartItem(id);
        
            const updated = await getCart();
            setItems(updated.items);
            setTotal(updated.totalPrice);
            dispatch(setCart(updated.items));
        
            showSuccess("Item removed from cart");
        
            } catch (error) {
            showError("Failed to remove item");
            fetchCart(); // fallback
            }
        };

        const summary = items.map((item) => {
            const original = item.product.price;
            const discount = item.product.discount || 0;
            const discounted =
                discount > 0
                ? original - (original * discount) / 100
                : original;
            return {
                name: item.product.name,
                quantity: item.quantity,
                original,
                discounted,
                hasDiscount: discount > 0,
                totalOriginal: original * item.quantity,
                totalDiscounted: discounted * item.quantity,
            };
        });
        
        const subtotal = summary.reduce((acc, i) => acc + i.totalOriginal, 0);
        const finalTotal = summary.reduce((acc, i) => acc + i.totalDiscounted, 0);

    return (
        <ProtectedRoute>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-10 flex flex-col gap-8 mt-8">

            {/* HEADER */}
            <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-orange-500">
                Your Cart
            </h1>

            <div className="flex items-center gap-2 text-gray-400">
                <FiShoppingCart size={18} className="text-orange-500" />
                <span
                className="text-sm font-medium"
                style={{ color: t.colors.textPrimary }}
                >
                {totalItems} items {/* ✅ FIXED */}
                </span>
            </div>
            </div>

            {/* MAIN */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT */}
            <div className="lg:col-span-2 flex flex-col gap-4">

                {items.map((item) => (
                <div
                    key={item._id}
                    className="flex items-center gap-5 p-5 rounded-2xl hover:border-orange-500/30 transition"
                    style={{ backgroundColor: t.colors.bodyBg }}
                >

                    {/* IMAGE */}
                    <img
                    src={`https://ipwtech-backend.onrender.com/${item.product.image}`}
                    className="w-20 h-20 object-contain"
                    />

                    {/* INFO */}
                    <div className="flex-1 flex flex-col gap-1">
                    <h3
                        className="font-semibold text-sm md:text-lg"
                        style={{ color: t.colors.textPrimary }}
                    >
                        {item.product.name}
                    </h3>

                    <p
                        className="text-xs md:text-sm hidden sm:block"
                        style={{ color: t.colors.textSecondary }}
                    >
                        {item.product.brand?.name} • {item.product.category?.name}
                    </p>
                    </div>

                    {/* QUANTITY */}
                    <div className="flex items-center bg-white/5 rounded-full px-1 py-1 gap-3 md:px-4 md:py-3">

                    <button
                        onClick={() =>
                        handleUpdate(item.product._id, item.quantity - 1)
                        }
                        disabled={updatingId === item.product._id}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500/10 hover:bg-orange-500/20 transition cursor-pointer"
                        style={{ color: t.colors.primary }}
                    >
                        <FiMinus />
                    </button>

                    <span className="text-orange-500 font-semibold">
                        {item.quantity}
                    </span>

                    <button
                        onClick={() =>
                        handleUpdate(item.product._id, item.quantity + 1)
                        }
                        disabled={updatingId === item.product._id}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500/10 hover:bg-orange-500/20 transition cursor-pointer"
                        style={{ color: t.colors.primary }}
                    >
                        <FiPlus />
                    </button>
                    </div>

                    {/* PRICE */}
                    <div className="text-orange-500 font-bold text-xs md:text-lg">
                    ${(item.product.price * item.quantity).toFixed(2)}
                    </div>

                    <div className="flex items-center gap-2 ml-auto">

                    {/* REMOVE BUTTON */}
                    <button
                        onClick={() => handleRemove(item.product._id)}
                        className="
                        w-9 h-9 flex items-center justify-center
                        rounded-lg bg-red-500/10
                        border border-red-500/20
                        text-red-500
                        hover:bg-red-500/20
                        transition-all duration-200
                        cursor-pointer
                        "
                    >
                        <FiTrash2 size={16} />
                    </button>

                    </div>
                </div>
                ))}
            </div>

            {/* RIGHT */}
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 flex flex-col gap-4">

            <div className="flex items-center gap-2 ">
                <h2
                    className="font-semibold"
                    style={{ color: t.colors.primary, fontSize: t.typography.h4 }}
                >
                    Order Summary
                </h2>
            </div>

            <div className="relative w-full max-w-xs">
                <h2 className="font-semibold mb-2" style={{ color: t.colors.primary, fontSize: t.typography.body }}>
                    Select Address:
                </h2>
                <div className="relative w-full">
                    {/* SELECT ADDRESS */}
                    <select
                        value={selectedIndex}
                        onChange={(e) => setSelectedIndex(Number(e.target.value))}
                        className="
                            w-full appearance-none
                            px-4 py-3 pr-10
                            text-sm font-medium text-gray-200

                            bg-gradient-to-br from-[#0f172a] to-[#1e293b]
                            border border-orange-500/30
                            rounded-xl

                            shadow-md shadow-orange-500/10

                            hover:border-orange-500
                            focus:outline-none focus:ring-2 focus:ring-orange-500/40
                            focus:border-orange-500

                            transition-all duration-200
                            cursor-pointer
                        "
                    >
                        {user?.addresses?.map((addr, i) => (
                            <option key={i} value={i} className="bg-[#0f172a] text-gray-200">
                                {addr.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="relative w-full max-w-xs">
                <h2 className="font-semibold mb-2" style={{ color: t.colors.primary, fontSize: t.typography.body }}>
                    Select Payment Method:
                </h2>
                <div className="relative w-full">
                    {/* SELECT PAYMENT METHOD */}
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="
                            w-full appearance-none
                            px-4 py-3 pr-10
                            text-sm font-medium text-gray-200
                            bg-gradient-to-br from-[#0f172a] to-[#1e293b]
                            border border-orange-500/30
                            rounded-xl
                            shadow-md shadow-orange-500/10
                            hover:border-orange-500
                            focus:outline-none focus:ring-2 focus:ring-orange-500/40
                            focus:border-orange-500
                            transition-all duration-200
                            cursor-pointer
                        "
                    >
                        <option value="CashOnDilevery" className="bg-[#0f172a] text-gray-200">
                            Cash On Dilevery
                        </option>
                        <option value="PayPal" className="bg-[#0f172a] text-gray-200">
                            PayPal
                        </option>
                        <option value="CreditCard" className="bg-[#0f172a] text-gray-200">
                            Credit Card
                        </option>
                    </select>
                </div>
            </div>

            {/* PRODUCTS LIST */}
            <div className="flex flex-col gap-3 max-h-[200px] overflow-y-auto pr-1">

                {summary.map((item, i) => (
                <div key={i} className="flex justify-between items-start text-sm">

                    <div className="flex flex-col">
                    <span style={{ color: t.colors.textPrimary }}>
                        {item.name}
                    </span>
                    <span className="text-xs text-gray-400">
                        x{item.quantity}
                    </span>
                    </div>

                    <div className="flex flex-col items-end">

                    {item.hasDiscount && (
                        <span className="text-xs line-through text-red-500">
                        ${item.totalOriginal.toFixed(2)}
                        </span>
                    )}

                    <span
                        className="font-medium"
                        style={{ color: t.colors.textPrimary }}
                    >
                        ${item.totalDiscounted.toFixed(2)}
                    </span>

                    </div>
                </div>
                ))}

            </div>

            {/* SUBTOTAL */}
            <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                <span style={{ color: t.colors.textPrimary }}>Subtotal</span>
                <span style={{ color: t.colors.textPrimary }}>
                ${subtotal.toFixed(2)}
                </span>
            </div>

            {/* SHIPPING */}
            <div className="flex justify-between text-sm">
                <span style={{ color: t.colors.textPrimary }}>Shipping</span>
                <span className="text-green-500">FREE</span>
            </div>

            {/* TOTAL */}
            <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="text-white font-semibold">Total</span>
                <span className="text-orange-500 font-bold text-lg">
                ${finalTotal.toFixed(2)}
                </span>
            </div>

            {/* BUTTON */}
            <button 
            onClick={() => handleCheckout(selectedIndex, paymentMethod)}
            className="
                w-full py-3 rounded-xl font-semibold
                bg-orange-500 text-white
                hover:opacity-90 transition cursor-pointer shadow-lg shadow-orange-500/30
            ">
                Checkout
            </button>

            {/* FEATURES */}
            <div className="mt-4 flex justify-between gap-4">

                <div className="flex items-center gap-2">
                <FiTruck className="text-orange-500" />
                <span className="text-xs" style={{ color: t.colors.textPrimary }}>
                    Free delivery
                </span>
                </div>

                <div className="flex items-center gap-2">
                <FiRotateCcw className="text-orange-500" />
                <span className="text-xs" style={{ color: t.colors.textPrimary }}>
                    30-day returns
                </span>
                </div>

                <div className="flex items-center gap-2">
                <FiShield className="text-orange-500" />
                <span className="text-xs" style={{ color: t.colors.textPrimary }}>
                    Secure checkout
                </span>
                </div>

            </div>

            </div>

            </div>
        </div>
        </ProtectedRoute>
    );
}
