"use client";

import { useEffect, useState } from "react";
import { FiArrowDown, FiChevronDown, FiFilter, FiX } from "react-icons/fi";
import { useShop } from "@/src/context/ShopContext";
import { getBrands } from "@/src/services/brandService";
import { getCategories } from "@/src/services/categoryService";
import { Brand } from "@/src/types/brand";
import { Category } from "@/src/types/category";
import { useTheme } from "@/src/theme/ThemeProvider";
import { getSpecifications } from "@/src/services/shopService";

export default function ShopSidebar() {
    const t = useTheme();
    const { filters, setFilters } = useShop();

    const [specs, setSpecs] = useState<any[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingSpecs, setLoadingSpecs] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [listOpen, setListOpen] = useState({
        category: false,
        brand: false,
        specs: true,
        price: true,
    });
    const [priceRange, setPriceRange] = useState({
        min: 0,
        max: 20000, 
    });
    const presetRanges = [
        "1-200",
        "200-500",
        "500-1000",
        "1000-2000",
        "2000-3000",
        "3000-5000",
        "5000-7000",
        "7000-10000",
    ];

    const clearAllFilters = () => {
        setFilters({
            categoryName: "",
            brandName: "",
            minPrice: 0,
            maxPrice: 20000,
        });
    };
    useEffect(() => {
        const fetch = async () => {
        const brandData = await getBrands();
        const categoryData = await getCategories();

        setBrands(brandData);
        setCategories(categoryData);
        };

        fetch();
    }, []);

    useEffect(() => {
        if (!filters.categoryName && !filters.brandName) {
        setSpecs([]);
        return;
        }

        const fetchSpecs = async () => {
        setLoadingSpecs(true);

        const data = await getSpecifications({
            categoryName: filters.categoryName,
            brandName: filters.brandName,
        });

        setSpecs(data);
        setLoadingSpecs(false);
        };

        fetchSpecs();
    }, [filters.categoryName, filters.brandName]);

    useEffect(() => {
        setFilters((prev) => ({
            ...prev,
            minPrice: priceRange.min,
            maxPrice: priceRange.max,
        }));
    }, [priceRange]);

    const sidebarContent = (
        <div
        className="rounded-2xl p-6 max-h-screen overflow-y-auto border custom-scrollbar"
        style={{
            background: t.colors.headerBg,
            borderColor: t.colors.bodyBg,
        }}
        >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
            <h2
            className="font-bold uppercase"
            style={{
                color: t.colors.primary,
                fontSize: t.typography.h4,
            }}
            >
            Filters
            </h2>

            <button
            onClick={() => setMobileOpen(false)}
            className="mobile-filters-button text-xl cursor-pointer"
            style={{ color: t.colors.primary }}
            aria-label="Close filters"
            >
            <FiX />
            </button>
        </div>

        {/* CATEGORY FILTER */}
        <div className="mb-8 p-2 rounded-xl" style={{ backgroundColor: t.colors.secondBackground }}>
        <div className="flex items-center justify-between mb-2">
            <h3
            className="text-sm font-semibold"
            style={{ color: t.colors.primary }}
            >
            Category
            </h3>

            <button
            type="button"
            className="text-xs font-semibold transition-all duration-300 cursor-pointer"
            style={{ color: t.colors.primary }}
            onClick={() =>
                setListOpen((prev) => ({
                ...prev,
                category: !prev.category,
                }))
            }
            >
            <FiChevronDown
                size={20}
                className={`transition-transform duration-300 ${
                listOpen.category ? "rotate-180" : ""
                }`}
            />
            </button>
        </div>

        <div
            className={`transition-all duration-300 overflow-hidden ${
            listOpen.category ? "max-h-[260px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
            <div
            className="
                flex flex-col gap-2
                overflow-y-auto
                pr-2
                max-h-[260px]
                rounded-xl
            "
            style={{
                scrollbarWidth: "thin",
            }}
            >
            {categories.map((cat) => (
                <label
                key={cat._id}
                className="
                    flex items-center gap-2 text-sm cursor-pointer font-semibold
                    min-h-[36px] px-2 py-1 rounded-lg
                    hover:bg-white/5 transition-colors
                "
                style={{ color: t.colors.textPrimary }}
                >
                <input
                    type="checkbox"
                    style={{
                    accentColor: "var(--primary)",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                    width: "14px",
                    height: "14px",
                    flexShrink: 0,
                    }}
                    checked={filters.categoryName === cat.name}
                    onChange={() =>
                    setFilters((prev) => ({
                        ...prev,
                        categoryName: prev.categoryName === cat.name ? "" : cat.name,
                        specs: {},
                    }))
                    }
                />
                <span className="truncate">{cat.name}</span>
                </label>
            ))}
            </div>
        </div>
        </div>

        {/* BRAND FILTER */}
        <div className="mb-8 p-2 rounded-xl" style={{ backgroundColor: t.colors.secondBackground }}>
        <div className="flex items-center justify-between mb-2">
            <h3
            className="text-sm font-semibold"
            style={{ color: t.colors.primary }}
            >
            Brand
            </h3>

            <button
            type="button"
            className="text-xs font-semibold transition-all duration-300 cursor-pointer"
            style={{ color: t.colors.primary }}
            onClick={() =>
                setListOpen((prev) => ({
                ...prev,
                brand: !prev.brand,
                }))
            }
            >
            <FiChevronDown
                size={20}
                className={`transition-transform duration-300 ${
                listOpen.brand ? "rotate-180" : ""
                }`}
            />
            </button>
        </div>

        <div
            className={`transition-all duration-300 overflow-hidden ${
            listOpen.brand ? "max-h-[260px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
            <div
            className="
                brand-scroll
                flex flex-col gap-2
                overflow-y-auto
                pr-2
                max-h-[260px]
                rounded-xl
            "
            style={{ scrollbarWidth: "thin" }}
            >
            {brands.map((brand) => (
                <label
                key={brand._id}
                className="
                    flex items-center gap-2 text-sm cursor-pointer font-semibold
                    min-h-[36px] px-2 py-1 rounded-lg
                    hover:bg-white/5 transition-colors
                "
                style={{ color: t.colors.textPrimary }}
                >
                <input
                    type="checkbox"
                    style={{
                    accentColor: "var(--primary)",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                    width: "14px",
                    height: "14px",
                    flexShrink: 0,
                    }}
                    checked={filters.brandName === brand.name}
                    onChange={() =>
                    setFilters((prev) => ({
                        ...prev,
                        brandName: prev.brandName === brand.name ? "" : brand.name,
                        specs: {},
                    }))
                    }
                />
                <span className="truncate">{brand.name}</span>
                </label>
            ))}
            </div>
        </div>
        </div>

        {/* SPECIFICATIONS FILTER */}
        {(filters.categoryName || filters.brandName) && (
        <div className="mt-8 p-2 rounded-xl" style={{ backgroundColor: t.colors.secondBackground }}>
            <div className="flex items-center justify-between mb-2">
            <h3
                className="text-sm font-semibold"
                style={{ color: t.colors.primary }}
            >
                Specifications
            </h3>

            <button
                type="button"
                className="text-xs font-semibold transition-all duration-300 cursor-pointer"
                style={{ color: t.colors.primary }}
                onClick={() =>
                setListOpen((prev) => ({
                    ...prev,
                    specs: !prev.specs,
                }))
                }
            >
                <FiChevronDown
                size={20}
                className={`transition-transform duration-300 ${
                    listOpen.specs ? "rotate-180" : ""
                }`}
                />
            </button>
            </div>

            <div
            className={`transition-all duration-300 overflow-hidden ${
                listOpen.specs ? "max-h-[380px] opacity-100" : "max-h-0 opacity-0"
            }`}
            >
            <div
                className="specs-scroll overflow-y-auto max-h-[380px] pr-2 rounded-xl"
                style={{ scrollbarWidth: "thin" }}
            >
                {loadingSpecs ? (
                <div className="flex flex-col gap-5 py-1">
                    {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="rounded-xl px-2 py-1">
                        <div className="h-4 w-32 rounded-md bg-white/10 animate-pulse mb-3" />

                        <div className="flex flex-col gap-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                            key={i}
                            className="flex items-center gap-2 px-2 py-1 min-h-[36px] rounded-lg"
                            >
                            <div className="w-[14px] h-[14px] rounded-[4px] bg-white/10 animate-pulse shrink-0" />
                            <div className="h-3 w-28 rounded-md bg-white/10 animate-pulse" />
                            </div>
                        ))}
                        </div>
                    </div>
                    ))}
                </div>
                ) : specs.length > 0 ? (
                <div className="flex flex-col gap-1">
                    {specs.map((spec) => (
                    <div key={spec.key} className="rounded-xl px-2 py-1">
                        <h4
                        className="text-sm font-semibold mb-1 sticky top-0 z-10 py-1"
                        style={{
                            color: t.colors.primaryHover,
                            background: t.colors.secondBackground || "rgba(15, 23, 42, 0.95)",
                        }}
                        >
                        {spec.key}
                        </h4>

                        <div className="flex flex-col gap-0.5">
                        {spec.values.map((value: string) => {
                            const selected = filters.specs?.[spec.key]?.includes(value);

                            return (
                            <label
                                key={value}
                                className="
                                flex items-center gap-2 text-sm cursor-pointer font-semibold
                                min-h-[36px] px-2 py-1 rounded-lg
                                hover:bg-white/5 transition-colors
                                "
                                style={{ color: t.colors.textPrimary }}
                            >
                                <input
                                type="checkbox"
                                style={{
                                    accentColor: "var(--primary)",
                                    color: "var(--text-primary)",
                                    cursor: "pointer",
                                    width: "14px",
                                    height: "14px",
                                    flexShrink: 0,
                                }}
                                checked={selected || false}
                                onChange={() => {
                                    setFilters((prev) => {
                                    const existing = prev.specs?.[spec.key] || [];
                                    let updated: string[];

                                    if (existing.includes(value)) {
                                        updated = existing.filter((v) => v !== value);
                                    } else {
                                        updated = [...existing, value];
                                    }

                                    const newSpecs = { ...prev.specs };

                                    if (updated.length === 0) {
                                        delete newSpecs[spec.key];
                                    } else {
                                        newSpecs[spec.key] = updated;
                                    }

                                    return {
                                        ...prev,
                                        specs: newSpecs,
                                    };
                                    });
                                }}
                                />
                                <span className="truncate">{value}</span>
                            </label>
                            );
                        })}
                        </div>
                    </div>
                    ))}
                </div>
                ) : (
                <p className="text-sm py-2" style={{ color: t.colors.textLight }}>
                    No specifications found.
                </p>
                )}
            </div>
            </div>
        </div>
        )}

        {/* price chooser, min and max inputs entered by user and option to choose with (0-200, 200-500, 500-1000 ....) */}
        <div
        className="mt-4 p-3 rounded-xl"
        style={{ backgroundColor: t.colors.secondBackground }}
        >
        <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center gap-2">
            <span
                className="text-sm font-semibold"
                style={{ color: t.colors.primary }}
            >
                Price
            </span>

            <button
                type="button"
                className="text-sm font-semibold cursor-pointer transition-all duration-300 hover:scale-105"
                style={{ color: t.colors.primary }}
                onClick={() => setPriceRange({ min: 0, max: 20000 })}
            >
                clear
            </button>
            </div>

            <div className="flex items-center gap-3">
            {/* MIN */}
            <div
                className="flex items-center rounded-xl px-2 py-1 w-full"
                style={{
                backgroundColor: t.colors.bodyBg,
                border: "1px solid rgba(255,122,0,0.3)",
                }}
            >
                <button
                type="button"
                onClick={() =>
                    setPriceRange((prev) => ({
                    ...prev,
                    min: Math.max(0, prev.min - 50),
                    }))
                }
                className="w-7 h-7 flex items-center justify-center rounded-md text-lg font-bold hover:scale-105 transition"
                style={{ color: t.colors.primary }}
                >
                -
                </button>

                <input
                type="number"
                min={0}
                max={priceRange.max}
                step={50}
                value={priceRange.min}
                onChange={(e) => {
                    const value = Number(e.target.value);
                    setPriceRange((prev) => ({
                    ...prev,
                    min: Math.max(0, Math.min(value, prev.max)),
                    }));
                }}
                className="w-full text-center bg-transparent outline-none border-none font-semibold text-sm"
                style={{ color: t.colors.primary }}
                />

                <button
                type="button"
                onClick={() =>
                    setPriceRange((prev) => ({
                    ...prev,
                    min: Math.min(prev.max, prev.min + 50),
                    }))
                }
                className="w-7 h-7 flex items-center justify-center rounded-md text-lg font-bold hover:scale-105 transition"
                style={{ color: t.colors.primary }}
                >
                +
                </button>
            </div>

            <span
                className="text-xs font-semibold"
                style={{ color: t.colors.primary }}
            >
                -
            </span>

            {/* MAX */}
            <div
                className="flex items-center rounded-xl px-2 py-1 w-full gap-1"
                style={{
                backgroundColor: t.colors.bodyBg,
                border: "1px solid rgba(255,122,0,0.3)",
                }}
            >
                <button
                type="button"
                onClick={() =>
                    setPriceRange((prev) => ({
                    ...prev,
                    max: Math.max(prev.min, prev.max - 50),
                    }))
                }
                className="w-7 h-7 flex items-center justify-center rounded-md text-lg font-bold hover:scale-105 transition"
                style={{ color: t.colors.primary }}
                >
                -
                </button>

                <input
                type="number"
                min={priceRange.min}
                max={20000}
                step={50}
                value={priceRange.max}
                onChange={(e) => {
                    const value = Number(e.target.value);
                    setPriceRange((prev) => ({
                    ...prev,
                    max: Math.min(10000, Math.max(value, prev.min)),
                    }));
                }}
                className="w-full text-center p-1 bg-transparent outline-none border-none font-semibold text-sm min-w-6"
                style={{ color: t.colors.primary }}
                />

                <button
                type="button"
                onClick={() =>
                    setPriceRange((prev) => ({
                    ...prev,
                    max: Math.min(20000, prev.max + 50),
                    }))
                }
                className="w-7 h-7 flex items-center justify-center rounded-md text-lg font-bold hover:scale-105 transition"
                style={{ color: t.colors.primary }}
                >
                +
                </button>
            </div>
            </div>

            {/* Preset ranges */}
            <div className="grid grid-cols-2 gap-2 mt-2">
            {presetRanges.map((range) => {
                const [min, max] = range.split("-").map(Number);

                return (
                <button
                    key={range}
                    type="button"
                    onClick={() => setPriceRange({ min, max })}
                    className="text-xs font-semibold cursor-pointer rounded-lg px-3 py-2 hover:bg-white/10 transition-colors"
                    style={{
                    color: t.colors.primary,
                    backgroundColor: t.colors.bodyBg,
                    border: "1px solid rgba(255,122,0,0.2)",
                    }}
                >
                    {range}
                </button>
                );
            })}
            </div>
        </div>
        </div>

        {/* Clear all filters button */}
        <div className="mt-6">
            <button
            type="button"
            onClick={clearAllFilters}
            className="w-full py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-300 hover:scale-105"
            style={{
                background: t.colors.primary,
                boxShadow: t.shadow.button,
                color: t.colors.surface,
            }}
            >
            Clear
            </button>
        </div>
        </div>
    );

    return (
    <>
        {/* Mobile button */}
        <div className="mobile-filters-button">
        <button
            onClick={() => setMobileOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold"
            style={{
            background: t.colors.headerBg,
            borderColor: t.colors.bodyBg,
            color: t.colors.primary,
            }}
        >
            <FiFilter />
            Open Filters
        </button>
        </div>

        {/* Desktop sidebar */}
        <div className="desktop-sidebar">
        {sidebarContent}
        </div>

        {/* Mobile drawer */}
        <div
            className={`mobile-filters-button fixed inset-0 z-[120] transition-all duration-300 ${
            mobileOpen ? "pointer-events-auto" : "pointer-events-none"
            }`}
        >
            {/* Overlay */}
            <div
            onClick={() => setMobileOpen(false)}
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
                mobileOpen ? "opacity-100" : "opacity-0"
            }`}
            />

            {/* Drawer */}
            <div
            className={`absolute top-0 left-0 h-full w-[88%] max-w-[320px] p-4 transition-transform duration-300 ease-in-out ${
                mobileOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            style={{
                background: "linear-gradient(160deg, #111827, #1f2937)",
            }}
            >
            <div
                className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-30 blur-3xl"
                style={{ background: "#ff6a00" }}
            />
            <div className="relative z-10 h-full">{sidebarContent}</div>
            </div>
        </div>
        </>
    );
}