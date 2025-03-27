"use client";
import React, { useState } from "react";

const tasks = [
  { date: "Mar 01", frontend: "Component Dev", description: "Building UI components", side: "frontend" },
  { date: "Mar 02", backend: "API Dev", description: "Designing API endpoints", side: "backend" },
  { date: "Mar 05", frontend: "UI Testing", description: "Testing UI functionality", side: "frontend" },
  { date: "Mar 06", backend: "Load Testing", description: "Ensuring backend performance", side: "backend" },
  { date: "Mar 09", frontend: "Final UI Polish", description: "Finalizing UI styles", side: "frontend" },
  { date: "Mar 10", backend: "Deploy Backend", description: "Deploying backend server", side: "backend" },
];

const TimelinePage = () => {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const toggleTask = (id: string) => {
    setSelectedTask((prev) => (prev === id ? null : id));
  };

  return (
    <div className="p-10 bg-white min-h-screen w-full font-sans">
      <h1 className="text-3xl font-bold text-[#385773] text-center mb-16">Project Timeline</h1>

      <div className="flex">
        {/* Labels on the left */}
        <div className="flex flex-col justify-center gap-[140px] pr-6">
          <div className="text-[#385773] font-semibold text-sm text-right">Frontend</div>
          <div className="text-[#385773] font-semibold text-sm text-right">Backend</div>
        </div>

        {/* Actual Timeline */}
        <div className="relative flex-1">
          {/* Main Horizontal Line */}
          <div className="absolute top-1/2 left-0 w-full border-t-2 border-[#385773] z-0" />

          {/* Nodes */}
          <div className="flex justify-around items-center h-[300px] relative z-10">
            {tasks.map((task, idx) => (
              <div key={idx} className="relative flex flex-col items-center w-[120px]">
                {/* Frontend Task */}
                {task.frontend && (
                  <div className="-mt-9 flex flex-col items-center relative">
                    <div className="mb-2 text-sm text-black">{task.frontend}</div>
                    <div className="w-[2px] h-10 border-l border-dotted border-gray-400" />
                    <div
                      className="w-3 h-3 bg-black rounded-full cursor-pointer"
                      onClick={() => toggleTask(`${idx}-frontend`)}
                    />
                    <div className="mt-2 text-sm text-gray-500">{task.date}</div>

                    {/* Popup Info */}
                    {selectedTask === `${idx}-frontend` && (
                      <div className="absolute -bottom-20 w-[150px] bg-white text-black text-xs border border-gray-300 shadow rounded px-3 py-2 z-20">
                        {task.description}
                      </div>
                    )}
                  </div>
                )}

                {/* Backend Task */}
                {task.backend && (
                  <div className="mt-11 flex flex-col items-center relative">
                    <div className="mt-2 text-sm text-gray-500">{task.date}</div>
                    <div
                      className="w-3 h-3 bg-black rounded-full cursor-pointer"
                      onClick={() => toggleTask(`${idx}-backend`)}
                    />
                    <div className="w-[2px] h-10 border-l border-dotted border-gray-400" />
                    <div className="mt-2 text-sm text-black">{task.backend}</div>

                    {/* Popup Info */}
                    {selectedTask === `${idx}-backend` && (
                      <div className="absolute top-20 w-[150px] bg-white text-black text-xs border border-gray-300 shadow rounded px-3 py-2 z-20">
                        {task.description}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;