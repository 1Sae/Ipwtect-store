"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { updateProfile } from "@/src/services/userService";
import { updateUser } from "@/src/store/auth/authSlice";
import { showSuccess, showError } from "@/src/utils/toast";
import SectionWrapper from "./SectionWrapper";

export default function ProfileForm() {
    const { user } = useAppSelector((s) => s.auth);
    const dispatch = useAppDispatch();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        companyName: "",
    });
    
    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                companyName: user.companyName || "",
            });
        }
    }, [user]);

    const [loading, setLoading] = useState(false);

    const handleChange = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        try {
        setLoading(true);

        const updated = await updateProfile(form);

        dispatch(updateUser(updated));
        localStorage.setItem("user", JSON.stringify(updated));

        showSuccess("Profile updated");
        } catch {
        showError("Failed to update profile");
        } finally {
        setLoading(false);
        }
    };

    return (
        <SectionWrapper title="Profile Information">

        <div className="grid md:grid-cols-2 gap-4">

            <input
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Full Name"
            className="input-modern"
            />

            <input
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Email"
            className="input-modern"
            />

            <input
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Phone"
            className="input-modern"
            />

            <input
            value={form.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
            placeholder="Company Name (optional)"
            className="input-modern"
            />

        </div>

        <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-fit px-4 py-2 rounded-lg bg-orange-500 text-white text-xs font-semibold cursor-pointer"
        >
            {loading ? "Updating..." : "Save Changes"}
        </button>

        </SectionWrapper>
    );
}