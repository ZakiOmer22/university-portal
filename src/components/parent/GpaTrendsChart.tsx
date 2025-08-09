import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    CartesianGrid,
    Cell,
} from "recharts";

interface GpaDataPoint {
    semester: string;
    [childName: string]: number | string;
}

interface GpaTrendsChartProps {
    data: GpaDataPoint[];
    childrenNames: string[];
}

const COLORS = [
    "#4F46E5", // Indigo
    "#10B981", // Emerald green
    "#EF4444", // Red
    "#F59E0B", // Amber
];

// Custom Tooltip with GPA value and styling
const CustomTooltip = ({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: any;
    label?: string;
}) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded shadow-lg border border-gray-200">
                <p className="font-semibold text-gray-700">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={`tooltip-${index}`} style={{ color: entry.color }}>
                        <span className="font-bold">{entry.name}: </span>
                        {entry.value.toFixed(2)}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function GpaTrendsChart({ data, childrenNames }: GpaTrendsChartProps) {
    return (
        <div className="bg-white rounded-lg p-6 shadow-lg mt-8">
            <h3 className="text-xl font-semibold mb-6 text-indigo-900">GPA Trends by Semester</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                    barCategoryGap="20%"
                >
                    <defs>
                        {childrenNames.map((name, idx) => (
                            <linearGradient id={`colorGrad${idx}`} key={name} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={COLORS[idx % COLORS.length]} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={COLORS[idx % COLORS.length]} stopOpacity={0.3} />
                            </linearGradient>
                        ))}
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis
                        dataKey="semester"
                        tick={{ fill: "#4B5563", fontWeight: "600" }}
                        tickLine={false}
                        axisLine={{ stroke: "#6366F1" }}
                        padding={{ left: 20, right: 20 }}
                    />
                    <YAxis
                        domain={[0, 4]}
                        tickCount={5}
                        tick={{ fill: "#4B5563", fontWeight: "600" }}
                        tickLine={false}
                        axisLine={{ stroke: "#6366F1" }}
                        label={{
                            value: "GPA",
                            angle: -90,
                            position: "insideLeft",
                            offset: 10,
                            fill: "#4B5563",
                            fontWeight: "700",
                        }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.1)" }} />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: 10 }} />

                    {childrenNames.map((name, idx) => (
                        <Bar
                            key={name}
                            dataKey={name}
                            fill={`url(#colorGrad${idx})`}
                            radius={[8, 8, 0, 0]}
                            animationDuration={800}
                            barSize={36}
                            onMouseOver={(e) => {
                                // Optional: add interactivity if needed
                            }}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} />
                            ))}
                        </Bar>
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}