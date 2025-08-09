import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconCreditCard, IconFileText, IconHelpCircle } from "@tabler/icons-react";

export default function TuitionPage() {
    const tuitionData = [
        { program: "Undergraduate", cost: "$1,200 / year", description: "For Bachelor's degree programs (Arts, Science, Business)." },
        { program: "Postgraduate", cost: "$2,000 / year", description: "For Master's degree programs in all faculties." },
        { program: "PhD", cost: "$3,500 / year", description: "Doctorate programs with advanced research facilities." },
    ];

    const additionalFees = [
        { name: "Registration Fee", amount: "$50" },
        { name: "Library Fee", amount: "$30" },
        { name: "Laboratory Fee", amount: "$100" },
    ];

    const faqs = [
        { q: "Can I pay tuition in installments?", a: "Yes, tuition can be paid in two installments per semester." },
        { q: "Are scholarships available?", a: "Yes, merit-based and need-based scholarships are available for qualified students." },
        { q: "What payment methods are accepted?", a: "We accept bank transfer, mobile money, and credit/debit cards." },
    ];

    return (
        <main className="pt-20 pb-10 max-w-6xl mx-auto px-4 space-y-12">
            {/* Hero Section */}
            <section className="text-center space-y-4">
                <h1 className="text-4xl font-bold">Tuition & Fees</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Transparent and affordable tuition rates to help you plan your academic journey.
                </p>
            </section>

            {/* Tuition Breakdown */}
            <section>
                <h2 className="text-2xl font-semibold mb-6">Tuition Rates</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {tuitionData.map((item, idx) => (
                        <Card key={idx} className="border hover:shadow-lg transition">
                            <CardHeader>
                                <CardTitle>{item.program}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xl font-bold text-blue-600">{item.cost}</p>
                                <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Additional Fees */}
            <section>
                <h2 className="text-2xl font-semibold mb-6">Additional Fees</h2>
                <div className="bg-gray-50 p-6 rounded-lg border">
                    <ul className="space-y-2">
                        {additionalFees.map((fee, idx) => (
                            <li key={idx} className="flex justify-between">
                                <span>{fee.name}</span>
                                <span className="font-semibold">{fee.amount}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Payment Instructions */}
            <section>
                <h2 className="text-2xl font-semibold mb-6">Payment Instructions</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <IconCreditCard className="w-8 h-8 text-blue-600" />
                            <CardTitle>Payment Methods</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Pay via bank transfer, mobile money, or credit/debit card at the finance office.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <IconFileText className="w-8 h-8 text-blue-600" />
                            <CardTitle>Receipts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Always request and keep your payment receipt for verification purposes.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <IconHelpCircle className="w-8 h-8 text-blue-600" />
                            <CardTitle>Support</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Contact the finance department for any queries about tuition or payments.</p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* FAQ Section */}
            <section>
                <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="p-4 border rounded-lg hover:shadow-sm">
                            <p className="font-semibold">{faq.q}</p>
                            <p className="text-gray-600 mt-1">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
