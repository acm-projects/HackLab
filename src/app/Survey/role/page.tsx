"use client";


import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


interface Role {
 id: number;
 role: string;
}


const RoleSelection = () => {
 const [allRoles, setAllRoles] = useState<Role[]>([]);
 const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
 const router = useRouter();


 // Fetch roles from backend
 useEffect(() => {
   const fetchRoles = async () => {
     try {
       const res = await fetch("http://52.15.58.198:3000/roles");
       const data = await res.json();


       const cleaned: Role[] = data.filter(
         (item: any) => typeof item?.role === "string"
       );


       setAllRoles(cleaned);
     } catch (error) {
       console.error("Failed to fetch roles:", error);
     }
   };


   fetchRoles();
 }, []);


 const toggleRole = (role: string) => {
   setSelectedRoles((prev) =>
     prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
   );
 };


 return (
   <div
     className="translate-x-[-8px] translate-y-[-8px] h-full w-screen flex justify-center items-center"
     style={{
       backgroundColor: "#385773",
       height: "100vh",
     }}
   >
     <div
       className="shadow-[10px] flex flex-col justify-center"
       style={{
         backgroundColor: "#ffffff",
         borderRadius: "24px",
         padding: "80px",
         width: "550px",
         height: "600px",
       }}
     >
       {/* Title and Selection */}
       <div
         style={{
           flex: 1,
           display: "flex",
           flexDirection: "column",
           justifyContent: "center",
           gap: "24px",
         }}
       >
         <h1
           style={{
             fontSize: "20px",
             fontWeight: "bold",
             textAlign: "center",
             color: "#000000",
           }}
         >
           Please choose from the following roles
         </h1>


         <div
           style={{
             display: "flex",
             flexWrap: "wrap",
             gap: "8px",
             justifyContent: "center",
             overflowY: "auto",
             maxHeight: "250px",
           }}
         >
           {allRoles.map((r) => (
             <button
               key={r.id}
               onClick={() => toggleRole(r.role)}
               style={{
                 padding: "10px 20px",
                 borderRadius: "12px",
                 fontSize: "14px",
                 color: selectedRoles.includes(r.role)
                   ? "#ffffff"
                   : "#1f2937",
                 backgroundColor: selectedRoles.includes(r.role)
                   ? "#385773"
                   : "#C0C0C0",
                 border: "none",
                 cursor: "pointer",
               }}
             >
               {r.role}
             </button>
           ))}
         </div>
       </div>


       {/* Navigation Buttons */}
       <div
         style={{
           display: "flex",
           justifyContent: "space-between",
           marginTop: "32px",
         }}
       >
         <button
           onClick={() => router.push("/Survey/interests")}
           style={{
             backgroundColor: "#385773",
             padding: "10px 24px",
             borderRadius: "12px",
             color: "#ffffff",
             fontSize: "14px",
             border: "none",
             cursor: "pointer",
           }}
         >
           Back
         </button>


         <button
           onClick={() => router.push("/Survey/userinfo")}
           style={{
             backgroundColor: "#385773",
             padding: "10px 24px",
             borderRadius: "12px",
             color: "#ffffff",
             fontSize: "14px",
             border: "none",
             cursor: "pointer",
             transition: "background-color 0.3s",
           }}
           onMouseOver={(e) =>
             (e.currentTarget.style.backgroundColor = "#2e475f")
           }
           onMouseOut={(e) =>
             (e.currentTarget.style.backgroundColor = "#385773")
           }
         >
           Next
         </button>
       </div>
     </div>
   </div>
 );
};


export default RoleSelection;





