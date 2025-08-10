import { DollarSign } from "lucide-react";
import { accountingCurriculum } from "@/data/curriculums/accounting";

export default function AccountingPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-100">
            {/* Header */}
            <section className="bg-gradient-to-r from-green-700 via-green-600 to-green-500 text-white py-16 shadow-xl">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex items-center justify-center bg-white/20 rounded-full p-6 shadow-lg">
                        <DollarSign className="w-16 h-16 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            Accounting
                        </h1>
                        <p className="mt-4 text-lg text-green-100 max-w-2xl leading-relaxed">
                            A 4-year program focused on financial accounting, auditing, taxation,
                            and managerial accounting skills for professional growth.
                        </p>
                    </div>
                </div>
            </section>

            {/* Curriculum */}
            <section className="max-w-6xl mx-auto px-6 py-12">
                {accountingCurriculum.map((yearData) => (
                    <div key={yearData.year} className="mb-16">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 border-b-4 border-green-500 inline-block pb-1">
                            Year {yearData.year}
                        </h2>
                        <div className="grid gap-8 md:grid-cols-2">
                            {yearData.semesters.map((sem) => (
                                <div
                                    key={sem.name}
                                    className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 overflow-hidden"
                                >
                                    <div className="bg-green-700 text-white px-6 py-3 font-semibold text-lg">
                                        {sem.name}
                                    </div>
                                    <ul className="p-6 space-y-4">
                                        {sem.courses.map((course) => (
                                            <li
                                                key={course.code}
                                                className="border-b border-gray-100 pb-3 last:border-0"
                                            >
                                                <p className="font-semibold text-gray-900">
                                                    {course.code} — {course.name}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {course.desc}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </section>

            {/* Call-to-Action */}
            <section className="bg-gradient-to-r from-green-50 to-green-100 py-12 mt-16">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h3 className="text-2xl font-bold text-gray-800">
                        Ready to start your Accounting career?
                    </h3>
                    <p className="mt-2 text-gray-600">
                        Apply now and become a skilled accounting professional.
                    </p>
                    <a
                        href="http://localhost:3000/admissions/apply"
                        className="mt-6 inline-block px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-medium rounded-full shadow-md transition-all duration-300"
                    >
                        Apply Now
                    </a>
                </div>
            </section>
        </main>
    );
}
