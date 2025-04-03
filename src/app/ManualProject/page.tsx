"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { ProjectData } from "../shared/types"


export default function ManualProject() {
 const router = useRouter()
 const searchParams = useSearchParams()


 const [frontendInput, setFrontendInput] = useState<string>("")
 const [frontendTimeline, setFrontendTimeline] = useState<string[]>([])
 const [backendInput, setBackendInput] = useState<string>("")
 const [backendTimeline, setBackendTimeline] = useState<string[]>([])




 const [projectName, setProjectName] = useState<string>("")
 const [projectType, setProjectType] = useState<string>("")
 const [techToBeUsed, setTechToBeUsed] = useState<string>("")
 const [selectedTechs, setSelectedTechs] = useState<string[]>([])
 const [interestInput, setInterestInput] = useState<string>("")
 const [selectedInterests, setSelectedInterests] = useState<string[]>([])
 const [description, setDescription] = useState<string>("")
 const [mvpInput, setMvpInput] = useState<string>("")
 const [mvps, setMvps] = useState<string[]>([])
 const [stretchGoalInput, setStretchGoalInput] = useState<string>("")
 const [stretchGoals, setStretchGoals] = useState<string[]>([])


 const [techOptions, setTechOptions] = useState<string[]>([])
 const [filteredTechOptions, setFilteredTechOptions] = useState<string[]>([])
 const [showDropdown, setShowDropdown] = useState<boolean>(false)


 const [interestOptions, setInterestOptions] = useState<string[]>([])
 const [filteredInterestOptions, setFilteredInterestOptions] = useState<string[]>([])
 const [showInterestDropdown, setShowInterestDropdown] = useState<boolean>(false)
 const [thumbnail, setThumbnail] = useState<File | null>(null)


 const [showMvpWarning, setShowMvpWarning] = useState<boolean>(false)
 const [showStretchGoalWarning, setShowStretchGoalWarning] = useState<boolean>(false)
 const [skillMap, setSkillMap] = useState<{ [id: number]: string }>({});
 const [topicMap, setTopicMap] = useState<{ [id: number]: string }>({});
  useEffect(() => {
   const fetchSkillsAndTopics = async () => {
     try {
       const [skillsRes, topicsRes] = await Promise.all([
         fetch("http://52.15.58.198:3000/skills"),
         fetch("http://52.15.58.198:3000/topics"),
       ]);
        const skillsData = await skillsRes.json();
       const topicsData = await topicsRes.json();
        const skillMapTemp: { [id: number]: string } = {};
       skillsData.forEach((s: { id: number; skill: string }) => {
         skillMapTemp[s.id] = s.skill;
       });
        const topicMapTemp: { [id: number]: string } = {};
       topicsData.forEach((t: { id: number; topic: string }) => {
         topicMapTemp[t.id] = t.topic;
       });
        setSkillMap(skillMapTemp);
       setTopicMap(topicMapTemp);
       setTechOptions(skillsData.map((s: { skill: string }) => s.skill));
       setInterestOptions(topicsData.map((t: { topic: string }) => t.topic));
     } catch (err) {
       console.error("Failed to fetch skills/topics", err);
     }
   };
    fetchSkillsAndTopics();
 }, []);
  useEffect(() => {
   const dataParam = searchParams.get("data");
   if (dataParam) {
     try {
       const data: ProjectData = JSON.parse(decodeURIComponent(dataParam));
      
       // Set all form fields from the data
       setProjectName(data.projectName || "");
       setProjectType(data.projectType || "");
       setSelectedTechs(data.techToBeUsed || []);
       setSelectedInterests(data.interests || []);
       setDescription(data.description || "");
       setMvps(data.mvps || []);
       setStretchGoals(data.stretchGoals || []);
      
       // If there's a thumbnail in the data (base64 string), keep it
       // Note: We don't set the thumbnail File object here since it's already base64
     } catch (error) {
       console.error("Error parsing project data:", error);
     }
   }
 }, [searchParams]);


 useEffect(() => {
   const dataParam = searchParams.get("data");
   if (!dataParam || techOptions.length === 0 || interestOptions.length === 0) return;
    try {
     const data = JSON.parse(decodeURIComponent(dataParam));
      if (data.source !== "ai") {
       console.log("👤 Manual project creation detected. Skipping AI autofill.");
       return;
     }
      console.log("🤖 AI project data detected. Pre-filling form...");
      setProjectName(data.projectName || data.title || "");
     setProjectType(data.projectType || data.type || "");
     setDescription(data.description || "");
     setMvps(Array.isArray(data.mvps) ? data.mvps : data.mvp || []);
     setStretchGoals(Array.isArray(data.stretchGoals) ? data.stretchGoals : data.stretch || []);
      const matchedTechs = (data.techToBeUsed || data.skills || []).filter((skill: string) =>
       techOptions.includes(skill)
     );
     setSelectedTechs(matchedTechs);
      const matchedInterests = (data.interests || data.topics || []).filter((topic: string) =>
       interestOptions.includes(topic)
     );
     setSelectedInterests(matchedInterests);
      // ✅ Add these lines to support AI timeline
     setFrontendTimeline(data.timeline?.frontend || []);
     setBackendTimeline(data.timeline?.backend || []);
    } catch (error) {
     console.error("❌ Failed to parse AI project data:", error);
   }
 }, [searchParams, techOptions, interestOptions]);
 
 


  useEffect(() => {
   const fetchSkills = async () => {
     try {
       const res = await fetch("http://52.15.58.198:3000/skills")
       const data = await res.json()
       setTechOptions(data.map((s: { skill: string }) => s.skill))
     } catch (err) {
       console.error("Error fetching skills:", err)
     }
   }


   const fetchTopics = async () => {
     try {
       const res = await fetch("http://52.15.58.198:3000/topics")
       const data = await res.json()
       setInterestOptions(data.map((t: { topic: string }) => t.topic))
     } catch (err) {
       console.error("Error fetching topics:", err)
     }
   }


   fetchSkills()
   fetchTopics()
 }, [])


 const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
   e.preventDefault();
    if (!projectName || !projectType || selectedTechs.length === 0) {
     alert("Please fill in all required fields");
     return;
   }
    const projectData: ProjectData = {
     id: Date.now(),
     projectName,
     projectType,
     techToBeUsed: selectedTechs,
     interests: selectedInterests,
     description,
     mvps,
     stretchGoals,
     timeline: {
       frontend: frontendTimeline,
       backend: backendTimeline,
     },
   };
    // Save image to local storage temporarily as base64 (only small images)
   if (thumbnail) {
     const reader = new FileReader();
     reader.onloadend = () => {
       const base64Image = reader.result;
       const enrichedData = { ...projectData, thumbnail: base64Image };
       localStorage.setItem("projectReviewData", JSON.stringify(enrichedData));
       router.push(`/reviewPage`);
     };
     reader.readAsDataURL(thumbnail);
   } else {
     localStorage.setItem("projectReviewData", JSON.stringify(projectData));
     router.push(`/reviewPage`);
   }
 };
  const handleTechInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const value = e.target.value
   setTechToBeUsed(value)


   if (value) {
     const filtered = techOptions.filter((tech) => tech.toLowerCase().includes(value.toLowerCase()))
     setFilteredTechOptions(filtered)
     setShowDropdown(true)
   } else {
     setShowDropdown(false)
   }
 }


 const handleTechSelect = (tech: string) => {
   if (!selectedTechs.includes(tech)) {
     setSelectedTechs([...selectedTechs, tech])
   }
   setTechToBeUsed("")
   setShowDropdown(false)
 }


 const handleAddNewTech = () => {
   if (techToBeUsed && !techOptions.includes(techToBeUsed)) {
     setTechOptions([...techOptions, techToBeUsed])
     setSelectedTechs([...selectedTechs, techToBeUsed])
     setTechToBeUsed("")
   }
   setShowDropdown(false)
 }


 const handleRemoveTech = (tech: string) => {
   setSelectedTechs(selectedTechs.filter((t) => t !== tech))
 }


 const handleInterestInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const value = e.target.value
   setInterestInput(value)


   if (value) {
     const filtered = interestOptions.filter((interest) => interest.toLowerCase().includes(value.toLowerCase()))
     setFilteredInterestOptions(filtered)
     setShowInterestDropdown(true)
   } else {
     setShowInterestDropdown(false)
   }
 }


 const handleInterestSelect = (interest: string) => {
   if (!selectedInterests.includes(interest)) {
     setSelectedInterests([...selectedInterests, interest])
   }
   setInterestInput("")
   setShowInterestDropdown(false)
 }


 const handleAddNewInterest = () => {
   if (interestInput && !interestOptions.includes(interestInput)) {
     setInterestOptions([...interestOptions, interestInput])
     setSelectedInterests([...selectedInterests, interestInput])
     setInterestInput("")
   }
   setShowInterestDropdown(false)
 }


 const handleRemoveInterest = (interest: string) => {
   setSelectedInterests(selectedInterests.filter((t) => t !== interest))
 }


 const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
   if (e.key === "Enter") {
     e.preventDefault()
     setShowDropdown(false)
     setShowInterestDropdown(false)
   }
 }


 const handleAddMvp = () => {
   if (mvpInput && mvps.length < 6) {
     setMvps([...mvps, mvpInput])
     setMvpInput("")
     if (mvps.length === 5) setShowMvpWarning(true)
   }
 }


 const handleRemoveMvp = (index: number) => {
   setMvps(mvps.filter((_, i) => i !== index))
   if (mvps.length === 6) setShowMvpWarning(false)
 }


 const handleAddStretchGoal = () => {
   if (stretchGoalInput && stretchGoals.length < 6) {
     setStretchGoals([...stretchGoals, stretchGoalInput])
     setStretchGoalInput("")
     if (stretchGoals.length === 5) setShowStretchGoalWarning(true)
   }
 }


 const handleRemoveStretchGoal = (index: number) => {
   setStretchGoals(stretchGoals.filter((_, i) => i !== index))
   if (stretchGoals.length === 6) setShowStretchGoalWarning(false)
 }


 const handleAddFrontend = () => {
   if (frontendInput && frontendTimeline.length < 6) {
     setFrontendTimeline([...frontendTimeline, frontendInput])
     setFrontendInput("")
   }
 }
  const handleRemoveFrontend = (index: number) => {
   setFrontendTimeline(frontendTimeline.filter((_, i) => i !== index))
 }
  const handleAddBackend = () => {
   if (backendInput && backendTimeline.length < 6) {
     setBackendTimeline([...backendTimeline, backendInput])
     setBackendInput("")
   }
 }
  const handleRemoveBackend = (index: number) => {
   setBackendTimeline(backendTimeline.filter((_, i) => i !== index))
 }


 return (
   <div
     className="h-full w-screen translate-[-8px]"
     style={{
       minHeight: "100vh",
       display: "flex",
       flexDirection: "column",
       alignItems: "center",
       background: "linear-gradient(to bottom right, #2c3640, #385773, #00d4ff)",
       color: "#ffffff",
       fontFamily: "'Nunito', sans-serif",
       position: "relative",
     }}>
     {/* Gradient bubbles */}
     <div
       style={{
         position: "absolute",
         top: "100px",
         left: "0px",
         width: "100%",
         height: "100%",
         overflow: "hidden",
         pointerEvents: "none"
       }}>
       <div style={{ position: "absolute", top: "10%", left: "5%", width: "300px", height: "300px", borderRadius: "50%", background: "#60a5fa", opacity: "0.1", filter: "blur(80px)" }}></div>
       <div style={{ position: "absolute", bottom: "15%", right: "10%", width: "250px", height: "250px", borderRadius: "50%", background: "#a5b4fc", opacity: "0.1", filter: "blur(60px)" }}></div>
       <div style={{ position: "absolute", top: "40%", right: "20%", width: "200px", height: "200px", borderRadius: "50%", background: "#c084fc", opacity: "0.1", filter: "blur(70px)" }}></div>
     </div>


     {/* Fixed Header */}
     <h2
       style={{
         padding: "5px",
         fontSize: "30px",
         fontWeight: "700",
         textAlign: "center",
         margin: "25px 0",
         position: "sticky",
         top: "0",
         zIndex: 10,
         background: "linear-gradient(to right, #e0f2fe, #e0e7ff)",
         WebkitBackgroundClip: "text",
         WebkitTextFillColor: "transparent",
         width: "100%",
         backdropFilter: "blur(10px)",
         paddingTop: "40px",
         paddingBottom: "20px",
       }}>
       BRING YOUR IDEAS TO LIFE!
     </h2>


     {/* Fixed Form Container */}
     <div
     className="translate-y-[-50px] flex justify-center"
       style={{
         width: "800px",
         height: "700px",
         position: "relative",
         zIndex: 10,
         marginTop: "20px",
         marginBottom: "40px",
         padding: "0 20px",
        
       }}>
       <div
         style={{
           backdropFilter: "blur(16px)",
           backgroundColor: "rgba(255, 255, 255, 0.1)",
           borderRadius: "16px",
           padding: "32px",
           boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.1)",
           width: "100%",
           overflow: "scroll",
         }}
       >
         {/* Form Content */}
         <form
           onSubmit={handleSubmit}
           style={{
             display: "flex",
             flexDirection: "column",
             gap: "20px",
             width: "100%",
             overflow: "scroll",
           }}
         >
           {/* Project Name and Type - Equal Width */}
           <div style={{
             display: "flex",
             gap: "16px",
             width: "100%",
           }}>
             <div style={{ flex: 1 }}>
               <input
                 type="text"
                 placeholder="Project Name"
                 value={projectName}
                 onChange={(e) => setProjectName(e.target.value)}
                 required
                 style={{
                   width: "100%",
                   padding: "12px",
                   borderRadius: "8px",
                   backgroundColor: "#ffffff80",
                   color: "#ffffff",
                   border: "1px solid #ffffff30",
                   boxSizing: "border-box",
                 }}
               />
             </div>
             <div style={{ flex: 1 }}>
               <input
                 type="text"
                 placeholder="Project Type"
                 value={projectType}
                 onChange={(e) => setProjectType(e.target.value)}
                 required
                 style={{
                   width: "100%",
                   padding: "12px",
                   borderRadius: "8px",
                   backgroundColor: "#ffffff80",
                   color: "#ffffff",
                   border: "1px solid #ffffff30",
                   boxSizing: "border-box",
                 }}
               />
             </div>
           </div>


           {/* Tech Stack - Full Width */}
           <div style={{ width: "100%" }}>
             <input
               type="text"
               placeholder="Add Tech"
               value={techToBeUsed}
               onChange={handleTechInputChange}
               onKeyDown={handleKeyDown}
               style={{
                 width: "100%",
                 padding: "12px",
                 borderRadius: "8px",
                 backgroundColor: "#ffffff80",
                 color: "#ffffff",
                 border: "1px solid #ffffff30",
                 boxSizing: "border-box",
               }}
             />
             {showDropdown && (
               <div style={{
                 marginTop: "8px",
                 backgroundColor: "#1e3a8a",
                 borderRadius: "8px",
                 padding: "8px",
                 width: "100%",
               }}>
                 {filteredTechOptions.map((tech, index) => (
                   <div
                     key={index}
                     onClick={() => handleTechSelect(tech)}
                     style={{
                       color: "#fff",
                       cursor: "pointer",
                       padding: "4px 0",
                       width: "100%",
                     }}
                   >
                     {tech}
                   </div>
                 ))}
                 {techToBeUsed && !techOptions.includes(techToBeUsed) && (
                   <div
                     onClick={handleAddNewTech}
                     style={{
                       color: "#93c5fd",
                       cursor: "pointer",
                       paddingTop: "4px",
                       width: "100%",
                     }}
                   >
                     Add "{techToBeUsed}"
                   </div>
                 )}
               </div>
             )}
             <div style={{
               display: "flex",
               flexWrap: "wrap",
               gap: "8px",
               marginTop: "8px",
               width: "100%",
             }}>
               {selectedTechs.map((tech, index) => (
                 <div
                   key={index}
                   style={{
                     backgroundColor: "#ffffff20",
                     padding: "6px 10px",
                     borderRadius: "6px",
                     color: "#fff",
                     maxWidth: "100%",
                     overflow: "hidden",
                     textOverflow: "ellipsis",
                   }}
                 >
                   {tech}
                   <span
                     onClick={() => handleRemoveTech(tech)}
                     style={{
                       marginLeft: "8px",
                       cursor: "pointer"
                     }}
                   >
                     ×
                   </span>
                 </div>
               ))}
             </div>
           </div>


           {/* Interests - Full Width */}
           <div style={{ width: "100%" }}>
             <input
               type="text"
               placeholder="Add Interest"
               value={interestInput}
               onChange={handleInterestInputChange}
               onKeyDown={handleKeyDown}
               style={{
                 width: "100%",
                 padding: "12px",
                 borderRadius: "8px",
                 backgroundColor: "#ffffff80",
                 color: "#ffffff",
                 border: "1px solid #ffffff30",
                 boxSizing: "border-box",
               }}
             />
             {showInterestDropdown && (
               <div style={{
                 marginTop: "8px",
                 backgroundColor: "#1e3a8a",
                 borderRadius: "8px",
                 padding: "8px",
                 width: "100%",
               }}>
                 {filteredInterestOptions.map((interest, index) => (
                   <div
                     key={index}
                     onClick={() => handleInterestSelect(interest)}
                     style={{
                       color: "#fff",
                       cursor: "pointer",
                       padding: "4px 0",
                       width: "100%",
                     }}
                   >
                     {interest}
                   </div>
                 ))}
                 {interestInput && !interestOptions.includes(interestInput) && (
                   <div
                     onClick={handleAddNewInterest}
                     style={{
                       color: "#93c5fd",
                       cursor: "pointer",
                       paddingTop: "4px",
                       width: "100%",
                     }}
                   >
                     Add "{interestInput}"
                   </div>
                 )}
               </div>
             )}
             <div style={{
               display: "flex",
               flexWrap: "wrap",
               gap: "8px",
               marginTop: "8px",
               width: "100%",
             }}>
               {selectedInterests.map((interest, index) => (
                 <div
                   key={index}
                   style={{
                     backgroundColor: "#ffffff20",
                     padding: "6px 10px",
                     borderRadius: "6px",
                     color: "#fff",
                     maxWidth: "100%",
                     overflow: "hidden",
                     textOverflow: "ellipsis",
                   }}
                 >
                   {interest}
                   <span
                     onClick={() => handleRemoveInterest(interest)}
                     style={{
                       marginLeft: "8px",
                       cursor: "pointer"
                     }}
                   >
                     ×
                   </span>
                 </div>
               ))}
             </div>
           </div>


           {/* Description - Taller and Full Width */}
           <div style={{ width: "100%" }}>
             <textarea
               placeholder="Project Description"
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               style={{
                 width: "100%",
                 height: "150px",
                 padding: "12px",
                 borderRadius: "8px",
                 backgroundColor: "#ffffff80",
                 color: "#ffffff",
                 border: "1px solid #ffffff30",
                 resize: "none",
                 boxSizing: "border-box",
               }}
             />
           </div>


           {/* MVPs - Full Width */}
           <div style={{ width: "100%" }}>
             <div style={{ display: "flex", gap: "8px" }}>
               <input
                 type="text"
                 placeholder="Add MVP"
                 value={mvpInput}
                 onChange={(e) => setMvpInput(e.target.value)}
                 style={{
                   flex: 1,
                   padding: "12px",
                   borderRadius: "8px",
                   backgroundColor: "#ffffff80",
                   color: "#ffffff",
                   border: "1px solid #ffffff30",
                   boxSizing: "border-box",
                 }}
               />
               <button
                 type="button"
                 onClick={handleAddMvp}
                 style={{
                   padding: "0 16px",
                   backgroundColor: "#385773",
                   color: "#fff",
                   border: "none",
                   borderRadius: "6px",
                   whiteSpace: "nowrap",
                 }}
               >
                 Add
               </button>
             </div>
             <div style={{
               display: "flex",
               flexWrap: "wrap",
               gap: "8px",
               marginTop: "8px",
               width: "100%",
             }}>
               {mvps.map((mvp, index) => (
                 <div
                   key={index}
                   style={{
                     backgroundColor: "#ffffff20",
                     padding: "6px 10px",
                     borderRadius: "6px",
                     color: "#fff",
                     maxWidth: "100%",
                     overflow: "hidden",
                     textOverflow: "ellipsis",
                   }}
                 >
                   {mvp}
                   <span
                     onClick={() => handleRemoveMvp(index)}
                     style={{
                       marginLeft: "8px",
                       cursor: "pointer"
                     }}
                   >
                     ×
                   </span>
                 </div>
               ))}
             </div>
             {showMvpWarning && <p style={{ color: "#f87171", marginTop: "4px" }}>Max 6 MVPs allowed</p>}
           </div>


           {/* Stretch Goals - Full Width */}
           <div style={{ width: "100%" }}>
             <div style={{ display: "flex", gap: "8px" }}>
               <input
                 type="text"
                 placeholder="Add Stretch Goal"
                 value={stretchGoalInput}
                 onChange={(e) => setStretchGoalInput(e.target.value)}
                 style={{
                   flex: 1,
                   padding: "12px",
                   borderRadius: "8px",
                   backgroundColor: "#ffffff80",
                   color: "#ffffff",
                   border: "1px solid #ffffff30",
                   boxSizing: "border-box",
                 }}
               />
               <button
                 type="button"
                 onClick={handleAddStretchGoal}
                 style={{
                   padding: "0 16px",
                   backgroundColor: "#385773",
                   color: "#fff",
                   border: "none",
                   borderRadius: "6px",
                   whiteSpace: "nowrap",
                 }}
               >
                 Add
               </button>
             </div>
             <div style={{
               display: "flex",
               flexWrap: "wrap",
               gap: "8px",
               marginTop: "8px",
               width: "100%",
             }}>
               {stretchGoals.map((goal, index) => (
                 <div
                   key={index}
                   style={{
                     backgroundColor: "#ffffff20",
                     padding: "6px 10px",
                     borderRadius: "6px",
                     color: "#fff",
                     maxWidth: "100%",
                     overflow: "hidden",
                     textOverflow: "ellipsis",
                   }}
                 >
                   {goal}
                   <span
                     onClick={() => handleRemoveStretchGoal(index)}
                     style={{
                       marginLeft: "8px",
                       cursor: "pointer"
                     }}
                   >
                     ×
                   </span>
                 </div>
               ))}
             </div>
             {showStretchGoalWarning && <p style={{ color: "#f87171", marginTop: "4px" }}>Max 6 stretch goals allowed</p>}
           </div>
           {/* Timeline - Frontend and Backend Inputs */}
           <div style={{ width: "100%" }}>
             <label style={{ marginBottom: "12px", fontWeight: "bold", display: "block" }}>Timeline</label>
             <div style={{ display: "flex", gap: "16px" }}>
               {/* Frontend Timeline */}
               <div style={{ flex: 1 }}>
                 <input
                   type="text"
                   placeholder="Add Frontend Task"
                   value={frontendInput}
                   onChange={(e) => setFrontendInput(e.target.value)}
                   style={{
                     width: "100%",
                     padding: "12px",
                     borderRadius: "8px",
                     backgroundColor: "#ffffff80",
                     color: "#ffffff",
                     border: "1px solid #ffffff30",
                     boxSizing: "border-box",
                   }}
                 />
                 <button
                   type="button"
                   onClick={handleAddFrontend}
                   style={{
                     marginTop: "8px",
                     width: "100%",
                     padding: "8px",
                     backgroundColor: "#385773",
                     color: "#fff",
                     border: "none",
                     borderRadius: "6px",
                   }}
                 >
                   Add Frontend Task
                 </button>
                 <div style={{ marginTop: "8px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                   {frontendTimeline.map((task, index) => (
                     <div
                       key={index}
                       style={{
                         backgroundColor: "#ffffff20",
                         padding: "6px 10px",
                         borderRadius: "6px",
                         color: "#fff",
                       }}
                     >
                       {task}
                       <span
                         onClick={() => handleRemoveFrontend(index)}
                         style={{ marginLeft: "8px", cursor: "pointer" }}
                       >
                         ×
                       </span>
                     </div>
                   ))}
                 </div>
                 {frontendTimeline.length === 6 && (
                   <p style={{ color: "#f87171", marginTop: "4px" }}>Max 6 frontend tasks allowed</p>
                 )}
               </div>


               {/* Backend Timeline */}
               <div style={{ flex: 1 }}>
                 <input
                   type="text"
                   placeholder="Add Backend Task"
                   value={backendInput}
                   onChange={(e) => setBackendInput(e.target.value)}
                   style={{
                     width: "100%",
                     padding: "12px",
                     borderRadius: "8px",
                     backgroundColor: "#ffffff80",
                     color: "#ffffff",
                     border: "1px solid #ffffff30",
                     boxSizing: "border-box",
                   }}
                 />
                 <button
                   type="button"
                   onClick={handleAddBackend}
                   style={{
                     marginTop: "8px",
                     width: "100%",
                     padding: "8px",
                     backgroundColor: "#385773",
                     color: "#fff",
                     border: "none",
                     borderRadius: "6px",
                   }}
                 >
                   Add Backend Task
                 </button>
                 <div style={{ marginTop: "8px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                   {backendTimeline.map((task, index) => (
                     <div
                       key={index}
                       style={{
                         backgroundColor: "#ffffff20",
                         padding: "6px 10px",
                         borderRadius: "6px",
                         color: "#fff",
                       }}
                     >
                       {task}
                       <span
                         onClick={() => handleRemoveBackend(index)}
                         style={{ marginLeft: "8px", cursor: "pointer" }}
                       >
                         ×
                       </span>
                     </div>
                   ))}
                 </div>
                 {backendTimeline.length === 6 && (
                   <p style={{ color: "#f87171", marginTop: "4px" }}>Max 6 backend tasks allowed</p>
                 )}
               </div>
             </div>
           </div>


           {/* Thumbnail Upload - Full Width */}
           <div style={{ width: "100%" }}>
             <label style={{ marginBottom: "8px", display: "block" }}>Upload Project Thumbnail</label>
             <input
               type="file"
               accept="image/*"
               onChange={(e) => {
                 const file = e.target.files?.[0];
                 if (file) setThumbnail(file);
               }}
               style={{
                 width: "100%",
                 padding: "12px",
                 borderRadius: "8px",
                 backgroundColor: "#ffffff80",
                 color: "#ffffff",
                 border: "1px solid #ffffff30",
                 boxSizing: "border-box",
               }}
             />
           </div>


           {/* Save Button - Full Width */}
           <button
             type="submit"
             style={{
               width: "100%",
               padding: "14px",
               backgroundColor: "#10b981",
               color: "#ffffff",
               fontWeight: "bold",
               border: "none",
               borderRadius: "8px",
               cursor: "pointer",
               marginTop: "10px",
             }}
           >
             Save Project
           </button>
         </form>
       </div>
     </div>
   </div>
 );
}



