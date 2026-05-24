import React from 'react'
import { useTheme } from "../contexts/ThemeContexts";
export default function IconButton2({ onClick, children }) {
    const t = useTheme();
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
            cursor-pointer
            h-10 w-10
            flex items-center justify-center
            rounded-md
            transition-colors
            `}
            style={{
                fontSize: t.typography.h2,
            }}
        >
            {children}
        </button>
    );
}