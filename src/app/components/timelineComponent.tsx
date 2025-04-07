"use client";
import React, { useState, useEffect } from "react";

const ProjectTimeline: React.FC<{ projectId: number }> = ({ projectId }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const toggleTask = (id: string) => {
    setSelectedTask((prev) => (prev === id ? null : id));
  };
  

  useEffect(() => {
    console.log("📦 Fetching timeline for project ID:", projectId);
    const fetchTimeline = async () => {
      
      try {
        const res = await fetch(`http://52.15.58.198:3000/projects/${projectId}`);
        const project = await res.json();
        console.log("🧠 Project data:", project);
        

        const frontendTasks = project.timeline?.frontend || [];
        const backendTasks = project.timeline?.backend || [];

        const generateDate = (index: number) => {
          const day = (index + 1) * 2;
          const date = new Date();
          const month = date.toLocaleString("default", { month: "short" });
          return `${month} ${String(day).padStart(2, "0")}`;
        };

        const combinedTasks: any[] = [];
        const maxLength = Math.max(frontendTasks.length, backendTasks.length);

        for (let i = 0; i < maxLength; i++) {
          if (frontendTasks[i]) {
            combinedTasks.push({
              date: generateDate(combinedTasks.length),
              frontend: frontendTasks[i],
              description: `Frontend Task ${i + 1}`,
              side: "frontend",
            });
          }
          if (backendTasks[i]) {
            combinedTasks.push({
              date: generateDate(combinedTasks.length),
              backend: backendTasks[i],
              description: `Backend Task ${i + 1}`,
              side: "backend",
            });
          }
        }
        

        setTasks(combinedTasks);
      } catch (err) {
        console.error("Failed to fetch timeline:", err);
      }
    };

    fetchTimeline();
  }, [projectId]);

  return (
    <div className="flex flex-col items-center mt-[24px] bg-[#ffffff] px-[20px] py-[24px] rounded-[12px] border border-[#fff] overflow-x-auto">
      <h2 className="text-[20px] font-[700] text-[#385773] mb-[24px]">Project Timeline</h2>
      <div className="flex w-full">
        {/* Labels */}
        <div className="flex flex-col justify-center gap-[140px] pr-[24px]">
          <div className="text-[#385773] font-[600] text-[14px] text-right">Frontend</div>
          <div className="text-[#385773] font-[600] text-[14px] text-right">Backend</div>
        </div>

        {/* Timeline */}
        <div className="relative flex-1 ml-[26px]">
          <div className="absolute top-1/2 left-0 w-full border-t-[2px] border-[#385773] z-0" />

          <div className="flex justify-around items-center h-[320px] relative z-10 gap-[50px]">
            {tasks.map((task, idx) => (
              <div key={idx} className="relative flex flex-col items-center w-[120px]">
                {task.frontend && (
                <div className="relative flex flex-col items-center w-[140px] h-[160px]">
                  {/* Text floats above */}
                  <div className="absolute top-[-40px] text-[13px] text-[#1f2937] text-center px-[4px]">
                    {task.frontend}
                  </div>

                  {/* Line & Dot fixed in center */}
                  <div className="mt-[32px] w-[2px] h-[40px] border-l border-dotted border-[#9ca3af]" />
                  <div
                    className="w-[12px] h-[12px] bg-[#000000] rounded-full cursor-pointer"
                    onClick={() => toggleTask(`${idx}-frontend`)}
                  />
                  <div className="mt-[2px] text-[12px] text-[#6b7280]">{task.date}</div>

                  {selectedTask === `${idx}-frontend` && (
                    <div className="absolute -bottom-[80px] w-[160px] bg-[#ffffff] text-[#111827] text-[12px] border border-[#d1d5db] shadow rounded-[6px] px-[12px] py-[8px] z-[20]">
                      {task.description}
                    </div>
                  )}
                </div>
              )}

              {task.backend && (
                <div className="relative flex flex-col items-center w-[140px] h-[160px]">
                  {/* Date above dot */}
                  <div className="mt-[55px] text-[12px] text-[#6b7280] mb-[4px]">{task.date}</div>

                  {/* Dot & line fixed in center */}
                  <div
                    className=" w-[12px] h-[12px] bg-[#000000] rounded-full cursor-pointer"
                    onClick={() => toggleTask(`${idx}-backend`)}
                  />
                  <div className="w-[2px] h-[40px] border-l border-dotted border-[#9ca3af]" />

                  {/* Backend task text absolutely positioned below */}
                  <div className="absolute bottom-[-40px] text-[13px] text-[#1f2937] text-center px-[4px]">
                    {task.backend}
                  </div>

                  {/* Tooltip */}
                  {selectedTask === `${idx}-backend` && (
                    <div className="absolute top-[80px] w-[160px] bg-[#ffffff] text-[#111827] text-[12px] border border-[#d1d5db] shadow rounded-[6px] px-[12px] py-[8px] z-[20]">
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

export default ProjectTimeline;
