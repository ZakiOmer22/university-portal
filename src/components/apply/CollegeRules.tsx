import { Book } from "lucide-react";
import { FaBook } from "react-icons/fa";

export default function CollegeRules() {
  return (
    <section className="bg-white shadow-md rounded-xl p-6 mb-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaBook className="text-blue-500" /> College Application Rules
      </h2>
      <ul className="list-decimal list-inside text-gray-700 space-y-2">
        <li>Each applicant may apply to a maximum of 3 colleges</li>
        <li>Required documents must be submitted by the deadline</li>
        <li>Each selected college should reflect serious academic interest</li>
        <li>Once submitted, application data cannot be modified</li>
        <li>Duplicate applications will be rejected</li>
      </ul>
    </section>
  );
}