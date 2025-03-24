"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const NameForm = () => {
  const router = useRouter();
  const [name, setName] = useState("");

  return (
    <div className="flex justify-center items-center h-screen bg-custom-blue"style={{ backgroundColor: "#385773" }}>
      <div className="bg-white rounded-2xl shadow-xl p-10 w-[500px] flex flex-col justify-between h-[600px]">
        <div className="flex-1 flex flex-col justify-center gap-6">
        <h1 className="text-2xl font-bold text-center">What is your name?</h1>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type in your name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
        </div>

        <div className="flex justify-between mt-8">
            <button
    
  >
  </button>
  <button
    onClick={() => router.push("/languages")}
    className={`bg-[#385773] px-6 py-2 rounded-lg text-white ${
      name.trim()
        ? "hover:bg-[#2e475f]"
        : "opacity-50 cursor-not-allowed"
    }`}
    disabled={!name.trim()}
  >
    Next
  </button>
        </div>
      </div>
    </div>
  );
};

export default NameForm;