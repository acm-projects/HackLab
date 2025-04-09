"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Download, Share2, Copy, FileText } from "lucide-react"
import NavBar from "../components/NavBar"

const currentUser = { id: 1, name: "Alex Johnson", role: "Frontend Developer" }

const resumeData = {
  skills: [
    "React", "TypeScript", "Next.js", "Tailwind CSS",
    "Git", "CI/CD", "API Design", "Node.js",
    "Python", "Docker", "Kubernetes", "GraphQL"
  ],
  experience: [
    {
      title: "Frontend Development",
      description: "Implemented responsive UI components using React and Tailwind CSS. Optimized performance by reducing bundle size and implementing code splitting.",
      metrics: "Contributed 4,320 lines of code across 78 commits. Resolved 15 UI-related issues."
    },
    {
      title: "API Integration",
      description: "Designed and implemented RESTful API endpoints. Created efficient data fetching strategies with proper error handling and loading states.",
      metrics: "Developed 8 API endpoints with comprehensive test coverage. Reduced API response time by 40%."
    },
    {
      title: "Performance Optimization",
      description: "Identified and resolved performance bottlenecks in the application. Implemented caching strategies and optimized database queries.",
      metrics: "Improved page load time by 35%. Reduced database query time by 50%."
    }
  ],
  projects: [
    {
      name: "User Authentication System",
      description: "Implemented secure user authentication with JWT tokens and role-based access control.",
      technologies: ["Node.js", "Express", "JWT", "MongoDB"]
    },
    {
      name: "Analytics Dashboard",
      description: "Created interactive data visualization dashboard with real-time updates.",
      technologies: ["React", "D3.js", "WebSockets", "Redux"]
    }
  ]
}

export default function AiResumeGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [resumeGenerated, setResumeGenerated] = useState(false)

  const handleGenerateResume = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setResumeGenerated(true)
    }, 2000)
  }

  return (
    <div className="h-screen w-full flex flex-col bg-[#f1f5f9] text-[#0f172a] font-nunito overflow-hidden">
      <NavBar />
      <div className="flex-1 grid grid-rows-[auto_1fr_160px] px-[24px] md:px-[64px] py-[32px] gap-[32px] mt-[60px] overflow-hidden">

        {/* Section 1: Header + Button */}
        <section className="flex flex-row items-center justify-between gap-[16px]">
          <div>
            <h2 className="text-[28px] font-bold">AI Resume Generator</h2>
            <p className="text-[#64748b] mt-[4px] text-[14px] max-w-[600px]">
              Generate a professional resume using your LinkedIn profile and project GitHub history.
            </p>
          </div>
          <Button
            onClick={handleGenerateResume}
            disabled={isGenerating}
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
        </section>

        {/* Section 2: Resume */}
        <section className="overflow-hidden">
          {!resumeGenerated && !isGenerating ? (
            <Card className="border-dashed border-[2px] bg-white h-[60%]">
              <CardContent className="pt-[24px] flex flex-col items-center justify-center h-[60%] text-center">
                <FileText className="h-[34px] w-[34px] text-[#cbd5e1] mb-[16px]" />
                <h3 className="text-[20px] font-medium mb-[8px]">No Resume Generated Yet</h3>
                <p className="text-[#64748b] max-w-[400px] text-[14px]">
                  Click "Generate Resume" to create an AI-powered resume tailored using your GitHub and LinkedIn.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white h-full overflow-y-auto">
              {/* Future content (Tabs for resume) goes here */}
              <CardContent className="text-center p-10 text-[#64748b]">
                <p>This is where the resume would be shown after generation.</p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Section 3: How It Works */}
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
                  }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center p-[16px] max-w-[280px]"
                  >
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
  )
}