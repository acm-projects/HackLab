"use client";
import React, { useState, useEffect } from "react";

interface ProjectTimelineProps {
  projectId: number;
  userId?: number;
  teamLeadId?: number;
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ projectId, userId, teamLeadId }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [completionStatus, setCompletionStatus] = useState<{ [key: string]: boolean }>({});

  const isTeamLead = userId && teamLeadId && userId === teamLeadId;

  const toggleTooltip = (id: string) => {
    setSelectedTask((prev) => (prev === id ? null : id));
  };

  const toggleTaskCompletion = (idx: number, side: "frontend" | "backend") => {
    const key = `${idx}-${side}`;
    const otherSide = side === "frontend" ? "backend" : "frontend";
    const otherKey = `${idx}-${otherSide}`;

    const newStatus = { ...completionStatus };
    const toggled = !newStatus[key];

    newStatus[key] = toggled;
    if (newStatus[otherKey] !== undefined) {
      newStatus[otherKey] = toggled;
    }

    setCompletionStatus(newStatus);
  };

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await fetch(`http://52.15.58.198:3000/projects/${projectId}`);
        const project = await res.json();

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

        // Init all tasks as incomplete
        const initialStatus: { [key: string]: boolean } = {};
        combinedTasks.forEach((task, idx) => {
          if (task.frontend) initialStatus[`${idx}-frontend`] = false;
          if (task.backend) initialStatus[`${idx}-backend`] = false;
        });

        setTasks(combinedTasks);
        setCompletionStatus(initialStatus);
      } catch (err) {
        console.error("Failed to fetch timeline:", err);
      }
    };

    fetchTimeline();
  }, [projectId]);

  return (
    <div className="flex w-full bg-[#f5f7fa]">
      <div className="w-[270px] bg-[#385773] py-[15px] text-[#fff] flex flex-col gap-[5px] overflow-y-auto border-r border-[#fff] mt-[50px]">
        <div className="text-center font-bold text-[18px] mb-[10px]">Timeline View</div>
      </div>

      <div className="flex-1 p-[40px] font-sans overflow-y-auto">
        <h1 className="text-[28px] font-bold text-[#385773] text-center mb-[40px]">Project Timeline</h1>

        <div className="flex">
          <div className="flex flex-col justify-center gap-[140px] pr-[24px]">
            <div className="text-[#385773] font-semibold text-[14px] text-right">Frontend</div>
            <div className="text-[#385773] font-semibold text-[14px] text-right">Backend</div>
          </div>

          <div className="relative flex-1">
            <div className="absolute top-1/2 left-0 w-full border-t-[2px] border-[#385773] z-0" />

            <div className="flex justify-around items-center h-[320px] relative z-10">
              {tasks.map((task, idx) => (
                <div key={idx} className="relative flex flex-col items-center w-[120px]">
                  {task.frontend && (
                    <div className="-mt-[40px] flex flex-col items-center relative">
                      <div className="mb-[8px] text-[13px] text-[#1f2937]">{task.frontend}</div>
                      <div className="w-[2px] h-[40px] border-l border-dotted border-gray-400" />
                      <div
                        className={`w-[12px] h-[12px] rounded-full cursor-pointer ${
                          completionStatus[`${idx}-frontend`] ? "bg-yellow-400" : "bg-black"
                        }`}
                        onClick={() =>
                          isTeamLead
                            ? toggleTaskCompletion(idx, "frontend")
                            : toggleTooltip(`${idx}-frontend`)
                        }
                      />
                      <div className="mt-[8px] text-[12px] text-[#6b7280]">{task.date}</div>

                      {selectedTask === `${idx}-frontend` && (
                        <div className="absolute -bottom-[80px] w-[160px] bg-white text-black text-[12px] border border-gray-300 shadow rounded px-[12px] py-[8px] z-20">
                          {task.description}
                        </div>
                      )}
                    </div>
                  )}

                  {task.backend && (
                    <div className="mt-[44px] flex flex-col items-center relative">
                      <div className="mt-[8px] text-[12px] text-[#6b7280]">{task.date}</div>
                      <div
                        className={`w-[12px] h-[12px] rounded-full cursor-pointer ${
                          completionStatus[`${idx}-backend`] ? "bg-yellow-400" : "bg-black"
                        }`}
                        onClick={() =>
                          isTeamLead
                            ? toggleTaskCompletion(idx, "backend")
                            : toggleTooltip(`${idx}-backend`)
                        }
                      />
                      <div className="w-[2px] h-[40px] border-l border-dotted border-gray-400" />
                      <div className="mt-[8px] text-[13px] text-[#1f2937]">{task.backend}</div>

                      {selectedTask === `${idx}-backend` && (
                        <div className="absolute top-[80px] w-[160px] bg-white text-black text-[12px] border border-gray-300 shadow rounded px-[12px] py-[8px] z-20">
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
    </div>
  );
};

export default ProjectTimeline;
