"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OngoingProjectCard from "../OngoingProjects";

// Data
const completedProjects = [
  {
    id: "1",
    title: "Task Manager 2.0",
    description: "A full-stack task management application with real-time updates and team collaboration features.",
    image: "/placeholder.svg?height=400&width=600",
    topics: ["React", "Node.js"],
    skills: ["MongoDB", "Socket.io"],
    groupLeader: { name: "Alex", image: "/default.jpg" },
    members: ["/default.jpg", "/default.jpg", "/default.jpg"],
    totalMembers: 3,
    moreNeeded: 2,
    likes: 0,
    isLiked: false,
    isBookmarked: false,
    joinRequested: false,
  },
  {
    id: "2",
    title: "Weather Dashboard",
    description: "Interactive weather dashboard with 7-day forecasts and location-based weather data.",
    image: "/placeholder.svg?height=400&width=600",
    topics: ["JavaScript"],
    skills: ["Chart.js"],
    groupLeader: { name: "Jamie", image: "/default.jpg" },
    members: ["/default.jpg"],
    totalMembers: 1,
    moreNeeded: 1,
    likes: 0,
    isLiked: false,
    isBookmarked: false,
    joinRequested: false,
  },
];

const savedProjects = [
  {
    id: "3",
    title: "E-commerce Platform",
    description: "A modern e-commerce platform with product management, cart functionality, and payment processing.",
    image: "/placeholder.svg?height=400&width=600",
    topics: ["E-commerce", "Payments"],
    skills: ["Next.js", "Stripe", "PostgreSQL", "Tailwind CSS"],
    groupLeader: { name: "Mia", image: "/default.jpg" },
    members: ["/default.jpg", "/default.jpg"],
    totalMembers: 2,
    moreNeeded: 1,
    likes: 9,
    isLiked: false,
    isBookmarked: true,
    joinRequested: false,
  },
];

const ongoingProjects = [
  {
    id: "4",
    title: "Portfolio Website",
    description: "Personal portfolio website showcasing projects and skills with a modern, responsive design.",
    image: "/placeholder.svg?height=400&width=600",
    topics: ["Portfolio", "Design"],
    skills: ["React", "Three.js", "Framer Motion"],
    groupLeader: { name: "Lucas", image: "/default.jpg" },
    members: ["/default.jpg"],
    totalMembers: 1,
    moreNeeded: 2,
    likes: 5,
    isLiked: false,
    isBookmarked: false,
    joinRequested: false,
  },
];

const likedProjects = [
  {
    id: "5",
    title: "AI Image Generator",
    description: "Web application that generates images based on text prompts using AI models.",
    image: "/placeholder.svg?height=400&width=600",
    topics: ["AI", "Image"],
    skills: ["Python", "Flask", "TensorFlow", "React"],
    groupLeader: { name: "Sarah", image: "/default.jpg" },
    members: ["/default.jpg", "/default.jpg", "/default.jpg"],
    totalMembers: 3,
    moreNeeded: 0,
    likes: 17,
    isLiked: true,
    isBookmarked: false,
    joinRequested: true,
  },
];

// Grid Renderer
const renderProjectGrid = (projects: any[]) => {
  if (!projects.length) {
    return <p className="text-sm text-muted-foreground">No projects available</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 gap-[60px]">
      {projects.map((project) => (
        <OngoingProjectCard
          key={project.id}
          title={project.title}
          description={project.description}
          image={project.image}
          topics={project.topics}
          skills={project.skills}
          groupLeader={project.groupLeader}
          members={project.members}
          totalMembers={project.totalMembers}
          moreNeeded={project.moreNeeded}
          likes={project.likes}
          showJoinButton={true}
          isLiked={project.isLiked}
          isBookmarked={project.isBookmarked}
          joinRequested={project.joinRequested}
          onLike={() => {}}
          onBookmark={() => {}}
          onJoin={() => {}}
        />
      ))}
    </div>
  );
};


export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-[8px] rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="pl-[24px] mb-6 text-2xl font-bold">Projects</h2>
        <Tabs defaultValue="completed" className="w-[1000px] pl-[24px]">
          <TabsList className="mb-[8px] grid w-full grid-cols-4">
            <TabsTrigger value="completed">Completed Projects</TabsTrigger>
            <TabsTrigger value="saved">Saved Projects</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing Projects</TabsTrigger>
            <TabsTrigger value="liked">Liked Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="completed">{renderProjectGrid(completedProjects)}</TabsContent>
          <TabsContent value="saved">{renderProjectGrid(savedProjects)}</TabsContent>
          <TabsContent value="ongoing">{renderProjectGrid(ongoingProjects)}</TabsContent>
          <TabsContent value="liked">{renderProjectGrid(likedProjects)}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
