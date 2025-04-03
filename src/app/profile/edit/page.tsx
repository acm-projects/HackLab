"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState({
    name: "Luke Sultzer",
    email: "",
    github: "",
    location: "",
    position: "",
    resume: "",
    school: "",
    joined: "",
  });

  const [editingField, setEditingField] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveAll = () => {
    // Optional: send profile to API here
    router.push("/profile");
  };

  return (
    <div className="min-h-screen h-screen overflow-y-auto bg-[#f9f9f9]">
      <div className="max-w-[700px] mx-auto bg-white rounded-[8px] shadow-md p-[24px]">
        <h2 className="text-[20px] font-semibold mb-[24px]">Basic Info</h2>

        {Object.entries(profile).map(([label, value]) => (
          <div
            key={label}
            className="flex justify-between items-start border-b py-[12px] gap-[20px]"
          >
            <div className="flex-1">
              <p className="text-[14px] font-medium capitalize mb-[4px]">
                {label === "joined" ? "Joined On" : label}
              </p>

              {editingField === label ? (
  <input
    type="text"
    value={value}
    onChange={(e) => handleChange(label, e.target.value)}
    onBlur={() => setEditingField(null)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.currentTarget.blur();
      }
    }}
    className="w-full border border-gray-300 rounded-[6px] px-[10px] py-[6px] text-[14px]"
    autoFocus
  />
) : (
  <p className="text-[14px] text-[#6B7280]">{value || "Not provided"}</p>
)}
            </div>
            <button
              onClick={() => setEditingField(label)}
              className="text-[#3B82F6] text-[14px] hover:underline"
            >
              {editingField === label ? "Editing..." : "Edit"}
            </button>
          </div>
        ))}

        <div className="mt-[24px] flex gap-[10px]">
          <button
            onClick={handleSaveAll}
            className="bg-[#3B82F6] text-white px-[16px] py-[8px] rounded-md text-[14px]"
          >
            Save
          </button>
          <button
            onClick={() => router.back()}
            className="border border-gray-300 px-[16px] py-[8px] rounded-md text-[14px] text-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
