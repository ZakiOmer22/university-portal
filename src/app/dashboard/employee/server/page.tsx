"use client";

import { useState, useEffect } from "react";

interface InternalServer {
    id: string;
    name: string;
    status: "online" | "offline" | "warning";
}

interface ServerStatus {
    id: string;
    name: string;
    ip: string;
    status: "online" | "offline" | "warning";
    uptimeSeconds: number;
    cpuUsagePercent: number;
    memoryUsagePercent: number;
    diskUsagePercent: number;
    networkInMbps: number;
    networkOutMbps: number;
    lastChecked: string; // ISO string
    domainAvailable: boolean;
    internalServers: InternalServer[];
}

const STATUS_COLORS = {
    online: "bg-green-500",
    offline: "bg-red-600",
    warning: "bg-yellow-400",
};

function formatUptime(seconds: number) {
    const days = Math.floor(seconds / (3600 * 24));
    seconds -= days * 3600 * 24;
    const hrs = Math.floor(seconds / 3600);
    seconds -= hrs * 3600;
    const mins = Math.floor(seconds / 60);
    return `${days}d ${hrs}h ${mins}m`;
}

export default function ServerStatusPage() {
    const [servers, setServers] = useState<ServerStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch mock or API data here
    async function fetchStatus() {
        setRefreshing(true);
        setError(null);
        try {
            await new Promise((r) => setTimeout(r, 800)); // simulate API delay

            const data: ServerStatus[] = [
                {
                    id: "srv-1",
                    name: "Web Server 1",
                    ip: "192.168.1.101",
                    status: "online",
                    uptimeSeconds: 259200,
                    cpuUsagePercent: 24,
                    memoryUsagePercent: 67,
                    diskUsagePercent: 40,
                    networkInMbps: 35,
                    networkOutMbps: 20,
                    lastChecked: new Date().toISOString(),
                    domainAvailable: true,
                    internalServers: [
                        { id: "int-1", name: "Auth Service", status: "online" },
                        { id: "int-2", name: "Cache Node", status: "online" },
                    ],
                },
                {
                    id: "srv-2",
                    name: "Database Server",
                    ip: "192.168.1.102",
                    status: "warning",
                    uptimeSeconds: 36000,
                    cpuUsagePercent: 78,
                    memoryUsagePercent: 80,
                    diskUsagePercent: 70,
                    networkInMbps: 12,
                    networkOutMbps: 9,
                    lastChecked: new Date().toISOString(),
                    domainAvailable: false,
                    internalServers: [
                        { id: "int-3", name: "DB Replica 1", status: "online" },
                        { id: "int-4", name: "DB Replica 2", status: "offline" },
                    ],
                },
                {
                    id: "srv-3",
                    name: "Cache Server",
                    ip: "192.168.1.103",
                    status: "offline",
                    uptimeSeconds: 0,
                    cpuUsagePercent: 0,
                    memoryUsagePercent: 0,
                    diskUsagePercent: 0,
                    networkInMbps: 0,
                    networkOutMbps: 0,
                    lastChecked: new Date().toISOString(),
                    domainAvailable: false,
                    internalServers: [],
                },
            ];

            // Fill to 6 cards if less than 6
            const filledData = [...data];
            while (filledData.length < 6) {
                // clone and modify id
                const clone = { ...data[filledData.length % data.length] };
                clone.id = `srv-clone-${filledData.length}`;
                clone.name += " (Clone)";
                filledData.push(clone);
            }

            setServers(filledData);
        } catch (e) {
            setError("Failed to fetch server status.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    // Check if any server is offline or domain unavailable
    const hasCriticalIssue = servers.some(
        (srv) => srv.status === "offline" || !srv.domainAvailable
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col">
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-indigo-900">Server Status Dashboard</h1>

                <button
                    onClick={fetchStatus}
                    disabled={refreshing}
                    className={`flex items-center space-x-2 px-4 py-2 rounded ${refreshing
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                        } text-white font-semibold transition`}
                    aria-label="Refresh Server Status"
                >
                    {refreshing ? (
                        <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8z"
                            />
                        </svg>
                    ) : (
                        "Refresh"
                    )}
                </button>
            </header>

            {hasCriticalIssue && (
                <div
                    role="alert"
                    className="mb-4 p-4 rounded bg-red-100 text-red-700 border border-red-400 flex flex-col md:flex-row md:items-center md:justify-between"
                >
                    <p className="font-semibold">
                        <strong>Alert:</strong> One or more servers are offline or their domains are unavailable.
                    </p>
                    <p className="mt-2 md:mt-0 md:ml-4">
                        Please <a href="mailto:network-admin@example.com" className="underline font-semibold text-red-700 hover:text-red-900">
                            contact the Network Administrator
                        </a>{" "}
                        immediately for assistance.
                    </p>
                </div>
            )}

            {loading && (
                <div className="flex-grow flex justify-center items-center text-indigo-700 text-lg">
                    Loading server status...
                </div>
            )}

            {error && (
                <div className="flex-grow text-center text-red-600 font-semibold">{error}</div>
            )}

            {!loading && !error && (
                <main className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {servers.map((srv) => (
                        <div
                            key={srv.id}
                            className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between space-y-3"
                            tabIndex={0}
                            aria-label={`Status card for ${srv.name}`}
                            style={{ minHeight: 250 }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h2 className="text-lg font-semibold text-indigo-900">{srv.name}</h2>
                                    <p className="text-xs text-gray-600">{srv.ip}</p>
                                </div>
                                <span
                                    className={`inline-block w-5 h-5 rounded-full ${STATUS_COLORS[srv.status]}`}
                                    title={`Status: ${srv.status}`}
                                    aria-label={`Status: ${srv.status}`}
                                />
                            </div>

                            {/* Domain availability */}
                            <div className="flex items-center space-x-2 text-sm font-medium">
                                <span
                                    className={`inline-block w-3 h-3 rounded-full ${srv.domainAvailable ? "bg-green-500" : "bg-red-600"
                                        }`}
                                    aria-label={`Domain is ${srv.domainAvailable ? "available" : "unavailable"}`}
                                    title={`Domain ${srv.domainAvailable ? "Available" : "Unavailable"}`}
                                />
                                <span>Domain {srv.domainAvailable ? "Available" : "Unavailable"}</span>
                            </div>

                            {/* Uptime */}
                            <p className="text-xs text-gray-700 font-medium">
                                Uptime: <span className="font-semibold">{formatUptime(srv.uptimeSeconds)}</span>
                            </p>

                            {/* Usage bars */}
                            <div className="space-y-1">
                                <UsageBar label="CPU" value={srv.cpuUsagePercent} colorClass="bg-indigo-600" />
                                <UsageBar label="Memory" value={srv.memoryUsagePercent} colorClass="bg-green-600" />
                                <UsageBar label="Disk" value={srv.diskUsagePercent} colorClass="bg-yellow-500" />
                            </div>

                            {/* Network stats */}
                            <div className="flex justify-between text-xs font-semibold text-gray-700 mt-1">
                                <div>
                                    <p>Net In</p>
                                    <p className="font-semibold">{srv.networkInMbps} Mbps</p>
                                </div>
                                <div>
                                    <p>Net Out</p>
                                    <p className="font-semibold">{srv.networkOutMbps} Mbps</p>
                                </div>
                            </div>

                            {/* Internal servers */}
                            {srv.internalServers.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-xs font-semibold text-gray-700 mb-1">Internal Servers:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {srv.internalServers.map((intSrv) => (
                                            <span
                                                key={intSrv.id}
                                                className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[intSrv.status]
                                                    } text-white`}
                                                title={`${intSrv.name} is ${intSrv.status}`}
                                                aria-label={`${intSrv.name} status: ${intSrv.status}`}
                                            >
                                                <span
                                                    className="w-2 h-2 rounded-full inline-block"
                                                    aria-hidden="true"
                                                />
                                                <span>{intSrv.name}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Last checked */}
                            <p className="mt-3 text-xs text-gray-400">
                                Last Checked: {new Date(srv.lastChecked).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </main>
            )}
        </div>
    );
}

interface UsageBarProps {
    label: string;
    value: number; // 0 to 100
    colorClass: string;
}
function UsageBar({ label, value, colorClass }: UsageBarProps) {
    return (
        <div>
            <div className="flex justify-between mb-0.5 text-xs font-semibold text-gray-700">
                <span>{label}</span>
                <span>{value}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded h-3">
                <div
                    className={`${colorClass} h-3 rounded`}
                    style={{ width: `${value}%`, transition: "width 0.5s ease" }}
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    role="progressbar"
                    aria-label={`${label} usage`}
                />
            </div>
        </div>
    );
}
