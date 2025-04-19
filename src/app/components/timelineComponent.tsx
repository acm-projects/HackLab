"use client";
import React, { useState, useEffect } from "react";

interface Task {
  description: string;
  side: "frontend" | "backend";
  label: string;
}

const ProjectTimeline: React.FC<{ projectId: number; isTeamLead?: boolean }> = ({ projectId, isTeamLead = false }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [doneIndices, setDoneIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await fetch(`http://52.15.58.198:3000/projects/${projectId}`);
        const project = await res.json();
        const frontendTasks = project.timeline?.frontend || [];
        const backendTasks = project.timeline?.backend || [];

        const combined: Task[] = [];
        const maxLength = Math.max(frontendTasks.length, backendTasks.length);

        for (let i = 0; i < maxLength; i++) {
          if (frontendTasks[i]) {
            combined.push({ label: frontendTasks[i], description: `Frontend Task ${i + 1}`, side: "frontend" });
          }
          if (backendTasks[i]) {
            combined.push({ label: backendTasks[i], description: `Backend Task ${i + 1}`, side: "backend" });
          }
        }
        setTasks(combined);
      } catch (err) {
        console.error("Failed to fetch timeline:", err);
      }
    };

    fetchTimeline();
  }, [projectId]);

  const handleToggle = (index: number) => {
    if (!isTeamLead) return;

    const newSet = new Set<number>(doneIndices);
    if (!doneIndices.has(index)) {
      // Mark current and all previous tasks as done
      for (let i = 0; i <= index; i++) newSet.add(i);
    } else {
      // Unmark current and all tasks after it
      for (let i = index; i < tasks.length; i++) newSet.delete(i);
    }
    setDoneIndices(newSet);
  };

  return (
    <div className="flex flex-col items-center mt-[14px] bg-[#ffffff] px-[20px] py-[24px] rounded-[12px] border border-[#fff] overflow-x-auto h-[90%]">
      <h2 className="absolute text-[20px] font-[700] text-[#385773] mb-[24px] flex">Project Timeline</h2>
      <div className="flex w-full mt-[150px]">
        <div className="flex flex-col justify-center gap-[140px] pr-[24px]">
          <div className="text-[#385773] font-[600] text-[14px] text-right">Frontend</div>
          <div className="text-[#385773] font-[600] text-[14px] text-right">Backend</div>
        </div>

        <div className="relative flex-1 ml-[26px]">
          <div className="absolute top-1/2 left-0 w-full border-t-[2px] border-[#385773] z-0" />

          <div className="flex justify-around items-center h-[320px] relative z-10 gap-[50px]">
            {tasks.map((task, idx) => (
              <div key={idx} className="relative flex flex-col items-center w-[120px]">
                {task.side === "frontend" && (
                  <div className="relative flex flex-col items-center w-[140px] h-[160px]">
                    <div className="absolute top-[-40px] text-[13px] text-[#1f2937] mt-[-35px] text-center px-[4px]">
                      {task.label}
                    </div>
                    <div className="mt-[32px] w-[2px] h-[40px] border-l border-dotted border-[#9ca3af]" />
                    <div
                      className={`w-[12px] h-[12px] rounded-full cursor-pointer`}
                      style={{
                        backgroundColor: doneIndices.has(idx) ? "#FFDA03" : "#000000",
                      }}
                      onClick={() => handleToggle(idx)}
                    />
                  </div>
                )}

                {task.side === "backend" && (
                  <div className="relative flex flex-col items-center w-[140px] h-[160px]">
                    <div
                      className={`w-[12px] h-[12px] mt-[75px] rounded-full cursor-pointer`}
                      style={{
                        backgroundColor: doneIndices.has(idx) ? "#FFDA03" : "#000000",
                      }}
                      onClick={() => handleToggle(idx)}
                    />
                    <div className="w-[2px] h-[40px] border-l border-dotted border-[#9ca3af]" />
                    <div className="absolute bottom-[-40px] text-[13px] text-[#1f2937] translate-y-[20px] text-center px-[4px]">
                      {task.label}
                    </div>
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
