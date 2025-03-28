"use client";
import React, { useState } from "react";
import NavBar from "../components/NavBar";
import OngoingProjectCard from "../components/OngoingProjects";
import ExpandedProjectModal from "../components/ExpandedProjectCard";

const FindProjects = () => {
  const [expandedProjectIndex, setExpandedProjectIndex] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState<boolean[]>(Array(6).fill(false));
  const [isBookmarked, setIsBookmarked] = useState<boolean[]>(Array(6).fill(false));
  const [joinRequested, setJoinRequested] = useState<boolean[]>(Array(6).fill(false));

  const projects = [
    {
      title: "Project 1",
      groupLeader: "John Doe",
      likes: 10,
      image: "../../../images/img2.jpg",
      description: "This is a sample project description.",
      tech: ["React", "Node.js", "TypeScript"],
      members: [
        "../../../images/img1.jpg",
        "../../../images/img3.jpg",
        "../../../images/img4.jpg",
      ],
      totalMembers: 5,
      moreNeeded: 2,
    },
    {
      title: "Project 2",
      groupLeader: "Jane Smith",
      likes: 15,
      image: "../../../images/img4.jpg",
      description: "Another sample project description. Checking 50 words description and it should the three dots if it exceeds the description limit. Torchy's taco is really good, everyone should try it atleast once. Not hit 50 words yet. Fried Avocado just wowwww, I think I hit the 50 chars. Have we hit 50 words yet? Bruh hit 45 words already is it ",
      tech: ["Python", "Django", "PostgreSQL"],
      members: [
        "../../../images/img1.jpg",
        "../../../images/img3.jpg",
        "../../../images/img4.jpg",
      ],
      totalMembers: 4,
      moreNeeded: 1,
    },
    {
      title: "Project 3",
      groupLeader: "Alice Johnson",
      likes: 8,
      image: "../../../images/img3.jpg",
      description: "Yet another sample project description. I just want to check if this text wraps or not, it doesssss",
      tech: ["Vue.js", "Firebase", "TailwindCSS"],
      members: [
        "../../../images/img1.jpg",
        "../../../images/img3.jpg",
        "../../../images/img4.jpg",
      ],
      totalMembers: 3,
      moreNeeded: 3,
    },
    {
      title: "Project 4",
      groupLeader: "Bob Brown",
      likes: 20,
      image: "../../../images/img1.jpg",
      description: "This is a sample project description.",
      tech: ["Angular", "Java", "MongoDB"],
      members: [
        "../../../images/img1.jpg",
        "../../../images/img3.jpg",
        "../../../images/img4.jpg",
      ],
      totalMembers: 6,
      moreNeeded: 1,
    },
    {
      title: "Project 5",
      groupLeader: "Charlie Davis",
      likes: 12,
      image: "../../../images/img5.jpg",
      description: "This is a sample project description.",
      tech: ["Svelte", "Go", "GraphQL"],
      members: [
        "../../../images/img1.jpg",
        "../../../images/img3.jpg",
        "../../../images/img4.jpg",
      ],
      totalMembers: 2,
      moreNeeded: 4,
    },
    {
      title: "Project 6",
      groupLeader: "Eve White",
      likes: 18,
      image: "../../../images/img6.png",
      description: "This is a sample project description.",
      tech: ["Flutter", "Kotlin", "Redis"],
      members: [
        "../../../images/img1.jpg",
        "../../../images/img3.jpg",
        "../../../images/img4.jpg",
      ],
      totalMembers: 7,
      moreNeeded: 1,
    },
  ];

  const handleLike = (index: number) => {
    const newLiked = [...isLiked];
    newLiked[index] = !newLiked[index];
    setIsLiked(newLiked);
  };

  const handleBookmark = (index: number) => {
    const newBookmarked = [...isBookmarked];
    newBookmarked[index] = !newBookmarked[index];
    setIsBookmarked(newBookmarked);
  };

  const handleJoin = (index: number) => {
    const newJoinRequested = [...joinRequested];
    newJoinRequested[index] = !newJoinRequested[index];
    setJoinRequested(newJoinRequested);
  };

  const openProjectModal = (index: number) => {
    setExpandedProjectIndex(index);
  };

  const closeProjectModal = () => {
    setExpandedProjectIndex(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-blue-900 text-white font-nunito overflow-y-auto scrollbar-hide">
      <NavBar />
      <div className="h-screen flex flex-col items-center bg-blue-900 text-white font-nunito overflow-y-scroll w-[90%] scrollbar-hide">
      <div className="grid grid-cols-2 gap-[50px] w-[85vw] mt-[150px] mx-auto">
        {projects.map((project, index) => (
          <div
            key={index}
            className="transition-transform duration-300 hover:transform hover:-translate-y-[4px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] cursor-pointer"
            onClick={() => openProjectModal(index)}
          >
            <OngoingProjectCard
              {...project}
              showJoinButton={true}
              isLiked={isLiked[index]}
              isBookmarked={isBookmarked[index]}
              joinRequested={joinRequested[index]}
              onLike={() => handleLike(index)}
              onBookmark={() => handleBookmark(index)}
              onJoin={() => handleJoin(index)}
            />
          </div>
        ))}
      </div>
      </div>
      {expandedProjectIndex !== null && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 translate-y-[150px] translate-x-[-520px] flex items-center justify-center">
          <div className="z-50">
            <ExpandedProjectModal
              {...projects[expandedProjectIndex]}
              onClose={closeProjectModal}
              isLiked={isLiked[expandedProjectIndex]}
              isBookmarked={isBookmarked[expandedProjectIndex]}
              joinRequested={joinRequested[expandedProjectIndex]}
              onLike={() => handleLike(expandedProjectIndex)}
              onBookmark={() => handleBookmark(expandedProjectIndex)}
              onJoin={() => handleJoin(expandedProjectIndex)}
              showJoinButton={true}
            />
          </div>
        </div>
      )}
      
    </div>
  );
};

export default FindProjects;
