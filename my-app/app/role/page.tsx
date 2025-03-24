"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const roles = ["Backend", "Frontend", "Full Stack"];

const RoleSelection = () => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const router = useRouter();

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  return (
    <div className="flex justify-center items-center h-screen" style={{ backgroundColor: "#385773" }}>
      <div className="bg-white rounded-2xl shadow-xl p-10 w-[500px] h-[600px] flex flex-col justify-between">
        <div className="flex-1 flex flex-col justify-center gap-6">
          <h1 className="text-2xl font-bold text-center">Please choose from the following roles</h1>
          <div className="flex flex-wrap gap-2 justify-center">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => toggleRole(role)}
                className={`px-4 py-2 rounded-lg ${
                  selectedRoles.includes(role) ? "bg-[#385773] text-white" : "bg-[#C0C0C0]"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-between mt-8">
          <button onClick={() => router.push("/interests")} className="bg-[#385773] text-white px-6 py-2 rounded-lg">
            Back
          </button>
          <button onClick={() => router.push("/userinfo")} className="bg-[#385773] text-white px-6 py-2 rounded-lg hover:bg-[#2e475f]">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;