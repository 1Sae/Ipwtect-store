import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { useTheme } from "../../contexts/ThemeContexts";
import { useState } from "react";

const RANGE_MAP = {
    today: "Today",
    last7Days: "Last 7 Days",
    last30Days: "Last 30 Days",
};

export default function AnalyticsChartCard({
    dataSource,
    title,
    subtitle,
    icon: Icon,
    emptyText = "No data",
    tooltipLabel,
    color = "#fb923c",
}) {
    const t = useTheme();
    const [range, setRange] = useState("today");

    const data = (dataSource?.[range] ?? []).map(d => ({
        ...d,
        date: new Date(d.label), // REAL date
    }));
    

    return (
        <div
            className="rounded-3xl p-6 shadow-xl"
            style={{
            background: `linear-gradient(180deg, ${t.colors.surface}, #fff)`,
            border: `1px solid ${t.colors.borderColor}`,
            }}
        >
            {/* ===== HEADER ===== */}
            <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${color}22` }}
                >
                <Icon size={20} style={{ color }} />
                </div>
    
                <div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500">{subtitle}</p>
                </div>
            </div>
    
            {/* RANGE SWITCH */}
            <div
                className="flex p-1 rounded-full"
                style={{
                background: "linear-gradient(135deg,#fff,#f9fafb)",
                border: `1px solid ${t.colors.borderColor}`,
                }}
            >
                {Object.keys(RANGE_MAP).map((key) => (
                <button
                    key={key}
                    onClick={() => setRange(key)}
                    className={`
                    px-4 py-1.5 text-sm font-semibold rounded-full transition-all
                    ${
                        range === key
                        ? "text-white shadow-md"
                        : "hover:bg-gray-100"
                    }
                    `}
                    style={{
                    background: range === key ? color : "transparent",
                    color: range === key ? "#fff" : color,
                    }}
                >
                    {RANGE_MAP[key]}
                </button>
                ))}
            </div>
            </div>
    
            {/* ===== CHART ===== */}
            <div className="h-[280px]">
            {data.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm font-semibold text-gray-400">
                {emptyText}
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <defs>
                    <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.6} />
                        <stop offset="100%" stopColor={color} stopOpacity={0.05} />
                    </linearGradient>
                    </defs>
    
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis
                    dataKey="date"
                    scale="time"
                    type="number"
                    tick={{ fill: t.colors.textSecondary, fontSize: 11 }}
                    domain={["dataMin", "dataMax"]}
                    tickFormatter={(d) =>
                        new Date(d).toLocaleDateString()
                    }
                    />

                    <YAxis
                    tick={{ fill: t.colors.textSecondary, fontSize: 11 }}
                    />
                    <Tooltip
                    formatter={(v) => [v.toLocaleString(), tooltipLabel]}
                    contentStyle={{
                        borderRadius: 12,
                        border: "none",
                        boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                    }}
                    />
    
                    <Line
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={3}
                    dot={{ r: 4, fill: color }}
                    activeDot={{ r: 6 }}
                    fill={`url(#gradient-${title})`}
                    />
                </LineChart>
                </ResponsiveContainer>
            )}
            </div>
        </div>
    );
}  