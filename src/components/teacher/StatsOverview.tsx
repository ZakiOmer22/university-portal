"use client";

import { FaUsers, FaBook, FaClipboardCheck, FaChartLine } from "react-icons/fa";

export default function StatsOverview() {
    const stats = [
        {
            icon: <FaUsers className="text-2xl" />,
            label: "Active Students",
            value: "142",
            change: "+12%",
            trend: "up",
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
            borderColor: "border-blue-200"
        },
        {
            icon: <FaBook className="text-2xl" />,
            label: "Courses Teaching",
            value: "8",
            change: "+2",
            trend: "up",
            color: "from-purple-500 to-pink-500",
            bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
            borderColor: "border-purple-200"
        },
        {
            icon: <FaClipboardCheck className="text-2xl" />,
            label: "Pending Grading",
            value: "23",
            change: "-5",
            trend: "down",
            color: "from-amber-500 to-orange-500",
            bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
            borderColor: "border-amber-200"
        },
        {
            icon: <FaChartLine className="text-2xl" />,
            label: "Avg. Performance",
            value: "87%",
            change: "+3.2%",
            trend: "up",
            color: "from-emerald-500 to-green-500",
            bgColor: "bg-gradient-to-br from-emerald-50 to-green-50",
            borderColor: "border-emerald-200"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
                <div 
                    key={index}
                    className={`relative p-6 rounded-2xl border-2 ${stat.borderColor} ${stat.bgColor} backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg group overflow-hidden`}
                >
                    {/* Background Gradient Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                    
                    {/* Animated Border */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 blur-sm transition-all duration-500`}></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                                {stat.icon}
                            </div>
                            <div className={`text-sm font-semibold px-2 py-1 rounded-full ${
                                stat.trend === 'up' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-red-100 text-red-700'
                            }`}>
                                {stat.change}
                            </div>
                        </div>
                        
                        <div className="space-y-1">
                            <div className="text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                                {stat.label}
                            </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className={`h-2 rounded-full bg-gradient-to-r ${stat.color} transition-all duration-1000 ease-out`}
                                    style={{ 
                                        width: stat.label === 'Avg. Performance' 
                                            ? stat.value 
                                            : `${Math.min(100, (parseInt(stat.value) / 200) * 100)}%` 
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Shine Effect */}
                    <div className="absolute inset-0 -inset-y-full -skew-y-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-y-full transition-transform duration-1000"></div>
                </div>
            ))}
        </div>
    );
}