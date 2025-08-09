import React from "react";

const ReportsPanel = () => {
    return (
        <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Reports Panel</h2>
            <ul className="list-disc list-inside text-sm space-y-1">
                <li>Attendance Summary</li>
                <li>Performance Overview</li>
                <li>Health Reports</li>
                <li>Disciplinary Records</li>
            </ul>
        </div>
    );
};

export default ReportsPanel;