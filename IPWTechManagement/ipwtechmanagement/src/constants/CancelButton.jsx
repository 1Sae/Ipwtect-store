import React from "react";
import { useTheme } from "../contexts/ThemeContexts";

export default function CancelButton({
    onClose,
    title = "Close",
    saving = false,
    }) {
    const t = useTheme();

    return (
        <div className="w-full sm:w-32">
        <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="
            w-full
            px-6 py-2
            font-semibold text-white
            cursor-pointer
            rounded-lg

            bg-[linear-gradient(90deg,rgb(0,102,255),rgb(51,133,255),rgb(0,85,204))]
            bg-[length:200%_100%] bg-left
            hover:bg-right

            transition-[background-position] duration-500 ease-out
            hover:opacity-95
            disabled:opacity-60 disabled:cursor-not-allowed
            "
            style={{
            borderRadius: t.radius.md,
            borderColor: t.colors.borderColor,
            }}
        >
            {title}
        </button>
        </div>
    );
}
