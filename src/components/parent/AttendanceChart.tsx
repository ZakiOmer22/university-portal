import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { TrendingUp, Users } from "lucide-react";

interface AttendanceDataPoint {
    semester: string;
    [childName: string]: number | string;
}

interface AttendanceTrendsChartProps {
    data: AttendanceDataPoint[];
    childrenNames: string[];
}

const COLORS = [
    "#2563EB", // Blue
    "#16A34A", // Green
    "#DC2626", // Red
    "#D97706", // Amber
    "#7C3AED", // Purple
    "#DB2777", // Pink
];

const CustomTooltip = ({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: Array<{ name?: string; value?: number | string; color?: string }>;
    label?: string;
}) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-200 backdrop-blur-sm">
                <p className="font-bold text-gray-900 mb-2">{label}</p>
                <div className="space-y-1">
                    {payload.map((entry: { name?: string; value?: number | string; color?: string }, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                            <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="font-medium text-gray-700">{entry.name}:</span>
                            <span className="font-bold text-gray-900">{entry.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export default function AttendanceTrendsChart({
    data,
    childrenNames,
}: AttendanceTrendsChartProps) {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">
                            Attendance Trends
                        </h3>
                        <p className="text-gray-600 text-sm">Semester-wise attendance percentage</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users size={16} />
                    <span>{childrenNames.length} child{childrenNames.length !== 1 ? 'ren' : ''}</span>
                </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={400}>
                <LineChart 
                    data={data} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
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
                        domain={[0, 100]}
                        tickCount={6}
                        tick={{ fill: "#64748b", fontSize: 12, fontWeight: "500" }}
                        tickLine={false}
                        axisLine={{ stroke: "#cbd5e1" }}
                        tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                        content={<CustomTooltip />} 
                        cursor={{ 
                            stroke: "#e2e8f0", 
                            strokeWidth: 1,
                            strokeDasharray: "4 4"
                        }} 
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
                        <Line
                            key={name}
                            type="monotone"
                            dataKey={name}
                            stroke={COLORS[idx % COLORS.length]}
                            strokeWidth={3}
                            dot={{ 
                                r: 4, 
                                strokeWidth: 2,
                                stroke: COLORS[idx % COLORS.length],
                                fill: "white"
                            }}
                            activeDot={{ 
                                r: 6, 
                                strokeWidth: 2,
                                stroke: "white"
                            }}
                            animationDuration={1500}
                            strokeLinecap="round"
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>

            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {childrenNames.map((name, idx) => {
                    const latestData = data[data.length - 1];
                    const latestValue = latestData ? latestData[name] : 0;
                    return (
                        <div key={name} className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <div 
                                    className="w-2 h-2 rounded-full" 
                                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                />
                                <span className="text-sm font-medium text-gray-700">{name}</span>
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                                {typeof latestValue === 'number' ? `${latestValue}%` : 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500">Current</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}