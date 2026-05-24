import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "../../contexts/ThemeContexts";

export default function CustomDropDownEditForm({
    label = "Label",
    icon = null, 
    options = [],
    value,
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
    const shouldScroll = options.length > 4;

    return (
        <div className="w-full md:w-79" ref={wrapRef}>
        {/* Label */}
        <div className="mb-1 flex px-1 items-center gap-1">
            {icon && (
            <span style={{ color: t.colors.primary }}>
                {icon}
            </span>
            )}

            <span
            className="text-xs font-semibold"
            style={{ color: t.colors.primary }}
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
            <span className="text-sm">
                {selected ? selected.label : placeholder}
            </span>
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
                        background:"white",
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
                        <span className="text-sm font-medium">{opt.label}</span>
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
