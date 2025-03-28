"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ProjectSidebar from "../../components/projectsidebar";
import ContentSidebar from "../../components/contentsidebar";

export default function ProjectPage() {
  const router = useRouter();
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    router.push(`/myproject/${projectId}/dashboard`);
  }, [projectId, router]);

  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
      {/* 10% width */}
      <div className="w-[10%] min-w-[120px] max-w-[160px] bg-white border-r">
        <ProjectSidebar />
      </div>

      {/* 20% width */}
      <div className="w-[20%] min-w-[200px] max-w-[300px] border-r bg-gray-50">
        <ContentSidebar projectId={projectId as string} />
      </div>

      {/* 70% width - Main Content */}
      <main className="w-[70%] overflow-y-auto bg-gray-100">
        {activeTab === "dashboard" && <DashboardPage />}
        {activeTab === "timeline" && <TimelinePage />}
      </main>
    </div>
  );
}

// Dummy components for now
function DashboardPage() {
  return <div>Dashboard Content</div>;
}

function TimelinePage() {
  return <div>Timeline Content</div>;
}
