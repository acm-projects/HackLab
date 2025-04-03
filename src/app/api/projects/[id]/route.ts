import { NextResponse } from 'next/server';


export async function GET(request: Request, { params }: { params: { id: string } }) {
 try {
   const projectId = params.id;
  
   // Fetch project data from your database
   // This is a mock implementation - replace with your actual DB query
   const projectData = {
     id: projectId,
     name: `Project ${projectId}`,
     description: "A collaborative platform for team communication and project management.",
     status: "In Development",
     startDate: "March 1, 2025",
     teamMembers: [
       { name: "Alice Johnson", role: "Owner" },
       { name: "Bob Smith", role: "Frontend" },
       { name: "Charlie Brown", role: "Frontend" },
       { name: "David Lee", role: "Backend" },
       { name: "Eve Miller", role: "Backend" },
     ],
     techStack: {
       frontend: ["React", "Tailwind CSS", "Redux"],
       backend: ["Node.js", "Express", "MongoDB"],
     },
     goals: {
       mvp: [
         "User authentication",
         "Project dashboard with team info",
         "Task creation & assignment",
         "Project timeline viewer"
       ],
       stretch: [
         "Real-time chat integration",
         "AI task suggestions",
         "Project themes",
         "Automated reports"
       ]
     },
     recentCommits: [
       { author: "Charlie Brown", message: "Fixed authentication bug", timestamp: "2 hours ago" },
       { author: "Bob Smith", message: "Added Redux store config", timestamp: "1 day ago" },
       { author: "Eve Miller", message: "Initial backend setup", timestamp: "2 days ago" },
     ]
   };


   return NextResponse.json(projectData);
 } catch (error) {
   return NextResponse.json(
     { error: "Failed to fetch project data" },
     { status: 500 }
   );
 }
}



