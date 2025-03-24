// app/myproject/[projectId]/layout.tsx
"use client";
import ProjectSidebar from "../../components/projectsidebar"; 
import ContentSidebar from "../../components/contentsidebar";
import TopBar from "../../components/topbar";
import { useParams } from "next/navigation";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const { projectId } = params;

  return (
    <div>
    <TopBar />
    <div className="flex h-screen bg-gray-100">
      <ProjectSidebar />
      <div className="flex flex-col w-full">
        <div className="flex flex-row h-full">
          <ContentSidebar projectId={projectId as string} />
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </div>s
    </div>
    </div>
  );
}