"use client";

import React, { useEffect, useState } from "react";
import { Cpu, HardDrive, Database, AlertTriangle, RefreshCw } from "lucide-react";

interface SystemAlert {
    id: string;
    type: "Warning" | "Error" | "Info";
    message: string;
    timestamp: string;
}

// Simulate getting system usage values
function getRandomUsage(min = 10, max = 90) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function SystemHealthPage() {
    const [cpuUsage, setCpuUsage] = useState<number>(0);
    const [memoryUsage, setMemoryUsage] = useState<number>(0);
    const [diskUsage, setDiskUsage] = useState<number>(0);
    const [alerts, setAlerts] = useState<SystemAlert[]>([]);
    const [loading, setLoading] = useState(false);

    // Simulate fetching system stats
    const fetchSystemHealth = () => {
        setLoading(true);

        setTimeout(() => {
            setCpuUsage(getRandomUsage(20, 85));
            setMemoryUsage(getRandomUsage(25, 80));
            setDiskUsage(getRandomUsage(30, 90));

            // Randomly generate alerts
            const sampleAlerts: SystemAlert[] = [
                {
                    id: "1",
                    type: "Warning",
                    message: "CPU temperature is high.",
                    timestamp: new Date(Date.now() - 600000).toISOString(),
                },
                {
                    id: "2",
                    type: "Info",
                    message: "Scheduled maintenance at 10:00 PM.",
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                },
                {
                    id: "3",
                    type: "Error",
                    message: "Disk space critically low on drive C:.",
                    timestamp: new Date(Date.now() - 1800000).toISOString(),
                },
            ];

            setAlerts(sampleAlerts);
            setLoading(false);
        }, 1500);
    };

    // Initial fetch on mount
    useEffect(() => {
        fetchSystemHealth();
    }, []);

    // Color based on usage %
    const usageColor = (value: number) => {
        if (value < 50) return "bg-green-500";
        if (value < 75) return "bg-yellow-500";
        return "bg-red-600";
    };

    // Icon color based on alert type
    const alertIconColor = (type: string) => {
        if (type === "Warning") return "text-yellow-500";
        if (type === "Error") return "text-red-600";
        return "text-blue-500";
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen space-y-6">
            <h1 className="text-2xl font-bold flex items-center gap-3">
                <Cpu size={28} /> System Health
                <button
                    onClick={fetchSystemHealth}
                    disabled={loading}
                    className={`ml-auto p-2 rounded-full hover:bg-gray-200 transition ${loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                        }`}
                    title="Refresh"
                >
                    <RefreshCw size={20} />
                </button>
            </h1>

            {/* Usage Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* CPU */}
                <div className="bg-white rounded-lg shadow p-5 flex flex-col items-center space-y-4">
                    <Cpu size={40} className="text-indigo-600" />
                    <p className="text-gray-700 font-semibold">CPU Usage</p>
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                        <div
                            className={`${usageColor(cpuUsage)} h-6 text-white font-bold flex items-center justify-center transition-all duration-700`}
                            style={{ width: `${cpuUsage}%` }}
                        >
                            {cpuUsage}%
                        </div>
                    </div>
                </div>

                {/* Memory */}
                <div className="bg-white rounded-lg shadow p-5 flex flex-col items-center space-y-4">
                    <Database size={40} className="text-green-600" />
                    <p className="text-gray-700 font-semibold">Memory Usage</p>
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                        <div
                            className={`${usageColor(memoryUsage)} h-6 text-white font-bold flex items-center justify-center transition-all duration-700`}
                            style={{ width: `${memoryUsage}%` }}
                        >
                            {memoryUsage}%
                        </div>
                    </div>
                </div>

                {/* Disk */}
                <div className="bg-white rounded-lg shadow p-5 flex flex-col items-center space-y-4">
                    <HardDrive size={40} className="text-yellow-600" />
                    <p className="text-gray-700 font-semibold">Disk Usage</p>
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                        <div
                            className={`${usageColor(diskUsage)} h-6 text-white font-bold flex items-center justify-center transition-all duration-700`}
                            style={{ width: `${diskUsage}%` }}
                        >
                            {diskUsage}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Alerts Section */}
            <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle size={24} className="text-red-600" /> Recent System Alerts
                </h2>

                {alerts.length === 0 ? (
                    <p className="text-gray-600">No alerts at this time.</p>
                ) : (
                    <ul className="space-y-3 max-w-xl">
                        {alerts.map((alert) => (
                            <li
                                key={alert.id}
                                className="flex items-center gap-3 bg-white rounded p-4 shadow"
                            >
                                <AlertTriangle
                                    size={28}
                                    className={`${alertIconColor(alert.type)} flex-shrink-0`}
                                />
                                <div>
                                    <p className="font-semibold">{alert.type}</p>
                                    <p>{alert.message}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(alert.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
