import { useEffect, useState } from "react";
import { useAlert } from "../../providers/AlertProvider";
import { useTheme } from "../../contexts/ThemeContexts";

export default function Alert() {
    const { alert, hideAlert } = useAlert();
    const t = useTheme();

    const [exit, setExit] = useState(false);

    useEffect(() => {
        if (!alert) return;

        setExit(false);

        const startExit = setTimeout(() => {
            setExit(true);
        }, 3000);

        const remove = setTimeout(() => {
            hideAlert();
        }, 3600); // must be > animation duration

        return () => {
            clearTimeout(startExit);
            clearTimeout(remove);
        };
    }, [alert, hideAlert]);

    if (!alert) return null;

    const colors = {
        success: t.colors.primary,
        error: t.colors.danger,
        warning: t.colors.warning,
        info: t.colors.info,
    };

    return (
        <div
            className="fixed top-6 right-6 z-50 min-w-[280px] px-4 py-3 shadow-lg"
            style={{
                background: t.colors.surface,
                borderLeft: `4px solid ${colors[alert.type]}`,
                borderRadius: t.radius.md,
                color: t.colors.textPrimary,

                transform: exit ? "translateX(140%)" : "translateX(0)",
                transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
            }}
        >
            <div className="flex items-start justify-between gap-3">
                <p className="text-sm">{alert.message}</p>

                <button
                    onClick={() => setExit(true)}
                    className="text-sm font-bold"
                    style={{ color: colors[alert.type] }}
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
