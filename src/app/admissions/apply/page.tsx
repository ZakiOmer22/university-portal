import EligibilityInfo from "@/components/apply/EligibilityInfo";
import CollegeRules from "@/components/apply/CollegeRules";
import ChoosingTips from "@/components/apply/ChoosingTips";
import MultiStepForm from "@/components/apply/MultiStepForm";

export default function ApplyPage() {
    return (
        <main className="pt-20 pb-10 bg-gray-50 min-h-screen">
            <section className="text-center mb-10">
                <h1 className="text-4xl font-bold text-blue-900">Apply to University of Hargeisa</h1>
                <p className="text-gray-600 text-lg mt-2">Start your journey toward a successful future.</p>
            </section>

            <section className="max-w-4xl mx-auto space-y-12 px-4">
                {/* Eligibility Information Section */}
                <div className="rounded-xl shadow-md bg-white p-6 border border-gray-200">
                    <EligibilityInfo />
                </div>

                {/* University/College Rules */}
                <div className="rounded-xl shadow-md bg-white p-6 border border-gray-200">
                    <CollegeRules />
                </div>

                {/* Tips for Choosing a Program */}
                <div className="rounded-xl shadow-md bg-white p-6 border border-gray-200">
                    <ChoosingTips />
                </div>

                {/* Multi-Step Application Form */}
                <div className="rounded-xl shadow-lg bg-white p-8 border border-blue-100">
                    <h2 className="text-2xl font-semibold text-blue-800 mb-4 text-center">Application Form</h2>
                    <MultiStepForm />
                </div>
            </section>
        </main>
    );
}