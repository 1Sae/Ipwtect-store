"use client";

import { createContext, useContext, useEffect } from "react";
import { theme } from "./theme";

const ThemeContext = createContext(theme);

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({
    children,
}: {
    children: React.ReactNode;
}) {

  // Inject theme values into CSS variables
    useEffect(() => {
        const root = document.documentElement;

        Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
        });
    }, []);

    return (
        <ThemeContext.Provider value={theme}>
        {children}
        </ThemeContext.Provider>
    );
}
