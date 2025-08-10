import { Heart } from "lucide-react";
import { nursingCurriculum } from "@/data/curriculums/nursing";

export default function NursingProgramPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
            {/* Header Section */}
            <section className="bg-gradient-to-r from-pink-600 via-rose-500 to-rose-400 text-white py-16 shadow-xl">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex items-center justify-center bg-white/20 rounded-full p-6 shadow-lg">
                        <Heart className="w-16 h-16 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            Bachelor of Science in Nursing
                        </h1>
                        <p className="mt-4 text-lg text-rose-100 max-w-2xl leading-relaxed">
                            A 4-year program designed to prepare students for a professional nursing career
                            through clinical practice, leadership training, and evidence-based learning.
                        </p>
                    </div>
                </div>
            </section>

            {/* Curriculum Section */}
            <section className="max-w-6xl mx-auto px-6 py-12">
                {nursingCurriculum.map((yearData) => (
                    <div key={yearData.year} className="mb-16">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 border-b-4 border-pink-500 inline-block pb-1">
                            Year {yearData.year}
                        </h2>

                        <div className="grid gap-8 md:grid-cols-2">
                            {yearData.semesters.map((sem) => (
                                <div
                                    key={sem.name}
                                    className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 overflow-hidden"
                                >
                                    <div className="bg-pink-600 text-white px-6 py-3 font-semibold text-lg">
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
            <section className="bg-gradient-to-r from-pink-50 to-pink-100 py-12 mt-16">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h3 className="text-2xl font-bold text-gray-800">
                        Ready to start your Nursing journey?
                    </h3>
                    <p className="mt-2 text-gray-600">
                        Apply now and take the first step toward becoming a healthcare professional.
                    </p>
                    <a
                        href="http://localhost:3000/admissions/apply"
                        className="mt-6 inline-block px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-full shadow-md transition-all duration-300"
                    >
                        Apply Now
                    </a>
                </div>
            </section>
        </main>
    );
}
