"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FileText } from "lucide-react";
import NavBar from "../components/NavBar";

export default function AiResumeGenerator() {
  const { data: session } = useSession();
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeGenerated, setResumeGenerated] = useState(false);
  const [completedProjects, setCompletedProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedGithub, setSelectedGithub] = useState<string>("");
  const [latexOutput, setLatexOutput] = useState<string>("");
  const [linkedin, setLinkedin] = useState<string>("");

  useEffect(() => {
    const fetchCompletedProjects = async () => {
      if (!session?.user?.email) return;

      try {
        const usersRes = await fetch("http://52.15.58.198:3000/users");
        const users = await usersRes.json();
        const matchedUser = users.find((u: any) => u.email === session.user.email);
        if (!matchedUser) return;

        const userProjectsRes = await fetch(`http://52.15.58.198:3000/users/${matchedUser.id}/projects`);
        const userProjectLinks = await userProjectsRes.json();
        const projectIds = userProjectLinks.map((link: any) => link.project_id);

        const allProjectsRes = await fetch("http://52.15.58.198:3000/projects");
        const allProjects = await allProjectsRes.json();

        const completedList = allProjects.filter(
          (p: any) => projectIds.includes(p.id) && p.completed && p.github_repo_url
        );

        // Add fallback manual project option
        const fallback = {
          id: 99999,
          title: "HackLab (Manual Entry)",
          github_repo_url: "https://github.com/acm-projects/HackLab",
        };

        const all = [...completedList, fallback];
        setCompletedProjects(all);
        setSelectedProjectId(all[0]?.id);
        setSelectedGithub(all[0]?.github_repo_url);
      } catch (err) {
        console.error("Failed to fetch completed projects:", err);
      }
    };

    fetchCompletedProjects();
  }, [session]);

  const handleGenerateResume = async () => {
    if (!session?.user?.email || !selectedProjectId || !selectedGithub || !linkedin) {
      alert("Missing required information.");
      return;
    }

    setIsGenerating(true);
    try {
      const usersRes = await fetch("http://52.15.58.198:3000/users");
      const allUsers = await usersRes.json();
      const currentUser = allUsers.find((u: any) => u.email === session.user?.email);

      if (!currentUser) throw new Error("User not found");

      const github_username = currentUser.github || "";
      const db_name = currentUser.name;

      const url = `http://52.15.58.198:3000/projects/${selectedProjectId}/generateResume?linkedin=${encodeURIComponent(linkedin)}&github=${encodeURIComponent(selectedGithub)}&github_username=${encodeURIComponent(github_username)}&db_name=${encodeURIComponent(db_name)}`;

      console.log("🔗 Resume POST URL:", url);

      const res = await fetch(url, { method: "POST" });
      console.log("🧾 Raw response:", res);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Backend Error Response:", errorText);
        throw new Error("Failed to generate resume");
      }

      const latexCode = await res.text();
      setLatexOutput(latexCode);
      setResumeGenerated(true);
    } catch (err) {
      console.error("❌ Resume generation error:", err);
      alert("Something went wrong while generating the resume.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#f1f5f9] text-[#0f172a] font-nunito overflow-hidden">
      <NavBar />
      <div className="flex-1 grid grid-rows-[auto_1fr_160px] px-[24px] md:px-[64px] py-[32px] gap-[32px] mt-[60px] overflow-hidden">
        {/* Header + LinkedIn + Dropdown + Button */}
        <section className="flex flex-row items-center justify-between gap-[16px]">
          <div>
            <h2 className="text-[28px] font-bold">AI Resume Generator</h2>
            <p className="text-[#64748b] mt-[4px] text-[14px] max-w-[600px]">
              Generate a professional resume using your LinkedIn profile and project GitHub history.
            </p>
          </div>

          <div className="flex items-center gap-[10px]">
            <input
              type="text"
              placeholder="Enter LinkedIn URL"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="px-[12px] py-[8px] border border-gray-300 rounded-[6px] text-[14px] text-[#0f172a] w-[280px]"
            />
            <select
              value={selectedProjectId?.toString() || ""}
              onChange={(e) => {
                const project = completedProjects.find(p => p.id.toString() === e.target.value);
                if (project) {
                  setSelectedProjectId(project.id);
                  setSelectedGithub(project.github_repo_url);
                }
              }}
              className="px-[12px] py-[8px] border border-gray-300 rounded-[6px] text-[14px] text-[#0f172a]"
            >
              <option value="">Select a completed project</option>
              {completedProjects.map((proj) => (
                <option key={proj.id} value={proj.id.toString()}>
                  {proj.title} – {proj.github_repo_url}
                </option>
              ))}
            </select>

            <Button
              onClick={handleGenerateResume}
              disabled={isGenerating || !selectedProjectId || !linkedin}
              className="w-[160px]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-[8px] h-[16px] w-[16px] animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Resume"
              )}
            </Button>
          </div>
        </section>

        {/* Resume Output Section */}
        <section className="overflow-hidden">
          {!resumeGenerated && !isGenerating ? (
            <Card className="bg-white h-full overflow-y-auto">
              <CardContent className="text-left p-6">
                <pre className="whitespace-pre-wrap text-[12px] font-mono text-[#334155]">
                  {latexOutput}
                </pre>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white h-full overflow-y-auto">
              <CardContent className="text-center p-10 text-[#64748b]">
                <p>This is where the resume would be shown after generation.</p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Info Footer */}
        <section className="h-full">
          <Card className="bg-[#f8fafc] w-[50%] h-full">
            <CardHeader>
              <CardTitle className="text-[18px]">How It Works</CardTitle>
              <CardDescription className="text-[14px] text-[#475569]">
                We combine your LinkedIn data with GitHub commits to create a resume tailored to your contributions.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full flex items-center">
              <div className="flex flex-row gap-[24px] justify-between w-full">
                {[
                  {
                    title: "Analyze LinkedIn Profile",
                    text: "We retrieve your LinkedIn details such as roles, education, and highlights.",
                  },
                  {
                    title: "Scan GitHub History",
                    text: "We extract key insights from your repositories, commit activity, and pull requests.",
                  },
                  {
                    title: "Generate Tailored Resume",
                    text: "We merge the data to build a personalized and visually appealing resume.",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center text-center p-[16px] max-w-[280px]">
                    <div className="bg-white p-[12px] rounded-full mb-[16px] shadow-sm">
                      <FileText className="h-[24px] w-[24px] text-[#334155]" />
                    </div>
                    <h3 className="font-medium mb-[8px] text-[15px]">{item.title}</h3>
                    <p className="text-[13px] text-[#64748b]">{item.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
