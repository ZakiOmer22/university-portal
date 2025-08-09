import { FaGraduationCap } from "react-icons/fa";

export default function ChoosingTips() {
  return (
    <section className="bg-white shadow-md rounded-xl p-6 mb-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaGraduationCap className="text-purple-500" /> Choosing the Right College
      </h2>
      <div className="grid md:grid-cols-2 gap-4 text-gray-700">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold text-lg mb-2">1. Consider Your Passion</h3>
          <p>Choose a college based on the field you are passionate about and want to grow in.</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold text-lg mb-2">2. Check Accreditation</h3>
          <p>Ensure the college is recognized and accredited by the Ministry of Education or equivalent.</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold text-lg mb-2">3. Think About Location</h3>
          <p>Study in a city or region that suits your lifestyle, culture, and safety preferences.</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold text-lg mb-2">4. Evaluate Facilities</h3>
          <p>Libraries, labs, student housing, internet, and computer centers matter for your academic life.</p>
        </div>
      </div>
    </section>
  );
}
