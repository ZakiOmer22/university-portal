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
];

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
            <div className="bg-white p-3 rounded shadow border border-gray-200">
                <p className="font-semibold text-gray-700">{label}</p>
                {payload.map((entry: any, idx: number) => (
                    <p key={idx} style={{ color: entry.color }}>
                        <span className="font-bold">{entry.name}: </span>
                        {entry.value}%
                    </p>
                ))}
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
        <div className="bg-white rounded-lg p-6 shadow-lg mt-8">
            <h3 className="text-xl font-semibold mb-6 text-indigo-900">
                Attendance Trends by Semester
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis
                        dataKey="semester"
                        tick={{ fill: "#4B5563", fontWeight: "600" }}
                        tickLine={false}
                        axisLine={{ stroke: "#6366F1" }}
                        padding={{ left: 20, right: 20 }}
                    />
                    <YAxis
                        domain={[0, 100]}
                        tickCount={6}
                        tick={{ fill: "#4B5563", fontWeight: "600" }}
                        tickLine={false}
                        axisLine={{ stroke: "#6366F1" }}
                        label={{
                            value: "Attendance %",
                            angle: -90,
                            position: "insideLeft",
                            offset: 10,
                            fill: "#4B5563",
                            fontWeight: "700",
                        }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#6366F1", strokeWidth: 2 }} />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: 10 }} />
                    {childrenNames.map((name, idx) => (
                        <Line
                            key={name}
                            type="monotone"
                            dataKey={name}
                            stroke={COLORS[idx % COLORS.length]}
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            animationDuration={1000}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}