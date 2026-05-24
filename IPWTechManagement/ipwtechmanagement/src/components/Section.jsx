import React from 'react'
import { useTheme } from '../contexts/ThemeContexts';

const Section = ({ title, children, className = "" }) => {
    const t = useTheme();
        return (
        <div
            className={`border px-4 py-4 ${className}`}
            style={{
            borderColor: t.colors.borderColor,
            borderRadius: t.radius.md,
            background: "white",
            }}
        >
            <div className="text-xs font-semibold mb-3" style={{ color: t.colors.primary }}>
            {title}
            </div>
            {children}
        </div>
        );
}

export default Section