"use client";

import React from "react";
import Graphs from "../components/graphs";
import { useRouter } from "next/navigation";
import NavBar from "../components/NavBar";

const ProfilePage = () => {
  const router = useRouter();
  return (
    <div className="bg-blue-900 text-white font-nunito min-h-screen">
      {/* Navbar should be placed outside the centered div */}
      <NavBar />

      <div className="flex flex-col items-center p-6">
        <div className="flex gap-6 w-full max-w-6xl">
          {/* Left Sidebar */}
          <div className="bg-white rounded-lg shadow p-4 w-1/4 text-gray-800">
            <div className="text-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gray-300 mx-auto mb-2"></div>
              <h2 className="text-lg font-semibold">Luke</h2>
              <p className="text-sm text-gray-500">Level 4</p>
              <div className="w-full h-2 bg-gray-200 rounded mt-1 mb-4">
                <div className="w-3/5 h-full bg-[#385773] rounded"></div>
              </div>
              <button className="bg-[#385773] text-white px-4 py-2 rounded">
                Edit Profile
              </button>
            </div>

            <div className="text-center">
              <h3 className="font-semibold mb-1">Languages</h3>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <span className="bg-gray-200 px-3 py-1 rounded-full text-gray-700">
                  Python
                </span>
                <span className="bg-gray-200 px-3 py-1 rounded-full text-gray-700">
                  C++
                </span>
              </div>

              <h3 className="font-semibold mb-1">Roles</h3>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <span className="bg-gray-200 px-3 py-1 rounded-full text-gray-700">
                  Full Stack
                </span>
                <span className="bg-gray-200 px-3 py-1 rounded-full text-gray-700">
                  Frontend
                </span>
              </div>

              <h3 className="font-semibold mb-1">Interests</h3>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="bg-gray-200 px-3 py-1 rounded-full text-gray-700">
                  Games
                </span>
                <span className="bg-gray-200 px-3 py-1 rounded-full text-gray-700">
                  Web Application
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Projects and Profile Info */}
            <div className="flex justify-between gap-6">
              <div className="bg-white p-6 rounded-lg shadow w-1/2">
                <h3 className="font-bold text-center border-b pb-2 mb-4 text-gray-800">
                  Projects Completed
                </h3>
                <div className="flex justify-around">
                  <div className="text-center">
                    <div className="bg-red-200 text-red-600 font-bold text-lg px-4 py-2 rounded">
                      <div>2</div>
                      <div className="text-sm font-medium">Ongoing</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-200 text-green-600 font-bold text-lg px-4 py-2 rounded">
                      <div>3</div>
                      <div className="text-sm font-medium">Created</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-200 text-blue-600 font-bold text-lg px-4 py-2 rounded">
                      <div>6</div>
                      <div className="text-sm font-medium">Joined</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow w-1/2">
                <h3 className="font-bold text-center border-b pb-2 mb-4 text-gray-800">
                  Profile Info
                </h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600">
                  <p>
                    <strong>Name:</strong> Luke
                  </p>
                  <p>
                    <strong>Email:</strong> —
                  </p>
                  <p>
                    <strong>GitHub:</strong> —
                  </p>
                  <p>
                    <strong>School/Company:</strong> UTD
                  </p>
                  <p>
                    <strong>Location:</strong> Austin
                  </p>
                  <p>
                    <strong>Status:</strong> Freshman
                  </p>
                  <p>
                    <strong>Resume:</strong> Not uploaded
                  </p>
                  <p>
                    <strong>Joined on:</strong> —
                  </p>
                </div>
              </div>
            </div>

            {/* Combined Top Projects & Languages */}
            <Graphs />

            {/* All Projects */}
            <div className="flex gap-6">
              <div className="bg-white p-6 rounded-lg shadow w-1/2">
                <h3 className="font-bold text-center mb-4 text-gray-800">
                  All Projects
                </h3>
                <p className="text-center text-gray-500">
                  AI Resume Builder
                  <br />
                  Macro+
                </p>
                <h3 className="font-bold text-center mb-4 text-gray-800">
                  Own Projects
                </h3>
              </div>
              <div className="bg-white p-6 rounded-lg shadow w-1/2">
                <h3 className="font-bold text-center mb-4 text-gray-800">
                  Saved Projects
                </h3>
                <p className="text-center text-gray-500">AI Resume Builder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
