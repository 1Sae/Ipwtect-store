"use client";

import { useShop } from "@/src/context/ShopContext";
import { useTheme } from "@/src/theme/ThemeProvider";

export default function ActiveFilters() {
    const { filters, setFilters } = useShop();
    const t = useTheme();

    const removeCategory = () => {
        setFilters(prev => ({
            ...prev,
            categoryName: "",
            specs: {}
        }));
    };

    const removeBrand = () => {
        setFilters(prev => ({
            ...prev,
            brandName: "",
            specs: {}
        }));
    };

    const removeSpec = (key: string, value: string) => {
        setFilters(prev => {

            const updated = prev.specs?.[key]?.filter(v => v !== value) || [];

            const newSpecs = { ...prev.specs };

            if (updated.length === 0) {
                delete newSpecs[key];
            } else {
                newSpecs[key] = updated;
            }

            return {
                ...prev,
                specs: newSpecs
            };
        });
    };

    const chips: { label: string; remove: () => void }[] = [];

    if (filters.categoryName) {
        chips.push({
            label: filters.categoryName,
            remove: removeCategory
        });
    }

    if (filters.brandName) {
        chips.push({
            label: filters.brandName,
            remove: removeBrand
        });
    }

    if (filters.specs) {
        Object.entries(filters.specs).forEach(([key, values]) => {
            values.forEach(value => {
                chips.push({
                    label: `${key}: ${value}`,
                    remove: () => removeSpec(key, value)
                });
            });
        });
    }

    if (chips.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 mb-6 cursor-pointer">

            {chips.map((chip, index) => (
                <button
                    key={index}
                    onClick={chip.remove}
                    className="
                        flex
                        items-center
                        gap-2
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        border
                        border-2
                        hover:opacity-80
                        transition
                        cursor-pointer
                        font-semibold
                    "
                    style={{
                        borderColor: t.colors.primary,
                        color: t.colors.primary
                    }}
                >
                    {chip.label} ✕
                </button>
            ))}

        </div>
    );
}