"use client";
import React, { useState } from "react";
import ProjectCard from "./projectcard";
import ProjectModal from "./projectmodal";
import TopBar from "../components/topbar";

const mockProjects = [
  {
    id: 1,
    title: "HackLab",
    tags: ["Career", "AI", "Design"],
    members: 4,
    spotsLeft: 1,
    datePosted: "January 25th",
    shortDescription: "Generate your great ideas and make it come real.",
    fullDescription:
      "HackLab is a collaboration platform designed for developers to work together and bring their ideas to life...",
  },
  {
    id: 2,
    title: "Fitness Tracker",
    tags: ["Health", "React Native", "UI/UX"],
    members: 3,
    spotsLeft: 2,
    datePosted: "February 10th",
    shortDescription: "A sleek mobile app to monitor workouts and health goals.",
    fullDescription:
      "Fitness Tracker is a mobile application that empowers users to log workouts, track progress, and stay motivated...",
  },
  {
    id: 3,
    title: "EcoMarket",
    tags: ["E-Commerce", "Sustainability", "Web"],
    members: 5,
    spotsLeft: 0,
    datePosted: "March 5th",
    shortDescription: "Marketplace for eco-friendly goods.",
    fullDescription:
      "EcoMarket connects environmentally conscious vendors and buyers in a beautiful web platform...",
  },
  {
    id: 4,
    title: "StudySync",
    tags: ["Education", "Collaboration", "React"],
    members: 2,
    spotsLeft: 3,
    datePosted: "March 12th",
    shortDescription: "A group study scheduler and tracker.",
    fullDescription:
      "StudySync helps students plan, schedule, and join study sessions with classmates. Great for remote learners...",
  },
  {
    id: 5,
    title: "Budget Buddy",
    tags: ["Finance", "Tools", "Mobile"],
    members: 4,
    spotsLeft: 1,
    datePosted: "March 15th",
    shortDescription: "Personal finance & budgeting tool.",
    fullDescription:
      "Budget Buddy is a lightweight app that gives people control over their money with minimal input...",
  },
  {
    id: 6,
    title: "PetPal",
    tags: ["Pets", "AI", "Community"],
    members: 3,
    spotsLeft: 2,
    datePosted: "April 1st",
    shortDescription: "Find and care for pets with AI.",
    fullDescription:
      "PetPal connects pet owners, sitters, and shelters while offering smart care tips powered by AI...",
  },
  {
    id: 7,
    title: "MindSpace",
    tags: ["Wellness", "Therapy", "Web App"],
    members: 5,
    spotsLeft: 0,
    datePosted: "April 10th",
    shortDescription: "Mental health journaling platform.",
    fullDescription:
      "MindSpace is a secure, cloud-based mental health app for journaling and accessing professional resources...",
  },
  {
    id: 8,
    title: "FitMeal",
    tags: ["Health", "Nutrition", "AI"],
    members: 2,
    spotsLeft: 2,
    datePosted: "April 15th",
    shortDescription: "AI-powered meal planning tool.",
    fullDescription:
      "FitMeal generates meal plans based on your goals, allergies, and tastes using GPT-assisted recommendations...",
  },
  {
    id: 9,
    title: "EventHive",
    tags: ["Social", "Web App", "Real-Time"],
    members: 3,
    spotsLeft: 1,
    datePosted: "April 20th",
    shortDescription: "Find & join local events instantly.",
    fullDescription:
      "EventHive aggregates and suggests local happenings so users can RSVP and meet people quickly and easily...",
  },
  {
    id: 10,
    title: "SkillSync",
    tags: ["Career", "Learning", "Platform"],
    members: 4,
    spotsLeft: 1,
    datePosted: "April 22nd",
    shortDescription: "Upskilling through short team projects.",
    fullDescription:
      "SkillSync allows users to team up on short-term projects to gain real experience and endorsements...",
  },
];

export default function FindProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<null | typeof mockProjects[0]>(null);

  return (
    <div className="min-h-screen overflow-y-auto bg-[#f4f4f4]">
      <TopBar />

      <div className="p-10">
        <h1 className="text-2xl font-bold mb-6">
          Found {mockProjects.length} projects just for you
        </h1>

       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>

        {/* Pop-up modal */}
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </div>
    </div>
  );
}
