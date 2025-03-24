"use client";

import React from "react";
import { useRouter } from "next/navigation";

const TopBar = () => {
  const router = useRouter();

  return (
    <nav className="bg-[#385773] text-white px-6 py-4 flex justify-between items-center shadow-md">
      <button onClick={() => router.push("/")} className="text-xl font-semibold">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white text-[#385773] flex items-center justify-center rounded-full">≡</div>
          <span>HackLab</span>
        </div>
      </button>

      <div className="w-[400px]">
        <input
          type="text"
          placeholder="Search for projects"
          className="w-full px-4 py-2 rounded-full text-black outline-none"
        />
      </div>

      <div className="bg-white text-[#385773] w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer">
        L
      </div>
    </nav>
  );
};

export default TopBar;