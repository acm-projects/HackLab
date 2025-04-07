"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Download, Share2, Copy, FileText } from "lucide-react"

// Mock team members
const teamMembers = [
  { id: 1, name: "Alex Johnson", role: "Frontend Developer" },
  { id: 2, name: "Sam Rivera", role: "Backend Developer" },
  { id: 3, name: "Taylor Kim", role: "Full Stack Developer" },
  { id: 4, name: "Jordan Patel", role: "DevOps Engineer" },
]

// Mock resume data
const resumeData = {
  skills: [
    "React",
    "TypeScript",
    "Next.js",
    "Tailwind CSS",
    "Git",
    "CI/CD",
    "API Design",
    "Node.js",
    "Python",
    "Docker",
    "Kubernetes",
    "GraphQL",
  ],
  experience: [
    {
      title: "Frontend Development",
      description:
        "Implemented responsive UI components using React and Tailwind CSS. Optimized performance by reducing bundle size and implementing code splitting.",
      metrics: "Contributed 4,320 lines of code across 78 commits. Resolved 15 UI-related issues.",
    },
    {
      title: "API Integration",
      description:
        "Designed and implemented RESTful API endpoints. Created efficient data fetching strategies with proper error handling and loading states.",
      metrics: "Developed 8 API endpoints with comprehensive test coverage. Reduced API response time by 40%.",
    },
    {
      title: "Performance Optimization",
      description:
        "Identified and resolved performance bottlenecks in the application. Implemented caching strategies and optimized database queries.",
      metrics: "Improved page load time by 35%. Reduced database query time by 50%.",
    },
  ],
  projects: [
    {
      name: "User Authentication System",
      description: "Implemented secure user authentication with JWT tokens and role-based access control.",
      technologies: ["Node.js", "Express", "JWT", "MongoDB"],
    },
    {
      name: "Analytics Dashboard",
      description: "Created interactive data visualization dashboard with real-time updates.",
      technologies: ["React", "D3.js", "WebSockets", "Redux"],
    },
  ],
}

export default function AiResumeGenerator() {
  const [selectedMember, setSelectedMember] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [resumeGenerated, setResumeGenerated] = useState<boolean>(false)

  const handleGenerateResume = () => {
    if (!selectedMember) return

    setIsGenerating(true)

    // Simulate API call to generate resume
    setTimeout(() => {
      setIsGenerating(false)
      setResumeGenerated(true)
    }, 2000)
  }

  return (
    <div className="space-y-[24px]">
    <div className="flex flex-col md:flex-row md:items-end gap-[16px] md:gap-[24px]">
      <div className="flex-1 space-y-[8px]">
        <h2 className="text-[24px] font-bold text-[#1e293b]">AI Resume Generator</h2>
        <p className="text-[#475569]">
          Generate a professional resume based on git commit history and project contributions
        </p>
        <Select value={selectedMember} onValueChange={setSelectedMember}>
          <SelectTrigger className="w-50px sm:w-[200px]">
            <SelectValue placeholder="Select team member" />
          </SelectTrigger>
          <SelectContent>
            {teamMembers.map((member) => (
              <SelectItem key={member.id} value={member.id.toString()}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
        <Button
          onClick={handleGenerateResume}
          disabled={!selectedMember || isGenerating}
          className="width-[50px]"
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

            {!resumeGenerated && !isGenerating && (
        <Card className="border-dashed border-[2px]">
            <CardContent className="pt-[24px] flex flex-col items-center justify-center min-h-[400px] text-center">
            <FileText className="h-[64px] w-[64px] text-[#cbd5e1] mb-[16px]" />
            <h3 className="text-[20px] font-medium text-[#334155] mb-[8px]">No Resume Generated Yet</h3>
            <p className="text-[#64748b] max-w-[400px]">
                Select a team member and click "Generate Resume" to create an AI-powered resume based on their git
                activity and project contributions.
            </p>
            </CardContent>
        </Card>
        )}

{resumeGenerated && (
  <Card>
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-[20px] text-[#1e293b]">
            {teamMembers.find((m) => m.id.toString() === selectedMember)?.name}'s Resume
          </CardTitle>
          <CardDescription className="text-[#64748b] text-[14px]">
            Generated based on git activity and project contributions
          </CardDescription>
        </div>
        <div className="flex gap-[8px]">
          <Button variant="outline" size="sm" className="text-[14px] px-[10px] py-[6px]">
            <Copy className="h-[16px] w-[16px] mr-[8px]" />
            Copy
          </Button>
          <Button variant="outline" size="sm" className="text-[14px] px-[10px] py-[6px]">
            <Download className="h-[16px] w-[16px] mr-[8px]" />
            Download
          </Button>
          <Button variant="outline" size="sm" className="text-[14px] px-[10px] py-[6px]">
            <Share2 className="h-[16px] w-[16px] mr-[8px]" />
            Share
          </Button>
        </div>
      </div>
    </CardHeader>

    <CardContent>
      <Tabs defaultValue="resume" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-[24px]">
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="resume">
          <div className="space-y-[24px]">
            {/* Summary */}
            <div>
              <h3 className="text-[18px] font-semibold mb-[12px]">Professional Summary</h3>
              <p className="text-[#334155] text-[14px]">
                {teamMembers.find((m) => m.id.toString() === selectedMember)?.role} with strong expertise in
                modern web technologies and collaborative development. Demonstrated ability to deliver
                high-quality code, optimize performance, and solve complex technical challenges. Committed to best
                practices, clean code, and continuous improvement.
              </p>
            </div>

            {/* Experience */}
            <div>
              <h3 className="text-[18px] font-semibold mb-[12px]">Experience Highlights</h3>
              <div className="space-y-[16px]">
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="border-l-[2px] border-[#e2e8f0] pl-[16px] py-[4px]">
                    <h4 className="font-medium text-[#1e293b]">{exp.title}</h4>
                    <p className="text-[#475569] text-[14px] mt-[4px]">{exp.description}</p>
                    <p className="text-[12px] text-[#94a3b8] mt-[8px] italic">{exp.metrics}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-[18px] font-semibold mb-[12px]">Technical Skills</h3>
              <div className="flex flex-wrap gap-[8px]">
                {resumeData.skills.slice(0, 8).map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
                <Badge variant="outline">+{resumeData.skills.length - 8} more</Badge>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="skills">
  <div className="space-y-[24px]">
    {/* Skills List */}
    <div>
      <h3 className="text-[18px] font-semibold mb-[12px]">Technical Skills</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[16px]">
        {resumeData.skills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center gap-[12px] p-[12px] bg-[#f8fafc] rounded-[8px]"
          >
            <div className="h-[8px] w-[8px] rounded-full bg-[#334155]"></div>
            <span className="text-[14px] text-[#1e293b]">{skill}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Skill Analysis */}
    <div>
      <h3 className="text-[18px] font-semibold mb-[12px]">Skill Analysis</h3>
      <p className="text-[#334155] mb-[16px] text-[14px]">
        Based on commit history and code contributions, here's an analysis of skill proficiency:
      </p>
      <div className="space-y-[12px]">
        {resumeData.skills.slice(0, 5).map((skill, index) => {
          const percent = Math.floor(Math.random() * 30 + 70)
          return (
            <div key={index} className="space-y-[4px]">
              <div className="flex justify-between text-[13px] text-[#475569]">
                <span>{skill}</span>
                <span>{percent}%</span>
              </div>
              <div className="h-[8px] bg-[#e2e8f0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#334155] rounded-full"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  </div>
</TabsContent>


<TabsContent value="projects">
  <div className="space-y-[24px]">
    <div>
      <h3 className="text-[18px] font-semibold mb-[12px]">Project Contributions</h3>
      <div className="space-y-[24px]">
        {resumeData.projects.map((project, index) => (
          <Card key={index}>
            <CardHeader className="pb-[8px]">
              <CardTitle className="text-[16px] text-[#0f172a]">{project.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[14px] text-[#334155]">{project.description}</p>
              <div className="flex flex-wrap gap-[8px] mt-[12px]">
                {project.technologies.map((tech, i) => (
                  <Badge key={i} variant="outline" className="text-[13px] px-[10px] py-[4px]">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="text-[13px] text-[#64748b] border-t pt-[16px]">
              Contributed {Math.floor(Math.random() * 20 + 10)} commits with{" "}
              {Math.floor(Math.random() * 1000 + 500)} lines of code
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  </div>
</TabsContent>

            </Tabs>
          </CardContent>

                <CardFooter className="border-t pt-[16px] flex justify-between">
        <div className="text-[13px] text-[#64748b]">
            Generated on {new Date().toLocaleDateString()} • Based on git activity
        </div>
        </CardFooter>
        </Card>
      )}

<Card className="bg-[#f8fafc] mt-[24px]">
  <CardHeader>
    <CardTitle className="text-[18px] text-[#0f172a]">How It Works</CardTitle>
    <CardDescription className="text-[14px] text-[#475569]">
      Our AI analyzes git commits and project contributions to generate personalized resumes
    </CardDescription>
  </CardHeader>

  <CardContent>

    <div className="flex flex-row gap-[24px]">
      {[
        {
          title: "Analyze Git History",
          text: "Our AI scans commit history, pull requests, and code changes to understand your contributions.",
        },
        {
          title: "Extract Skills & Experience",
          text: "The system identifies technologies, patterns, and accomplishments from your code.",
        },
        {
          title: "Generate Professional Resume",
          text: "A tailored resume is created highlighting your strengths and achievements.",
        },
      ].map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center text-center p-[16px]"
        >
          <div className="bg-white p-[12px] rounded-full mb-[16px] shadow-sm">
            <FileText className="h-[24px] w-[24px] text-[#334155]" />
          </div>
          <h3 className="font-medium mb-[8px] text-[15px] text-[#0f172a]">{item.title}</h3>
          <p className="text-[13px] text-[#64748b]">{item.text}</p>
        </div>
      ))}
    </div>
  </CardContent>
</Card>
    </div>
  )
}

