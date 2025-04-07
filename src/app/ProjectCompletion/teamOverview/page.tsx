import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, Clock } from "lucide-react"

// Mock data for team members
const teamMembers = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Frontend Developer",
    avatar: "/placeholder.svg?height=100&width=100",
    commits: 78,
    pullRequests: 12,
    languages: ["TypeScript", "React", "CSS"],
  },
  {
    id: 2,
    name: "Sam Rivera",
    role: "Backend Developer",
    avatar: "/placeholder.svg?height=100&width=100",
    commits: 64,
    pullRequests: 8,
    languages: ["Python", "Node.js", "SQL"],
  },
  {
    id: 3,
    name: "Taylor Kim",
    role: "Full Stack Developer",
    avatar: "/placeholder.svg?height=100&width=100",
    commits: 92,
    pullRequests: 15,
    languages: ["JavaScript", "Go", "GraphQL"],
  },
  {
    id: 4,
    name: "Jordan Patel",
    role: "DevOps Engineer",
    avatar: "/placeholder.svg?height=100&width=100",
    commits: 45,
    pullRequests: 6,
    languages: ["Terraform", "Bash", "Docker"],
  },
]

// Mock data for MVPs and stretch goals
const projectGoals = {
  mvps: [
    {
      id: 1,
      title: "User Authentication",
      description: "Implement secure login and registration system",
      status: "completed",
      assignee: "Sam Rivera",
    },
    {
      id: 2,
      title: "Dashboard UI",
      description: "Create responsive dashboard with key metrics",
      status: "completed",
      assignee: "Alex Johnson",
    },
    {
      id: 3,
      title: "API Integration",
      description: "Connect to external data sources via API",
      status: "completed",
      assignee: "Taylor Kim",
    },
    {
      id: 4,
      title: "Deployment Pipeline",
      description: "Set up CI/CD for automated testing and deployment",
      status: "completed",
      assignee: "Jordan Patel",
    },
  ],
  stretchGoals: [
    {
      id: 1,
      title: "Real-time Updates",
      description: "Implement WebSocket for live data updates",
      status: "completed",
      assignee: "Taylor Kim",
    },
    {
      id: 2,
      title: "Advanced Analytics",
      description: "Add data visualization and reporting features",
      status: "in-progress",
      assignee: "Alex Johnson",
    },
    {
      id: 3,
      title: "Mobile App",
      description: "Create companion mobile application",
      status: "not-started",
      assignee: "Unassigned",
    },
    {
      id: 4,
      title: "AI Recommendations",
      description: "Implement AI-powered content recommendations",
      status: "in-progress",
      assignee: "Sam Rivera",
    },
  ],
}

export default function TeamOverview() {
  // Calculate completion percentages
  const mvpCompletionRate =
    (projectGoals.mvps.filter((goal) => goal.status === "completed").length / projectGoals.mvps.length) * 100
  const stretchCompletionRate =
    (projectGoals.stretchGoals.filter((goal) => goal.status === "completed").length /
      projectGoals.stretchGoals.length) *
    100

  return (
    <div className="space-y-[32px]">
      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[20px] text-[#1e293b]">Team Performance</CardTitle>
          <CardDescription className="text-[14px] text-[#64748b]">Overall project contribution metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px]">
            <div className="bg-[#f8fafc] p-[16px] rounded-[8px]">
              <div className="text-[24px] font-bold text-[#1e293b]">
                {teamMembers.reduce((sum, member) => sum + member.commits, 0)}
              </div>
              <div className="text-[14px] text-[#475569]">Total Commits</div>
            </div>
            <div className="bg-[#f8fafc] p-[16px] rounded-[8px]">
              <div className="text-[24px] font-bold text-[#1e293b]">
                {teamMembers.reduce((sum, member) => sum + member.pullRequests, 0)}
              </div>
              <div className="text-[14px] text-[#475569]">Pull Requests</div>
            </div>
            <div className="bg-[#f8fafc] p-[16px] rounded-[8px]">
              <div className="text-[24px] font-bold text-[#1e293b]">{mvpCompletionRate.toFixed(0)}%</div>
              <div className="text-[14px] text-[#475569]">MVP Completion</div>
            </div>
            <div className="bg-[#f8fafc] p-[16px] rounded-[8px]">
              <div className="text-[24px] font-bold text-[#1e293b]">{stretchCompletionRate.toFixed(0)}%</div>
              <div className="text-[14px] text-[#475569]">Stretch Goals</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MVPs and Stretch Goals Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[20px] text-[#1e293b]">Project Goals</CardTitle>
          <CardDescription className="text-[14px] text-[#64748b]">
            MVPs and stretch goals with completion status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-[24px]">
          {/* MVP Goals */}
          <div>
            <h3 className="text-[16px] font-semibold mb-[12px] flex items-center">
              <span className="mr-[8px]">Minimum Viable Product (MVP)</span>
              <Badge variant="secondary" className="text-[12px]">
                {mvpCompletionRate.toFixed(0)}% Complete
              </Badge>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-[16px]">
              {projectGoals.mvps.map((goal) => (
                <div key={goal.id} className="border rounded-[8px] p-[16px] flex">
                  <div className="mr-[12px] mt-[4px]">
                    {goal.status === "completed" ? (
                      <CheckCircle2 className="h-[20px] w-[20px] text-[#22c55e]" />
                    ) : goal.status === "in-progress" ? (
                      <Clock className="h-[20px] w-[20px] text-[#f59e0b]" />
                    ) : (
                      <XCircle className="h-[20px] w-[20px] text-[#cbd5e1]" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-[15px]">{goal.title}</h4>
                    <p className="text-[13px] text-[#475569] mt-[4px]">{goal.description}</p>
                    <p className="text-[12px] text-[#64748b] mt-[6px]">Assigned to: {goal.assignee}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stretch Goals */}
          <div>
            <h3 className="text-[16px] font-semibold mb-[12px] flex items-center">
              <span className="mr-[8px]">Stretch Goals</span>
              <Badge variant="secondary" className="text-[12px]">
                {stretchCompletionRate.toFixed(0)}% Complete
              </Badge>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-[16px]">
              {projectGoals.stretchGoals.map((goal) => (
                <div key={goal.id} className="border rounded-[8px] p-[16px] flex">
                  <div className="mr-[12px] mt-[4px]">
                    {goal.status === "completed" ? (
                      <CheckCircle2 className="h-[20px] w-[20px] text-[#22c55e]" />
                    ) : goal.status === "in-progress" ? (
                      <Clock className="h-[20px] w-[20px] text-[#f59e0b]" />
                    ) : (
                      <XCircle className="h-[20px] w-[20px] text-[#cbd5e1]" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-[15px]">{goal.title}</h4>
                    <p className="text-[13px] text-[#475569] mt-[4px]">{goal.description}</p>
                    <p className="text-[12px] text-[#64748b] mt-[6px]">Assigned to: {goal.assignee}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Contributions Section */}
      <div>
        <h2 className="text-[24px] font-bold text-[#1e293b] mb-[24px]">Team Contributions</h2>
        <div className="grid grid-cols-2 gap-[24px]">
          {teamMembers.map((member) => (
            <Card key={member.id}>
              <CardHeader className="pb-[8px]">
                <div className="flex items-center gap-[16px]">
                  <Avatar className="h-[48px] w-[48px]">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-[16px]">{member.name}</CardTitle>
                    <CardDescription className="text-[13px] text-[#64748b]">{member.role}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="mt-[8px] space-y-[12px]">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#475569]">Commits</span>
                  <span className="font-medium text-[#1e293b]">{member.commits}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#475569]">Pull Requests</span>
                  <span className="font-medium text-[#1e293b]">{member.pullRequests}</span>
                </div>
                <div className="pt-[8px]">
                  <p className="text-[13px] text-[#475569] mb-[4px]">Contribution Level</p>
                  <Progress value={Math.min(member.commits / 1.2, 100)} className="h-[6px]" />
                </div>
                <div className="pt-[8px]">
                  <p className="text-[13px] text-[#475569] mb-[4px]">Languages</p>
                  <div className="flex flex-wrap gap-[6px]">
                    {member.languages.map((lang) => (
                      <Badge key={lang} variant="secondary" className="text-[11px] px-[8px] py-[2px]">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

