import React, { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContexts";
import { LuX, LuPackage } from "react-icons/lu";
import { productsService } from "../../services/ProductsService";
import { useAlert } from "../../providers/AlertProvider";
import BrandLoader from "../../components/modals/BrandLoader";
import SaveButtons from "../../constants/SaveButtons";
import CancelButton from "../../constants/CancelButton";
import IconButton from "../../constants/IconButton";
export default function ProductsModal2({ open, productId, onClose, getImageUrl }) {
    const t = useTheme();
    const { showAlert } = useAlert();

    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState(null);

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
            className="w-full max-w-2xl border shadow-xl overflow-hidden flex flex-col"
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
                    }}
                >
                    <img
                    src={getImageUrl?.(product.image)}
                    alt={product.name}
                    className="w-full max-h-72 object-contain" // ✅ contain + flexible
                    onError={(e) => {
                        e.currentTarget.src = "/placeholder.png";
                    }}
                    />
                </div>

                {/* Info */}
                <div className="space-y-3">
                    <div>
                    <div className="text-xs font-semibold" style={{ color: t.colors.textSecondary }}>
                        Name
                    </div>
                    <div className="font-semibold" style={{ color: t.colors.textPrimary }}>
                        {product.name}
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

                    <div>
                    <div className="text-xs font-semibold" style={{ color: t.colors.textSecondary }}>
                        Description
                    </div>
                    <div className="text-sm" style={{ color: t.colors.textPrimary }}>
                        {product.description || "-"}
                    </div>
                    </div>
                </div>

                {/* Specs full width */}
                <div className="md:col-span-2">
                    <div className="text-xs font-semibold mb-2" style={{ color: t.colors.textSecondary }}>
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
                            <div className="text-xs font-semibold mb-1" style={{ color: t.colors.textSecondary }}>
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
        className="border px-3 py-2"
        style={{
            borderColor: t.colors.borderColor,
            borderRadius: t.radius.md,
            background: "white",
        }}
        >
        <div className="text-xs font-semibold" style={{ color: t.colors.textSecondary }}>
            {label}
        </div>
        <div className="text-sm font-semibold" style={{ color: t.colors.textPrimary }}>
            {value || "-"}
        </div>
        </div>
    );
}
