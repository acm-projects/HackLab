"use client";
import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Lightbulb, Brain } from "lucide-react";
import { useRouter } from "next/navigation";


export default function CreateProjectWithAI() {
 const [description, setDescription] = useState("");
 const [isTyping, setIsTyping] = useState(false);
 const canvasRef = useRef<HTMLDivElement>(null);
 const router = useRouter();


 useEffect(() => {
   const container = canvasRef.current;
   if (!container) return;


   const createParticle = () => {
     const particle = document.createElement("div");
     particle.style.position = "absolute";
     particle.style.borderRadius = "50%";
     particle.style.width = `${Math.random() * 6 + 2}px`;
     particle.style.height = particle.style.width;
     particle.style.background = ["#385773", "#4a7296", "#2d4459", "#6a9cc9", "#1e3a5c"][Math.floor(Math.random() * 5)];
     particle.style.opacity = `${Math.random() * 0.5 + 0.1}`;
     particle.style.left = `${Math.random() * 100}%`;
     particle.style.top = `${Math.random() * 100}%`;


     container.appendChild(particle);


     const xSpeed = (Math.random() - 0.5) * 0.5;
     const ySpeed = (Math.random() - 0.5) * 0.5;


     const animate = () => {
       const currentLeft = parseFloat(particle.style.left);
       const currentTop = parseFloat(particle.style.top);
       let newLeft = currentLeft + xSpeed;
       let newTop = currentTop + ySpeed;


       if (newLeft < 0 || newLeft > 100) newLeft = currentLeft - xSpeed;
       if (newTop < 0 || newTop > 100) newTop = currentTop - ySpeed;


       particle.style.left = `${newLeft}%`;
       particle.style.top = `${newTop}%`;


       requestAnimationFrame(animate);
     };
     animate();
   };


   for (let i = 0; i < 40; i++) createParticle();
 }, []);


 const resolveIDsToLabels = async (ids: number[], type: "skills" | "topics") => {
   const promises = ids.map(async (id) => {
     try {
       const res = await fetch(`http://52.15.58.198:3000/${type}/${id}`);
       if (!res.ok) throw new Error(`Failed to fetch ${type} with id ${id}`);
       const data = await res.json();
       return data;
     } catch (err) {
       console.error("Error fetching", type, id, err);
       return null;
     }
   });
   return Promise.all(promises);
 };


 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   if (!description.trim()) return;
    try {
     const res = await fetch("http://52.15.58.198:3000/projects/generateProject", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ prompt: description }),
     });
      if (!res.ok) throw new Error("Failed to generate project");
      const aiProject = await res.json();
     console.log("🎯 Raw AI Project Response:", aiProject);
      alert("✅ Project suggestions generated!");
     console.log("✅ Alert: Project suggestions generated");
      const enrichedProject = {
       projectName: aiProject.title,
       projectType: aiProject.type,
       techToBeUsed: aiProject.skills || [],
       interests: aiProject.topics || [],
       description: aiProject.description,
       mvps: aiProject.mvp || [],
       stretchGoals: aiProject.stretch || [],
       timeline: {
         frontend: aiProject.timeline?.frontend || [],
         backend: aiProject.timeline?.backend || [],
       },
       source: "ai",
     };
    


      console.log("🚀 Final Enriched Project To Pass:", enrichedProject);
      // Wait for user confirmation
     const proceed = confirm("📦 Suggestions ready!\n\nDo you want to open them in the project form?");
     if (proceed) {
       const encoded = encodeURIComponent(JSON.stringify(enrichedProject));
       router.push(`/ManualProject?data=${encoded}`);
     } else {
       console.log("🛑 User cancelled redirection.");
     }
   } catch (err) {
     console.error("❌ AI generation failed:", err);
     alert("❌ Something went wrong while generating the project.");
     console.log("❌ Alert: AI generation failed");
   }
 };


 const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
   setDescription(e.target.value);
   setIsTyping(true);
   setTimeout(() => setIsTyping(false), 1000);
 };


 return (
   <div
     className="h-screen w-full translate-[-8px]"
     style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "16px", position: "relative", overflow: "hidden" }}
   >
     <div ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />
     <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom right, #1a2a3aE6, #385773CC, #1e3a5cE6)", zIndex: 1 }}></div>


     <form
       onSubmit={handleSubmit}
       style={{
         width: "800px",
         backgroundColor: "#ffffff1A",
         backdropFilter: "blur(16px)",
         borderRadius: "24px",
         boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
         zIndex: 2,
         overflow: "hidden",
         position: "relative",
       }}
     >
       <div style={{ height: "4px", width: "100%", background: "linear-gradient(to right, #5fa8e0, #9bbcf0, #5fa8e0)" }}></div>


       <div style={{ padding: "32px" }}>
         <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
           <div style={{ background: "linear-gradient(to bottom right, #5fa8e0, #9bbcf0)", padding: "8px", borderRadius: "50%" }}>
             <Brain style={{ height: "24px", width: "24px", color: "#fff" }} />
           </div>
           <div>
             <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#fff" }}>Create with AI</h2>
             <p style={{ color: "#cbd5e1", marginTop: "4px" }}>Transform your ideas into reality with AI assistance</p>
           </div>
         </div>


         <div style={{ position: "relative", marginBottom: "24px" }}>
           <textarea
             placeholder="Describe your dream project in detail..."
             value={description}
             onChange={handleInputChange}
             rows={10}
             style={{
               width: "94%",
               padding: "20px",
               backgroundColor: "#1a2a3aCC",
               border: "1px solid #7ea3c2",
               color: "#ffffff",
               fontSize: "16px",
               borderRadius: "16px",
               resize: "none",
               outline: "none",
             }}
           />
           <div
             style={{
               position: "absolute",
               bottom: "16px",
               right: "16px",
               backgroundColor: "#1a2a3a",
               border: "1px solid #7ea3c2",
               borderRadius: "12px",
               padding: "8px",
               display: "flex",
               alignItems: "center",
               gap: "8px",
               fontSize: "12px",
               color: "#cbd5e1",
             }}
           >
             <Lightbulb style={{ height: "16px", width: "16px", color: "#9bbcf0" }} />
             <span>Be specific and imaginative</span>
           </div>
         </div>


         <button
           type="submit"
           style={{
             width: "100%",
             height: "56px",
             background: "linear-gradient(to right, #5fa8e0, #4a7296)",
             border: "none",
             borderRadius: "16px",
             fontSize: "16px",
             color: "#fff",
             fontWeight: "500",
             cursor: "pointer",
             display: "flex",
             alignItems: "center",
             justifyContent: "center",
             gap: "8px",
             position: "relative",
             overflow: "hidden",
           }}
         >
           <Sparkles style={{ height: "20px", width: "20px" }} />
           Generate Project with AI
         </button>
       </div>
     </form>
   </div>
 );
}



