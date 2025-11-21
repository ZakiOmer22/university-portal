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
import { TrendingUp, Award, Users } from "lucide-react";

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
    "#8B5CF6", // Purple
    "#EC4899", // Pink
];

type TooltipEntry = {
    name?: string;
    value?: number | string;
    color?: string;
};

const CustomTooltip = ({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: TooltipEntry[];
    label?: string;
}) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-200 backdrop-blur-sm">
                <p className="font-bold text-gray-900 mb-3">{label}</p>
                <div className="space-y-2">
                    {payload.map((entry: TooltipEntry, index: number) => (
                        <div key={`tooltip-${index}`} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: entry.color }}
                                />
                                <span className="font-medium text-gray-700">{entry.name}:</span>
                            </div>
                            <span className="font-bold text-gray-900">
                                {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export default function GpaTrendsChart({ data, childrenNames }: GpaTrendsChartProps) {
    // Calculate average GPA for each child
    const childAverages = childrenNames.map(name => {
        const values = data.map(item => {
            const value = item[name];
            return typeof value === 'number' ? value : 0;
        }).filter(val => val > 0);
        
        const average = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
        return { name, average };
    });

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">GPA Trends</h3>
                        <p className="text-gray-600 text-sm">Semester-wise academic performance</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users size={16} />
                    <span>{childrenNames.length} child{childrenNames.length !== 1 ? 'ren' : ''}</span>
                </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    barCategoryGap="15%"
                    barGap={8}
                >
                    <defs>
                        {childrenNames.map((name, idx) => (
                            <linearGradient 
                                id={`colorGrad${idx}`} 
                                key={name} 
                                x1="0" 
                                y1="0" 
                                x2="0" 
                                y2="1"
                            >
                                <stop offset="0%" stopColor={COLORS[idx % COLORS.length]} stopOpacity={0.9} />
                                <stop offset="100%" stopColor={COLORS[idx % COLORS.length]} stopOpacity={0.5} />
                            </linearGradient>
                        ))}
                    </defs>

                    <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke="#f1f5f9" 
                        vertical={false}
                    />
                    <XAxis
                        dataKey="semester"
                        tick={{ fill: "#64748b", fontSize: 12, fontWeight: "500" }}
                        tickLine={false}
                        axisLine={{ stroke: "#cbd5e1" }}
                        padding={{ left: 10, right: 10 }}
                    />
                    <YAxis
                        domain={[0, 4]}
                        tickCount={5}
                        tick={{ fill: "#64748b", fontSize: 12, fontWeight: "500" }}
                        tickLine={false}
                        axisLine={{ stroke: "#cbd5e1" }}
                        tickFormatter={(value) => value.toFixed(1)}
                    />
                    <Tooltip 
                        content={<CustomTooltip />} 
                        cursor={{ fill: "rgba(99,102,241,0.05)" }} 
                    />
                    <Legend 
                        verticalAlign="bottom"
                        height={60}
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ 
                            paddingTop: 20,
                            fontSize: '12px',
                            fontWeight: '500'
                        }}
                    />

                    {childrenNames.map((name, idx) => (
                        <Bar
                            key={name}
                            dataKey={name}
                            fill={`url(#colorGrad${idx})`}
                            radius={[6, 6, 0, 0]}
                            animationDuration={1200}
                            barSize={32}
                        >
                            {data.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    opacity={0.9}
                                />
                            ))}
                        </Bar>
                    ))}
                </BarChart>
            </ResponsiveContainer>

            {/* Performance Summary */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {childAverages.map((child, idx) => (
                    <div key={child.name} className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <div 
                                className="w-2 h-2 rounded-full" 
                                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                            />
                            <span className="text-sm font-medium text-gray-700">{child.name}</span>
                        </div>
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <Award size={16} className="text-yellow-500" />
                            <span className="text-2xl font-bold text-gray-900">
                                {child.average.toFixed(2)}
                            </span>
                        </div>
                        <div className="text-xs text-gray-500">Average GPA</div>
                    </div>
                ))}
            </div>
        </div>
    );
}