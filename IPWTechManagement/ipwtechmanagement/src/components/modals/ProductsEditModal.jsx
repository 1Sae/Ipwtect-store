    import React, { useEffect, useMemo, useState } from "react";
    import { useTheme } from "../../contexts/ThemeContexts";
    import { LuX, LuPackage, LuTag, LuLayers, LuActivity } from "react-icons/lu";
    import { productsService } from "../../services/Services";
    import { useAlert } from "../../providers/AlertProvider";
    import BrandLoader from "../../components/modals/BrandLoader";
    import CustomDropDownEditForm from "../../components/buttons/CustomDropDownEditForm";
    import SaveButtons from "../../constants/SaveButtons";
    import CancelButton from "../../constants/CancelButton";
    import IconButton from "../../constants/IconButton";

    export default function ProductsEditModal({
    open,
    productId,
    onClose,
    getImageUrl,
    categories = [],
    brands = [],
    onRefetch,
    }) {
    const t = useTheme();
    const { showAlert } = useAlert();

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [product, setProduct] = useState(null);

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        status: "available",
        categoryId: "",
        brandId: "",
    });

    const [specs, setSpecs] = useState([{ key: "", value: "" }]);

    // ✅ NEW: images state
    const [mainImage, setMainImage] = useState(""); // string path
    const [images, setImages] = useState([]); // array of string paths
    const [activeImgIndex, setActiveImgIndex] = useState(0);

    const [uploadingImages, setUploadingImages] = useState(false);

    // ✅ Prevent background scroll (LOCK) - only once
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
        document.body.style.overflow = prev;
        };
    }, [open]);

    // ✅ ESC to close
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
        if (e.key === "Escape") onClose?.();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    // ✅ Fetch product details
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

            setForm({
            name: p?.name ?? "",
            description: p?.description ?? "",
            price: String(p?.price ?? ""),
            stock: String(p?.stock ?? ""),
            status: String(p?.status ?? "available").toLowerCase(),
            categoryId: p?.category?._id ?? "",
            brandId: p?.brand?._id ?? "",
            });

            const incoming = Array.isArray(p?.specifications) ? p.specifications : [];
            setSpecs(
            incoming.length > 0
                ? incoming.map((s) => ({ key: s?.key ?? "", value: s?.value ?? "" }))
                : [{ key: "", value: "" }]
            );

            // ✅ NEW: init images (keep main image first, dedupe)
            const list = [];
            if (Array.isArray(p?.images) && p.images.length > 0) list.push(...p.images.filter(Boolean));
            if (p?.image && !list.includes(p.image)) list.unshift(p.image);
            const unique = Array.from(new Set(list));

            setImages(unique);
            setMainImage(p?.image || unique[0] || "");
            setActiveImgIndex(0);
        } catch (err) {
            showAlert("error", err.response?.data?.message || "Failed to load product details");
            setProduct(null);
        } finally {
            setLoading(false);
        }
        };

        fetchOne();
    }, [open, productId, showAlert]);

    const categoryOptions = useMemo(
        () => [
        { value: "", label: "Select category" },
        ...categories.map((c) => ({ value: c._id, label: c.name })),
        ],
        [categories]
    );

    const brandOptions = useMemo(
        () => [
        { value: "", label: "Select brand" },
        ...brands.map((b) => ({ value: b._id, label: b.name })),
        ],
        [brands]
    );

    const statusOptions = useMemo(
        () => [
        { value: "available", label: "Available" },
        { value: "unavailable", label: "Unavailable" },
        ],
        []
    );

    const handleChange = (key) => (e) => {
        setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

    const handleSpecCommit = (index, field, value) => {
        setSpecs((prev) => {
        const next = [...prev];
        next[index] = {
            ...next[index],
            [field]: value.trim(),
        };
        return next;
        });
    };

    const addSpecRow = () => setSpecs((prev) => [...prev, { key: "", value: "" }]);

    const removeSpecRow = (index) => {
        setSpecs((prev) => {
        const next = prev.filter((_, i) => i !== index);
        return next.length > 0 ? next : [{ key: "", value: "" }];
        });
    };

    // ✅ NEW: image helpers
    const currentImage = images?.[activeImgIndex] || mainImage || product?.image || "";

    const setAsMain = (img) => {
        if (!img) return;
        setMainImage(img);
        setImages((prev) => {
        const next = prev.filter((x) => x !== img);
        return [img, ...next]; // keep main first
        });
        setActiveImgIndex(0);
    };

    const removeImage = (img) => {
        setImages((prev) => {
        const next = prev.filter((x) => x !== img);
        const nextMain = next[0] || "";
        setMainImage((curr) => (curr === img ? nextMain : curr));
        setActiveImgIndex(0);
        return next;
        });
    };

    // ✅ NEW: upload multiple images and merge into state
    const handleUploadImages = async (files) => {
        try {
            if (!files || files.length === 0) return;

            setUploadingImages(true);

        // expects productsService.uploadProductImages to exist
        // If you don't have it, create it in your service (I can provide it).
            const res = await productsService.uploadProductImages(files);

            const fileUrls = res?.data?.data?.fileUrls || res?.data?.fileUrls || [];
            if (!Array.isArray(fileUrls) || fileUrls.length === 0) {
                showAlert("error", "Upload failed: no file urls returned");
                return;
            }

            setImages((prev) => {
                const merged = Array.from(new Set([...prev, ...fileUrls]));
                // if there is no main image yet, set first uploaded as main
                if (!mainImage && merged.length > 0) setMainImage(merged[0]);
                return merged;
            });

            showAlert("success", "Images uploaded successfully");
            } catch (err) {
            showAlert("error", err.response?.data?.message || "Failed to upload images");
            } finally {
                setUploadingImages(false);
            }
    };

    const validate = () => {
        if (!form.name.trim()) return "Name is required";
        if (!form.price || Number.isNaN(Number(form.price))) return "Price must be a number";
        if (!form.stock || Number.isNaN(Number(form.stock))) return "Stock must be a number";
        if (!form.categoryId) return "Category is required";
        if (!form.brandId) return "Brand is required";
        return null;
    };

    const handleSave = async () => {
        const msg = validate();
        if (msg) return showAlert("error", msg);

        const cleanedSpecs = specs
            .map((s) => ({
            key: String(s.key || "").trim(),
            value: String(s.value || "").trim(),
            }))
            .filter((s) => s.key && s.value);

        // ✅ ensure main image is included in images array + dedupe
        const finalImages = Array.from(new Set([mainImage, ...(images || [])].filter(Boolean)));
        const finalMain = mainImage || finalImages[0] || "";

        setSaving(true);
        try {
            const payload = {
            name: form.name.trim(),
            description: form.description.trim(),
            price: Number(form.price),
            stock: Number(form.stock),
            status: form.status,
            category: form.categoryId,
            brand: form.brandId,
            specifications: cleanedSpecs,

            // ✅ NEW: image fields
            image: finalMain,
            images: finalImages,
        };

        await productsService.updateProduct(productId, payload);

        showAlert("success", "Product updated successfully");
        onClose?.();
        await onRefetch?.();
        } catch (err) {
        showAlert("error", err.response?.data?.message || "Failed to update product");
        } finally {
        setSaving(false);
        }
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
        {/* ✅ flex flex-col so body can scroll with flex-1 */}
        <div
            className="w-full max-w-4xl lg:max-w-5xl border shadow-xl overflow-hidden flex flex-col"
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
                <LuPackage style={{ color: t.colors.primary }} />
                <div className="font-semibold" style={{ color: t.colors.textPrimary }}>
                Edit Product
                </div>
            </div>

            <IconButton onClick={onClose}>
                <LuX size={16} />
            </IconButton>
            </div>

            {/* ✅ Scrollable Body (includes specs editor) */}
            <div className="px-5 py-4 overflow-y-auto flex-1">
            {loading && (
                <div className="py-10">
                <BrandLoader />
                </div>
            )}

            {!loading && !product && (
                <div style={{ color: t.colors.textSecondary }}>No data.</div>
            )}

            {!loading && product && (
                <div className="flex flex-col gap-5">
                {/* Image centered at top */}
                <div className="flex justify-center">
                    <div
                    className="p-3 w-full max-w-[350px] border"
                    style={{
                        borderColor: t.colors.borderColor,
                        borderRadius: t.radius.md,
                        background: "white",
                        position: "relative",
                    }}
                    >
                    <img
                        src={getImageUrl?.(currentImage)}
                        alt={product.name}
                        className="w-full max-h-60 max-w-80 object-contain"
                        onError={(e) => {
                        e.currentTarget.src = "/placeholder.png";
                        }}
                    />

                    {/* ✅ Upload button (keeps design minimal) */}
                    <div className="mt-3 flex items-center justify-between gap-2">
                        <label
                        className="px-3 py-1.5 text-xs font-semibold border cursor-pointer"
                        style={{
                            borderRadius: t.radius.md,
                            borderColor: t.colors.borderColor,
                            background: "white",
                            color: t.colors.primary,
                            opacity: uploadingImages ? 0.7 : 1,
                        }}
                        title="Upload images"
                        >
                        {uploadingImages ? "Uploading..." : "Upload Images"}
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            hidden
                            onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            e.target.value = "";
                            handleUploadImages(files);
                            }}
                            disabled={uploadingImages}
                        />
                        </label>

                        {images.length > 0 && (
                        <div className="text-xs" style={{ color: t.colors.textSecondary }}>
                            {images.length} image(s)
                        </div>
                        )}
                    </div>

                    {/* ✅ Thumbnails (scrollable) */}
                    {images.length > 1 && (
                        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                        {images.map((img, idx) => (
                            <div key={`${img}-${idx}`} className="shrink-0">
                            <button
                                type="button"
                                onClick={() => setActiveImgIndex(idx)}
                                className="border p-4 cursor-pointer"
                                style={{
                                borderColor: idx === activeImgIndex ? t.colors.primary : t.colors.borderColor,
                                borderRadius: t.radius.md,
                                background: "white",
                                }}
                                title="Preview"
                            >
                                <img
                                src={getImageUrl?.(img)}
                                alt={`${product.name} ${idx + 1}`}
                                className="w-14 h-14 object-contain"
                                onError={(e) => {
                                    e.currentTarget.src = "/placeholder.png";
                                }}
                                />
                            </button>

                            <div className="mt-1 flex items-center gap-1 justify-center">
                                <button
                                type="button"
                                onClick={() => setAsMain(img)}
                                className="px-2 py-1 text-[10px] font-semibold border cursor-pointer"
                                style={{
                                    borderRadius: t.radius.md,
                                    borderColor: t.colors.borderColor,
                                    background: img === mainImage ? "rgba(34, 197, 94, 0.10)" : "white",
                                    color: img === mainImage ? t.colors.success : t.colors.primary,
                                }}
                                title="Set as main image"
                                >
                                Main
                                </button>

                                <button
                                type="button"
                                onClick={() => removeImage(img)}
                                className="px-2 py-1 text-[10px] font-semibold border cursor-pointer"
                                style={{
                                    borderRadius: t.radius.md,
                                    borderColor: t.colors.borderColor,
                                    background: "white",
                                    color: t.colors.danger,
                                }}
                                title="Remove image"
                                >
                                ✕
                                </button>
                            </div>
                            </div>
                        ))}
                        </div>
                    )}
                    </div>
                </div>

                {/* Form under image */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Field label="Name">
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
                        placeholder="Product name"
                    />
                    </Field>

                    <Field label="Price">
                    <input
                        value={form.price}
                        onChange={handleChange("price")}
                        className="w-full px-3 py-2 border outline-none"
                        style={{
                        borderRadius: t.radius.md,
                        borderColor: t.colors.inputBorder,
                        background: "white",
                        color: t.colors.textPrimary,
                        }}
                        placeholder="0"
                    />
                    </Field>

                    <Field label="Stock">
                    <input
                        value={form.stock}
                        onChange={handleChange("stock")}
                        className="w-full px-3 py-2 border outline-none"
                        style={{
                        borderRadius: t.radius.md,
                        borderColor: t.colors.inputBorder,
                        background: "white",
                        color: t.colors.textPrimary,
                        }}
                        placeholder="0"
                    />
                    </Field>

                    {/* Status dropdown */}
                    <CustomDropDownEditForm
                    label="Status"
                    icon={<LuActivity size={14} />}
                    value={form.status}
                    onChange={(val) => setForm((p) => ({ ...p, status: val }))}
                    options={statusOptions}
                    placeholder="Select status"
                    />

                    {/* Category dropdown */}
                    <CustomDropDownEditForm
                    label="Category"
                    icon={<LuLayers size={14} />}
                    value={form.categoryId}
                    onChange={(val) => setForm((p) => ({ ...p, categoryId: val }))}
                    options={categoryOptions}
                    placeholder="Select category"
                    />

                    {/* Brand dropdown */}
                    <CustomDropDownEditForm
                    label="Brand"
                    icon={<LuTag size={14} />}
                    value={form.brandId}
                    onChange={(val) => setForm((p) => ({ ...p, brandId: val }))}
                    options={brandOptions}
                    placeholder="Select brand"
                    />

                    {/* Description full width */}
                    <div className="md:col-span-3">
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

                {/* ✅ Specifications Editor (INSIDE scroll area) */}
                <div className="md:col-span-3">
                    <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-semibold px-1" style={{ color: t.colors.primary }}>
                        Specifications
                    </div>

                    <button
                        type="button"
                        onClick={addSpecRow}
                        className="px-3 py-1.5 text-xs font-semibold border cursor-pointer"
                        style={{
                        borderRadius: t.radius.md,
                        borderColor: t.colors.borderColor,
                        background: "white",
                        color: t.colors.primary,
                        }}
                    >
                        + Add Spec
                    </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {specs.map((s, idx) => (
                        <div
                        key={`${idx}-${s.key}`}
                        className="border p-3 flex items-start gap-2"
                        style={{
                            borderRadius: t.radius.md,
                            borderColor: t.colors.borderColor,
                            background: "white",
                        }}
                        >
                        <div className="flex-1 grid grid-cols-2 gap-2">
                            <input
                            defaultValue={s.key}
                            onBlur={(e) => handleSpecCommit(idx, "key", e.target.value)}
                            className="w-full px-3 py-2 border outline-none"
                            style={{
                                borderRadius: t.radius.md,
                                borderColor: t.colors.inputBorder,
                                background: "white",
                                color: t.colors.textPrimary,
                            }}
                            placeholder="Key"
                            />

                            <input
                            defaultValue={s.value}
                            onBlur={(e) => handleSpecCommit(idx, "value", e.target.value)}
                            className="w-full px-3 py-2 border outline-none"
                            style={{
                                borderRadius: t.radius.md,
                                borderColor: t.colors.inputBorder,
                                background: "white",
                                color: t.colors.textPrimary,
                            }}
                            placeholder="Value"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => removeSpecRow(idx)}
                            className="px-3 py-2 text-xs font-semibold border mt-1 cursor-pointer flex items-center justify-center"
                            style={{
                            borderRadius: t.radius.md,
                            borderColor: t.colors.borderColor,
                            background: "white",
                            color: t.colors.danger,
                            }}
                            title="Remove"
                        >
                            ✕
                        </button>
                        </div>
                    ))}
                    </div>

                    <div className="text-xs mt-2 px-1" style={{ color: t.colors.textSecondary }}>
                    Only rows with both key and value will be saved.
                    </div>
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
