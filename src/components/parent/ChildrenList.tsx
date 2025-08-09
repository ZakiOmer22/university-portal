import Link from "next/link";

interface ChildData {
  id: string;
  name: string;
  grade: string;
  gpa: number;
}

export default function ChildrenList({ children }: { children: ChildData[] }) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-indigo-900">
        Children's Progress
      </h3>

      {children.length === 0 ? (
        <p className="text-gray-600 italic">No children data available.</p>
      ) : (
        <ul className="divide-y divide-indigo-100">
          {children.map((child) => (
            <li
              key={child.id}
              className="flex items-center justify-between py-3 px-2 hover:bg-indigo-50 rounded transition"
            >
              <div>
                <p className="font-medium text-gray-900">{child.name}</p>
                <p className="text-sm text-gray-500">
                  {child.grade} • GPA: <span className="font-semibold text-indigo-700">{child.gpa}</span>
                </p>
              </div>
              <Link
                href={`/dashboard/parent/child/${child.id}`}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
              >
                View →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
