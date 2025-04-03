"use client";
import type React from "react";
import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // 👈 add at the top




const MyProject = () => {
 const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
 const [view, setView] = useState("dashboard");
 const [userProjects, setUserProjects] = useState<any[]>([]);
 const [userId, setUserId] = useState<number | null>(null);
 const { data: session } = useSession();
 const [projectTopics, setProjectTopics] = useState<string[]>([]);
 const [projectSkills, setProjectSkills] = useState<string[]>([]);
 const [tasks, setTasks] = useState<any[]>([]);
 const [selectedTask, setSelectedTask] = useState<string | null>(null);


 const toggleTask = (id: string) => {
   setSelectedTask((prev) => (prev === id ? null : id));
 };


 const router = useRouter()
 useEffect(() => {
   const fetchProjectMeta = async () => {
     if (!selectedProjectId) return;


     try {
       // Fetch Topics
       const topicRes = await fetch(`http://52.15.58.198:3000/projects/${selectedProjectId}/topics`);
       if (!topicRes.ok) throw new Error("Failed to fetch topics");
       const topicData = await topicRes.json();
       setProjectTopics(topicData.map((topic: any) => topic.topic)); // ✅ FIXED


       // Fetch Skills
       const skillRes = await fetch(`http://52.15.58.198:3000/projects/${selectedProjectId}/skills`);
       if (!skillRes.ok) throw new Error("Failed to fetch skills");
       const skillData = await skillRes.json();
       setProjectSkills(skillData.map((skill: any) => skill.skill)); // ✅ FIXED
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


       const associatedProjects = allProjects.filter((p: any) => projectIds.includes(p.id));
       setUserProjects(associatedProjects);
       if (associatedProjects.length > 0) setSelectedProjectId(associatedProjects[0].id);
     } catch (err) {
       console.error("Failed to fetch project data:", err);
     }
   };
   fetchProjects();
 }, [session]);


 const selectedProject = userProjects.find(p => p.id === selectedProjectId);
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


     if (selectedProject?.team_lead_id === userId) {
       const deleteRes = await fetch(`http://52.15.58.198:3000/projects/${selectedProjectId}`, {
         method: "DELETE"
       });


       if (!deleteRes.ok) {
         alert("Failed to delete the project.");
         return;
       }


       alert("Project deleted successfully.");
     } else {
       alert("Project removed from your profile.");
     }


     setUserProjects(prev => prev.filter(p => p.id !== selectedProjectId));
     setSelectedProjectId(null);
   } catch (err) {
     console.error("Delete error:", err);
     alert("An error occurred while deleting the project.");
   }
  
 };


 return (
   <div className="w-screen h-full bg-[#f5f7fa]">
     <NavBar />
     <div className="flex w-screen h-screen translate-[-8px]">
       <div className="w-[270px] bg-[#385773] py-[15px] text-[#fff] flex flex-col gap-[5px] overflow-y-auto border-r border-[#fff] mt-[50px]">
         {userProjects.map(project => (
           <img
             key={project.id}
             src={project.thumbnail || "/placeholder.jpg"}
             alt="thumbnail"
             className={` mt-[0px] w-[150px] h-[100px] object-cover rounded-[8px] cursor-pointer border-1 border-[#fff] ml-[60px] ${
               selectedProjectId === project.id ? "border-[#385773]" : "border-transparent"
             }`}
             onClick={() => setSelectedProjectId(project.id)}
           />
         ))}
       </div>


       <div className="flex-1 flex flex-col p-[20px] gap-[10px] mt-[50px] max-h-[calc(100vh-50px)] overflow-y-auto">


         <div className="flex gap-[10px] mb-[10px] items-center justify-between">
           <div className="flex gap-[10px]">
             {['dashboard', 'timeline', 'chat'].map((item) => (
               <button
                 key={item}
                 className={`px-[16px] py-[8px] rounded-[6px] text-[#ffffff] font-medium ${
                   view === item ? "bg-[#385773]" : "bg-[#9ca3af] hover:bg-[#6b7280]"
                 }`}
                 onClick={() => setView(item)}
               >
                 {item.charAt(0).toUpperCase() + item.slice(1)}
               </button>
             ))}
           </div>


           {selectedProject && userId === selectedProject.team_lead_id && (
           <div className="flex gap-[10px]">
               {/* Edit Button */}
               <button
               onClick={() => router.push(`/editReviewPage?id=${selectedProjectId}`)}
               className="bg-[#2869a2] hover:bg-[#385773] text-[#ffffff] px-[14px] py-[8px] rounded-[6px] text-[14px] font-medium flex justify-center items-center"
               >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-[20px] mr-[6px]">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.251 2.251 0 0 1 3.182 3.182L6.75 19.963 3 21l1.037-3.75L16.862 3.487Z" />
               </svg>
               Edit
               </button>




               {/* Delete Button */}
               <button
               onClick={handleDelete}
               className="bg-[#ef4444] hover:bg-[#dc2626] text-[#ffffff] px-[14px] py-[8px] rounded-[6px] text-[14px] font-medium flex justify-center items-center"
               >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-[20px] mr-[6px]">
                   <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
               </svg>
               Delete
               </button>
           </div>
           )}


         </div>


         {view === "dashboard" && selectedProject && (
 <div className="bg-[#ffffff] p-[20px] rounded-[8px] shadow-md border border-[#d1d5db]">
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


     <p className="text-[15px] text-[#374151]">{selectedProject.description}</p>
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
   <div className="flex flex-wrap gap-[8px]">
     {projectSkills.length > 0 ? (
       projectSkills.map((skill, idx) => (
         <span
           key={idx}
           className="px-[10px] py-[4px] bg-[#fef3c7] text-[#92400e] rounded-[6px] text-[13px]"
         >
           {skill}
         </span>
       ))
     ) : (
       <p className="text-[13px] text-[#9ca3af]">No skills listed.</p>
     )}
   </div>
 </div>


 {/* Members Box */}
 <div className="flex-1 border border-[#d1d5db] rounded-[8px] p-[15px] min-h-[160px] bg-[#f9fafb]">
   <h3 className="text-[16px] font-semibold text-[#111827] mb-[10px] flex justify-start items-center">
   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-[25px]">
       <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
       </svg>


       Members</h3>
   <div className="flex flex-wrap gap-[8px]">
     <span className="bg-[#e0f2fe] text-[#0369a1] px-[10px] py-[4px] rounded-[6px] text-[13px]">
       Coming Soon
     </span>
   </div>
 </div>
</div>


 </div>
)}
           {view === "timeline" && selectedProject && (
 <div className="bg-[#ffffff] p-[20px] rounded-[8px] shadow-md border border-[#d1d5db]">
   <h1 className="text-[22px] font-bold text-[#111827] mb-[20px]">Project Timeline</h1>
  
   <div className="flex">
     {/* Labels on the left */}
     <div className="flex flex-col justify-center gap-[140px] pr-[24px]">
       <div className="text-[#385773] font-semibold text-[14px] text-right">Frontend</div>
       <div className="text-[#385773] font-semibold text-[14px] text-right">Backend</div>
     </div>


     {/* Actual Timeline */}
     <div className="relative flex-1 overflow-x-auto max-w-full">
 <div className="relative w-max px-[20px] py-[30px]">
   {/* ✅ MOVED: line now inside scroll container and stretches with content */}
   <div className="absolute top-1/2 left-0 h-[2px] w-full bg-[#385773] z-0" />


   <div className="flex items-center gap-[80px] relative z-10">
     {tasks.map((task, idx) => (
       <div key={idx} className="relative flex flex-col items-center min-w-[120px]">
         {task.frontend && (
           <div className="-mt-[30px] flex flex-col items-center relative">
             <div className="mb-[6px] text-[12px] text-[#1f2937]">{task.frontend}</div>
             <div className="w-[2px] h-[30px] border-l border-dotted border-[#9ca3af]" />
             <div
               className="w-[10px] h-[10px] bg-[#385773] rounded-full cursor-pointer"
               onClick={() => toggleTask(`${idx}-frontend`)}
             />
             <div className="mt-[6px] text-[11px] text-[#6b7280]">{task.date}</div>


             {selectedTask === `${idx}-frontend` && (
               <div className="absolute -bottom-[70px] w-[140px] bg-white text-black text-[11px] border border-[#d1d5db] shadow rounded px-[10px] py-[6px] z-20">
                 {task.description}
               </div>
             )}
           </div>
         )}


         {task.backend && (
           <div className="mt-[34px] flex flex-col items-center relative">
             <div className="mt-[6px] text-[11px] text-[#6b7280]">{task.date}</div>
             <div
               className="w-[10px] h-[10px] bg-[#385773] rounded-full cursor-pointer"
               onClick={() => toggleTask(`${idx}-backend`)}
             />
             <div className="w-[2px] h-[30px] border-l border-dotted border-[#9ca3af]" />
             <div className="mt-[6px] text-[12px] text-[#1f2937]">{task.backend}</div>


             {selectedTask === `${idx}-backend` && (
               <div className="absolute top-[70px] w-[140px] bg-white text-black text-[11px] border border-[#d1d5db] shadow rounded px-[10px] py-[6px] z-20">
                 {task.description}
               </div>
             )}
           </div>
         )}
       </div>
     ))}
   </div>
 </div>
</div>




   </div>
 </div>
)}


         {view === "chat" && (
           <div className="text-[#6b7280] text-[14px]">Chat view (Coming Soon)</div>
         )}
       </div>
     </div>
   </div>
 );
};


export default MyProject;





