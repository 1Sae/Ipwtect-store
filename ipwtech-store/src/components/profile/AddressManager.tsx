"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
    addAddress,
    removeAddress,
    getProfile,
    updateAddress,
} from "@/src/services/userService";
import { updateUser } from "@/src/store/auth/authSlice";
import { showSuccess, showError } from "@/src/utils/toast";
import SectionWrapper from "./SectionWrapper";
import { useTheme } from "@/src/theme/ThemeProvider";

export default function AddressManager() {
    const t = useTheme();
    const { user } = useAppSelector((s) => s.auth);
    const dispatch = useAppDispatch();

    const [mode, setMode] = useState<"view" | "add">("view");
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        label: "",
        fullAddress: "",
        city: "",
        country: "",
        postalCode: "",
    });

    const fetchUser = async () => {
        try {
        const data = await getProfile();
        dispatch(updateUser(data));
        localStorage.setItem("user", JSON.stringify(data));
        } catch {
        showError("Failed to load user data");
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleAdd = async () => {
        try {
        const updated = await addAddress(form);

        dispatch(updateUser(updated));
        localStorage.setItem("user", JSON.stringify(updated));

        showSuccess("Address added");

        setForm({
            label: "",
            fullAddress: "",
            city: "",
            country: "",
            postalCode: "",
        });
        await fetchUser();
        setMode("view"); // 🔥 go back to list
        } catch {
        showError("Failed to add address");
        }
    };

    const handleRemove = async (index: number) => {
        try {
        const updated = await removeAddress(index);
        await fetchUser();
        dispatch(updateUser(updated));
        localStorage.setItem("user", JSON.stringify(updated));

        showSuccess("Address removed");
        } catch {
        showError("Failed to remove address");
        }
    };

    const handleUpdate = async (index: number, updatedAddress: any) => {
        try {
        const updated = await updateAddress(index, updatedAddress);
        await fetchUser();
        dispatch(updateUser(updated));
        localStorage.setItem("user", JSON.stringify(updated));

        showSuccess("Address updated");
        } catch {
        showError("Failed to update address");
        }
    };

    if (loading) {
        return (
        <SectionWrapper title="Addresses">
            <p className="text-gray-400 text-sm">Loading...</p>
        </SectionWrapper>
        );
    }

    return (
        <SectionWrapper title="Addresses:">

        {/*  MENU TOGGLE */}
        <div className="flex gap-2 mb-4">

            <button
            onClick={() => setMode("view")}
            className={`
                px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer scale-100 hover:scale-105 transition-all duration-300 ease-in-out
                ${mode === "view"
                ? "bg-orange-500 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"}
            `}
            >
            View Addresses
            </button>

            <button
            onClick={() => setMode("add")}
            className={`
                px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer scale-100 hover:scale-105 transition-all duration-300 ease-in-out
                ${mode === "add"
                ? "bg-orange-500 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"}
            `}
            >
            Add Address
            </button>

        </div>
        {/* view mode */}
        {mode === "view" && (
            <div className="flex flex-col gap-4">

            {user?.addresses?.length === 0 && (
                <p className="text-orange-500 text-sm text-center">
                No addresses yet
                </p>
            )}

            {user?.addresses?.map((addr, i) => (
                <EditableAddressCard
                key={i}
                address={addr}
                onRemove={() => handleRemove(i)}
                onUpdate={(updated) => handleUpdate(i, updated)}
                />
            ))}

            </div>
        )}

        {/* add mode */}
        {mode === "add" && (
            <div className="grid md:grid-cols-2 gap-3">

            <input
                placeholder="Label"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                className="input-modern"
            />

            <input
                placeholder="Address"
                value={form.fullAddress}
                onChange={(e) =>
                setForm({ ...form, fullAddress: e.target.value })
                }
                className="input-modern"
            />

            <input
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="input-modern"
            />

            <input
                placeholder="Country"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="input-modern"
            />

            <input
                placeholder="Postal Code"
                value={form.postalCode}
                onChange={(e) =>
                setForm({ ...form, postalCode: e.target.value })
                }
                className="input-modern"
            />

            <button
                onClick={handleAdd}
                className="col-span-full mt-2 bg-orange-500 text-white py-2 rounded-lg font-semibold"
            >
                Save Address
            </button>

            </div>
        )}

        </SectionWrapper>
    );
}


function EditableAddressCard({
    address,
    onRemove, 
    onUpdate,
    }: {
    address: any;
    onRemove: () => void;
    onUpdate: (data: any) => void;
    }) {
    const [edit, setEdit] = useState(false);
    const [local, setLocal] = useState(address);    
    const t = useTheme();

    return (
        <div className="border border-white/10 p-4 rounded-xl flex flex-col gap-3">

        {edit ? (
            <>
            <input value={local.label}
                onChange={(e)=>setLocal({...local,label:e.target.value})}
                className="input-modern"/>

            <input value={local.fullAddress}
                onChange={(e)=>setLocal({...local,fullAddress:e.target.value})}
                className="input-modern" />

            <input value={local.city}
                onChange={(e)=>setLocal({...local,city:e.target.value})}
                className="input-modern" />

            <input value={local.country}
                onChange={(e)=>setLocal({...local,country:e.target.value})}
                className="input-modern" />

            <input value={local.postalCode}
                onChange={(e)=>setLocal({...local,postalCode:e.target.value})}
                className="input-modern" />

            <div className="flex gap-2">
                <button
                onClick={() => {
                    onUpdate(local);
                    setEdit(false);
                }}
                className="px-4 py-1 bg-orange-500 text-white rounded cursor-pointer"
                >
                Save
                </button>

                <button
                onClick={() => setEdit(false)}
                className="px-4 py-1 bg-white/10 text-gray-300 rounded cursor-pointer"
                >
                Cancel
                </button>
            </div>
            </>
        ) : (
            <>
            <div className="flex flex-col gap-1">
                <div className="flex gap-1 items-center">
                    <p className="font-semibold text-sm" style={{
                        color: t.colors.textPrimary
                    }}>Label:</p>
                    <p className="font-semibold text-sm" style={{
                    color: t.colors.primary
                    }}>{address.label}</p>
                </div>
                <div className="flex gap-1 items-center">
                    <p className="font-semibold text-sm" style={{
                        color: t.colors.textPrimary
                    }}>Full Address:</p>
                    <p className="font-semibold text-sm" style={{
                    color: t.colors.primary
                    }}>{address.fullAddress}</p>
                </div>
                <div className="flex gap-1 items-center">
                    <p className="font-semibold text-sm" style={{
                        color: t.colors.textPrimary
                    }}>City:</p>
                    <p className="font-semibold text-sm" style={{
                    color: t.colors.primary
                    }}>{address.city}</p>
                </div>
                <div className="flex gap-1 items-center">
                    <p className="font-semibold text-sm" style={{
                        color: t.colors.textPrimary
                    }}>Country:</p>
                    <p className="font-semibold text-sm" style={{
                    color: t.colors.primary
                    }}>{address.country}</p>
                </div>
                <div className="flex gap-1 items-center">
                    <p className="font-semibold text-sm" style={{
                        color: t.colors.textPrimary
                    }}>Postal Code:</p>
                    <p className="font-semibold text-sm" style={{
                    color: t.colors.primary
                    }}>{address.postalCode}</p>
                </div>
            </div>

            <div className="flex gap-3">
                <button
                onClick={() => setEdit(true)}
                className="px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer scale-100 hover:scale-105 transition-all duration-300 ease-in-out"
                style={{
                    color: t.colors.textPrimary,
                    backgroundColor: t.colors.primary,
                }}
                >
                View Address
                </button>

                <button
                onClick={onRemove}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-red-500 transition cursor-pointer scale-100 hover:scale-105 transition-all duration-300 ease-in-out hover:bg-red-500 hover:text-white"
                >
                Remove
                </button>
            </div>
            </>
        )}
        </div>
    );
}