import React, { useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContexts";
import logo from "../../assets/logo.png";

const BrandLoader = () => {
    const t = useTheme();


    return (
        <div className="w-full h-full min-h-[200px] flex items-center justify-center">
        <div
            className="w-13 h-13 border-3 flex items-center justify-center rounded-full animate-spin"
            style={{
            borderColor: t.colors.borderColor,
            borderTopColor: t.colors.primary,
            }}
        >
            <img
            src={logo}
            alt="Loading"
            className="w-9 h-9 object-contain animate-pulse"
            />
        </div>
        </div>
    );
};

export default BrandLoader;
