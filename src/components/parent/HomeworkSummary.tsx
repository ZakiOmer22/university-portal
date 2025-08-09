interface Homework {
    id: string;
    title: string;
    dueDate: Date;
    status: "completed" | "pending" | "overdue";
    childName: string;
}

interface HomeworkSummaryProps {
    assignments: Homework[];
}

export default function HomeworkSummary({ assignments }: HomeworkSummaryProps) {
    const statusColors = {
        completed: "bg-green-100 text-green-800",
        pending: "bg-yellow-100 text-yellow-800",
        overdue: "bg-red-100 text-red-800",
    };

    return (
        <section className="bg-white rounded-lg shadow p-4 max-h-[300px] overflow-auto mt-8">
            <h3 className="text-lg font-semibold mb-4">Homework & Assignments</h3>
            {assignments.length === 0 ? (
                <p className="text-gray-600 italic">No homework assignments.</p>
            ) : (
                <ul className="space-y-3">
                    {assignments.map(({ id, title, dueDate, status, childName }) => (
                        <li key={id} className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-b-0">
                            <div>
                                <p className="font-semibold">{title}</p>
                                <p className="text-sm text-gray-600">For: {childName}</p>
                                <time className="text-sm text-gray-500" dateTime={dueDate.toISOString()}>
                                    Due: {dueDate.toLocaleDateString()}
                                </time>
                            </div>
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold select-none ${statusColors[status]}`}
                                aria-label={`Homework status: ${status}`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}