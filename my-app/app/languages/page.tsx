"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const languages = ["Java", "JavaScript", "Python", "C++"];

const LanguageSelection = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const toggleLang = (lang: string) => {
    setSelected((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const filteredLanguages = languages.filter((lang) =>
    lang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="flex justify-center items-center h-screen"
      style={{ backgroundColor: "#385773" }}
    >
      <div className="bg-white rounded-2xl shadow-xl p-10 w-[500px] h-[600px] flex flex-col justify-between">
        <div className="flex-1 flex flex-col justify-center gap-6">
          <h1 className="text-2xl font-bold text-center">
            What programming languages do you use?
          </h1>

          {/* 🔍 Search Input */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for languages..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />

          {/* ✅ Filtered Buttons */}
          <div className="flex flex-wrap gap-2 justify-center">
            {filteredLanguages.map((lang) => (
              <button
                key={lang}
                className={`px-4 py-2 rounded-lg border ${
                  selected.includes(lang)
                    ? "bg-[#385773] text-white"
                    : "bg-[#C0C0C0]"
                }`}
                onClick={() => toggleLang(lang)}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => router.push("/name")}
            className="bg-[#385773] text-white px-6 py-2 rounded-lg"
          >
            Back
          </button>
          <button
            onClick={() => router.push("/interests")}
            className="bg-[#385773] text-white px-6 py-2 rounded-lg hover:bg-[#2e475f]"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;