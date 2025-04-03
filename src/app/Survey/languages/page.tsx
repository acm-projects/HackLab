"use client";


import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


interface Skill {
 id: number;
 skill: string;
}


const LanguageSelection = () => {
 const { data: session } = useSession();
 const [allLanguages, setAllLanguages] = useState<Skill[]>([]);
 const [selected, setSelected] = useState<string[]>([]);
 const [searchTerm, setSearchTerm] = useState("");
 const [userId, setUserId] = useState<number | null>(null);
 const router = useRouter();


 useEffect(() => {
   const fetchData = async () => {
     try {
       const res = await fetch("http://52.15.58.198:3000/skills");
       const data = await res.json();
       const cleaned: Skill[] = data.filter(
         (item: any) => typeof item?.skill === "string"
       );
       setAllLanguages(cleaned);


       if (session?.user?.email) {
         const userRes = await fetch("http://52.15.58.198:3000/users");
         const users = await userRes.json();
         const foundUser = users.find(
           (u: any) => u.email === session.user?.email
         );
         if (foundUser?.id) {
           setUserId(foundUser.id);
         }
       }
     } catch (error) {
       console.error("Failed to fetch skills or user:", error);
     }
   };


   fetchData();
 }, [session]);


 const toggleLang = async (lang: string) => {
   if (!userId) return;


   const skill = allLanguages.find((s) => s.skill === lang);
   if (!skill) return;


   const isSelected = selected.includes(lang);
   setSelected((prev) =>
     isSelected ? prev.filter((l) => l !== lang) : [...prev, lang]
   );


   if (!isSelected) {
     try {
       const res = await fetch(
         `http://52.15.58.198:3000/users/${userId}/skills/${skill.id}`,
         {
           method: "POST",
         }
       );
       const data = await res.json();
       console.log("✅ Skill added to backend:", data);
     } catch (error) {
       console.error("Error adding skill to backend:", error);
     }
   }
 };


 const filteredLanguages = allLanguages.filter((lang) =>
   lang.skill.toLowerCase().includes(searchTerm.toLowerCase())
 );


 return (
   <div
     className="flex justify-center items-center h-screen w-screen translate-x-[-8px] translate-y-[-8px]"
     style={{ backgroundColor: "#385773" }}
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
           What programming languages do you use?
         </h1>


         <input
           type="text"
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           placeholder="Search for languages..."
           className="flex justify-center items-center translate-x-[-10px]"
           style={{
             width: "100%",
             padding: "12px 16px",
             border: "1px solid #d1d5db",
             borderRadius: "12px",
             fontSize: "16px",
             color: "#1f2937",
             outline: "none",
           }}
         />


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
           {filteredLanguages.map((lang) => (
             <button
               key={lang.id}
               onClick={() => toggleLang(lang.skill)}
               style={{
                 padding: "10px 20px",
                 borderRadius: "12px",
                 fontSize: "14px",
                 color: selected.includes(lang.skill)
                   ? "#ffffff"
                   : "#1f2937",
                 backgroundColor: selected.includes(lang.skill)
                   ? "#385773"
                   : "#C0C0C0",
                 border: "none",
                 cursor: "pointer",
               }}
             >
               {lang.skill}
             </button>
           ))}
         </div>
       </div>


       <div
         style={{
           display: "flex",
           justifyContent: "space-between",
           marginTop: "32px",
         }}
       >
         <button
           onClick={() => router.push("/Survey/name")}
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
           onClick={async () => {
             console.log("🧠 Selected (local):", selected);


             try {
               const res = await fetch(
                 `http://52.15.58.198:3000/users/${userId}/skills`
               );
               const data = await res.json();
               console.log("📦 Skills from backend:", data);
             } catch (error) {
               console.error("❌ Could not fetch backend skills:", error);
             }


             router.push("/Survey/interests");
           }}
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


export default LanguageSelection;





