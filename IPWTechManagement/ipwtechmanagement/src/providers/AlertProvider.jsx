import { createContext, useContext, useState, useCallback } from "react";

const AlertContext = createContext(null);

export const useAlert = () => useContext(AlertContext);

export default function AlertProvider({ children }) {
    const [alert, setAlert] = useState(null);

    const showAlert = useCallback((type, message) => {
        setAlert({ type, message });
    }, []);

    const hideAlert = useCallback(() => {
        setAlert(null);
    }, []);

    return (
        <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
            {children}
        </AlertContext.Provider>
    );
}
