"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ProjectSidebar from "../../components/projectsidebar";
import ContentSidebar from "../../components/contentsidebar";


export default function ProjectPage() {
  const router = useRouter();
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState("dashboard"); // Default tab

  useEffect(() => {
    // If the user visits `/myproject/[projectId]`, ensure they go to `/dashboard`
    router.push(`/myproject/${projectId}/dashboard`);
  }, [projectId, router]);

  return (
    <div>
     
      <div className="flex h-screen bg-gray-100">
        <ProjectSidebar />
        <div className="flex flex-col w-full">
          <div className="flex flex-row h-full">
            <ContentSidebar projectId={projectId as string} />
            <main className="flex-1 p-6 overflow-y-auto">
              {activeTab === "dashboard" && <DashboardPage />}
              {activeTab === "timeline" && <TimelinePage />}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simulated Dashboard and Timeline pages (Replace with actual imports if needed)
function DashboardPage() {
  return <div>Dashboard Content</div>;
}

function TimelinePage() {
  return <div>Timeline Content</div>;
}
