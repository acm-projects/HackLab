"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";

const tabs = [
  { name: "Dashboard", path: "dashboard" },
  { name: "Timeline", path: "timeline" },
  { name: "Chat", path: "chat" }, 
];

const ContentSidebar = ({ projectId }: { projectId: string }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="bg-[#4A6B8A] text-white w-[200px] h-screen py-8 flex flex-col items-start gap-2 px-4">
      {tabs.map((tab) => {
        const isActive = pathname?.includes(tab.path);

        return (
          <button
            key={tab.name}
            onClick={() => router.push(`/myproject/${projectId}/${tab.path}`)}
            className={`px-4 py-2 w-[160px] text-left rounded-l-lg transition-all duration-200 
              ${
                isActive
                  ? "bg-[#2F4D6A] font-semibold"
                  : "hover:bg-[#3C5F80]"
              }`}
          >
            {tab.name}
          </button>
        );
      })}
    </div>
  );
};

export default ContentSidebar;