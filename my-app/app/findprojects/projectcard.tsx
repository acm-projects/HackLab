"use client";
import React from "react";

interface ProjectCardProps {
    project: {
      id: number;
      title: string;
      tags: string[];
      members: number;
      spotsLeft: number;
      datePosted: string;
      shortDescription: string;
      fullDescription: string;
    };
    onClick: () => void;
  }
  
  const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
    return (
      <div
        onClick={onClick}
        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer border"
      >
        {/* Placeholder Image */}
        <div className="bg-[#385773] h-[100px] w-full" />
  
        {/* Content */}
        <div className="p-4 flex flex-col gap-2">
          {/* Title & Tags */}
          <div>
            <h3 className="text-md font-bold mb-1">{project.title}</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-xs text-gray-700 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
  
          {/* Description */}
          <p className="text-sm text-gray-600 leading-snug">
            {project.shortDescription}
          </p>
  
          {/* Members + Spots */}
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-700">
              👥 {project.members} members, {project.spotsLeft} spots left
            </span>
            <button className="bg-[#385773] text-white text-xs px-4 py-1 rounded-full hover:bg-[#2f4863]">
              Join
            </button>
          </div>
  
          {/* Footer Icons + Date */}
          <div className="flex items-center justify-between text-xs text-gray-400 mt-3">
            <div className="flex gap-3 items-center">
              <span>🔖</span>
              <span>👍 0</span>
            </div>
            <p className="text-[10px]">Posted on {project.datePosted}</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default ProjectCard;