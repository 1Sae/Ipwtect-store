import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "../../contexts/ThemeContexts";
import { createPortal } from "react-dom";

export default function CustomDropdown({
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
    const menuRef = useRef(null);
    const [menuPos, setMenuPos] = useState(null);

    const selected = useMemo(
        () => options.find((o) => o.value === value),
        [options, value]
    );

    // ✅ outside click (portal-safe)
    useEffect(() => {
        const handleClick = (e) => {
        if (
            wrapRef.current?.contains(e.target) ||
            menuRef.current?.contains(e.target)
        )
            return;
        setOpen(false);
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    return (
        <div
        ref={wrapRef}
        className="w-full md:w-48 select-none"
        >
        {/* Label */}
        <div className="mb-1 flex items-center gap-1 px-1">
            {icon && <span style={{ color: t.colors.primary }}>{icon}</span>}
            <span
            className="text-xs font-semibold"
            style={{ color: t.colors.textSecondary }}
            >
            {label}
            </span>
        </div>

        {/* Trigger */}
        <button
            type="button"
            onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setMenuPos({
                top: rect.bottom + 6,
                left: rect.left,
                width: rect.width,
            });
            setOpen((p) => !p);
            }}
            className="
            w-full flex items-center justify-between
            px-3 py-2
            rounded-lg
            border
            cursor-pointer
            transition-all duration-200
            hover:shadow-md hover:-translate-y-0.5
            focus:outline-none
            "
            style={{
            borderColor: t.colors.borderColor,
            background: "white",
            color: t.colors.textPrimary,
            }}
        >
            <span className="text-sm font-medium truncate">
            {selected ? selected.label : placeholder}
            </span>

            <span
            className={`transition-transform duration-200 ${
                open ? "rotate-180" : ""
            }`}
            style={{ color: t.colors.textSecondary }}
            >
            ▾
            </span>
        </button>

        {/* Dropdown menu */}
        {open &&
            menuPos &&
            createPortal(
            <div
                ref={menuRef}
                className="
                fixed z-[9999]
                rounded-xl
                border
                shadow-xl
                animate-[fadeIn_0.15s_ease-out]
                "
                style={{
                top: menuPos.top,
                left: menuPos.left,
                width: menuPos.width,
                borderColor: t.colors.borderColor,
                background: t.colors.surface,
                }}
            >
                {options.map((opt) => {
                const active = opt.value === value;

                return (
                    <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                        onChange(opt.value);
                        setOpen(false);
                    }}
                    className={`
                        w-full flex items-center justify-between
                        px-3 py-2
                        text-sm
                        cursor-pointer
                        transition-all duration-150
                        ${
                        active
                            ? "bg-orange-50 font-semibold"
                            : "hover:bg-gray-50"
                        }
                    `}
                    style={{
                        color: active
                        ? t.colors.primary
                        : t.colors.textPrimary,
                    }}
                    >
                    <span>{opt.label}</span>

                    {active && (
                        <span className="text-orange-500 font-bold">✓</span>
                    )}
                    </button>
                );
                })}
            </div>,
            document.body
            )}
        </div>
    );
}
