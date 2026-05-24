import React, { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContexts";
import { LuX, LuChartBarStacked, LuImage } from "react-icons/lu";
import { brandsService } from "../../services/Services";
import { useAlert } from "../../providers/AlertProvider";
import BrandLoader from "./BrandLoader";
import SaveButtons from "../../constants/SaveButtons";
import CancelButton from "../../constants/CancelButton";
import IconButton from "../../constants/IconButton";

export default function BrandEditModal({
    open,
    brandId,
    onClose,
    getImageUrl,
    onRefetch,
}) {
    const t = useTheme();
    const { showAlert } = useAlert();

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [brand, setBrand] = useState(null);

    const [form, setForm] = useState({
        name: "",
        description: "",
    });

    // image
    const [imagePath, setImagePath] = useState("");
    const [uploading, setUploading] = useState(false);

    /* 🔒 lock background scroll */
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
        document.body.style.overflow = prev;
        };
    }, [open]);

    /* ⛔ ESC close */
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
        if (e.key === "Escape") onClose?.();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    /* Fetch brand */
    useEffect(() => {
        if (!open || !brandId) return;

        const fetchOne = async () => {
        setLoading(true);
        setBrand(null);

        try {
            const res = await brandsService.getBrandById(brandId);
            const payload = res?.data?.data;
            const b = payload?.brand ? payload.brand : payload;

            setBrand(b);
            setForm({
            name: b?.name ?? "",
            description: b?.description ?? "",
            });
            setImagePath(b?.image || "");
        } catch (err) {
            showAlert("error", err?.response?.data?.message || "Failed to load brand details");
            setBrand(null);
        } finally {
            setLoading(false);
        }
        };

        fetchOne();
    }, [open, brandId, showAlert]);

    const handleChange = (key) => (e) => {
        setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

    const validate = () => {
        if (!form.name.trim()) return "Brand name is required";
        return null;
    };

    /* Upload image (multipart – same logic as category) */
    const handleUploadImage = async (file) => {
        if (!file) return;

        try {
        setUploading(true);

        const fd = new FormData();
        fd.append("image", file);

        const res = await brandsService.updateBrand(brandId, fd, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        const payload = res?.data?.data;
        const updated = payload?.brand ? payload.brand : payload;
        const newImg = updated?.image || payload?.image || "";

        if (!newImg) {
            showAlert("error", "Upload succeeded but no image returned");
            return;
        }

        setImagePath(newImg);
        showAlert("success", "Image uploaded successfully");
        } catch (err) {
        showAlert("error", err?.response?.data?.message || "Failed to upload image");
        } finally {
        setUploading(false);
        }
    };

    const handleSave = async () => {
        const msg = validate();
        if (msg) return showAlert("error", msg);

        setSaving(true);
        try {
        const payload = {
            name: form.name.trim(),
            description: form.description.trim(),
            image: imagePath,
        };

        await brandsService.updateBrand(brandId, payload);

        showAlert("success", "Brand updated successfully");
        onClose?.();
        await onRefetch?.();
        } catch (err) {
        showAlert("error", err?.response?.data?.message || "Failed to update brand");
        } finally {
        setSaving(false);
        }
    };

    if (!open) return null;

    const previewSrc = getImageUrl?.(imagePath) || "";

return (
        <div
        className="fixed inset-0 z-[999] flex items-center justify-center px-4"
        style={{ background: "rgba(0,0,0,0.45)" }}
        onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose?.();
        }}
        >
        <div
            className="w-full max-w-3xl border shadow-xl overflow-hidden flex flex-col"
            style={{
            background: t.colors.surface,
            borderColor: t.colors.borderColor,
            borderRadius: t.radius.lg,
            maxHeight: "90vh",
            }}
        >
            {/* Header */}
            <div
            className="flex items-center justify-between px-5 py-4 border-b shrink-0"
            style={{ borderColor: t.colors.borderColor }}
            >
            <div className="flex items-center gap-2">
                <LuChartBarStacked style={{ color: t.colors.primary }} />
                <div className="font-semibold" style={{ color: t.colors.textPrimary }}>
                Edit Brand
                </div>
            </div>

            <IconButton onClick={onClose}>
                <LuX size={16} />
            </IconButton>
            </div>

            {/* Body */}
            <div className="px-5 py-4 overflow-y-auto flex-1">
            {loading && (
                <div className="py-10">
                <BrandLoader />
                </div>
            )}

            {!loading && !brand && (
                <div style={{ color: t.colors.textSecondary }}>No data.</div>
            )}

            {!loading && brand && (
                <div className="flex flex-col gap-5">
                {/* Image */}
                <div className="flex justify-center">
                    <div
                    className="p-3 w-full max-w-[350px] border"
                    style={{
                        borderColor: t.colors.borderColor,
                        borderRadius: t.radius.md,
                        background: "white",
                    }}
                    >
                    <div
                        className="text-xs font-semibold mb-2 flex items-center gap-2 px-1"
                        style={{ color: t.colors.primary }}
                    >
                        <LuImage size={14} />
                        Brand Image
                    </div>

                    <div
                        className="border flex items-center justify-center overflow-hidden"
                        style={{
                        borderColor: t.colors.borderColor,
                        borderRadius: t.radius.md,
                        background: "white",
                        height: 180,
                        }}
                    >
                        {previewSrc ? (
                        <img
                            src={previewSrc}
                            alt={form.name || "Brand"}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                            e.currentTarget.src = "/placeholder.png";
                            }}
                        />
                        ) : (
                        <div
                            className="text-xs font-semibold"
                            style={{ color: t.colors.textSecondary }}
                        >
                            No Image
                        </div>
                        )}
                    </div>

                    {/* Upload */}
                    <div className="mt-3 flex items-center justify-between gap-2">
                        <label
                        className="px-3 py-1.5 text-xs font-semibold border cursor-pointer"
                        style={{
                            borderRadius: t.radius.md,
                            borderColor: t.colors.borderColor,
                            background: "white",
                            color: t.colors.primary,
                            opacity: uploading ? 0.7 : 1,
                        }}
                        >
                        {uploading ? "Uploading..." : "Upload Image"}
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            disabled={uploading}
                            onChange={(e) => {
                            const file = (e.target.files || [])[0];
                            e.target.value = "";
                            handleUploadImage(file);
                            }}
                        />
                        </label>

                        <div className="text-xs" style={{ color: t.colors.textSecondary }}>
                        JPG / PNG
                        </div>
                    </div>
                    </div>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 gap-4">
                    <Field label="Brand Name">
                    <input
                        value={form.name}
                        onChange={handleChange("name")}
                        className="w-full px-3 py-2 border outline-none"
                        style={{
                        borderRadius: t.radius.md,
                        borderColor: t.colors.inputBorder,
                        background: "white",
                        color: t.colors.textPrimary,
                        }}
                        placeholder="Brand name"
                    />
                    </Field>

                    <Field label="Description">
                    <textarea
                        value={form.description}
                        onChange={handleChange("description")}
                        rows={4}
                        className="w-full px-3 py-2 border outline-none resize-none"
                        style={{
                        borderRadius: t.radius.md,
                        borderColor: t.colors.inputBorder,
                        background: "white",
                        color: t.colors.textPrimary,
                        }}
                        placeholder="Write description..."
                    />
                    </Field>
                </div>
                </div>
            )}
            </div>

            {/* Footer */}
            <div
            className="px-5 py-4 border-t shrink-0 flex justify-end gap-2"
            style={{ borderColor: t.colors.borderColor }}
            >
            <CancelButton onClose={onClose} title="Close" saving={loading} />
            <SaveButtons title={saving ? "Saving..." : "Save"} handle={handleSave} />
            </div>
        </div>
        </div>
    );
}

function Field({ label, children }) {
    const t = useTheme();
    return (
        <div className="w-full">
        <div className="mb-1 px-1 text-xs font-semibold" style={{ color: t.colors.primary }}>
            {label}
        </div>
        {children}
        </div>
    );
}
