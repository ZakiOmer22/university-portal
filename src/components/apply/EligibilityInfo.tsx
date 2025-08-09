import { FaCheckCircle, FaInfoCircle, FaGraduationCap, FaBook } from "react-icons/fa";

export default function EligibilityInfo() {
    return (
        <section className="bg-white shadow-md rounded-xl p-6 mb-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-green-500" /> Eligibility Criteria
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Completion of high school or equivalent certificate</li>
                <li>Minimum GPA of 2.5 or equivalent grading system</li>
                <li>Valid ID or birth certificate for identity verification</li>
                <li>High school leaving certificate and transcripts</li>
                <li>Optional: Recommendation letter or community involvement proof</li>
            </ul>
        </section>
    );
}