"use client";
import Image from "next/image";

const events = [
  {
    title: "Annual Science & Tech Expo",
    date: "Sep 15, 2025",
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6",
    description:
      "Showcasing innovative projects and research from our students and faculty in science, engineering, and technology.",
    link: "/events/science-expo",
  },
  {
    title: "Cultural Festival 2025",
    date: "Oct 10, 2025",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad",
    description:
      "A vibrant celebration of diverse cultures with food, music, dance, and art from around the world.",
    link: "/events/cultural-festival",
  },
  {
    title: "Entrepreneurship Summit",
    date: "Nov 5, 2025",
    image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1",
    description:
      "An inspiring event for aspiring entrepreneurs featuring keynote speakers, workshops, and networking.",
    link: "/events/entrepreneurship-summit",
  },
];

export default function Events() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
          Upcoming Events
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
            >
              {/* Event Image */}
              <div className="relative h-48 w-full">
                <Image
                  src={event.image}
                  alt={event.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Event Details */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-full text-sm">
                    {event.date}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <a
                  href={event.link}
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Learn More →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* View All Events Button */}
        <div className="text-center mt-12">
          <a
            href="/events"
            className="px-6 py-3 bg-indigo-700 text-white rounded-lg font-semibold hover:bg-indigo-800 transition"
          >
            View All Events
          </a>
        </div>
      </div>
    </section>
  );
}
