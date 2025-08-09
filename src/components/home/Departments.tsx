"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import PageSkeleton from "../ui/PageSkeleton";

const departments = [
  {
    name: "School of Computing",
    description: "Specializing in software engineering, AI, and data science.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
  },
  {
    name: "Faculty of Engineering & Technology",
    description: "Innovative programs in civil, electrical, and mechanical fields.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
  },
  {
    name: "School of Business & Leadership",
    description: "Focused on entrepreneurship, finance, and corporate strategy.",
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786",
  },
  {
    name: "College of Arts & Humanities",
    description: "Languages, history, and cultural studies for global thinkers.",
    image: "https://images.unsplash.com/photo-1506784365847-bbad939e9335",
  },
  {
    name: "Faculty of Natural Sciences",
    description: "Research-driven biology, chemistry, and environmental science.",
    image: "https://images.unsplash.com/photo-1581090700227-4c4f50b3a2d4",
  },
  {
    name: "School of Medicine & Health Sciences",
    description: "Cutting-edge programs in nursing, pharmacy, and medical sciences.",
    image: "https://images.unsplash.com/photo-1580281657521-6c0d7b3c56b2",
  },
  {
    name: "Law & Governance Institute",
    description: "Legal studies, policy, and justice reform programs.",
    image: "https://images.unsplash.com/photo-1589391886645-d51941baf7f2",
  },
  {
    name: "Education and Pedagogy Center",
    description: "Teacher training, curriculum design, and modern learning.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
  },
  {
    name: "Agricultural Sciences & Sustainability",
    description: "Farming innovation, agribusiness, and food security solutions.",
    image: "https://images.unsplash.com/photo-1568564321258-8a6b8b1688db",
  },
  {
    name: "Global Economics & Development",
    description: "Macro, microeconomics, trade, and emerging market research.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
  },
];

export default function Departments() {
  const [loading, setLoading] = useState(true);
  const [broken, setBroken] = useState<Record<string, boolean>>({});

  // Extended skeleton loading (2.5 seconds for smoother experience)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-indigo-900 mb-12 text-center">
        Our Departments 
      </h2>

      {loading ? (
        <PageSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {departments.map(({ name, description, image }, idx) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer"
            >
              <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center">
                {!broken[name] ? (
                  <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    onError={() =>
                      setBroken((prev) => ({ ...prev, [name]: true }))
                    }
                  />
                ) : (
                  <span className="text-gray-500 text-sm">Image unavailable</span>
                )}
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-semibold text-indigo-800 mb-2">
                  {name}
                </h3>
                <p className="text-gray-700 text-sm">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
