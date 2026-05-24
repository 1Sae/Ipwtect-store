import React, { useEffect, useMemo, useState } from "react";
import {
  LuPackagePlus,
  LuTarget,
  LuChartBar,
  LuLayers,
  LuTag,
  LuActivity,
  LuChartBarStacked,
} from "react-icons/lu";
import { useTheme } from "../../contexts/ThemeContexts";
import FormDropDown from "../../components/buttons/FormDropDown";
import CreateButton from "../../constants/CreateButton";
import CancelButton from "../../constants/CancelButton";
import { useAlert } from "../../providers/AlertProvider";
import {
  productsService,
  categoriesService,
  brandsService,
} from "../../services/Services";
import CustomDropDownAddingForm from "../../components/buttons/CustomDropDownAddingForm";
import BrandLoader from "../../components/modals/BrandLoader";
import { IMAGE_BASE_URL } from "../../config/apiPaths";

const AddProductPage = () => {
  /* ... your comments unchanged ... */

  const t = useTheme();
  const { showAlert } = useAlert();

  const [whatToAdd, setWhatToAdd] = useState("Product");

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    status: "available",
    categoryId: "",
    brandId: "",
    discount: "0",
  });

  const [specs, setSpecs] = useState([{ key: "", value: "" }]);

  const [uploadingImages, setUploadingImages] = useState(false);
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const [catForm, setCatForm] = useState({
    name: "",
    description: "",
  });

  const [catImageFile, setCatImageFile] = useState(null);
  const [catPreview, setCatPreview] = useState("");

  const [brandForm, setBrandForm] = useState({
    name: "",
    description: "",
  });

  const [brandImageFile, setBrandImageFile] = useState(null);
  const [brandPreview, setBrandPreview] = useState("");

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "";
    if (
      String(imgPath).startsWith("http://") ||
      String(imgPath).startsWith("https://")
    )
      return imgPath;
    return `${IMAGE_BASE_URL}/${String(imgPath).replace(/^\/+/, "")}`;
  };

  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      try {
        const [cRes, bRes] = await Promise.all([
          categoriesService.getAllCategories(),
          brandsService.getAllBrands(),
        ]);

        const catPayload = cRes?.data?.data;
        const brandPayload = bRes?.data?.data;

        setCategories(Array.isArray(catPayload) ? catPayload : catPayload?.categories || []);
        setBrands(Array.isArray(brandPayload) ? brandPayload : brandPayload?.brands || []);
        showAlert("success", "Categories/Brands loaded successfully");
      } catch (err) {
        showAlert(
          "error",
          err.response?.data?.message || "Failed to load categories/brands"
        );
        setCategories([]);
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleChange = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const addSpecRow = () => setSpecs((prev) => [...prev, { key: "", value: "" }]);

  const removeSpecRow = (index) => {
    setSpecs((previous) => {
      const next = previous.filter((_, i) => i !== index);
      return next.length > 0 ? next : [{ key: "", value: "" }];
    });
  };

  const handleSpecCommit = (index, field, value) => {
    setSpecs((previous) => {
      const specs = [...previous];
      specs[index] = { ...specs[index], [field]: value.trim() };
      return specs;
    });
  };

  const currentImage = images?.[activeImgIndex] || mainImage || "";

  const setAsMain = (img) => {
    if (!img) return;
    setMainImage(img);
    setImages((prev) => {
      const next = prev.filter((x) => x !== img);
      return [img, ...next];
    });
    setActiveImgIndex(0);
  };

  const removeImage = (img) => {
    setImages((prev) => {
      const next = prev.filter((x) => x !== img);
      const nextMain = next[0] || "";
      setMainImage((current) => (current === img ? nextMain : current));
      setActiveImgIndex(0);
      return next;
    });
  };

  const handleUploadImages = async (files) => {
    try {
      if (!files || files.length === 0) return;

      setUploadingImages(true);
      const res = await productsService.uploadProductImages(files);

      const fileUrls = res?.data?.data?.fileUrls || res?.data?.fileUrls || [];
      if (!Array.isArray(fileUrls) || fileUrls.length === 0) {
        showAlert("error", "Upload failed: no file urls returned");
        return;
      }

      setImages((prev) => {
        const merged = Array.from(new Set([...prev, ...fileUrls].filter(Boolean)));
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

  const resetProductForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      status: "available",
      categoryId: "",
      brandId: "",
      discount: "0",
    });
    setSpecs([{ key: "", value: "" }]);
    setImages([]);
    setMainImage("");
    setActiveImgIndex(0);
  };

  const validateProduct = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.description.trim()) return "Description is required";
    if (!form.price || Number.isNaN(Number(form.price))) return "Price must be a number";
    if (!form.stock || Number.isNaN(Number(form.stock))) return "Stock must be a number";
    if (!form.categoryId) return "Category is required";
    if (!form.brandId) return "Brand is required";
    if (!images || images.length === 0) return "Please upload at least one image";
    if (!mainImage) return "Please choose a main image";
    if (form.discount === "" || Number.isNaN(Number(form.discount))) return "Discount must be a number";
    return null;
  };

  const handleCreateProduct = async () => {
    const msg = validateProduct();
    if (msg) return showAlert("error", msg);

    const cleanedSpecs = specs
      .map((s) => ({
        key: String(s.key || "").trim(),
        value: String(s.value || "").trim(),
      }))
      .filter((s) => s.key && s.value);

    const finalImages = Array.from(new Set([mainImage, ...images].filter(Boolean)));
    const finalMain = mainImage || finalImages[0];

    setCreating(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.categoryId,
        brand: form.brandId,
        stock: Number(form.stock),
        status: form.status,
        discount: Number(form.discount),
        image: finalMain,
        images: finalImages,
        specifications: cleanedSpecs,
      };

      await productsService.createProduct(payload);

      showAlert("success", "Product created successfully");
      resetProductForm();
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Failed to create product");
    } finally {
      setCreating(false);
    }
  };

  const handleCatChange = (key) => (e) => {
    setCatForm((p) => ({ ...p, [key]: e.target.value }));
  };

  const resetCategoryForm = () => {
    setCatForm({ name: "", description: "" });
    setCatImageFile(null);
    setCatPreview("");
  };

  const validateCategory = () => {
    if (!catForm.name.trim()) return "Category name is required";
    return null;
  };

  const handlePickCategoryImage = (file) => {
    setCatImageFile(file || null);
    if (!file) {
      setCatPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setCatPreview(url);
  };

  const handleCreateCategory = async () => {
    const msg = validateCategory();
    if (msg) return showAlert("error", msg);

    setCreating(true);
    try {
      await categoriesService.createCategory({
        name: catForm.name.trim(),
        description: catForm.description.trim(),
        imageFile: catImageFile,
      });

      showAlert("success", "Category created successfully");
      resetCategoryForm();

      const cRes = await categoriesService.getAllCategories();
      const catPayload = cRes?.data?.data;
      setCategories(Array.isArray(catPayload) ? catPayload : catPayload?.categories || []);
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Failed to create category");
    } finally {
      setCreating(false);
    }
  };

  const handleBrandChange = (key) => (e) => {
    setBrandForm((p) => ({ ...p, [key]: e.target.value }));
  };

  const handlePickBrandImage = (file) => {
    setBrandImageFile(file || null);
    if (!file) {
      setBrandPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setBrandPreview(url);
  };

  const resetBrandForm = () => {
    setBrandForm({ name: "", description: "" });
    setBrandImageFile(null);
    setBrandPreview("");
  };

  const validateBrand = () => {
    if (!brandForm.name.trim()) return "Brand name is required";
    return null;
  };

  const handleCreateBrand = async () => {
    const msg = validateBrand();
    if (msg) return showAlert("error", msg);

    setCreating(true);
    try {
      await brandsService.createBrand({
        name: brandForm.name.trim(),
        description: brandForm.description.trim(),
        imageFile: brandImageFile,
      });

      showAlert("success", "Brand created successfully");
      resetBrandForm();

      const res = await brandsService.getAllBrands();
      const payload = res?.data?.data;
      setBrands(Array.isArray(payload) ? payload : payload?.brands || []);
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Failed to create brand");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="mt-0">
      {/* Header */}
      <div className="w-full justify-between flex flex-col sm:flex-row md:items-center gap-2 py-2 px-2 bg-white rounded-lg">
        <div className="mb-3">
          <h1 className="font-bold" style={{ color: t.colors.primary, fontSize: t.typography.h3 }}>
            Manage Products
          </h1>
          <p style={{ color: t.colors.textSecondary, fontSize: t.typography.small }}>
            Add a new product, category or brand. Select what you want to add
          </p>
        </div>

        <div className="mb-1 mr-0 flex flex-col sm:flex-row gap-3 items-end">
          <FormDropDown
            label="Filter What To Add"
            value={whatToAdd}
            icon={<LuPackagePlus size={14} />}
            categoryIcon={<LuChartBarStacked size={14} />}
            brandIcon={<LuChartBar size={14} />}
            productIcon={<LuPackagePlus size={14} />}
            onChange={setWhatToAdd}
            options={[
              { value: "Product", label: "Product" },
              { value: "Category", label: "Category" },
              { value: "Brand", label: "Brand" },
            ]}
          />
        </div>
      </div>

      {/* Body */}
      <div className="px-2 py-4 overflow-y-auto">
        {loading && <BrandLoader />}

        {/* ✅ PRODUCT FORM */}
        {!loading && whatToAdd === "Product" && (
          <div
            className="border shadow-sm overflow-hidden max-w-8xl"
            style={{
              borderColor: t.colors.borderColor,
              borderRadius: t.radius.lg,
              background: t.colors.surface,
              height: "calc(100vh - 200px)",
            }}
          >
            <div className="px-4 py-3 border-b" style={{ borderColor: t.colors.borderColor }}>
              <div className="font-semibold gap-2 flex items-center" style={{ color: t.colors.textPrimary }}>
                <LuPackagePlus size={20} style={{ color: t.colors.primary }} />
                Create Product
              </div>
              <div className="text-sm" style={{ color: t.colors.textSecondary }}>
                Upload images, choose a main image, then fill product details.
              </div>
            </div>

            {/* ✅ MAKE CONTENT SCROLLABLE (Product) */}
            <div className="p-4 flex flex-col gap-5 overflow-y-auto" style={{ height: "calc(100% - 88px)" }}>
              {/* Images */}
              <div className="flex flex-col items-center">
                <div
                  className="p-3 w-full max-w-[360px] border"
                  style={{
                    borderColor: t.colors.borderColor,
                    borderRadius: t.radius.md,
                    background: "white",
                  }}
                >
                  <img
                    src={getImageUrl(currentImage || mainImage)}
                    alt="Preview Your Image here "
                    className="w-full max-h-72 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.png";
                    }}
                  />

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

                    <div className="text-xs" style={{ color: t.colors.textSecondary }}>
                      {images.length} image(s)
                    </div>
                  </div>

                  {images.length > 0 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                      {images.map((img, idx) => (
                        <div key={`${img}-${idx}`} className="shrink-0">
                          <button
                            type="button"
                            onClick={() => setActiveImgIndex(idx)}
                            className="border p-1 cursor-pointer"
                            style={{
                              borderColor: idx === activeImgIndex ? t.colors.primary : t.colors.borderColor,
                              borderRadius: t.radius.md,
                              background: "white",
                            }}
                            title="Preview"
                          >
                            <img
                              src={getImageUrl(img)}
                              alt={`img-${idx + 1}`}
                              className="w-14 h-14 object-cover"
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

                  {images.length > 0 && (
                    <div className="mt-2 text-xs text-center" style={{ color: t.colors.textSecondary }}>
                      Main:{" "}
                      <span style={{ color: t.colors.textPrimary, fontWeight: 700 }}>
                        {mainImage ? "Selected" : "Not selected"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Inputs */}
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

                <Field label="Discount">
                  <input
                    value={form.discount}
                    onChange={handleChange("discount")}
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

                <CustomDropDownAddingForm
                  label="Status"
                  icon={<LuActivity size={14} />}
                  value={form.status}
                  onChange={(val) => setForm((p) => ({ ...p, status: val }))}
                  options={statusOptions}
                  placeholder="Select status"
                />

                <CustomDropDownAddingForm
                  label="Category"
                  icon={<LuLayers size={14} />}
                  value={form.categoryId}
                  onChange={(val) => setForm((p) => ({ ...p, categoryId: val }))}
                  options={categoryOptions}
                  placeholder="Select category"
                />

                <CustomDropDownAddingForm
                  label="Brand"
                  icon={<LuTag size={14} />}
                  value={form.brandId}
                  onChange={(val) => setForm((p) => ({ ...p, brandId: val }))}
                  options={brandOptions}
                  placeholder="Select brand"
                />

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

              {/* Specs */}
              <div>
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

                <div className="text-xs mt-2 px-1 text-red-600">
                  Only rows with both key and value will be saved.
                </div>
              </div>

              {/* Product Actions */}
              <div className="flex justify-end gap-2">
                <CancelButton title="Reset" saving={creating} onClose={resetProductForm} />
                <CreateButton title={creating ? "Creating..." : "Create"} handle={handleCreateProduct} />
              </div>
            </div>
          </div>
        )}

        {/* ✅ CATEGORY FORM (NEW) */}
        {!loading && whatToAdd === "Category" && (
          <div
            className="border shadow-sm overflow-hidden"
            style={{
              borderColor: t.colors.borderColor,
              borderRadius: t.radius.lg,
              background: t.colors.surface,
            }}
          >
            <div className="px-4 py-3 border-b" style={{ borderColor: t.colors.borderColor }}>
              <div className="font-semibold gap-2 flex items-center" style={{ color: t.colors.textPrimary }}>
                <LuChartBarStacked size={20} style={{ color: t.colors.primary }} />
                Create Category
              </div>
              <div className="text-sm" style={{ color: t.colors.textSecondary }}>
                Upload one image (optional), enter name and description, then create.
              </div>
            </div>

            <div className="p-4 flex flex-col gap-5 overflow-y-auto">
              {/* Category image */}
              <div className="flex justify-center">
                <div
                  className="p-3 w-full max-w-[360px] border"
                  style={{
                    borderColor: t.colors.borderColor,
                    borderRadius: t.radius.md,
                    background: "white",
                  }}
                >
                  <img
                    src={catPreview}
                    alt="category-preview"
                    className="w-full max-h-72 object-contain"
                  />

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <label
                      className="px-3 py-1.5 text-xs font-semibold border cursor-pointer"
                      style={{
                        borderRadius: t.radius.md,
                        borderColor: t.colors.borderColor,
                        background: "white",
                        color: t.colors.primary,
                      }}
                      title="Choose category image"
                    >
                      Choose Image
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          e.target.value = "";
                          handlePickCategoryImage(file);
                        }}
                      />
                    </label>

                    {catImageFile ? (
                      <button
                        type="button"
                        className="px-3 py-1.5 text-xs font-semibold border cursor-pointer"
                        style={{
                          borderRadius: t.radius.md,
                          borderColor: t.colors.borderColor,
                          background: "white",
                          color: t.colors.danger,
                        }}
                        onClick={() => handlePickCategoryImage(null)}
                      >
                        Remove
                      </button>
                    ) : (
                      <div className="text-xs" style={{ color: t.colors.textSecondary }}>
                        Optional
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Category inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Name">
                  <input
                    value={catForm.name}
                    onChange={handleCatChange("name")}
                    className="w-full px-3 py-2 border outline-none"
                    style={{
                      borderRadius: t.radius.md,
                      borderColor: t.colors.inputBorder,
                      background: "white",
                      color: t.colors.textPrimary,
                    }}
                    placeholder="Category name"
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field label="Description">
                    <textarea
                      value={catForm.description}
                      onChange={handleCatChange("description")}
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

              {/* Category Actions */}
              <div className="flex justify-end gap-2">
                <CancelButton title="Reset" saving={creating} onClose={resetCategoryForm} />
                <CreateButton title={creating ? "Creating..." : "Create"} handle={handleCreateCategory} />
              </div>
            </div>
          </div>
        )}

        {/* ✅ BRAND FORM */}
        {!loading && whatToAdd === "Brand" && (
          <div
            className="border shadow-sm overflow-hidden"
            style={{
              borderColor: t.colors.borderColor,
              borderRadius: t.radius.lg,
              background: t.colors.surface,
            }}
          >
            <div className="px-4 py-3 border-b" style={{ borderColor: t.colors.borderColor }}>
              <div className="font-semibold gap-2 flex items-center" style={{ color: t.colors.textPrimary }}>
                <LuChartBar size={20} style={{ color: t.colors.primary }} />
                Create Brand
              </div>
              <div className="text-sm" style={{ color: t.colors.textSecondary }}>
                Upload one image (optional), enter brand name and description.
              </div>
            </div>

            {/* ✅ MAKE CONTENT SCROLLABLE (Brand) */}
            <div className="p-4 flex flex-col gap-5 overflow-y-auto">
              {/* Brand Image */}
              <div className="flex justify-center">
                <div
                  className="p-3 w-full max-w-[360px] border"
                  style={{
                    borderColor: t.colors.borderColor,
                    borderRadius: t.radius.md,
                    background: "white",
                  }}
                >
                  <img
                    src={brandPreview}
                    alt="brand-preview"
                    className="w-full max-h-72 object-contain"
                  />

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <label
                      className="px-3 py-1.5 text-xs font-semibold border cursor-pointer"
                      style={{
                        borderRadius: t.radius.md,
                        borderColor: t.colors.borderColor,
                        background: "white",
                        color: t.colors.primary,
                      }}
                    >
                      Choose Image
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          e.target.value = "";
                          handlePickBrandImage(file);
                        }}
                      />
                    </label>

                    {brandImageFile ? (
                      <button
                        type="button"
                        className="px-3 py-1.5 text-xs font-semibold border cursor-pointer"
                        style={{
                          borderRadius: t.radius.md,
                          borderColor: t.colors.borderColor,
                          background: "white",
                          color: t.colors.danger,
                        }}
                        onClick={() => handlePickBrandImage(null)}
                      >
                        Remove
                      </button>
                    ) : (
                      <div className="text-xs" style={{ color: t.colors.textSecondary }}>
                        Optional
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Brand Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Name">
                  <input
                    value={brandForm.name}
                    onChange={handleBrandChange("name")}
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

                <div className="md:col-span-2">
                  <Field label="Description">
                    <textarea
                      value={brandForm.description}
                      onChange={handleBrandChange("description")}
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

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <CancelButton title="Reset" saving={creating} onClose={resetBrandForm} />
                <CreateButton
                  title={creating ? "Creating..." : "Create"}
                  handle={handleCreateBrand}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProductPage;

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
