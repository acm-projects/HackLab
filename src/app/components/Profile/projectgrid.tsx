"use client";
import React from "react";
import OngoingProjectCard from "../OngoingProjects"; // Use your custom card

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  topics: string[];
  skills: string[];
  groupLeader: {
    name: string;
    image: string;
  };
  likes: number;
  members: string[];
  totalMembers: number;
  moreNeeded: number;
  isSaved?: boolean;
  isLiked: boolean;
  isBookmarked: boolean;
  joinRequested: boolean;
  onLike: () => void;
  onBookmark: () => void;
  onJoin: () => void;
  status: "completed" | "ongoing" | "saved" | "liked";
}

interface ProjectGridProps {
  projects: Project[];
  emptyMessage?: string;
  type: "completed" | "saved" | "ongoing" | "liked";
}

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, emptyMessage = "No projects available" }) => {
  if (projects.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-[20px] sm:grid-cols-2 xl:grid-cols-2 w-full">
      {projects.map((project) => (
        <OngoingProjectCard
          key={project.id}
          title={project.title}
          description={project.description}
          image={project.image}
          topics={project.topics}
          skills={project.skills}
          groupLeader={project.groupLeader}
          likes={project.likes}
          members={project.members}
          totalMembers={project.totalMembers}
          moreNeeded={project.moreNeeded}
          showJoinButton={true}
          isLiked={project.isLiked}
          isBookmarked={project.isBookmarked}
          joinRequested={project.joinRequested}
          onLike={project.onLike}
          onBookmark={project.onBookmark}
          onJoin={project.onJoin}
        />
      ))}
    </div>
  );
};

export default ProjectGrid;
