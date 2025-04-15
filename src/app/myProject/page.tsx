"use client";
import type React from "react";
import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProjectTimeline from "../components/timelineComponent";
import EditProject from "../components/EditProjectInline";
import LoadingPage from "../components/loadingScreen"; // adjust the path if needed

const MyProject = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [view, setView] = useState("dashboard");
  const [isEditing, setIsEditing] = useState(false);
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const { data: session } = useSession();
  const [projectTopics, setProjectTopics] = useState<string[]>([]);
  const [projectSkills, setProjectSkills] = useState<{ name: string; icon_url: string }[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [projectUsers, setProjectUsers] = useState<any[]>([]);
  const [joinRequests, setJoinRequests] = useState<any[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const router = useRouter();
  const [joinRequestUsers, setJoinRequestUsers] = useState<{ [userId: number]: any }>({});

 
  const [showLoadingPage, setShowLoadingPage] = useState(true);
  
      useEffect(() => {
        const timer = setTimeout(() => setShowLoadingPage(false), 2000);
        return () => clearTimeout(timer);
      }, []);

 const fetchProjectUsers = async () => {
   if (!selectedProjectId) return;
   try {
     const res = await fetch(`http://52.15.58.198:3000/projects/${selectedProjectId}/users`);
     if (!res.ok) throw new Error("Failed to fetch project users");
     const data = await res.json();
     setProjectUsers(data);
   } catch (err) {
     console.error("Failed to fetch project users:", err);
     setProjectUsers([]);
   }
 };
 const fetchJoinRequests = async (projectId: number) => {
  try {
    const res = await fetch(`http://52.15.58.198:3000/projects/${projectId}/join-requests`);
    const data = await res.json();
    setJoinRequests(data);

    // Fetch user details for each join request
    const userDetails: { [userId: number]: any } = {};
    for (const req of data) {
      if (!userDetails[req.user_id]) {
        const userRes = await fetch(`http://52.15.58.198:3000/users/${req.user_id}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          userDetails[req.user_id] = userData;
        }
      }
    }
    setJoinRequestUsers(userDetails);
  } catch (err) {
    console.error("Failed to fetch join requests:", err);
  }
};


const handleAcceptJoin = async (userIdToAccept: number, projectId: number) => {
  const roleId = 2; // example roleId for 'member'
  try {
    const res = await fetch(`http://52.15.58.198:3000/users/${userIdToAccept}/projects/${projectId}/${roleId}`, {
      method: "POST"
    });
    if (!res.ok) throw new Error("Accept failed");
    await handleRejectJoin(userIdToAccept, projectId);
    fetchProjectUsers();
  } catch (err) {
    console.error("Accept failed:", err);
  }
};

const handleRejectJoin = async (userIdToReject: number, projectId: number) => {
  try {
    const res = await fetch(`http://52.15.58.198:3000/users/${userIdToReject}/join-requests/${projectId}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Reject failed");
    setJoinRequests((prev) => prev.filter(req => req.user_id !== userIdToReject || req.project_id !== projectId));
  } catch (err) {
    console.error("Reject failed:", err);
  }
};


 useEffect(() => {
   fetchProjectUsers();
 }, [selectedProjectId]);

 useEffect(() => {
  if (!selectedProjectId || !userId) return;
  const currentProject = userProjects.find(p => p.id === selectedProjectId);
  if (currentProject && currentProject.team_lead_id === userId) {
    fetchJoinRequests(selectedProjectId);

  }
}, [selectedProjectId, userId]);

 const handleKickUser = async (userIdToKick: number) => {
   if (!selectedProjectId) return;
   try {
     const res = await fetch(`http://52.15.58.198:3000/users/${userIdToKick}/projects/${selectedProjectId}`, {
       method: "DELETE"
     });
     if (!res.ok) throw new Error("Failed to kick user");
     fetchProjectUsers();
     alert("User removed successfully");
   } catch (err) {
     console.error("Error removing user from project:", err);
     alert("Failed to remove user");
   }
 };

 const toggleTask = (id: string) => {
   setSelectedTask((prev) => (prev === id ? null : id));
 };

 useEffect(() => {
  const fetchProjectMeta = async () => {
    if (!selectedProjectId) return;
    try {
      const topicRes = await fetch(`http://52.15.58.198:3000/projects/${selectedProjectId}/topics`);
      if (!topicRes.ok) throw new Error("Failed to fetch topics");
      const topicData = await topicRes.json();
      setProjectTopics(topicData.map((topic: any) => topic.topic));

      const skillRes = await fetch(`http://52.15.58.198:3000/projects/${selectedProjectId}/skills`);
      const skillData = await skillRes.json();
      
      console.log("Raw skillData:", skillData);
      
      setProjectSkills(skillData.map((skill: any) => ({
        name: skill.skill,
        icon_url: skill.icon_url,
      })));
      
      console.log("Mapped projectSkills:", skillData.map((skill: any) => ({
        name: skill.name,
        icon_url: skill.icon_url,
      })));
      
      
    } catch (err) {
      console.error("Error fetching project metadata:", err);
      setProjectTopics([]);
      setProjectSkills([]);
    }
  };
  fetchProjectMeta();
}, [selectedProjectId]);


useEffect(() => {
  const fetchProjects = async () => {
    if (!session?.user?.email) return;
    try {
      const usersRes = await fetch("http://52.15.58.198:3000/users");
      const users = await usersRes.json();
      const currentUser = users.find((u: any) => u.email === session.user.email);
      
      if (!currentUser) return;
      const fetchedUserId = currentUser.id;
      setUserId(fetchedUserId);

      const userProjectsRes = await fetch(`http://52.15.58.198:3000/users/${fetchedUserId}/projects`);
      const userProjectLinks = await userProjectsRes.json();
      const projectIds = userProjectLinks.map((link: any) => link.project_id);

      const allProjectsRes = await fetch("http://52.15.58.198:3000/projects");
      const allProjects = await allProjectsRes.json();

      // Filter out completed projects
      const associatedProjects = allProjects.filter((p: any) => 
        projectIds.includes(p.id) && !p.completed
      );
      
      setUserProjects(associatedProjects);
      
      if (associatedProjects.length > 0) {
        const firstProject = associatedProjects[0];
        setSelectedProjectId(firstProject.id);

        if (firstProject.team_lead_id === fetchedUserId) {
          fetchJoinRequests(fetchedUserId);
        }
      }
    } catch (err) {
      console.error("Failed to fetch project data:", err);
    }
  };

  fetchProjects();
}, [session]);


 const selectedProject = userProjects.find(p => p.id === selectedProjectId);
 const isTeamLead = selectedProject && userId === selectedProject?.team_lead_id;

 useEffect(() => {
   const fetchTimeline = async () => {
     if (!selectedProjectId) return;
     try {
       const res = await fetch(`http://52.15.58.198:3000/projects/${selectedProjectId}`);
       const project = await res.json();
       const frontendTasks = project.timeline?.frontend || [];
       const backendTasks = project.timeline?.backend || [];

       const generateDate = (index: number) => {
         const day = (index + 1) * 2;
         const date = new Date();
         const month = date.toLocaleString("default", { month: "short" });
         return `${month} ${String(day).padStart(2, "0")}`;
       };

       const combinedTasks: any[] = [];
       const maxLength = Math.max(frontendTasks.length, backendTasks.length);

       for (let i = 0; i < maxLength; i++) {
         if (frontendTasks[i]) {
           combinedTasks.push({
             date: generateDate(combinedTasks.length),
             frontend: frontendTasks[i],
             description: `Frontend Task ${i + 1}`,
             side: "frontend",
           });
         }
         if (backendTasks[i]) {
           combinedTasks.push({
             date: generateDate(combinedTasks.length),
             backend: backendTasks[i],
             description: `Backend Task ${i + 1}`,
             side: "backend",
           });
         }
       }

       setTasks(combinedTasks);
     } catch (err) {
       console.error("Failed to fetch timeline:", err);
     }
   };
   fetchTimeline();
 }, [selectedProjectId]);

 const handleMarkComplete = async () => {
  if (!selectedProjectId) return;
  try {
    const res = await fetch(`http://52.15.58.198:3000/projects/${selectedProjectId}/complete`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!res.ok) throw new Error("Failed to mark project as complete");
    
    // Remove the completed project from state
    setUserProjects(prev => prev.filter(project => project.id !== selectedProjectId));
    
    // Reset the selected project
    setSelectedProjectId(null);
    
    alert("Project marked as complete!");
    setShowCompleteConfirm(false);
  } catch (err) {
    console.error("Error:", err);
    alert("Could not mark project complete");
  }
};

const handleDelete = async () => {
  if (!selectedProjectId || !userId) return;
  try {
    const unlinkRes = await fetch(`http://52.15.58.198:3000/users/${userId}/projects/${selectedProjectId}`, {
      method: "DELETE"
    });
    if (!unlinkRes.ok) {
      alert("Failed to remove project from user.");
      return;
    }
    const deleteRes = await fetch(`http://52.15.58.198:3000/projects/${selectedProjectId}`, {
      method: "DELETE"
    });
    if (!deleteRes.ok) {
      alert("Failed to delete the project.");
      return;
    }
    alert("Project deleted successfully.");
    setShowDeleteConfirm(false);
  } catch (err) {
    console.error("Delete error:", err);
    alert("An error occurred while deleting the project.");
  }
};
if (showLoadingPage) {
    return <LoadingPage />;
  }
 
 return (
   <div className="w-screen h-full bg-[#f5f7fa] text-nunito">
     <NavBar />
     <div className="flex w-screen h-full translate-x-[-8px]">
     <div className="w-[270px] mt-[50px] bg-[#385773] py-[10px] text-[#fff] flex flex-col gap-[12px] overflow-y-auto border-r border-[#fff] px-[10px] rounded-br-[55px]">
      <div className="translate-y-[10px]">
      {userProjects.map((project) => (
        <div
          key={project.id}
          onClick={() => {
            setSelectedProjectId(project.id);
            setView("dashboard");
          }}
          
          className={`flex items-center gap-[20px] px-[15px] py-[20px] rounded-[8px] cursor-pointer transition-colors ${
            selectedProjectId === project.id ? "bg-[#ffffff20]" : "hover:bg-[#ffffff10]"
          }`}
        >
          <img
            src={project.thumbnail}
            alt="thumbnail"
            className="w-[50px] h-[50px] object-cover rounded-[6px] border border-white"
          />
          <span className="text-[14px] font-medium text-[#fff] whitespace-nowrap overflow-hidden text-ellipsis max-w-[130px]">
            {project.title}
          </span>
        </div>
      ))}
      </div>
    </div>



       <div className="flex-1 flex flex-col p-[20px] gap-[10px] mt-[50px] max-h-[calc(100vh-50px)] overflow-y-auto">


       <div className="sticky top-[0px] translate-y-[-10px] bg-[#f5f7fa] z-20 py-[10px] flex gap-[10px] items-center justify-between border-b border-[#e5e7eb] px-[5px]">
       <div
          className={`relative rounded-[8px] h-[40px] flex items-center justify-between px-[15px] bg-[#d1d5db] transition-all duration-300 ease-in-out`}
          style={{
            width: isTeamLead ? "340px" : "225px",
          }}
        >
          {/* Sliding Pill Indicator */}
          <div
            className="absolute top-[4px] left-[4px] h-[32px] bg-[#6b7280] rounded-[6px] transition-transform duration-300 ease-in-out"
            style={{
              width: "112px",
              transform:
                view === "timeline"
                  ? "translateX(124px)"
                  : view === "manage"
                  ? "translateX(244px)"
                  : "translateX(4px)",
            }}
          />



        {/* Tabs */}
        <button
          onClick={() => setView("dashboard")}
          className={`z-10 w-[112px] h-[32px] translate-x-[-7px] hover:text-[#374151] cursor-pointer rounded-[6px] text-sm font-semibold transition-colors duration-200 bg-transparent border-transparent outline-none ${
            view === "dashboard" ? "text-[#fff]" : "text-[#374151]"
          }`}
        >
          Dashboard
        </button>
        <button
        onClick={() => setView("timeline")}
        className={`z-10 w-[112px] h-[32px] rounded-[6px] text-sm font-semibold hover:text-[#374151] cursor-pointer transition-colors duration-200 bg-transparent border-transparent outline-none ${
          view === "timeline" ? "text-[#fff]" : "text-[#374151]"
        } `}
      >
        Timeline
      </button>

        {selectedProject && userId === selectedProject.team_lead_id && (
          <button
            onClick={() => setView("manage")}
            className={`z-10 w-[112px] h-[32px] translate-x-[5px] rounded-[6px] hover:text-[#374151] cursor-pointer text-sm font-semibold transition-colors duration-200 bg-transparent border-transparent outline-none ${
              view === "manage" ? "text-[#fff]" : "text-[#374151]"
            }`}
          >
            Manage
          </button>
        )}

      </div>




        {selectedProject && userId === selectedProject.team_lead_id && (
          <div className="flex gap-[10px]">
            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#2869a2] hover:bg-[#385773] cursor-pointer text-[#ffffff] px-[14px] py-[8px] rounded-[6px] text-[14px] font-medium flex justify-center items-center border-none outline-none" style={{
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-[20px] mr-[6px]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 3.487a2.251 2.251 0 0 1 3.182 3.182L6.75 19.963 3 21l1.037-3.75L16.862 3.487Z"
                />
              </svg>
              Edit
            </button>

            {/* Delete Button */}
            <button
                onClick={() => setShowDeleteConfirm(true)} // JUST set the modal
                className="bg-[#af0a0a] hover:bg-[#5c3131] cursor-pointer text-[#ffffff] px-[14px] py-[8px] rounded-[6px] text-[14px] font-medium flex justify-center items-center border-none outline-none"
              >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-[20px] mr-[6px]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
              Delete
            </button>
            <button
              onClick={() => setShowCompleteConfirm(true)} // JUST set the modal
              className="bg-[#088e61] hover:bg-[#2f574a] cursor-pointer text-[#ffffff] px-[14px] py-[8px] rounded-[6px] text-[14px] font-medium border-none outline-none"
            >
          Mark Complete
        </button>

        {showDeleteConfirm && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 ">
            <div className="bg-[#385773] text-[#fff] p-[10px] rounded shadow-lg text-center rounded-[10px] mt-[70px]">
              <p className="mb-[5px] text-lg font-medium">Are you sure you want to delete this project?</p>
              <div className="flex justify-center gap-[10px] ">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false); // close modal
                    handleDelete(); // only delete if user says yes
                  }}
                  className="bg-[#ef4444] text-[#fff] px-[10px] py-[10px] rounded border-none outline-none rounded-[10px]"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-[#9ca3af] text-[#fff] px-[10px] py-[10px] rounded border-none outline-none rounded-[10px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showCompleteConfirm && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-[#385773] text-[#fff] p-[10px] rounded shadow-lg text-center rounded-[10px] mt-[70px]">
              <p className="mb-[5px] text-lg font-medium">Do you want to mark this project as complete?</p>
              <div className="flex justify-center gap-[10px]">
                <button
                  onClick={() => {
                    setShowCompleteConfirm(false); // close modal
                    handleMarkComplete(); // only complete if user confirms
                  }}
                  className="bg-[#10b981] text-[#fff] rounded-[10px] px-[10px] py-[10px] rounded border-none outline-none"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowCompleteConfirm(false)}
                  className="bg-[#9ca3af] text-[#fff] rounded-[10px] px-[10px] py-[10px] rounded border-none outline-none"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

          </div>
          
        )}

        {selectedProject && userId !== selectedProject.team_lead_id && (
          <div className="flex gap-[10px]">
            <button
              onClick={async () => {
                try {
                  const res = await fetch(`http://52.15.58.198:3000/users/${userId}/projects/${selectedProject.id}`, {
                    method: "DELETE",
                  });
                  if (!res.ok) {
                    alert("Failed to leave the project.");
                    return;
                  }
                  alert("You have left the project.");
                  setUserProjects(prev => prev.filter(p => p.id !== selectedProject.id));
                  setSelectedProjectId(null);
                } catch (err) {
                  console.error("Leave project error:", err);
                  alert("An error occurred while leaving the project.");
                }
              }}
              className="bg-[#af0a0a] hover:bg-[#5c3131] text-[#ffffff] cursor-pointer px-[14px] py-[8px] rounded-[6px] text-[14px] font-medium border-none outline-none"
            >
              Leave Project
            </button>
          </div>
        )}

      </div>



      {view === "dashboard" && selectedProject && !isEditing && (
 <div className="bg-[#ffffff] p-[20px] rounded-[8px] shadow-md border border-[#d1d5db] h-[650px] overflow-hidden">
  <div className="h-full overflow-y-auto pr-[10px]">
   {/* Layer 1: Title, Type, GitHub, Description */}
   <div className="mb-[20px]">
     <h2 className="text-[22px] font-bold text-[#111827] mb-[5px]">{selectedProject.title}</h2>


     <div className="flex items-center gap-[10px] mb-[5px]">
       {selectedProject.type && (
         <span className="text-[12px] font-medium text-[#ffffff] bg-[#385773] px-[10px] py-[4px] rounded-[999px]">
           {selectedProject.type}
         </span>
       )}


       {selectedProject.github_repo_url && (
         <a
           href={selectedProject.github_repo_url}
           target="_blank"
           rel="noopener noreferrer"
           className="text-[#2563eb] text-[13px] underline hover:text-[#1e40af] break-all flex justify-center items-center d"
         >
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-[25px]">
           <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
           </svg>
           GITHUB LINK
         </a>
       )}
     </div>


     <p className="text-[15px] text-[#374151]" style={{
      fontFamily: "'Nunito', sans-serif",
    }}> {selectedProject.description} </p>
   </div>


       {/* Layer 2: MVPs and Stretch Goals (compact side-by-side layout) */}
       <div className="flex gap-[20px] mb-[px]">
       {/* MVPs */}
       <div className="flex-1">
           <h3 className="text-[15px] font-semibold text-[#111827] mb-[6px]">MVPs</h3>
           <div className="flex flex-col gap-[1px]">
           {selectedProject.mvp?.map((mvp: string, idx: number) => (
               <div key={idx} className="flex items-center gap-[6px]">
               <div className="min-w-[20px] min-h-[20px] rounded-full bg-[#c7d2fe] text-[#1e3a8a] text-[11px] font-semibold flex items-center justify-center">
                   {idx + 1}
               </div>
               <p className="text-[13px] text-[#374151]">{mvp}</p>
               </div>
           ))}
           </div>
       </div>


       {/* Stretch Goals */}
       <div className="flex-1">
           <h3 className="text-[15px] font-semibold text-[#111827] mb-[6px]">Stretch Goals</h3>
           <div className="flex flex-col gap-[1px]">
           {selectedProject.stretch?.map((goal: string, idx: number) => (
               <div key={idx} className="flex items-center gap-[6px]">
               <div className="min-w-[20px] min-h-[20px] rounded-full bg-[#fee2e2] text-[#b91c1c] text-[11px] font-semibold flex items-center justify-center">
                   {idx + 1}
               </div>
               <p className="text-[13px] text-[#374151]">{goal}</p>
               </div>
           ))}
           </div> 
       </div>
       </div>






   {/* Layer 3: Topics, Tech Used, Members (equal-sized boxes) */}
<div className="flex gap-[20px] mt-[20px]">
 {/* Topics Box */}
 <div className="flex-1 border border-[#d1d5db] rounded-[8px] p-[15px] min-h-[160px] bg-[#f9fafb]">
      


   <h3 className="text-[16px] font-semibold text-[#111827] mb-[10px] flex justify-start items-center">
   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-[25px]">
       <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
       </svg>
       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-[25px]">
       <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
       </svg>


       Topics


       </h3>
   <div className="flex flex-wrap gap-[8px]">
     {projectTopics.length > 0 ? (
       projectTopics.map((topic, idx) => (
         <span
           key={idx}
           className="text-[14px] text-[#374151] bg-[#ede9fe] px-[10px] py-[4px] rounded-[6px]"
         >
           {topic}
         </span>
       ))
     ) : (
       <p className="text-[13px] text-[#9ca3af]">No topics yet.</p>
     )}
   </div>
 </div>


 {/* Tech Used Box */}
 <div className="flex-1 border border-[#d1d5db] rounded-[8px] p-[15px] min-h-[160px] bg-[#f9fafb]">
   <h3 className="text-[16px] font-semibold text-[#111827] mb-[10px] flex justify-start items-center">
   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-[25px]">
       <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
       <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
       </svg>


       Tech Used
       </h3>
       <div className="flex flex-wrap gap-[10px]">
        {projectSkills.map((skill, idx) => (
          <div
            key={idx}
            className="flex items-center gap-[8px] px-[10px] py-[6px] bg-[#fef3c7] border border-[#fcd34d] rounded-[6px] shadow-sm"
          >
            <img
              src={skill.icon_url || "/default-tech-icon.png"}
              alt={skill.name}
              className="w-[18px] h-[18px] object-contain"
            />
            <span className="text-[13px] text-[#92400e]"> {skill.name} </span>
          </div>
        ))}
      </div>


 </div>


 {/* Members Box */}
 <div className="flex-1 border border-[#d1d5db] rounded-[8px] p-[15px] min-h-[160px] bg-[#f9fafb]">
  <h3 className="text-[16px] font-semibold text-[#111827] mb-[10px] flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-[25px] mr-[6px]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
    Members
  </h3>

  <div className="flex flex-col gap-[12px] max-h-[180px] overflow-y-auto pr-[5px]">
    {projectUsers.length > 0 ? (
      projectUsers.map((user, idx) => (
        <div
          key={idx}
          onClick={() => router.push(`/profile/${user.id}`)}
          className="cursor-pointer flex items-center gap-[10px] bg-white px-[10px] py-[6px] rounded-[8px] shadow-sm border border-[#e5e7eb] hover:shadow-md transition"
        >
          <img
            src={user.image || "/default-avatar.png"}
            alt={user.name}
            className="w-[35px] h-[35px] rounded-full border border-[#d1d5db] object-cover"
          />
          <span className="text-[14px] font-medium text-[#374151]">{user.name}</span>
        </div>
      ))
      
    ) : (
      <p className="text-[13px] text-[#9ca3af]">No members yet.</p>
    )}
  </div>
</div>

</div>
</div>

 </div>
)}
    {view === "dashboard" && selectedProject && isEditing && (
      <EditProject
        projectId={selectedProjectId!.toString()}
        onClose={() => setIsEditing(false)}
      />
    )}
           {view === "timeline" && selectedProject && (
  <div className="bg-white p-[20px] h-[650px] rounded-[8px] shadow-md border border-[#d1d5db] overflow-y-auto">
    <ProjectTimeline projectId={selectedProjectId!} />
  </div>
)}
        {view === "manage" && selectedProject && userId === selectedProject.team_lead_id && (
  <div className="bg-white p-[20px] h-[650px] rounded-[8px] shadow-md border border-[#d1d5db] overflow-y-auto">
    <h2 className="text-xl font-bold mb-4 text-[#385773]">Manage Members</h2>
            <div className="flex flex-col gap-[10px] mb-8">
              {projectUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center bg-[#f9fafb] border border-[#d1d5db] px-[15px] py-[10px] rounded-[6px]"
                >
                  <div className="flex items-center gap-[10px]">
                    <img
                      src={user.image || "/default-avatar.png"}
                      alt={user.name}
                      className="w-[40px] h-[40px] rounded-full border border-[#d1d5db] object-cover"
                    />
                    <span className="text-[14px] font-medium text-[#374151]">{user.name}</span>
                  </div>
                  <button
                    onClick={() => handleKickUser(user.id)}
                    className="text-[#ef4444] text-[12px] border border-[#ef4444] px-[10px] py-[4px] rounded-[6px] hover:bg-[#fee2e2] cursor-pointer"
                  >
                    {user.id === userId ? "Leave Project" : "Kick Out"}
                  </button>

                </div>
              ))}
            </div>

            <h2 className="text-xl font-bold mb-2 text-[#385773]">Join Requests</h2>
            <div className="flex flex-col gap-[10px]">
              {joinRequests.filter(r => r.project_id === selectedProjectId).map((req) => (
                <div
                  key={`${req.user_id}-${req.project_id}`}
                  className="flex justify-between items-center bg-[#e0f2fe] border border-[#38bdf8] px-[15px] py-[10px] rounded-[6px]"
                >
                  <div className="flex items-center gap-[10px]">

                    {joinRequestUsers[req.user_id] ? (
                      <div className="flex items-center gap-[10px]">
                        <button
                      onClick={() => router.push(`/profile/${req.user_id}`)}
                      className="text-[14px] font-semibold text-[#1d4ed8] underline hover:text-[#1e40af] bg-transparent border-none outline-none"
                    >
                        <img
                          src={joinRequestUsers[req.user_id].image || "/default-avatar.png"}
                          alt={joinRequestUsers[req.user_id].name}
                          className="w-[35px] h-[35px] rounded-full border border-[#d1d5db] object-cover"
                        />
                        </button>
                        <span className="text-[14px] font-medium text-[#1e293b]">
                          {joinRequestUsers[req.user_id].name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[14px] text-[#9ca3af]">Loading user...</span>
                    )}

                  </div>
                  <div className="flex gap-[10px]">
                    <button
                      onClick={() => handleAcceptJoin(req.user_id, req.project_id)}
                      className="text-[#fff] bg-[#10b981] hover:bg-[#059669] px-[10px] py-[5px] text-[13px] rounded-[6px] border-none outline-none"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectJoin(req.user_id, req.project_id)}
                      className="text-[#fff] bg-[#ef4444] hover:bg-[#dc2626] px-[10px] py-[5px] text-[13px] rounded-[6px] border-none outline-none"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
              {joinRequests.filter(r => r.project_id === selectedProjectId).length === 0 && (
                <p className="text-[13px] text-[#64748b]">No join requests for this project.</p>
              )}
            </div>
          </div>
        )}
        


       </div>
     </div>
   </div>
 );
};


export default MyProject;





