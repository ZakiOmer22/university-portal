"use client";

import Image from "next/image";
import { useState } from "react";

const partnerLogos = [
  { name: "Google", src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Microsoft", src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
  { name: "Amazon", src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { name: "Facebook", src: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_(2019).png" },
  { name: "Apple", src: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
  { name: "IBM", src: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
  { name: "Intel", src: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Intel-logo.svg" },
  { name: "Cisco", src: "https://upload.wikimedia.org/wikipedia/commons/6/64/Cisco_logo.svg" },
  { name: "Tesla", src: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg" },
  { name: "Samsung", src: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" },
  { name: "Adobe", src: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Adobe_Systems_logo.svg" },
  { name: "Oracle", src: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Oracle_logo.svg" },
  { name: "Nvidia", src: "https://upload.wikimedia.org/wikipedia/en/2/21/Nvidia_logo.svg" },
  { name: "HP", src: "https://upload.wikimedia.org/wikipedia/commons/3/3a/HP_logo_2012.svg" },
  { name: "Dell", src: "https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg" },
];

export default function Partners() {
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  return (
    <section className="bg-white py-16 border-t">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-900">Our Trusted Partners</h2>
          <p className="text-gray-600 text-lg mt-2">
            Collaborating with leading global companies and organizations.
          </p>
        </div>

        {/* Carousel Wrapper (acts as mask without resizing page) */}
        <div className="relative overflow-hidden w-full">
          <div className="flex animate-scroll whitespace-nowrap will-change-transform">
            {[...partnerLogos, ...partnerLogos].map((partner, idx) => (
              <div key={idx} className="flex-shrink-0 mx-8">
                {!brokenImages[partner.name] ? (
                  <Image
                    src={partner.src}
                    alt={partner.name}
                    width={100}
                    height={50}
                    className="object-contain max-h-10"
                    onError={() =>
                      setBrokenImages((prev) => ({ ...prev, [partner.name]: true }))
                    }
                    unoptimized
                  />
                ) : (
                  <div className="h-10 w-24 flex items-center justify-center bg-gray-200 text-gray-600 text-xs rounded">
                    {partner.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-scroll {
          animation: scroll 55s linear infinite; /* ✅ Faster and smooth */
        }
      `}</style>
    </section>
  );
}
