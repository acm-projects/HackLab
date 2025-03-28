"use client";


import React from "react";


const DashboardPage = () => {
 return (
  <div
  style={{
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
    width: "100%",
    padding: "40px 60px",
    boxSizing: "border-box",
  }}
>

     {/* Header */}
     <div
       style={{
         display: "flex",
         justifyContent: "space-between",
         alignItems: "flex-start",
         marginBottom: "24px",
       }}
     >
       <div>
         <h1
           style={{
             fontSize: "28px",
             fontWeight: "bold",
             marginBottom: "8px",
             color: "#1f2937",
           }}
         >
           Project Alpha
         </h1>
         <p
           style={{
             color: "#4b5563",
             fontSize: "14px",
             maxWidth: "640px",
           }}
         >
           A collaborative platform for team communication and project management.
         </p>
       </div>
       <div style={{ display: "flex", gap: "16px", paddingTop: "30px" }}>
         <span
           style={{
             backgroundColor: "#e5e7eb",
             color: "#374151",
             fontSize: "13px",
             padding: "8px 12px",
             borderRadius: "9999px",
           }}
         >
           <strong>Status:</strong> In Development
         </span>
         <span
           style={{
             backgroundColor: "#e5e7eb",
             color: "#374151",
             fontSize: "13px",
             padding: "8px 12px",
             borderRadius: "9999px",
           }}
         >
           <strong>Started:</strong> March 1, 2025
         </span>
       </div>
     </div>


     {/* Team Members + Tech Stack */}
     <div
       style={{
         display: "grid",
         gridTemplateColumns: "1fr 1fr",
         gap: "24px",
         marginBottom: "24px",
       }}
     >
       <div
         style={{
           backgroundColor: "#ffffff",
           borderRadius: "12px",
           padding: "24px",
           boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
         }}
       >
         <h2
           style={{
             fontSize: "20px",
             fontWeight: "bold",
             marginBottom: "16px",
             paddingBottom: "8px",
             borderBottom: "1px solid #e5e7eb",
             color: "#385773",
           }}
         >
           Team Members
         </h2>
         <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px", color: "#1f2937" }}>
           <div>
             <h3 style={{ fontWeight: "600", color: "#385773" }}>Owner</h3>
             <p>Alice Johnson</p>
           </div>
           <div>
             <h3 style={{ fontWeight: "600", color: "#385773" }}>Frontend</h3>
             <p>Bob Smith</p>
             <p>Charlie Brown</p>
           </div>
           <div>
             <h3 style={{ fontWeight: "600", color: "#385773" }}>Backend</h3>
             <p>David Lee</p>
             <p>Eve Miller</p>
           </div>
         </div>
       </div>


       <div
         style={{
           backgroundColor: "#ffffff",
           borderRadius: "12px",
           padding: "24px",
           boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
         }}
       >
         <h2
           style={{
             fontSize: "20px",
             fontWeight: "bold",
             marginBottom: "16px",
             paddingBottom: "8px",
             borderBottom: "1px solid #e5e7eb",
             color: "#385773",
           }}
         >
           Tech Stack
         </h2>
         <div
           style={{
             display: "grid",
             gridTemplateColumns: "1fr 1fr",
             gap: "16px",
             fontSize: "14px",
             color: "#1f2937",
           }}
         >
           <div>
             <h3 style={{ fontWeight: "600", color: "#385773" }}>Frontend</h3>
             <p>React</p>
             <p>Tailwind CSS</p>
             <p>Redux</p>
           </div>
           <div>
             <h3 style={{ fontWeight: "600", color: "#385773" }}>Backend</h3>
             <p>Node.js</p>
             <p>Express</p>
             <p>MongoDB</p>
           </div>
         </div>
       </div>
     </div>


     {/* Goals Section */}
     <div
       style={{
         backgroundColor: "#ffffff",
         borderRadius: "12px",
         padding: "24px",
         marginBottom: "24px",
         boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
       }}
     >
       <h2
         style={{
           fontSize: "20px",
           fontWeight: "bold",
           marginBottom: "16px",
           paddingBottom: "8px",
           borderBottom: "1px solid #e5e7eb",
           color: "#385773",
         }}
       >
         Goals
       </h2>
       <div
         style={{
           display: "grid",
           gridTemplateColumns: "1fr 1fr",
           gap: "24px",
           fontSize: "14px",
           color: "#1f2937",
         }}
       >
         <div>
           <h3 style={{ fontWeight: "600", color: "#385773", marginBottom: "8px" }}>MVP</h3>
           <ul style={{ paddingLeft: "20px", listStyleType: "disc", lineHeight: "1.6" }}>
             <li>User authentication</li>
             <li>Project dashboard with team info</li>
             <li>Task creation & assignment</li>
             <li>Project timeline viewer</li>
           </ul>
         </div>
         <div>
           <h3 style={{ fontWeight: "600", color: "#385773", marginBottom: "8px" }}>Stretch Goals</h3>
           <ul style={{ paddingLeft: "20px", listStyleType: "disc", lineHeight: "1.6" }}>
             <li>Real-time chat integration</li>
             <li>AI task suggestions</li>
             <li>Project themes</li>
             <li>Automated reports</li>
           </ul>
         </div>
       </div>
     </div>


     {/* Recent Commits */}
     <div
     className="mb-[35px]"
       style={{
         backgroundColor: "#ffffff",
         borderRadius: "12px",
         padding: "24px",
         boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
         paddingBottom: "10px",
       }}
     >
       <h2
         style={{
           fontSize: "20px",
           fontWeight: "bold",
           marginBottom: "16px",
           paddingBottom: "8px",
           borderBottom: "1px solid #e5e7eb",
           color: "#385773",
         }}
       >
         Recent Commits
       </h2>
       <ul style={{ fontSize: "14px", color: "#1f2937" }}>
         <li style={{ padding: "10px 0", borderBottom: "1px solid #e5e7eb" }}>
           <strong>Charlie Brown</strong> — “Fixed authentication bug”
           <span style={{ fontSize: "12px", color: "#6b7280", marginLeft: "8px" }}>2 hours ago</span>
         </li>
         <li style={{ padding: "10px 0", borderBottom: "1px solid #e5e7eb" }}>
           <strong>Bob Smith</strong> — “Added Redux store config”
           <span style={{ fontSize: "12px", color: "#6b7280", marginLeft: "8px" }}>1 day ago</span>
         </li>
         <li style={{ padding: "10px 0" }}>
           <strong>Eve Miller</strong> — “Initial backend setup”
           <span style={{ fontSize: "12px", color: "#6b7280", marginLeft: "8px" }}>2 days ago</span>
         </li>
       </ul>
     </div>
   </div>
 );
};


export default DashboardPage;