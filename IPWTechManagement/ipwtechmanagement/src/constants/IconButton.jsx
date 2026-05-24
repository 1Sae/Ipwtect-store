import React from 'react'
import { useTheme } from "../contexts/ThemeContexts";
export default function IconButton({ onClick, children }) {
    const t = useTheme();
    return (
        <button
            type="button"
            onClick={onClick}
            className="
            cursor-pointer
            h-10 w-10
            flex items-center justify-center
            rounded-md
            border
            bg-white
            hover:bg-gray-100
            transition-colors
            "
            style={{
                borderColor: t.colors.borderColor,
                background: t.colors.surface,
                color: t.colors.secondary,
                fontSize: t.typography.h2,
            }}
        >
            {children}
        </button>
    );
}