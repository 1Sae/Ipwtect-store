"use client";

import { useTheme } from "@/src/theme/ThemeProvider";

interface Props {
    desc: string;
}

export default function AboutProduct({ desc }: Props) {
        const t = useTheme();
    
        return (
        <div className="bg-[#0f172a] p-6 rounded-xl border border-white/10">
    
            <h2 className="font-semibold mb-4 underline"
            style={{
            color: t.colors.primary,
            fontSize: t.typography.h3
            }}
            >
            About The Product
            </h2>
    
            <div className="flex flex-col gap-3">
                <p style={{ color: t.colors.textPrimary , fontSize: t.typography.h4 }}>
                    {desc}
                </p>
            </div>
    
        </div>
    );
}