"use client";
import Image from "next/image";

const partnerTestimonials = [
  {
    company: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    feedback:
      "Partnering with this university has allowed us to tap into some of the brightest minds in technology. Their students are always innovative and driven.",
    person: "Sarah Lee",
    position: "Head of University Relations",
  },
  {
    company: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    feedback:
      "We are proud to collaborate on research projects. The university's commitment to excellence aligns perfectly with our vision for future tech.",
    person: "James Carter",
    position: "Senior Program Manager",
  },
  {
    company: "IBM",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
    feedback:
      "Their dedication to building future-ready talent is outstanding. We’ve hired several graduates who are now key members of our teams.",
    person: "Linda Park",
    position: "Talent Acquisition Director",
  },
];

export default function PartnersSay() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center px-6">
        <h2 className="text-4xl font-bold text-gray-900 mb-12">What Our Partners Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {partnerTestimonials.map((partner, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition"
            >
              <Image
                src={partner.logo}
                alt={`${partner.company} Logo`}
                width={80}
                height={80}
                className="mb-4 object-contain"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <p className="italic text-gray-600 mb-4">&quot;{partner.feedback}&quot;</p>
              <div className="mt-4">
                <p className="font-semibold text-gray-900">{partner.person}</p>
                <p className="text-sm text-gray-500">{partner.position} at {partner.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
