"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamOverview from "./teamOverview/page";
import AiResumeGenerator from "./resumeGenerator/page";

export default function HomePage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">

    <div className="overflow-y-scroll bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9]">
      <header className="bg-[#ffffff] border-b border-[#e2e8f0] py-[32px]">
        <div className="max-w-[1200px] mx-auto px-[16px]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-[16px]">
            <div>
              <h1 className="text-[30px] font-bold text-[#1e293b]">CodeCollab</h1>
              <p className="text-[16px] text-[#475569] mt-[8px]">
                A real-time collaborative coding platform with integrated AI assistance and version control
              </p>
              <p className="text-[14px] text-[#64748b] mt-[4px]">Hackathon Project • April 2025 • Team Innovators</p>
            </div>
            <div className="flex items-center gap-[12px]">
              <a
                href="https://github.com/team-innovators/codecollab"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-[8px] px-[16px] py-[8px] rounded-[8px] bg-[#f1f5f9] hover:bg-[#e2e8f0] transition-colors text-[#1e293b]"
              >
                {/* GitHub icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-github"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
                GitHub Repository
              </a>
              <a
                href="https://codecollab-demo.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-[8px] px-[16px] py-[8px] rounded-[8px] bg-[#1e293b] hover:bg-[#334155] transition-colors text-[#ffffff]"
              >
                {/* External Link icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-external-link"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" x2="21" y1="14" y2="3"></line>
                </svg>
                Live Demo
              </a>
            </div>
          </div>
          <div className="mt-[24px] p-[16px] bg-[#f8fafc] rounded-[8px] border border-[#e2e8f0] text-[14px] text-[#334155]">
            <p className="font-medium mb-[8px]">Project Overview:</p>
            <p>
              CodeCollab enables developers to write, review, and debug code together in real-time. The platform
              features AI-powered code suggestions, integrated version control, and collaborative debugging tools. Built
              during the Spring 2025 Hackathon, our team completed all MVP requirements and several stretch goals within
              48 hours.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-[16px] py-[32px]">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-[32px]">
            <TabsTrigger value="overview">Team Overview</TabsTrigger>
            <TabsTrigger value="resume">AI Resume</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-[16px]">
            <TeamOverview />
          </TabsContent>

          <TabsContent value="resume" className="mt-[16px]">
            <AiResumeGenerator />
          </TabsContent>
        </Tabs>
      </main>
    </div>
    </div>
  );
}
