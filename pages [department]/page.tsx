// import Link from "next/link";

// export default async function DepartmentBatchesPage({
//     params,
// }: {
//     params: { department: string } | Promise<{ department: string }>;
// }) {
//     // unwrap params with await — works since it's async component
//     const unwrappedParams = await params;
//     const department = unwrappedParams.department;

//     const batches = [
//         { id: "batch-2023", name: "Batch 2023" },
//         { id: "batch-2024", name: "Batch 2024" },
//         { id: "batch-2025", name: "Batch 2025" },
//     ];

//     return (
//         <div className="p-6">
//             <h1 className="text-3xl font-bold mb-6 capitalize">
//                 {department.replace("-", " ")} — Batches
//             </h1>
//             <div className="grid md:grid-cols-3 gap-6">
//                 {batches.map((batch) => (
//                     <Link
//                         key={batch.id}
//                         href={`/dashboard/admin/students/${department}/${batch.id}`}
//                         className="group bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden border border-gray-200"
//                     >
//                         <img
//                             src={`https://source.unsplash.com/400x200/?students,${encodeURIComponent(batch.name)}`}
//                             alt={batch.name}
//                             className="w-full h-40 object-cover"
//                         />
//                         <div className="p-4">
//                             <h2 className="text-lg font-semibold">{batch.name}</h2>
//                             <p className="text-sm text-gray-600">View students in this batch</p>
//                         </div>
//                     </Link>
//                 ))}
//             </div>
//         </div>
//     );
// }
