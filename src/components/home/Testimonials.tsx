"use client";

const testimonials = [
  {
    name: "Amina Hassan",
    role: "Computer Science Graduate",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "The University of Hargeisa equipped me with industry-ready skills.",
  },
  {
    name: "Mohamed Ali",
    role: "Engineering Student",
    photo: "https://randomuser.me/api/portraits/men/75.jpg",
    text: "Practical labs and supportive faculty made learning exciting!",
  },
  {
    name: "Fatima Noor",
    role: "Business Alumni",
    photo: "https://randomuser.me/api/portraits/women/52.jpg",
    text: "Scholarships and internships opened endless opportunities.",
  },
  {
    name: "Hassan Ibrahim",
    role: "Science Student",
    photo: "https://randomuser.me/api/portraits/men/64.jpg",
    text: "Research projects here gave me hands-on global exposure.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-indigo-50 py-16 overflow-hidden">
      <h2 className="text-3xl font-bold text-center text-indigo-900 mb-12">
        What Our Students Say
      </h2>
      <div className="relative w-full overflow-hidden">
        <div className="flex animate-slide gap-8 px-6">
          {testimonials.map(({ name, role, photo, text }, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-lg min-w-[300px] max-w-[320px] text-center"
            >
              <img
                src={photo}
                alt={name}
                className="mx-auto rounded-full w-20 h-20 object-cover mb-4"
              />
              <p className="italic text-gray-700 mb-4">&quot;{text}&quot;</p>
              <h4 className="font-semibold text-indigo-800">{name}</h4>
              <p className="text-sm text-gray-500">{role}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .animate-slide {
          width: max-content;
          animation: slide 25s linear infinite;
        }
        @keyframes slide {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
