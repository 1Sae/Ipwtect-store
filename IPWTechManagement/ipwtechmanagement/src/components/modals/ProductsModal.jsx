import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../contexts/ThemeContexts";
import { LuX, LuPackage, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { productsService } from "../../services/Services";
import { useAlert } from "../../providers/AlertProvider";
import BrandLoader from "../../components/modals/BrandLoader";
import SaveButtons from "../../constants/SaveButtons";
import CancelButton from "../../constants/CancelButton";
import IconButton from "../../constants/IconButton";

export default function ProductsModal({ open, productId, onClose, getImageUrl }) {
    const t = useTheme();
    const { showAlert } = useAlert();

    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState(null);

    // ✅ NEW: active image index
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (!open || !productId) return;

        const fetchOne = async () => {
        setLoading(true);
        setProduct(null);
        try {
            const res = await productsService.getProductById(productId);
            const payload = res?.data?.data;
            const p = payload?.product ? payload.product : payload;
            setProduct(p);
            setActiveIndex(0); // ✅ reset on open / product change
        } catch (err) {
            showAlert("error", err.response?.data?.message || "Failed to load product details");
            setProduct(null);
        } finally {
            setLoading(false);
        }
        };

        fetchOne();
    }, [open, productId, showAlert]);

    // 🔒 Lock body scroll when modal is open
    useEffect(() => {
        if (!open) return;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
        document.body.style.overflow = originalOverflow;
        };
    }, [open]);

    // ✅ NEW: build images list (product.images OR fallback to product.image)
    const images = useMemo(() => {
        if (!product) return [];
        const list = [];

        if (Array.isArray(product.images) && product.images.length > 0) {
        list.push(...product.images.filter(Boolean));
        }

        if (product.image && !list.includes(product.image)) {
        list.unshift(product.image); // keep main image first if not included
        }

        // remove duplicates (just in case)
        return Array.from(new Set(list));
    }, [product]);

    // ✅ NEW: keep activeIndex safe if images length changes
    useEffect(() => {
        if (!open) return;
        if (activeIndex >= images.length) setActiveIndex(0);
    }, [images.length, activeIndex, open]);

    // ✅ NEW: keyboard navigation (← →)
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e) => {
        if (!images || images.length <= 1) return;

        if (e.key === "ArrowLeft") {
            setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
        } else if (e.key === "ArrowRight") {
            setActiveIndex((prev) => (prev + 1) % images.length);
        }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, images]);

    const currentImage = images?.[activeIndex] || product?.image;

    const goPrev = () => {
        if (!images || images.length <= 1) return;
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goNext = () => {
        if (!images || images.length <= 1) return;
        setActiveIndex((prev) => (prev + 1) % images.length);
    };

    if (!open) return null;

    return (
        <div
        className="fixed inset-0 z-[999] flex items-center justify-center px-4"
        style={{ background: "rgba(0,0,0,0.45)" }}
        onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose?.();
        }}
        >
        <div
            className="w-full max-w-6xl border shadow-xl overflow-hidden flex flex-col"
            style={{
            background: t.colors.surface,
            borderColor: t.colors.borderColor,
            borderRadius: t.radius.lg,
            maxHeight: "90vh",
            }}
        >
            {/* Header (fixed) */}
            <div
            className="flex items-center justify-between px-5 py-4 border-b shrink-0"
            style={{ borderColor: t.colors.borderColor }}
            >
            <div className="flex items-center gap-2">
                <LuPackage style={{ color: t.colors.primary }} />
                <div className="font-semibold" style={{ color: t.colors.textPrimary }}>
                Product Details
                </div>
            </div>

            <IconButton onClick={onClose}>
                <LuX size={20} />
            </IconButton>
            </div>

            {/* ✅ Body (scrollable) */}
            <div className="p-5 overflow-y-auto flex-1">
            {loading && (
                <div className="py-10">
                <BrandLoader />
                </div>
            )}

            {!loading && !product && (
                <div style={{ color: t.colors.textSecondary }}>No data.</div>
            )}

            {!loading && product && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* ✅ Image */}
                <div
                    className="border p-3 flex items-center justify-center"
                    style={{
                    borderColor: t.colors.borderColor,
                    borderRadius: t.radius.md,
                    background: "white",
                    position: "relative", // ✅ needed for arrows overlay
                    }}
                >
                    {/* ✅ Arrows (only if multiple images) */}
                    {images.length > 1 && (
                    <>
                        <button
                        type="button"
                        onClick={goPrev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 border shadow-sm p-2 cursor-pointer"
                        style={{
                            borderColor: t.colors.borderColor,
                            borderRadius: t.radius.md,
                            background: "white",
                            color: t.colors.primary,
                        }}
                        aria-label="Previous image"
                        >
                        <LuChevronLeft size={18} />
                        </button>

                        <button
                        type="button"
                        onClick={goNext}
                        className="absolute right-3 top-1/2 -translate-y-1/2 border shadow-sm p-2 cursor-pointer"
                        style={{
                            borderColor: t.colors.borderColor,
                            borderRadius: t.radius.md,
                            background: "white",
                            color: t.colors.primary,
                        }}
                        aria-label="Next image"
                        >
                        <LuChevronRight size={18} />
                        </button>
                    </>
                    )}

                    <div className="w-full">
                    <img
                        src={getImageUrl?.(currentImage)}
                        alt={product.name}
                        className="w-full max-h-70 mt-6 object-contain " // ✅ contain + flexible
                        onError={(e) => {
                        e.currentTarget.src = "/placeholder.png";
                        }}
                    />

                    {/* ✅ Thumbnails (scrollable) */}
                    {images.length > 1 && (
                        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
                        {images.map((img, idx) => (
                            <button
                            key={`${img}-${idx}`}
                            type="button"
                            onClick={() => setActiveIndex(idx)}
                            className="border p-1 cursor-pointer shrink-0"
                            style={{
                                borderColor:
                                idx === activeIndex ? t.colors.primary : t.colors.borderColor,
                                borderRadius: t.radius.md,
                                background: "white",
                            }}
                            aria-label={`Image ${idx + 1}`}
                            >
                            <img
                                src={getImageUrl?.(img)}
                                alt={`${product.name} ${idx + 1}`}
                                className="w-14 h-14 object-contian"
                                onError={(e) => {
                                e.currentTarget.src = "/placeholder.png";
                                }}
                            />
                            </button>
                        ))}
                        </div>
                    )}

                    {/* ✅ Small counter (keeps UI clean) */}
                    {images.length > 1 && (
                        <div className="mt-2 text-xs text-end" style={{ color: t.colors.primary }}>
                        {activeIndex + 1} / {images.length}
                        </div>
                    )}
                    </div>
                </div>

                {/* Info */}
                <div className="space-y-3 mt-6">
                    <div className="mb-3 py-3 border-b ml-1" style={{ borderColor: t.colors.borderColor }}>
                    <div className="text-xs font-semibold" style={{ color: t.colors.primary }}>
                        Name
                    </div>
                    <div className="font-semibold" style={{ color: t.colors.textPrimary }}>
                        {product.name.toUpperCase()}
                    </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                    <Info label="Price" value={`$${product.price}`} />
                    <Info label="Status" value={product.status} />
                    <Info label="Category" value={product.category?.name || "-"} />
                    <Info label="Brand" value={product.brand?.name || "-"} />
                    <Info label="Stock" value={String(product.stock ?? 0)} />
                    <Info label="Sold" value={String(product.sold ?? 0)} />
                    </div>

                    
                </div>

                {/* Specs full width */}
                <div className="md:col-span-2">
                    <div className="mb-3 max-w-8xl py-3 border-b" style={{ borderColor: t.colors.borderColor }}>
                    <div className="text-xs font-semibold mb-2" style={{ color: t.colors.primary }}>
                        Description
                    </div>
                    <div className="text-sm font-medium" style={{ color: t.colors.textPrimary }}>
                        {product.description || "-"}
                    </div>
                    </div>
                    <div className="text-xs font-semibold mb-2" style={{ color: t.colors.primary }}>
                    Specifications
                    </div>

                    {Array.isArray(product.specifications) && product.specifications.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {product.specifications.map((s) => (
                        <div
                            key={s._id || `${s.key}-${s.value}`}
                            className="border px-4 py-3"
                            style={{
                            borderColor: t.colors.borderColor,
                            borderRadius: t.radius.md,
                            background: "white",
                            }}
                        >
                            <div className="text-xs font-semibold mb-1" style={{ color: t.colors.primary }}>
                            {s.key}
                            </div>

                            <div className="text-sm font-semibold" style={{ color: t.colors.textPrimary }}>
                            {s.value}
                            </div>
                        </div>
                        ))}
                    </div>
                    ) : (
                    <div style={{ color: t.colors.textSecondary }}>No specifications.</div>
                    )}
                </div>
                </div>
            )}
            </div>

            {/* Footer (fixed) */}
            <div
            className="px-5 py-4 border-t flex justify-end shrink-0"
            style={{ borderColor: t.colors.borderColor }}
            >
            <CancelButton onClose={onClose} saving={loading} title="Close" />
            </div>
        </div>
        </div>
    );
}

function Info({ label, value }) {
    const t = useTheme();
    return (
        <div
        className="border px-3 py-3"
        style={{
            borderColor: t.colors.borderColor,
            borderRadius: t.radius.md,
            background: "white",
        }}
        >
        <div className="text-xs font-semibold" style={{ color: t.colors.primary }}>
            {label}
        </div>
        <div className="text-sm font-bold mt-2" style={{ color: t.colors.textPrimary }}>
            {value || "-"}
        </div>
        </div>
    );
}
