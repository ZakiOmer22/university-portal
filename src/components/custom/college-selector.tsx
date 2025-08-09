"use client";

import { useState, useEffect } from "react";
import { School } from "lucide-react";

type CollegeSelectorProps = {
  value?: string;
  onSelect?: (college: string) => void;
};

const colleges = [
  "College of Engineering",
  "College of Medicine",
  "College of Business",
  "College of Computer Science",
  "College of Education",
  "College of Agriculture",
];

export function CollegeSelector({ value = "", onSelect }: CollegeSelectorProps) {
  const [selected, setSelected] = useState<string>(value);

  // If parent changes value prop, sync it
  useEffect(() => {
    setSelected(value);
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelected(e.target.value);
    if (onSelect) {
      onSelect(e.target.value);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-6 rounded-2xl shadow-md">
      <div className="flex items-center gap-2 mb-3 text-blue-600">
        <School size={28} />
        <h3 className="text-lg font-semibold">Select Your College / Faculty</h3>
      </div>

      <select
        value={selected}
        onChange={handleChange}
        className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-50 dark:bg-zinc-800 dark:text-white dark:border-zinc-700 focus:ring-2 focus:ring-blue-400"
      >
        <option value="">-- Choose your faculty --</option>
        {colleges.map((college) => (
          <option key={college} value={college}>
            {college}
          </option>
        ))}
      </select>

      {selected && (
        <p className="mt-3 text-sm text-green-600 dark:text-green-400">
          Selected: {selected}
        </p>
      )}
    </div>
  );
}
