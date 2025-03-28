"use client";
import React, { useState } from "react";


const tasks = [
 { date: "Mar 01", frontend: "Component Dev", description: "Building UI components", side: "frontend" },
 { date: "Mar 02", backend: "API Dev", description: "Designing API endpoints", side: "backend" },
 { date: "Mar 05", frontend: "UI Testing", description: "Testing UI functionality", side: "frontend" },
 { date: "Mar 06", backend: "Load Testing", description: "Ensuring backend performance", side: "backend" },
 { date: "Mar 09", frontend: "Final UI Polish", description: "Finalizing UI styles", side: "frontend" },
 { date: "Mar 10", backend: "Deploy Backend", description: "Deploying backend server", side: "backend" },
];


const TimelinePage = () => {
 const [selectedTask, setSelectedTask] = useState<string | null>(null);


 const toggleTask = (id: string) => {
   setSelectedTask((prev) => (prev === id ? null : id));
 };


 return (
   <div style={{ padding: "40px", backgroundColor: "#ffffff", minHeight: "100vh", width: "100%", fontFamily: "sans-serif" }}>
     <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#385773", textAlign: "center", marginBottom: "64px" }}>
       Project Timeline
     </h1>


     <div style={{ display: "flex" }}>
       {/* Labels on the left */}
       <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "140px", paddingRight: "24px" }}>
         <div style={{ color: "#385773", fontWeight: "600", fontSize: "14px", textAlign: "right" }}>Frontend</div>
         <div style={{ color: "#385773", fontWeight: "600", fontSize: "14px", textAlign: "right" }}>Backend</div>
       </div>


       {/* Timeline */}
       <div style={{ position: "relative", flex: 1 }}>
         <div style={{ position: "absolute", top: "50%", left: 0, width: "100%", borderTop: "2px solid #385773", zIndex: 0 }} />


         <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", height: "300px", position: "relative", zIndex: 10 }}>
           {tasks.map((task, idx) => (
             <div key={idx} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", width: "120px" }}>
               {/* Frontend Task */}
               {task.frontend && (
                 <div style={{ marginTop: "-36px", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                   <div style={{ marginBottom: "8px", fontSize: "14px", color: "#000000" }}>{task.frontend}</div>
                   <div style={{ width: "2px", height: "40px", borderLeft: "1px dotted #d1d5db" }} />
                   <div
                     style={{ width: "12px", height: "12px", backgroundColor: "#000000", borderRadius: "50%", cursor: "pointer" }}
                     onClick={() => toggleTask(`${idx}-frontend`)}
                   />
                   <div style={{ marginTop: "8px", fontSize: "14px", color: "#6b7280" }}>{task.date}</div>


                   {selectedTask === `${idx}-frontend` && (
                     <div style={{
                       position: "absolute",
                       bottom: "-80px",
                       width: "150px",
                       backgroundColor: "#ffffff",
                       color: "#000000",
                       fontSize: "12px",
                       border: "1px solid #d1d5db",
                       boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                       borderRadius: "8px",
                       padding: "12px",
                       zIndex: 20
                     }}>
                       {task.description}
                     </div>
                   )}
                 </div>
               )}


               {/* Backend Task */}
               {task.backend && (
                 <div style={{ marginTop: "44px", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                   <div style={{ marginBottom: "8px", fontSize: "14px", color: "#6b7280" }}>{task.date}</div>
                   <div
                     style={{ width: "12px", height: "12px", backgroundColor: "#000000", borderRadius: "50%", cursor: "pointer" }}
                     onClick={() => toggleTask(`${idx}-backend`)}
                   />
                   <div style={{ width: "2px", height: "40px", borderLeft: "1px dotted #d1d5db" }} />
                   <div style={{ marginTop: "8px", fontSize: "14px", color: "#000000" }}>{task.backend}</div>


                   {selectedTask === `${idx}-backend` && (
                     <div style={{
                       position: "absolute",
                       top: "80px",
                       width: "150px",
                       backgroundColor: "#ffffff",
                       color: "#000000",
                       fontSize: "12px",
                       border: "1px solid #d1d5db",
                       boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                       borderRadius: "8px",
                       padding: "12px",
                       zIndex: 20
                     }}>
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
 );
};


export default TimelinePage;


