"use client";
import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import OngoingProjectCard from "../components/OngoingProjects";
import ExpandedProjectModal from "../components/ExpandedProjectCard";

interface Project {
  id: number;
  title: string;
  groupLeader: { name: string; image: string };
  likes: number;
  image: string;
  description: string;
  members: string[];
  totalMembers: number;
  moreNeeded: number;
  topics: string[];
  skills: string[];
  mvp: string[];
  stretch: string[];
}

const FindProjects = () => {
  const [expandedProjectIndex, setExpandedProjectIndex] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLiked, setIsLiked] = useState<boolean[]>([]);
  const [isBookmarked, setIsBookmarked] = useState<boolean[]>([]);
  const [joinRequested, setJoinRequested] = useState<boolean[]>([]);
  const [filters, setFilters] = useState<{ topics: string[]; skills: string[] }>({ topics: [], skills: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const currentUserId = 1; // Replace with real userId from auth

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://52.15.58.198:3000/projects");
        const data = await res.json();
        const likedRes = await fetch(`http://52.15.58.198:3000/users/${currentUserId}/liked-projects`);
        let likedProjectIds: number[] = [];

        if (likedRes.ok) {
          likedProjectIds = (await likedRes.json()).map((p: any) => p.id);
        }
        const bookmarkedRes = await fetch(`http://52.15.58.198:3000/users/${currentUserId}/bookmarked-projects`);
        let bookmarkedProjectIds: number[] = [];

        if (bookmarkedRes.ok) {
          bookmarkedProjectIds = (await bookmarkedRes.json()).map((p: any) => p.id);
        }


        const enrichedProjects = await Promise.all(
          data.map(async (p: any) => {
            const projectId = p.id;
            let membersData = [];
            let skillsData = [];
            let topicsData = [];
            let teamLeadData = { name: "Unknown", image: "../../../images/default.jpg" };

            try {
              const [teamLeadRes, membersRes, skillsRes, topicsRes] = await Promise.all([
                fetch(`http://52.15.58.198:3000/users/${p.team_lead_id}`),
                fetch(`http://52.15.58.198:3000/projects/${projectId}/users`),
                fetch(`http://52.15.58.198:3000/projects/${projectId}/skills`),
                fetch(`http://52.15.58.198:3000/projects/${projectId}/topics`)
              ]);

              if (teamLeadRes.ok) teamLeadData = await teamLeadRes.json();
              if (membersRes.ok) membersData = await membersRes.json();
              if (skillsRes.ok) skillsData = (await skillsRes.json()).map((s: any) => s.skill);
              if (topicsRes.ok) topicsData = (await topicsRes.json()).map((t: any) => t.topic);
            } catch (err) {
              console.error("Fetch error:", err);
            }

            return {
              id: projectId,
              title: p.title,
              groupLeader: teamLeadData,
              likes: p.likes || 0,
              image: p.thumbnail?.startsWith("http") ? p.thumbnail : "../../../images/default.jpg",
              description: p.description || "No description provided.",
              topics: topicsData,
              skills: skillsData,
              members: membersData.map((user: any) => user.image || "../../../images/default.jpg"),
              totalMembers: membersData.length,
              moreNeeded: p.moreNeeded || 0,
              mvp: p.mvp || [],
              stretch: p.stretch || [],
            };
          })
        );

        setProjects(enrichedProjects);
        setIsLiked(enrichedProjects.map((p) => likedProjectIds.includes(p.id)));
        setIsBookmarked(enrichedProjects.map((p) => bookmarkedProjectIds.includes(p.id)));
        setJoinRequested(Array(enrichedProjects.length).fill(false));
      } catch (err) {
        console.error("Failed to load projects:", err);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const topicMatch = filters.topics.length === 0 || filters.topics.some((t) => project.topics.includes(t));
    const skillMatch = filters.skills.length === 0 || filters.skills.some((s) => project.skills.includes(s));
    return matchesSearch && topicMatch && skillMatch;
  });

  const handleLike = async (index: number) => {
    const projectId = projects[index].id;
  
    try {
      // Re-check backend before POST
      const checkRes = await fetch(`http://52.15.58.198:3000/users/${currentUserId}/liked-projects`);
      const liked = await checkRes.json();
      const alreadyLiked = liked.some((p: any) => p.id === projectId);
  
      // Don't try to POST again if already liked
      if (alreadyLiked && isLiked[index]) {
        // Unlike
        await fetch(`http://52.15.58.198:3000/users/${currentUserId}/liked-projects/${projectId}`, {
          method: "DELETE",
        });
  
        await fetch(`http://52.15.58.198:3000/projects/${projectId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ likes: projects[index].likes - 1 }),
        });
  
        setIsLiked((prev) => {
          const copy = [...prev];
          copy[index] = false;
          return copy;
        });
  
        setProjects((prev) => {
          const copy = [...prev];
          copy[index].likes -= 1;
          return copy;
        });
  
        return;
      }
  
      // Like (only if not already liked)
      if (!alreadyLiked) {
        await fetch(`http://52.15.58.198:3000/users/${currentUserId}/liked-projects/${projectId}`, {
          method: "POST",
        });
  
        await fetch(`http://52.15.58.198:3000/projects/${projectId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ likes: projects[index].likes + 1 }),
        });
  
        setIsLiked((prev) => {
          const copy = [...prev];
          copy[index] = true;
          return copy;
        });
  
        setProjects((prev) => {
          const copy = [...prev];
          copy[index].likes += 1;
          return copy;
        });
      }
    } catch (err) {
      console.error("❌ handleLike error:", err);
    }
  };
  

  const handleBookmark = async (index: number) => {
    const projectId = projects[index].id;
    const bookmarked = isBookmarked[index];

    const method = bookmarked ? "DELETE" : "POST";
    await fetch(`http://52.15.58.198:3000/users/${currentUserId}/bookmarked-projects/${projectId}`, {
      method,
    });

    setIsBookmarked((prev) => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  const handleJoin = async (index: number) => {
    const projectId = projects[index].id;
    const requested = joinRequested[index];

    const method = requested ? "DELETE" : "POST";
    await fetch(`http://52.15.58.198:3000/users/${currentUserId}/join-requests/${projectId}`, {
      method,
    });

    setJoinRequested((prev) => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  const openProjectModal = (index: number) => {
    setExpandedProjectIndex(index);
  };

  const closeProjectModal = () => {
    setExpandedProjectIndex(null);
  };

  const clearFilters = () => setFilters({ topics: [], skills: [] });

  return (
    <div className="min-h-screen flex flex-col items-center bg-blue-900 text-white font-nunito overflow-y-auto scrollbar-hide">
      <NavBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSearchSubmit={() => setSearchQuery(searchInput)}
        onClearFilters={clearFilters}
        onApplyFilters={setFilters}
        onSearchChange={(query: string) => setSearchQuery(query)}
      />

      <div className="h-screen flex flex-col items-center bg-blue-900 text-white w-[90%] scrollbar-hide">
        {filteredProjects.length > 0 ? (
          <div className="text-[#000000] font-[700] underline underline-offset-5 text-[24px] mt-[100px] mb-[-100px] mr-[950px]">
            Found {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""} just for you
          </div>
        ) : (
          <div className="w-full flex justify-center items-center mt-[200px]">
            <p className="text-[#9ca3af] text-[18px] text-center font-[600]">
              No results match your search. Maybe create one yourself!
            </p>
          </div>
        )}

        {filteredProjects.length > 0 && (
          <div className="grid grid-cols-2 gap-[50px] w-[85vw] mt-[150px] mx-auto">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="transition-transform duration-300 hover:-translate-y-[4px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] cursor-pointer"
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
        )}
      </div>

      {expandedProjectIndex !== null && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 translate-y-[150px] translate-x-[-520px] flex items-center justify-center">
          <div className="z-50">
            <ExpandedProjectModal
              {...filteredProjects[expandedProjectIndex]}
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
