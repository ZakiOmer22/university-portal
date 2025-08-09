"use client";

export default function Programs() {
  const programs = [
    {
      title: "Undergraduate Programs",
      description:
        "Explore a wide range of bachelor's degree programs in arts, sciences, engineering, and business.",
      href: "/academics/undergraduate",
    },
    {
      title: "Graduate Programs",
      description:
        "Advance your career with master's and doctoral programs led by expert faculty.",
      href: "/academics/graduate",
    },
    {
      title: "Online Learning",
      description:
        "Flexible online courses and degree programs to fit your schedule.",
      href: "/academics/online",
    },
  ];

  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-indigo-900 mb-10">Our Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {programs.map(({ title, description, href }) => (
            <a
              key={title}
              href={href}
              className="block border border-indigo-900 rounded-lg p-6 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-indigo-900 mb-3">{title}</h3>
              <p className="text-gray-700">{description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
