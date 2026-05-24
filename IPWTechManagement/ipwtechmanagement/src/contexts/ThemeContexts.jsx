import React, { createContext, useContext } from "react";
import { theme } from "../constants/theme";

const ThemeContext = createContext(theme);

export const AppThemeProvider = ({ children }) => {
    return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
