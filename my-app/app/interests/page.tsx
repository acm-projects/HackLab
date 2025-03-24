"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const interestOptions = ["Sports", "Food", "Games", "Web Application"];

const InterestSelection = () => {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleInterest = (interest: string) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const filteredInterests = interestOptions.filter((interest) =>
    interest.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="flex justify-center items-center h-screen"
      style={{ backgroundColor: "#385773" }}
    >
      <div className="bg-white rounded-2xl shadow-xl p-10 w-[500px] h-[600px] flex flex-col justify-between">
        <div className="flex-1 flex flex-col justify-center gap-6">
          <h1 className="text-2xl font-bold text-center">
            What are your interests?
          </h1>

          {/* 🔍 Search Input */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search interests..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />

          {/* ✅ Filtered Interest Buttons */}
          <div className="flex flex-wrap gap-2 justify-center">
            {filteredInterests.map((interest) => (
              <button
                key={interest}
                className={`px-4 py-2 rounded-lg border ${
                  selected.includes(interest)
                    ? "bg-[#385773] text-white"
                    : "bg-[#C0C0C0]"
                }`}
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => router.push("/languages")}
            className="bg-[#385773] text-white px-6 py-2 rounded-lg"
          >
            Back
          </button>
          <button
            onClick={() => router.push("/role")}
            className="bg-[#385773] text-white px-6 py-2 rounded-lg hover:bg-[#2e475f]"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterestSelection;