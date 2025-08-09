export default function About() {
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="text-4xl font-bold text-indigo-900 mb-10 text-center">
          About University Portal
        </h2>

        {/* Intro Paragraph */}
        <p className="text-gray-700 max-w-4xl mx-auto leading-relaxed text-lg mb-16 text-center">
          The University of Hargeisa is committed to academic excellence and research, serving the people of Somaliland and the region by providing quality education and community development. Our campus fosters innovation, collaboration, and leadership.
        </p>

        {/* Vision, Mission & Core Values Grid */}
        <div className="grid gap-12 sm:grid-cols-3 text-center">
          {/* Vision */}
          <div className="px-6">
            <h3 className="text-2xl font-semibold text-indigo-800 mb-4">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
              To be a leading institution of higher education and research that empowers individuals to contribute effectively to the development and prosperity of Somaliland and beyond.
            </p>
          </div>

          {/* Mission */}
          <div className="px-6 border-l border-r border-gray-200">
            <h3 className="text-2xl font-semibold text-indigo-800 mb-4">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
              To provide accessible, quality education and conduct impactful research, fostering critical thinking, innovation, and ethical leadership to meet the needs of society and global challenges.
            </p>
          </div>

          {/* Core Values */}
          <div className="px-6">
            <h3 className="text-2xl font-semibold text-indigo-800 mb-4">Core Values</h3>
            <ul className="text-gray-600 leading-relaxed text-base sm:text-lg space-y-2">
              <li>Academic Excellence</li>
              <li>Integrity & Ethics</li>
              <li>Inclusivity & Diversity</li>
              <li>Community Engagement</li>
              <li>Innovation & Research</li>
              <li>Collaboration & Partnership</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
