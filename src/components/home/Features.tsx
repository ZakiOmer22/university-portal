export default function Features() {
  const features = [
    {
      title: "Experienced Faculty",
      description:
        "Our professors are industry leaders and scholars committed to student success.",
      icon: (
        <svg
          className="w-12 h-12 text-indigo-700 mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="7" r="4" />
          <path d="M5.5 21h13a2 2 0 0 0-13 0z" />
        </svg>
      ),
    },
    {
      title: "Cutting-Edge Facilities",
      description:
        "Labs and resources equipped with the latest technology for hands-on learning.",
      icon: (
        <svg
          className="w-12 h-12 text-indigo-700 mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <path d="M16 3v18" />
        </svg>
      ),
    },
    {
      title: "Global Network",
      description:
        "Strong partnerships and exchange programs with universities worldwide.",
      icon: (
        <svg
          className="w-12 h-12 text-indigo-700 mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="12" y1="2" x2="12" y2="22" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-indigo-900 mb-10">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {features.map(({ title, description, icon }) => (
            <div key={title} className="p-6 border border-indigo-900 rounded-lg hover:shadow-lg transition cursor-default">
              <div>{icon}</div>
              <h3 className="text-xl font-semibold text-indigo-900 mb-2">{title}</h3>
              <p className="text-gray-700">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
