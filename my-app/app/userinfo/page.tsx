"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const UserInfo = () => {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [school, setSchool] = useState("");
  const [resume, setResume] = useState<File | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setResume(e.target.files[0]);
    }
  };

  return (
    
    <div
      className="flex justify-center items-center h-screen"
      style={{ backgroundColor: "#385773" }}
    >
      
      <div className="bg-white rounded-2xl shadow-xl p-10 w-[500px] h-[600px] flex flex-col justify-between">
        <div className="flex-1 flex flex-col justify-center gap-5">
          <h1 className="text-2xl font-bold text-center mb-2">Let's finish your profile</h1>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="City, Country"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <input
                type="text"
                placeholder="e.g., Senior, Software Engineer"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company/School</label>
              <input
                type="text"
                placeholder="Enter your school or company"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Resume</label>
              <div className="relative">
                <input
                  type="file"
                  id="resumeUpload"
                  onChange={handleUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
                
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-500">
                  {resume ? resume.name : "No file chosen"}
                </div>
              </div>
              {resume && (
                <p className="text-sm italic text-blue-800 mt-1">📄 {resume.name}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => router.push("/role")}
            className="bg-[#385773] text-white px-6 py-2 rounded-lg"
          >
            Back
          </button>
          <button
            onClick={() => router.push("/Profile")}
            className={`bg-[#385773] text-white px-6 py-2 rounded-lg ${
              location && status && school
                ? "hover:bg-[#2e475f]"
                : "opacity-50 cursor-not-allowed"
            }`}
            disabled={!location || !status || !school}
          >
            End
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;