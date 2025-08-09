"use client";
import { useEffect, useState } from "react";

const stats = [
  { label: "Graduates", value: 12000 },
  { label: "Faculty Members", value: 350 },
  { label: "Research Papers", value: 450 },
  { label: "Student Clubs", value: 45 },
];

export default function Achievements() {
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const intervals = stats.map(({ value }, idx) => {
      const increment = Math.ceil(value / 100);
      return setInterval(() => {
        setCounts((prev) => {
          const newCounts = [...prev];
          if (newCounts[idx] < value) {
            newCounts[idx] = Math.min(newCounts[idx] + increment, value);
          }
          return newCounts;
        });
      }, 20);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <section className="bg-indigo-900 text-white py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 text-center">
        {stats.map(({ label }, idx) => (
          <div key={label}>
            <p className="text-5xl font-extrabold">{counts[idx]}</p>
            <p className="text-xl font-semibold mt-2">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
