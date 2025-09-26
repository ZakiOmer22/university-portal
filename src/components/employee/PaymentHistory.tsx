import React, { useState } from "react";

interface Payment {
    id: string;
    date: Date;
    amount: number;
    method: string;
    status: "Completed" | "Pending" | "Failed";
}

interface PaymentHistoryProps {
    payments: Payment[];
}

const statusColors = {
    Completed: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Failed: "bg-red-100 text-red-800",
};

export default function PaymentHistory({ payments }: PaymentHistoryProps) {
    const [sortedPayments, setSortedPayments] = useState(payments);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const toggleSortByDate = () => {
        const newOrder = sortOrder === "asc" ? "desc" : "asc";
        const sorted = [...sortedPayments].sort((a, b) =>
            newOrder === "asc"
                ? a.date.getTime() - b.date.getTime()
                : b.date.getTime() - a.date.getTime()
        );
        setSortedPayments(sorted);
        setSortOrder(newOrder);
    };

    return (
        <section
            className="bg-white rounded-lg shadow mt-8 p-6 overflow-x-auto"
            aria-label="Payment history table"
        >
            <h3 className="text-xl font-semibold mb-6 text-indigo-900">Payment History</h3>
            <table className="w-full table-auto border-collapse border border-indigo-300 rounded-md text-left">
                <thead className="bg-indigo-100 cursor-pointer">
                    <tr>
                        <th
                            onClick={toggleSortByDate}
                            className="border border-indigo-300 px-4 py-2 select-none"
                            aria-sort={sortOrder === "asc" ? "ascending" : "descending"}
                            tabIndex={0}
                        >
                            Date {sortOrder === "asc" ? "▲" : "▼"}
                        </th>
                        <th className="border border-indigo-300 px-4 py-2">Amount</th>
                        <th className="border border-indigo-300 px-4 py-2">Method</th>
                        <th className="border border-indigo-300 px-4 py-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedPayments.map(({ id, date, amount, method, status }) => (
                        <tr
                            key={id}
                            tabIndex={0}
                            className="hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            aria-label={`Payment of $${amount} on ${date.toLocaleDateString()}, status ${status}`}
                        >
                            <td className="border border-indigo-300 px-4 py-2">
                                {date.toLocaleDateString()}
                            </td>
                            <td className="border border-indigo-300 px-4 py-2">${amount.toFixed(2)}</td>
                            <td className="border border-indigo-300 px-4 py-2">{method}</td>
                            <td className={`border border-indigo-300 px-4 py-2 text-center`}>
                                <span
                                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold select-none ${statusColors[status]}`}
                                    aria-label={`Payment status: ${status}`}
                                >
                                    {status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}