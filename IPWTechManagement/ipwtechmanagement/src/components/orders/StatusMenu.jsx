import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  LuTruck,
  LuLoader,
  LuClock,
  LuX,
} from "react-icons/lu";
import { useTheme } from "../../contexts/ThemeContexts";

const STATUS_ICONS = {
  Pending: LuClock,
  Processing: LuLoader,
  Shipped: LuTruck,
  Delivered: LuTruck,
  Cancelled: LuX,
};

export default function StatusMenu({
  orderId,
  currentStatus,
  onChange,
  onClose,
  STATUS_CONFIG,
  style,
}) {
  const ref = useRef(null);
  const t = useTheme();

  /* 🔒 Close on outside click */
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return createPortal(
    <div
      ref={ref}
      className="
        fixed
        z-[99999]
        w-56
        rounded-xl
        bg-white
        shadow-2xl
        overflow-hidden
        animate-in fade-in zoom-in-95
      "
      style={{
        ...style,
        pointerEvents: "auto",
      }}
    >
      {/* ===== HEADER ===== */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: t.colors.primary }}
      >
        <span
          className="text-sm font-semibold"
          style={{ color: t.colors.primary }}
        >
          Update Status
        </span>

        <button
          onClick={onClose}
          className="p-1 rounded-md cursor-pointer hover:bg-gray-100"
        >
          <LuX size={14} />
        </button>
      </div>

      {/* ===== STATUS LIST ===== */}
      <div className="py-1">
        {Object.entries(STATUS_CONFIG)
          .filter(([key]) => key !== "default")
          .map(([key, cfg]) => {
            const Icon = STATUS_ICONS[key];
            const isActive = key === currentStatus;

            return (
              <button
                key={key}
                onClick={() => onChange(orderId, key)}
                className={`
                  w-full flex items-center gap-3
                  px-4 py-2.5 text-sm font-semibold
                  transition cursor-pointer
                  ${
                    isActive
                      ? "bg-gray-100"
                      : "hover:bg-gray-50"
                  }
                `}
              >
                {/* ICON */}
                <span
                  className={`
                    w-8 h-8 rounded-lg
                    flex items-center justify-center
                    ${cfg.textClass}
                  `}
                  style={{ background: cfg.bgColor }}
                >
                  {Icon && <Icon size={16} />}
                </span>

                {/* LABEL */}
                <div className="flex flex-col text-left">
                  <span className={cfg.textClass}>
                    {cfg.label}
                  </span>

                  {isActive && (
                    <span className="text-xs text-gray-400">
                      Current status
                    </span>
                  )}
                </div>
              </button>
            );
          })}
      </div>
    </div>,
    document.body
  );
}
