export default function CallToAction() {
  return (
    <section className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-16">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Join the University Portal?
        </h2>
        <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
          Take the first step towards your academic future. Apply today and be part of a thriving academic community that shapes leaders of tomorrow.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {/* Apply Button */}
          <a
            href="/admissions/apply"
            className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-gray-200 transition"
          >
            Apply Now
          </a>

          {/* Explore Programs Button (Updated Hover) */}
          <a
            href="/academics/undergraduate"
            className="px-6 py-3 bg-indigo-700 text-white font-semibold rounded-lg border border-white hover:bg-white hover:text-indigo-700 transition"
          >
            Explore Programs
          </a>
        </div>
      </div>
    </section>
  );
}
