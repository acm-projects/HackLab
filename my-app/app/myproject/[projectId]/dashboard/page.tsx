"use client";
import React from "react";

const DashboardPage = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Project Alpha</h1>
          <p className="text-gray-600 max-w-xl text-sm">
            A collaborative platform for team communication and project management.
          </p>
        </div>
        <div className="flex gap-4">
          <span className="bg-gray-200 text-sm text-gray-700 px-3 py-1 rounded-full">
            <strong>Status:</strong> In Development
          </span>
          <span className="bg-gray-200 text-sm text-gray-700 px-3 py-1 rounded-full">
            <strong>Started:</strong> March 1, 2025
          </span>
        </div>
      </div>

      {/* Team Members + Tech Stack */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-[#385773]">Team Members</h2>
          <div className="space-y-4 text-sm text-gray-800">
            <div>
              <h3 className="font-semibold text-[#385773]">Owner</h3>
              <p>Alice Johnson</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#385773]">Frontend</h3>
              <p>Bob Smith</p>
              <p>Charlie Brown</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#385773]">Backend</h3>
              <p>David Lee</p>
              <p>Eve Miller</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-[#385773]">Tech Stack</h2>
          <div className="grid grid-cols-2 text-sm text-gray-800 gap-4">
            <div>
              <h3 className="font-semibold text-[#385773]">Frontend</h3>
              <p>React</p>
              <p>Tailwind CSS</p>
              <p>Redux</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#385773]">Backend</h3>
              <p>Node.js</p>
              <p>Express</p>
              <p>MongoDB</p>
            </div>
          </div>
        </div>
      </div>

      {/* MVP + Stretch Goals */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 border-b pb-2 text-[#385773]">Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-800">
          <div>
            <h3 className="font-semibold text-[#385773] mb-2">MVP</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>User authentication</li>
              <li>Project dashboard with team info</li>
              <li>Task creation & assignment</li>
              <li>Project timeline viewer</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[#385773] mb-2">Stretch Goals</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Real-time chat integration</li>
              <li>AI task suggestions</li>
              <li>Project themes</li>
              <li>Automated reports</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Commit History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 border-b pb-2 text-[#385773]">Recent Commits</h2>
        <ul className="divide-y divide-gray-200 text-sm text-gray-800">
          <li className="py-2">
            <strong>Charlie Brown</strong> — “Fixed authentication bug” 
            <span className="text-gray-500 text-xs ml-2">2 hours ago</span>
          </li>
          <li className="py-2">
            <strong>Bob Smith</strong> — “Added Redux store config” 
            <span className="text-gray-500 text-xs ml-2">1 day ago</span>
          </li>
          <li className="py-2">
            <strong>Eve Miller</strong> — “Initial backend setup” 
            <span className="text-gray-500 text-xs ml-2">2 days ago</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;