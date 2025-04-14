"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, Github, Linkedin } from "lucide-react";
import NavBar from "../components/NavBar";

export default function AiResumeGenerator() {
  const { data: session } = useSession();
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeGenerated, setResumeGenerated] = useState(false);
  const [latexOutput, setLatexOutput] = useState<string>("");

  const handleGenerateResume = async () => {
    setIsGenerating(true);
  
    try {
      console.log("🧠 Full session object:", session);

      if (!session?.user) {
        throw new Error("No active session found");
      }

      const user = session.user as any;
      
      // Fallback values if not in session
      const github_username = user.github_username ;
      const db_name = user.name;
      const id = user.id;

      if (!id) {
        throw new Error("Missing user ID in session");
      }

      console.log("📦 Sending to backend:", { github_username, db_name, id });

      const res = await fetch(`http://52.15.58.198:3000/users/${id}/generateResume`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ github_username, db_name }),
      });
  
      if (!res.ok) {
        const errText = await res.text();
        console.error("❌ Backend Error:", errText);
        throw new Error("Failed to generate resume.");
      }
  
      const latex = await res.text();
      setLatexOutput(latex);
      setResumeGenerated(true);
    } catch (err) {
      console.error("Resume generation error:", err);
      alert("Something went wrong while generating the resume.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col text-[#0f172a] font-nunito">
      <NavBar />
      <div className="flex flex-col px-[24px] md:px-[64px] pt-[32px] gap-[32px]">
        {/* Header */}
        <section className="flex flex-row items-center justify-between mt-[-20px] ml-[-50px]">
        <img src="/images/resumeJuno.png" alt="Image 1" className="w-[340px] h-[250px]"/>
          <div className="bg-[#fff] translate-x-[-300px]">
            <h2 className="text-[24px] font-bold mt-[60px]">Create Resume with Juno</h2>
            <p className="text-[#64748b] mt-[4px] text-[13px] max-w-[600px]">
              Generate a professional resume based on your GitHub contributions and LinkedIn profile.
            </p>
          </div>
          
          <Button onClick={handleGenerateResume} disabled={isGenerating} className="w-[180px] bg-[#385773] border-none outline-none cursor-pointer hover:bg-[#739fc5]">
            {isGenerating ? (
              <>
                <Loader2 className="mr-[10px] h-[10px] w-[10px] animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Resume"
            )}
          </Button>
        </section>

        {/* Side-by-side content */}
        <section className="flex flex-row gap-[32px] h-[calc(100vh-140px)] mt-[-80px]">
          {/* Left: Resume Output (70%) */}
          <div className="w-[70%] h-[85%] flex flex-col gap-4">
            <Card className="bg-[#fff] mb-[10px]">
              <CardHeader>
                <CardTitle className="text-[18px]">Personalized Resume created with Juno</CardTitle>
                <CardDescription className="text-[14px]">
                  LaTeX code output for your professional resume
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-[#fff] flex-grow overflow-y-auto">
              <CardContent className="p-[30px]">
                <pre className="whitespace-pre-wrap text-[15px] font-mono text-[#334155] bg-[#f8fafc] p-[15px] rounded-md" style={{
      fontFamily: "'Nunito', sans-serif",
    }}>
                  {latexOutput || "Your resume LaTeX code will appear here once generated."}
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* Right: How It Works (30%) */}
          <div className="w-[30%] h-[78%] min-w-[300px]">
            <Card className="bg-[#f8fafc] h-full overflow-auto">
              <CardHeader>
                <CardTitle className="text-[18px]">How We Build Your Resume</CardTitle>
                <CardDescription className="text-[14px] text-[#475569]">
                  Combining your GitHub and LinkedIn data for a comprehensive profile
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[50%] flex flex-col gap-[28px] items-center justify-start">
                {[
                  {
                    icon: <Github className="h-[24px] w-[24px] text-[#334155]" />,
                    title: "GitHub Analysis",
                    text: "We analyze your repositories, commit history, and contributions to understand your technical skills and project experience.",
                  },
                  {
                    icon: <Linkedin className="h-[24px] w-[24px] text-[#0a66c2]" />,
                    title: "LinkedIn Integration",
                    text: "Your professional experience, education, and skills from LinkedIn help us create a well-rounded profile.",
                  },
                  {
                    icon: <FileText className="h-[24px] w-[24px] text-[#334155]" />,
                    title: "Smart Compilation",
                    text: "We combine both data sources with AI analysis to highlight your strongest qualifications in a professional format.",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center text-center p-[16px] max-w-full">
                    <div className="bg-white p-[12px] rounded-full mb-[16px] shadow-sm">
                      {item.icon}
                    </div>
                    <h3 className="font-medium mb-[8px] text-[15px]">{item.title}</h3>
                    <p className="text-[13px] text-[#64748b]">{item.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}