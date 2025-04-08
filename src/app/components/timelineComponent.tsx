"use client";
import React, { useState, useEffect } from "react";

interface Task {
  date: string;
  description: string;
  frontend?: string;
  backend?: string;
  side: "frontend" | "backend";
  originalIndex: number;
}

const ProjectTimeline: React.FC<{ projectId: number; isLeader: boolean }> = ({
  projectId,
  isLeader,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);

  const LOCAL_STORAGE_KEY = `project-${projectId}-completed-tasks`;

  const toggleTask = (id: string) => {
    setSelectedTask((prev) => (prev === id ? null : id));
  };

  const saveToLocalStorage = (completedKeys: string[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(completedKeys));
  };

  const toggleComplete = (
    key: string,
    side: "frontend" | "backend",
    originalIndex: number
  ) => {
    if (!isLeader) return;

    const isCurrentlyCompleted = completed.includes(key);

    let updated: string[];

    if (isCurrentlyCompleted) {
      const sameSideKeysToRemove = tasks
        .filter((t) => t.side === side && t.originalIndex >= originalIndex)
        .map((t) => generateKey(t.side, t.originalIndex));

      updated = completed.filter((k) => !sameSideKeysToRemove.includes(k));
    } else {
      const sameSideKeysToAdd = tasks
        .filter((t) => t.side === side && t.originalIndex <= originalIndex)
        .map((t) => generateKey(t.side, t.originalIndex));

      updated = Array.from(new Set([...completed, ...sameSideKeysToAdd]));
    }

    setCompleted(updated);
    saveToLocalStorage(updated);
  };

  const generateKey = (side: string, index: number) => {
    return `project-${projectId}-${side}-${index}`;
  };

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) setCompleted(JSON.parse(saved));
    else setCompleted([]);
  }, [projectId]);

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

        const combinedTasks: Task[] = [];
        const maxLength = Math.max(frontendTasks.length, backendTasks.length);

        for (let i = 0; i < maxLength; i++) {
          if (frontendTasks[i]) {
            combinedTasks.push({
              date: generateDate(combinedTasks.length),
              frontend: frontendTasks[i],
              description: `Frontend Task ${i + 1}`,
              side: "frontend",
              originalIndex: i,
            });
          }
          if (backendTasks[i]) {
            combinedTasks.push({
              date: generateDate(combinedTasks.length),
              backend: backendTasks[i],
              description: `Backend Task ${i + 1}`,
              side: "backend",
              originalIndex: i,
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
    <div className="bg-white px-[20px] py-[20px] rounded-[8px] shadow-md border border-[#d1d5db]">
      <h1 className="text-[22px] font-bold text-[#111827] mb-[20px]">
        Project Timeline
      </h1>

      <div className="flex">
        {/* Labels on the left */}
        <div className="flex flex-col justify-center gap-[140px] pr-[24px]">
          <div className="text-[#385773] font-semibold text-[14px] text-right">
            Frontend
          </div>
          <div className="text-[#385773] font-semibold text-[14px] text-right">
            Backend
          </div>
        </div>

        {/* Actual Timeline */}
        <div className="relative flex-1 overflow-x-auto max-w-full">
          <div className="relative w-max px-[20px] py-[30px]">
            <div className="absolute top-1/2 left-0 h-[2px] w-full bg-[#385773] z-0" />

            <div className="flex items-center gap-[80px] relative z-10">
              {tasks.map((task, idx) => {
                const key =
                  task.side === "frontend"
                    ? generateKey("frontend", task.originalIndex)
                    : generateKey("backend", task.originalIndex);

                return (
                  <div
                    key={idx}
                    className="relative flex flex-col items-center min-w-[120px]"
                  >
                    {task.frontend && (
                      <div className="-mt-[30px] flex flex-col items-center relative">
                        <div className="mb-[6px] text-[12px] text-[#1f2937]">
                          {task.frontend}
                        </div>
                        <div className="w-[2px] h-[30px] border-l border-dotted border-[#9ca3af]" />
                        <div
                          className="rounded-full cursor-pointer"
                          style={{
                            width: "10px",
                            height: "10px",
                            backgroundColor: completed.includes(key)
                              ? "#DAA520"
                              : "#385773",
                          }}
                          onClick={() =>
                            toggleComplete(key, "frontend", task.originalIndex)
                          }
                        />
                        <div className="mt-[6px] text-[11px] text-[#6b7280] invisible">
                          placeholder
                        </div>

                        {selectedTask === key && (
                          <div className="absolute -bottom-[70px] w-[140px] bg-white text-black text-[11px] border border-[#d1d5db] shadow rounded px-[10px] py-[6px] z-20">
                            {task.description}
                          </div>
                        )}
                      </div>
                    )}

                    {task.backend && (
                      <div className="mt-[34px] flex flex-col items-center relative">
                        <div className="mt-[6px] text-[11px] text-[#6b7280] invisible">
                          placeholder
                        </div>
                        <div
                          className="rounded-full cursor-pointer"
                          style={{
                            width: "10px",
                            height: "10px",
                            backgroundColor: completed.includes(key)
                              ? "#facc15"
                              : "#385773",
                          }}
                          onClick={() =>
                            toggleComplete(key, "backend", task.originalIndex)
                          }
                        />
                        <div className="w-[2px] h-[30px] border-l border-dotted border-[#9ca3af]" />
                        <div className="mt-[6px] text-[12px] text-[#1f2937]">
                          {task.backend}
                        </div>

                        {selectedTask === key && (
                          <div className="absolute top-[70px] w-[140px] bg-white text-black text-[11px] border border-[#d1d5db] shadow rounded px-[10px] py-[6px] z-20">
                            {task.description}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTimeline;
