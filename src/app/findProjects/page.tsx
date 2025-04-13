// "use client";
// import React, { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import NavBar from "../components/NavBar";
// import OngoingProjectCard from "../components/OngoingProjects";
// import ExpandedProjectModal from "../components/ExpandedProjectCard";
// import ProjectTimeline from "../components/timelineComponent";

// interface Project {
//   id: number;
//   title: string;
//   groupLeader: { name: string; image: string };
//   likes: number;
//   image: string;
//   description: string;
//   members: string[];
//   totalMembers: number;
//   moreNeeded: number;
//   topics: string[];
//   skills: string[];
//   mvp: string[];
//   stretch: string[];
//   frontendTasks: string[];
//   backendTasks: string[];
// }

// const FindProjects = () => {
//   const { data: session } = useSession();
//   const [currentUserId, setCurrentUserId] = useState<number | null>(null);
//   const [expandedProjectIndex, setExpandedProjectIndex] = useState<number | null>(null);
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [isLiked, setIsLiked] = useState<boolean[]>([]);
//   const [isBookmarked, setIsBookmarked] = useState<boolean[]>([]);
//   const [joinRequested, setJoinRequested] = useState<boolean[]>([]);
//   const [filters, setFilters] = useState<{ topics: string[]; skills: string[] }>({ topics: [], skills: [] });
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchInput, setSearchInput] = useState("");

//   useEffect(() => {
//     const fetchUserId = async () => {
//       if (!session?.user?.email) return;
//       try {
//         const res = await fetch("http://52.15.58.198:3000/users");
//         const allUsers = await res.json();
//         const currentUser = allUsers.find((u: any) => u.email === session.user.email);
//         if (currentUser) {
//           setCurrentUserId(currentUser.id);
//         }
//       } catch (err) {
//         console.error("❌ Failed to fetch user ID:", err);
//       }
//     };

//     fetchUserId();
//   }, [session]);

//   useEffect(() => {
//     if (!currentUserId) return;

//     const fetchProjects = async () => {
//       try {
//         const res = await fetch("http://52.15.58.198:3000/projects");
//         const data = await res.json();

//         // Exclude projects where current user is the team leader
//         const visibleProjects = data.filter((p: any) => p.team_lead_id !== currentUserId);
    

//         const [likedRes, bookmarkedRes, joinRes] = await Promise.all([
//           fetch(`http://52.15.58.198:3000/users/${currentUserId}/liked-projects`),
//           fetch(`http://52.15.58.198:3000/users/${currentUserId}/bookmarked-projects`),
//           fetch(`http://52.15.58.198:3000/users/${currentUserId}/join-requests`)
//         ]);

//         const likedProjectIds = likedRes.ok ? (await likedRes.json()).map((item: any) => Number(item.project_id)) : [];
//         const bookmarkedProjectIds = bookmarkedRes.ok ? (await bookmarkedRes.json()).map((item: any) => Number(item.project_id)) : [];
//         const joinRequestedProjectIds = joinRes.ok ? (await joinRes.json()).map((item: any) => Number(item.project_id)) : [];

//         const enrichedProjects = await Promise.all(
//           visibleProjects.map(async (p: any) => {
//             const projectId = p.id;
//             let membersData = [];
//             let skillsData = [];
//             let topicsData = [];
//             let teamLeadData = { name: "Unknown", image: "../../../images/default.jpg" };

//             try {
//               const [teamLeadRes, membersRes, skillsRes, topicsRes] = await Promise.all([
//                 fetch(`http://52.15.58.198:3000/users/${p.team_lead_id}`),
//                 fetch(`http://52.15.58.198:3000/projects/${projectId}/users`),
//                 fetch(`http://52.15.58.198:3000/projects/${projectId}/skills`),
//                 fetch(`http://52.15.58.198:3000/projects/${projectId}/topics`)
//               ]);

//               if (teamLeadRes.ok) teamLeadData = await teamLeadRes.json();
//               if (membersRes.ok) membersData = await membersRes.json();
//               if (skillsRes.ok) skillsData = (await skillsRes.json()).map((s: any) => s.skill);
//               if (topicsRes.ok) topicsData = (await topicsRes.json()).map((t: any) => t.topic);
//             } catch (err) {
//               console.error("Fetch error:", err);
//             }

//             return {
//               id: projectId,
//               title: p.title,
//               groupLeader: teamLeadData,
//               likes: p.likes || 0,
//               image: p.thumbnail?.startsWith("http") ? p.thumbnail : "../../../images/default.jpg",
//               description: p.description || "No description provided.",
//               topics: topicsData,
//               skills: skillsData,
//               members: membersData.map((user: any) => user.image || "../../../images/default.jpg"),
//               totalMembers: membersData.length,
//               moreNeeded: p.moreNeeded || 0,
//               mvp: p.mvp || [],
//               stretch: p.stretch || [],
//               frontendTasks: [],
//               backendTasks: [],
//             };
//           })
//         );

//         setProjects(enrichedProjects);
//         setIsLiked(enrichedProjects.map((p) => likedProjectIds.includes(p.id)));
//         setIsBookmarked(enrichedProjects.map((p) => bookmarkedProjectIds.includes(p.id)));
//         setJoinRequested(enrichedProjects.map((p) => joinRequestedProjectIds.includes(p.id)));

//       } catch (err) {
//         console.error("❌ Failed to load projects:", err);
//       }
//     };

//     fetchProjects();
//   }, [currentUserId]);
  
  
//    const filteredProjects = projects.filter((project) => {
//    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
//    const topicMatch = filters.topics.length === 0 || filters.topics.some((t) => project.topics.includes(t));
//    const skillMatch = filters.skills.length === 0 || filters.skills.some((s) => project.skills.includes(s));
//    return matchesSearch && topicMatch && skillMatch;
//  });


//  const handleLike = async (index: number) => {
//    const project = projects[index];
//    const projectId = project.id;
//    const liked = isLiked[index];
//     try {
//      if (liked) {
//        await fetch(`http://52.15.58.198:3000/users/${currentUserId}/liked-projects/${projectId}`, {
//          method: "DELETE",
//        });
//         setIsLiked((prev) => {
//          const copy = [...prev];
//          copy[index] = false;
//          return copy;
//        });
//         setProjects((prev) => {
//          const copy = [...prev];
//          copy[index] = { ...copy[index], likes: copy[index].likes - 1 };
//          return copy;
//        });
//      } else {
      
//        await fetch(`http://52.15.58.198:3000/users/${currentUserId}/liked-projects/${projectId}`, {
//          method: "POST",
//          headers: { "Content-Type": "application/json" },
//          body: JSON.stringify({ user_id: currentUserId, project_id: projectId }),
//        });
//         setIsLiked((prev) => {
//          const copy = [...prev];
//          copy[index] = true;
//          return copy;
//        });
//         setProjects((prev) => {
//          const copy = [...prev];
//          copy[index] = { ...copy[index], likes: copy[index].likes + 1 };
//          return copy;
//        });
//      }
//    } catch (err) {
//      console.error("❌ Error toggling like:", err);
//    }
//  };


//  const handleBookmark = async (index: number) => {
//    const projectId = projects[index].id;
//    const bookmarked = isBookmarked[index];


//    const method = bookmarked ? "DELETE" : "POST";
//    await fetch(`http://52.15.58.198:3000/users/${currentUserId}/bookmarked-projects/${projectId}`, {
//      method,
//    });


//    setIsBookmarked((prev) => {
//      const copy = [...prev];
//      copy[index] = !copy[index];
//      return copy;
//    });
//  };


//  const handleJoin = async (index: number) => {
//    const projectId = projects[index].id;
//    const requested = joinRequested[index];
//     try {
//      let res;
//       if (requested) {
//        // DELETE to cancel the join request (no body needed)
//        res = await fetch(`http://52.15.58.198:3000/users/${currentUserId}/join-requests/${projectId}`, {
//          method: "DELETE",
//        });
//      } else {
//        // POST to send a join request
//        res = await fetch(`http://52.15.58.198:3000/users/${currentUserId}/join-requests/${projectId}`, {
//          method: "POST",
//          headers: { "Content-Type": "application/json" },
//          body: JSON.stringify({
//            user_id: currentUserId,
//            project_id: projectId,
//          }),
//        });
//      }
//       if (!res.ok) throw new Error("Failed to toggle join request");
//       setJoinRequested((prev) => {
//        const copy = [...prev];
//        copy[index] = !requested;
//        return copy;
//      });
//    } catch (err) {
//      console.error("❌ Join request toggle failed:", err);
//    }
//  };
 


//  const openProjectModal = (index: number) => {
//    setExpandedProjectIndex(index);
//  };


//  const closeProjectModal = () => {
//    setExpandedProjectIndex(null);
//  };


//  const clearFilters = () => setFilters({ topics: [], skills: [] });


//  return (
  
//    <div className="min-h-screen flex flex-col items-center bg-blue-900 text-white font-nunito overflow-y-auto scrollbar-hide">
//      <NavBar
//        searchInput={searchInput}
//        setSearchInput={setSearchInput}
//        onSearchSubmit={() => setSearchQuery(searchInput)}
//        onClearFilters={clearFilters}
//        onApplyFilters={setFilters}
//        onSearchChange={(query: string) => setSearchQuery(query)}
//        showSearch={(true)}
//      />


//      <div className="h-screen flex flex-col items-center bg-blue-900 text-white w-[90%] scrollbar-hide">
//        {filteredProjects.length > 0 ? (
//          <div className="text-[#000000] font-[700] text-[24px] mt-[100px] mb-[-100px] mr-[950px]">
//            Found {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""} just for you
//          </div>
//        ) : (
//          <div className="w-full flex justify-center items-center mt-[200px]">
//            <p className="text-[#9ca3af] text-[18px] text-center font-[600]">
//              No results match your search. Maybe create one yourself!
//            </p>
//          </div>
//        )}


//        {filteredProjects.length > 0 && (
//          <div className="grid grid-cols-2 gap-[50px] w-[85vw] mt-[150px] mx-auto">
//            {filteredProjects.map((project, index) => (
//              <div
//                key={project.id}
//                className="transition-transform duration-300 hover:-translate-y-[4px] cursor-pointer mb-[30px]"
//                onClick={() => openProjectModal(index)}
//              >
//                <OngoingProjectCard
//                  {...project}
//                  showJoinButton={true}
//                  isLiked={isLiked[index]}
//                  likes={project.likes}
//                  isBookmarked={isBookmarked[index]}
//                  joinRequested={joinRequested[index]}
//                  onLike={() => handleLike(index)}
//                  onBookmark={() => handleBookmark(index)}
//                  onJoin={() => handleJoin(index)}
//                />
//              </div>
//            ))}
//          </div>
//        )}
//      </div>


//      {expandedProjectIndex !== null && (
//        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 translate-y-[150px] translate-x-[-520px] flex items-center justify-center">
//          <div className="z-50">
//            <ExpandedProjectModal
//              {...filteredProjects[expandedProjectIndex]}
//              onClose={closeProjectModal}
//              isLiked={isLiked[expandedProjectIndex]}
//              isBookmarked={isBookmarked[expandedProjectIndex]}
//              joinRequested={joinRequested[expandedProjectIndex]}
//              onLike={() => handleLike(expandedProjectIndex)}
//              onBookmark={() => handleBookmark(expandedProjectIndex)}
//              onJoin={() => handleJoin(expandedProjectIndex)}
//              showJoinButton={true}
//            />
//          </div>
//        </div>
//      )}
//    </div>
//  );
// };


// export default FindProjects;



"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import NavBar from "../components/NavBar";
import OngoingProjectCard from "../components/OngoingProjects";
import ExpandedProjectModal from "../components/ExpandedProjectCard";
import ProjectTimeline from "../components/timelineComponent";

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
  frontendTasks: string[];
  backendTasks: string[];
}

const FindProjects = () => {
  const { data: session } = useSession();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [expandedProjectIndex, setExpandedProjectIndex] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLiked, setIsLiked] = useState<boolean[]>([]);
  const [isBookmarked, setIsBookmarked] = useState<boolean[]>([]);
  const [joinRequested, setJoinRequested] = useState<boolean[]>([]);
  const [filters, setFilters] = useState<{ topics: string[]; skills: string[] }>({ topics: [], skills: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchUserId = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch("http://52.15.58.198:3000/users");
        const allUsers = await res.json();
        const currentUser = allUsers.find((u: any) => u.email === session.user.email);
        if (currentUser) {
          setCurrentUserId(currentUser.id);
        }
      } catch (err) {
        console.error("❌ Failed to fetch user ID:", err);
      }
    };

    fetchUserId();
  }, [session]);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchProjects = async () => {
      try {
        const res = await fetch("http://52.15.58.198:3000/projects");
        const data = await res.json(); // ← THIS LINE is missing
        const filteredByLead = data.filter((p: any) => p.team_lead_id !== currentUserId);

        // Fetch user memberships
        const memberships = await Promise.all(
          filteredByLead.map(async (project: any) => {
            const resMembers = await fetch(`http://52.15.58.198:3000/projects/${project.id}/users`);
            const members = await resMembers.json();
            const isMember = Array.isArray(members) && members.some((m: any) => m.id === currentUserId);

            // const isMember = members.some((m: any) => m.id === currentUserId);
            return isMember ? null : project;
          })
        );

        // Filter out nulls (projects the user is a member of)
        const visibleProjects = memberships.filter(Boolean);

    

        const [likedRes, bookmarkedRes, joinRes] = await Promise.all([
          fetch(`http://52.15.58.198:3000/users/${currentUserId}/liked-projects`),
          fetch(`http://52.15.58.198:3000/users/${currentUserId}/bookmarked-projects`),
          fetch(`http://52.15.58.198:3000/users/${currentUserId}/join-requests`)
        ]);

        const likedProjectIds = likedRes.ok ? (await likedRes.json()).map((item: any) => Number(item.project_id)) : [];
        const bookmarkedProjectIds = bookmarkedRes.ok ? (await bookmarkedRes.json()).map((item: any) => Number(item.project_id)) : [];
        const joinRequestedProjectIds = joinRes.ok ? (await joinRes.json()).map((item: any) => Number(item.project_id)) : [];

        const enrichedProjects = await Promise.all(
          visibleProjects.map(async (p: any) => {
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
              frontendTasks: [],
              backendTasks: [],
            };
          })
        );

        setProjects(enrichedProjects);
        setIsLiked(enrichedProjects.map((p) => likedProjectIds.includes(p.id)));
        setIsBookmarked(enrichedProjects.map((p) => bookmarkedProjectIds.includes(p.id)));
        setJoinRequested(enrichedProjects.map((p) => joinRequestedProjectIds.includes(p.id)));

      } catch (err) {
        console.error("❌ Failed to load projects:", err);
      }
    };

    fetchProjects();
  }, [currentUserId]);
  
  
   const filteredProjects = projects.filter((project) => {
   const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
   const topicMatch = filters.topics.length === 0 || filters.topics.some((t) => project.topics.includes(t));
   const skillMatch = filters.skills.length === 0 || filters.skills.some((s) => project.skills.includes(s));
   return matchesSearch && topicMatch && skillMatch;
 });


 const handleLike = async (index: number) => {
   const project = projects[index];
   const projectId = project.id;
   const liked = isLiked[index];
    try {
     if (liked) {
       await fetch(`http://52.15.58.198:3000/users/${currentUserId}/liked-projects/${projectId}`, {
         method: "DELETE",
       });
        setIsLiked((prev) => {
         const copy = [...prev];
         copy[index] = false;
         return copy;
       });
        setProjects((prev) => {
         const copy = [...prev];
         copy[index] = { ...copy[index], likes: copy[index].likes - 1 };
         return copy;
       });
     } else {
      
       await fetch(`http://52.15.58.198:3000/users/${currentUserId}/liked-projects/${projectId}`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ user_id: currentUserId, project_id: projectId }),
       });
        setIsLiked((prev) => {
         const copy = [...prev];
         copy[index] = true;
         return copy;
       });
        setProjects((prev) => {
         const copy = [...prev];
         copy[index] = { ...copy[index], likes: copy[index].likes + 1 };
         return copy;
       });
     }
   } catch (err) {
     console.error("❌ Error toggling like:", err);
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
    try {
     let res;
      if (requested) {
       // DELETE to cancel the join request (no body needed)
       res = await fetch(`http://52.15.58.198:3000/users/${currentUserId}/join-requests/${projectId}`, {
         method: "DELETE",
       });
     } else {
       // POST to send a join request
       res = await fetch(`http://52.15.58.198:3000/users/${currentUserId}/join-requests/${projectId}`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           user_id: currentUserId,
           project_id: projectId,
         }),
       });
     }
      if (!res.ok) throw new Error("Failed to toggle join request");
      setJoinRequested((prev) => {
       const copy = [...prev];
       copy[index] = !requested;
       return copy;
     });
   } catch (err) {
     console.error("❌ Join request toggle failed:", err);
   }
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
       showSearch={(true)}
     />


     <div className="h-screen flex flex-col items-center bg-blue-900 text-white w-[90%] scrollbar-hide">
       {filteredProjects.length > 0 ? (
         <div className="text-[#000000] font-[700] text-[24px] mt-[100px] mb-[-100px] mr-[950px]">
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
               className="transition-transform duration-300 hover:-translate-y-[4px] cursor-pointer mb-[30px]"
               onClick={() => openProjectModal(index)}
             >
               <OngoingProjectCard
                 {...project}
                 showJoinButton={true}
                 isLiked={isLiked[index]}
                 likes={project.likes}
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
