import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../contexts/ThemeContexts";
import {
  LuFilter,
  LuTrendingUp,
  LuTruck,
  LuPackage,
  LuLayoutGrid,
  LuList,
  LuEye,
  LuPencil,
  LuTrash2,
  LuSearch,
} from "react-icons/lu";
import CustomDropdown from "../../components/buttons/CustomDropDown";
import {
  productsService,
  categoriesService,
  brandsService,
} from "../../services/Services";
import { useAlert } from "../../providers/AlertProvider";
import {IMAGE_BASE_URL } from "../../config/apiPaths";
import ProductsModal from "../../components/modals/ProductsModal";
import ProductsEditModal from "../../components/modals/ProductsEditModal";
import SaveButtons from "../../constants/SaveButtons";
import BrandLoader from "../../components/modals/BrandLoader";


const LOW_STOCK_THRESHOLD = 5;

const ProductsPage = () => {
  const t = useTheme();
  const { showAlert } = useAlert();

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [quickFilter, setQuickFilter] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [loading, setLoading] = useState(false);

  // search query
  const [searchQuery, setSearchQuery] = useState("");

  // view mode: "table" | "grid"
  const [viewMode, setViewMode] = useState("table");

  // ✅ separate ids
  const [selectedViewId, setSelectedViewId] = useState(null);
  const [selectedEditId, setSelectedEditId] = useState(null);

  const openViewModal = Boolean(selectedViewId);
  const openEditModal = Boolean(selectedEditId);

  const normalizeProducts = (res) => {
    const payload = res?.data?.data;
    if (Array.isArray(payload)) return payload;
    if (payload?.products) return payload.products;
    return [];
  };

  const normalizeCategories = (res) => {
    const payload = res?.data?.data;
    if (Array.isArray(payload)) return payload;
    if (payload?.categories) return payload.categories;
    return [];
  };

  const normalizeBrands = (res) => {
    const payload = res?.data?.data;
    if (Array.isArray(payload)) return payload;
    if (payload?.brands) return payload.brands;
    return [];
  };

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "";
    if (imgPath.startsWith("http")) return imgPath;
  
    return `${IMAGE_BASE_URL}/${String(imgPath).replace(/^\/+/, "")}`;
  };

  const getMainImage = (p) => {
    if (p?.image) return p.image;                 // main image field
    if (Array.isArray(p?.images) && p.images[0]) return p.images[0]; // fallback
    return ""; // will trigger placeholder onError
  };
  

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [pRes, cRes, bRes] = await Promise.all([
        productsService.getAll(),
        categoriesService.getAllCategories(),
        brandsService.getAllBrands(),
      ]);

      setProducts(normalizeProducts(pRes));
      setCategories(normalizeCategories(cRes));
      setBrands(normalizeBrands(bRes));
      showAlert("success", "Products loaded successfully");
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Failed to load data");
      setProducts([]);
      setCategories([]);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };
  const refetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productsService.getAll();
      setProducts(normalizeProducts(res));
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Failed to refresh products");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    try {
      await productsService.deleteProduct(id);
      refetchProducts();
      showAlert("success", "Product deleted successfully");
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredProducts = useMemo(() => {
    let list = Array.isArray(products) ? [...products] : [];

    // Search filter
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => String(p?.name || "").toLowerCase().includes(q));
    }

    if (categoryFilter !== "all") {
      const target = String(categoryFilter).toLowerCase();
      list = list.filter((p) => String(p.category?.name || "").toLowerCase() === target);
    }

    if (brandFilter !== "all") {
      const target = String(brandFilter).toLowerCase();
      list = list.filter((p) => String(p.brand?.name || "").toLowerCase() === target);
    }

    if (quickFilter === "available" || quickFilter === "unavailable") {
      const target = String(quickFilter).toLowerCase();
      list = list.filter((p) => String(p.status || "").toLowerCase() === target);
    } else if (quickFilter === "low-stock") {
      list = list.filter((p) => Number(p.stock ?? 0) <= LOW_STOCK_THRESHOLD);
    } else if (quickFilter === "out-of-stock") {
      list = list.filter((p) => Number(p.stock ?? 0) === 0);
    } else if (quickFilter === "top-selling") {
      list = list
        .filter((p) => Number(p.sold ?? 0) > 0)
        .sort((a, b) => Number(b.sold ?? 0) - Number(a.sold ?? 0));
    }

    if (priceRange !== "all") {
      const [minStr, maxStr] = String(priceRange).split("-");
      const min = Number(minStr);
      const max = Number(maxStr);

      if (!Number.isNaN(min) && !Number.isNaN(max)) {
        list = list.filter((p) => {
          const price = Number(p.price);
          return !Number.isNaN(price) && price >= min && price <= max;
        });
      }
    }

    return list;
  }, [products, searchQuery, categoryFilter, brandFilter, quickFilter, priceRange]);

  const handleReset = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setBrandFilter("all");
    setQuickFilter("all");
    setPriceRange("all");
  };

  return (
    <div className="mt-0">
      {/* Header + Filters*/}
      <div className="flex flex-col md:flex-row md:items-center gap-2 px-2 py-2 w-full justify-between rounded-lg">
        <div className="mb-1">
          <h1 className="font-bold" style={{ color: t.colors.primary, fontSize: t.typography.h3 }}>
            Manage Products
          </h1>
          <p style={{ color: t.colors.textSecondary, fontSize: t.typography.small }}>
            Manage your catalog, filter products, and monitor stock & sales.
          </p>
        </div>

        <div className="mb-1 flex flex-col sm:flex-row gap-3 sm:items-end">
        <button
                type="button"
                onClick={handleReset}
                className="
                    text-orange-400
                    cursor-pointer
                    px-5 py-2 mb-0 text-sm font-semibold
                    rounded-md
                    transition-all duration-600 ease-out
                    hover:-translate-y-1
                    hover:shadow-[0_8px_15px_-6px_rgba(255,162,96,0.8)]
                    hover:bg-orange-400 hover:text-white
                    hover:border-orange-400
                    focus:outline-none
                "
                >
                Reset
          </button>
          <div className="w-full sm:w-48">
            <CustomDropdown
              label="Filter By Category"
              value={categoryFilter}
              icon={<LuTrendingUp size={14} />}
              onChange={setCategoryFilter}
              options={[
                { value: "all", label: "All" },
                ...categories.map((c) => ({ value: c.name, label: c.name })),
              ]}
            />
          </div>

          <div className="w-full sm:w-48">
            <CustomDropdown
              label="Filter By Brand"
              value={brandFilter}
              icon={<LuTrendingUp size={14} />}
              onChange={setBrandFilter}
              options={[
                { value: "all", label: "All" },
                ...brands.map((b) => ({ value: b.name, label: b.name })),
              ]}
            />
          </div>

          <div className="w-full sm:w-48">
            <CustomDropdown
              label="Quick Filter"
              value={quickFilter}
              icon={<LuFilter size={14} />}
              onChange={setQuickFilter}
              options={[
                { value: "all", label: "All" },
                { value: "available", label: "Available" },
                { value: "unavailable", label: "Unavailable" },
                { value: "low-stock", label: "Low Stock" },
                { value: "out-of-stock", label: "Out of Stock" },
                { value: "top-selling", label: "Top Selling" },
              ]}
            />
          </div>

          <div className="w-full sm:w-48">
            <CustomDropdown
              label="Price Range"
              value={priceRange}
              icon={<LuTruck size={14} />}
              onChange={setPriceRange}
              options={[
                { value: "all", label: "All" },
                { value: "0-500", label: "0 - 500" },
                { value: "501-1000", label: "501 - 1000" },
                { value: "1101-2000", label: "1101 - 2000" },
              ]}
            />
          </div>

          {/* Search */}
          <div
            className="w-full sm:w-72 flex items-center gap-2  scale-100 hover:scale-105 transition duration-300 ease-in-out border px-3 py-2"
            style={{ borderColor: t.colors.borderColor, borderRadius: t.radius.md, background: "white" }}
          >
            <LuSearch style={{ color: t.colors.primary }} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product by name..."
              className="w-full outline-none bg-transparent text-sm"
              style={{ color: t.colors.textPrimary }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-2 mt-3 flex items-center gap-2" style={{ color: t.colors.textSecondary }}>
        <TabButton active={viewMode === "table"} onClick={() => setViewMode("table")} label="Table" icon={<LuList size={14} />} />
        <TabButton active={viewMode === "grid"} onClick={() => setViewMode("grid")} label="Grid" icon={<LuLayoutGrid size={14} />} />
      </div>

      {/* Table View */}
      {viewMode === "table" && (
        <div
          className="mt-6 mb-40 border shadow-sm overflow-hidden"
          style={{
            borderColor: t.colors.borderColor,
            background: t.colors.surface,
            borderRadius: t.radius.lg,
          }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: t.colors.borderColor }}>
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <LuPackage style={{ color: t.colors.primary }} />
                    <div className="font-semibold" style={{ color: t.colors.textPrimary }}>
                    Products List
                    </div>
                </div>

                <div className="text-sm font-medium" style={{ color: t.colors.primary }}>
                {loading ? "Loading..." : `Loaded ${filteredProducts.length} product(s)`}
                </div>
                </div>
          </div>

          <div className="w-full overflow-x-auto">
            <div className="max-h-[620px] md:max-h-[620px] lg:max-h-[740px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10">
                  <tr className="text-left" style={{ background: t.colors.inputBackground, color: t.colors.textSecondary }}>
                    <th className="px-4 py-3 font-semibold">#Num</th>
                    <th className="px-4 py-3 font-semibold">Product</th>
                    <th className="px-4 py-3 font-semibold">Price</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Brand</th>
                    <th className="px-4 py-3 font-semibold">Image</th>
                    <th className="px-4 py-3 font-semibold">Sold</th>
                    <th className="px-4 py-3 font-semibold">Stock</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                    <th className="px-2 py-3 font-semibold">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p, index) => (
                    <tr key={p._id} className="border-t" style={{ borderColor: t.colors.borderColor }}>
                      <td className="px-4 py-3" style={{ color: t.colors.textPrimary }}>
                        {index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold" style={{ color: t.colors.textPrimary }}>
                          {p.name}
                        </div>
                        <div className="text-xs" style={{ color: t.colors.textSecondary }}>
                          Status:{" "}
                          <span
                            className="font-semibold"
                            style={{
                              color:
                                String(p.status).toLowerCase() === "available"
                                  ? t.colors.success
                                  : t.colors.danger,
                            }}
                          >
                            {p.status}
                          </span>
                        </div>
                      </td>

                      <td className="px-3 py-3" style={{ color: t.colors.textPrimary }}>
                        ${p.price}
                      </td>

                      <td className="px-4 py-3" style={{ color: t.colors.textPrimary }}>
                        {p.category?.name || "-"}
                      </td>

                      <td className="px-4 py-3" style={{ color: t.colors.textPrimary }}>
                        {p.brand?.name || "-"}
                      </td>

                      <td className="px-3 py-3">
                        <img
                          src={getImageUrl(getMainImage(p))}
                          alt={p.name}
                          className="w-14 h-14 rounded-lg object-contain"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.png";
                          }}
                        />
                      </td>

                      <td className="px-7 py-3" style={{ color: t.colors.textPrimary }}>
                        {p.sold ?? 0}
                      </td>

                      <td className="px-5 py-3">
                        <span
                          className="px-2 py-1 rounded-md text-xs font-semibold"
                          style={{
                            background:
                              Number(p.stock ?? 0) === 0
                                ? "rgba(239, 68, 68, 0.10)"
                                : Number(p.stock ?? 0) <= LOW_STOCK_THRESHOLD
                                ? "rgba(245, 158, 11, 0.12)"
                                : "rgba(34, 197, 94, 0.10)",
                            color:
                              Number(p.stock ?? 0) === 0
                                ? t.colors.danger
                                : Number(p.stock ?? 0) <= LOW_STOCK_THRESHOLD
                                ? t.colors.warning
                                : t.colors.success,
                          }}
                        >
                          {Number(p.stock ?? 0) === 0 ? "Out" : p.stock}
                        </span>
                      </td>

                      <td className="px-2 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="inline-flex items-center px-2 py-1.5 border text-xs font-semibold transition cursor-pointer"
                            style={{
                              borderRadius: t.radius.md,
                              borderColor: t.colors.borderColor,
                              background: "white",
                              color: t.colors.primary,
                            }}
                            onClick={() => setSelectedViewId(p._id)}
                          >
                            <LuEye size={14} />
                          </button>

                          <button
                            type="button"
                            className="inline-flex items-center px-2 py-1.5 border text-xs font-semibold transition cursor-pointer"
                            style={{
                              borderRadius: t.radius.md,
                              borderColor: t.colors.borderColor,
                              background: "white",
                              color: t.colors.primary,
                            }}
                            onClick={() => setSelectedEditId(p._id)}
                          >
                            <LuPencil size={14} />
                          </button>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="inline-flex items-center px-2 py-1.5 border text-xs font-semibold transition cursor-pointer text-red-600"
                            style={{
                              borderRadius: t.radius.md,
                              borderColor: t.colors.borderColor,
                              background: "white",
                            }}
                            onClick={() => deleteProduct(p._id)}
                          >
                            <LuTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!loading && filteredProducts.length === 0 && (
                    <tr>
                      <td className="px-4 py-10 text-center" colSpan={10}>
                        <div className="font-semibold" style={{ color: t.colors.textPrimary }}>
                          No products found
                        </div>
                        <div className="text-sm" style={{ color: t.colors.textSecondary }}>
                          Try changing filters or reset.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center justify-between border-b gap-2 w-full" style={{ borderColor: t.colors.borderColor }}>
              <div>
                <LuPackage style={{ color: t.colors.primary }} />
                <div className="font-semibold" style={{ color: t.colors.textPrimary }}>
                  Products Grid
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-right mt-6" style={{ color: t.colors.primary }}>
                  {loading ? "Loading..." : `Loaded ${filteredProducts.length} Product(s)`}
                </div>
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 && !loading && (
            <div className="border rounded-lg p-8 text-center" style={{ borderColor: t.colors.borderColor, background: t.colors.surface }}>
              <div className="font-semibold mb-1" style={{ color: t.colors.textPrimary }}>
                No products found
              </div>
              <div className="text-sm" style={{ color: t.colors.textSecondary }}>
                Try changing filters or reset.
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((p) => (
              <div
                key={p._id}
                className="border rounded-xl overflow-hidden shadow-sm flex flex-col"
                style={{ borderColor: t.colors.borderColor, background: t.colors.surface }}
              >
                <div className="relative bg-white flex items-center justify-center px-4 pt-4 pb-3">
                  <img
                    src={getImageUrl(getMainImage(p))}
                    alt={p.name}
                    className="w-50 h-47 object-contain rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.png";
                    }}
                  />
                </div>

                <div className="px-4 py-3 flex-1 flex flex-col gap-2 text-sm">
                  <div>
                    <div className="font-semibold line-clamp-2" style={{ color: t.colors.textPrimary }}>
                      {p.name}
                    </div>
                    <div className="text-xs mt-1" style={{ color: t.colors.textSecondary }}>
                      Status:{" "}
                      <span
                        className="font-semibold"
                        style={{
                          color:
                            String(p.status).toLowerCase() === "available"
                              ? t.colors.success
                              : t.colors.danger,
                        }}
                      >
                        {p.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div>
                      <div className="text-gray-500">Price</div>
                      <div className="font-semibold" style={{ color: t.colors.textPrimary }}>
                        ${p.price}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Sold</div>
                      <div className="font-semibold" style={{ color: t.colors.textPrimary }}>
                        {p.sold ?? 0}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Stock</div>
                      <span
                        className="px-2 py-0.5 rounded-md text-xs font-semibold inline-block"
                        style={{
                          background:
                            Number(p.stock ?? 0) === 0
                              ? "rgba(239, 68, 68, 0.10)"
                              : Number(p.stock ?? 0) <= LOW_STOCK_THRESHOLD
                              ? "rgba(245, 158, 11, 0.12)"
                              : "rgba(34, 197, 94, 0.10)",
                          color:
                            Number(p.stock ?? 0) === 0
                              ? t.colors.danger
                              : Number(p.stock ?? 0) <= LOW_STOCK_THRESHOLD
                              ? t.colors.warning
                              : t.colors.success,
                        }}
                      >
                        {Number(p.stock ?? 0) === 0 ? "Out" : p.stock}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs mt-1">
                    <div>
                      <div className="text-gray-500">Category</div>
                      <div className="font-medium" style={{ color: t.colors.textPrimary }}>
                        {p.category?.name || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Brand</div>
                      <div className="font-medium" style={{ color: t.colors.textPrimary }}>
                        {p.brand?.name || "-"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 border-t flex items-center justify-between gap-2" style={{ borderColor: t.colors.borderColor }}>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 border text-xs font-semibold transition cursor-pointer"
                      style={{
                        borderRadius: t.radius.md,
                        borderColor: t.colors.borderColor,
                        background: "white",
                        color: t.colors.primary,
                      }}
                      onClick={() => setSelectedViewId(p._id)}
                    >
                      <LuEye size={14} className="mr-1" />
                      View
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 border text-xs font-semibold transition cursor-pointer"
                      style={{
                        borderRadius: t.radius.md,
                        borderColor: t.colors.borderColor,
                        background: "white",
                        color: t.colors.primary,
                      }}
                      onClick={() => setSelectedEditId(p._id)}
                    >
                      <LuPencil size={14} className="mr-1" />
                      Edit
                    </button>
                  </div>

                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border text-xs font-semibold transition cursor-pointer text-red-600"
                    style={{
                      borderRadius: t.radius.md,
                      borderColor: t.colors.borderColor,
                      background: "white",
                    }}
                    onClick={() => deleteProduct(p._id)}
                  >
                    <LuTrash2 size={14} className="mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ProductsModal
        open={openViewModal}
        productId={selectedViewId}
        getImageUrl={getImageUrl}
        onClose={() => setSelectedViewId(null)}
      />

      <ProductsEditModal
        open={openEditModal}
        productId={selectedEditId}
        categories={categories}
        brands={brands}
        getImageUrl={getImageUrl}
        onClose={() => setSelectedEditId(null)}
        onRefetch={refetchProducts}
      />

    </div>
  );
};

function TabButton({ active, onClick, icon, label }) {
  const t = useTheme();
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 text-sm font-semibold inline-flex items-center gap-2 transition-colors"
      style={{
        borderBottom: `2px solid ${active ? t.colors.primary : t.colors.borderColor}`,
        borderLeft: "none",
        borderRight: "none",
        borderTop: "none",
        background: "transparent",
        color: active ? t.colors.primary : t.colors.textPrimary,
      }}
    >
      {icon}
      {label}
    </button>
  );
}

export default ProductsPage;
