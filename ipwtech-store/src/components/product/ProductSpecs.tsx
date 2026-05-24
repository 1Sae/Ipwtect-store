"use client";

import { useTheme } from "@/src/theme/ThemeProvider";

interface Props {
    specs: {
      key: string;
      value: string;
    }[];
  }
  
  export default function ProductSpecs({ specs }: Props) {
    const t = useTheme();
    if (!specs || specs.length === 0) return null;
  
    return (
      <div className="bg-[#0f172a] p-6 rounded-xl border border-white/10">
  
        <h2 className="font-semibold mb-4 underline"
        style={{
          color: t.colors.primary,
          fontSize: t.typography.h3
        }}
        >
          Specifications
        </h2>
  
        <div className="flex flex-col gap-3">
  
          {specs.map((spec, i) => (
            <div
              key={i}
              className="flex justify-between border-b border-white/10 pb-2"
            >
              <span className="font-medium" style={{ color: t.colors.primary , fontSize: t.typography.h4 }}>{spec.key}</span>
              <span className="font-normal" style={{ color: t.colors.textPrimary , fontSize: t.typography.h4 }}>
                {spec.value}
              </span>
            </div>
          ))}
  
        </div>
  
      </div>
    );
  }