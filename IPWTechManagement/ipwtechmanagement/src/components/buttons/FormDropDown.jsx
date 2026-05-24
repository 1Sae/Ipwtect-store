import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "../../contexts/ThemeContexts";

export default function FormDropDown({
    label = "Label",
    icon = null, 
    options = [],
    value,
    productIcon=null,
    categoryIcon=null,
    brandIcon=null,
    onChange,
    placeholder = "Select...",
    }) {
    const t = useTheme();
    const [open, setOpen] = useState(false);
    const wrapRef = useRef(null);

    const selected = useMemo(
        () => options.find((o) => o.value === value),
        [options, value]
    );

    // close on outside click
    useEffect(() => {
        const onDocClick = (e) => {
        if (!wrapRef.current) return;
        if (!wrapRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    const itemHeight = 40;
    const maxVisible = 5;
    const listMaxHeight = itemHeight * maxVisible;
    const shouldScroll = options.length > 3;

    return (
        <div className="w-full md:w-78" ref={wrapRef}>
        {/* Label */}
        <div className="mb-1 flex px-1 items-center gap-1">
            {icon && (
            <span style={{ color: t.colors.primary }}>
                {icon}
            </span>
            )}

            <span
            className="text-xs font-semibold"
            style={{ color: t.colors.textSecondary }}
            >
            {label}
            </span>
        </div>

        {/* Trigger + Menu */}
        <div className="relative">
            <button
            type="button"
            onClick={() => setOpen((p) => !p)}
            className="w-full flex items-center justify-between px-3 py-2 border outline-none cursor-pointer"
            style={{
                borderRadius: t.radius.md,
                borderColor: t.colors.inputBorder,
                background: "white",
                color: t.colors.textPrimary,
            }}
            >
            <div className="flex items-center gap-2"
            style={{ color: t.colors.primary }}
            >
                <span className="text-sm">
                    {icon && value === "Product" && productIcon ? productIcon : value === "Category" && 
                    categoryIcon ? categoryIcon : value === "Brand" && brandIcon ? brandIcon : icon}
                </span>
                <span className="text-sm font-semibold">{selected?.label || placeholder}</span>
            </div>
            <span style={{ color: t.colors.textSecondary }}>▾</span>
            </button>

            {open && (
            <div
                className="absolute left-0 right-0 z-50 mt-2 border shadow-md overflow-hidden"
                style={{
                borderRadius: t.radius.md,
                borderColor: t.colors.borderColor,
                background: t.colors.surface,
                maxHeight: shouldScroll ? listMaxHeight : "none",
                overflowY: shouldScroll ? "auto" : "hidden",
                }}
            >
                {options.map((opt) => {
                const active = opt.value === value;

                return (
                    <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                        onChange?.(opt.value);
                        setOpen(false);
                    }}
                    className="w-full text-left px-3 cursor-pointer"
                    style={{
                        height: itemHeight,
                        background: "white",
                        color: t.colors.textPrimary,
                    }}
                    onMouseEnter={(e) => {
                        if (!active)
                        e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                    }}
                    onMouseLeave={(e) => {
                        if (!active) e.currentTarget.style.background = "white";
                    }}
                    >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500"
                            style={
                                active
                                ? { color: t.colors.primary }
                                : { color: t.colors.textSecondary }
                            }
                            >{opt.label === "Product" ? productIcon : 
                            opt.label === "Category" ? categoryIcon : brandIcon
                            }</span>
                            <span className="text-sm font-medium">{
                                opt.label === "Product" ? "Product" : 
                                opt.label === "Category" ? "Category" : "Brand"
                                }</span>
                            
                        </div>
                        {active && (
                        <span
                            style={{
                            color: t.colors.primary,
                            fontWeight: 700,
                            }}
                        >
                            ✓
                        </span>
                        )}
                    </div>
                    </button>
                );
                })}
            </div>
            )}
        </div>
        </div>
    );
}
