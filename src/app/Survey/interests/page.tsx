"use client";


import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


interface Topic {
 id: number;
 topic: string;
}


const InterestSelection = () => {
 const { data: session } = useSession();
 const router = useRouter();
 const [allTopics, setAllTopics] = useState<Topic[]>([]);
 const [selected, setSelected] = useState<string[]>([]);
 const [searchTerm, setSearchTerm] = useState("");
 const [userId, setUserId] = useState<number | null>(null);


 // Fetch topics + userId
 useEffect(() => {
   const fetchData = async () => {
     try {
       const res = await fetch("http://52.15.58.198:3000/topics");
       const data = await res.json();
       const cleaned: Topic[] = data.filter(
         (item: any) => typeof item?.topic === "string"
       );
       setAllTopics(cleaned);


       // Get userId using email
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
       console.error("Failed to fetch topics or user:", error);
     }
   };


   fetchData();
 }, [session]);


 const toggleInterest = async (interest: string) => {
   console.log("🔁 Toggle called for:", interest);
   if (!userId) {
     console.warn("⚠️ No user ID available yet.");
     return;
   }
    const topic = allTopics.find((t) => t.topic === interest);
   if (!topic) {
     console.warn("❌ Topic not found:", interest);
     return;
   }
    const isSelected = selected.includes(interest);
   const updated = isSelected
     ? selected.filter((i) => i !== interest)
     : [...selected, interest];
    setSelected(updated);
   console.log("✅ Updated selected:", updated);
    // Only POST when selecting (not deselecting)
   if (!isSelected) {
     try {
       const res = await fetch(
         `http://52.15.58.198:3000/users/${userId}/topics/${topic.id}`,
         {
           method: "POST",
         }
       );
       const data = await res.json();
        if (res.status === 500 && data.error?.includes("duplicate key")) {
         console.log("⚠️ Interest already exists in backend (ignoring).");
       } else {
         console.log("✅ Interest added to backend:", data);
       }
     } catch (error) {
       console.error("Error adding interest to backend:", error);
     }
   }
 };


 const filteredInterests = allTopics.filter((interest) =>
   interest.topic.toLowerCase().includes(searchTerm.toLowerCase())
 );


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
       <div
         className="items-center flex"
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
           What are your interests?
         </h1>


         {/* Search Field */}
         <input
           type="text"
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           placeholder="Search interests..."
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


         {/* Interest Buttons */}
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
           {filteredInterests.map((interest) => (
             <button
               key={interest.id}
               onClick={() => toggleInterest(interest.topic)}
               style={{
                 padding: "10px 20px",
                 borderRadius: "12px",
                 fontSize: "14px",
                 color: selected.includes(interest.topic)
                   ? "#ffffff"
                   : "#1f2937",
                 backgroundColor: selected.includes(interest.topic)
                   ? "#385773"
                   : "#C0C0C0",
                 border: "none",
                 cursor: "pointer",
               }}
             >
               {interest.topic}
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
           onClick={() => router.push("/Survey/languages")}
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
           onClick={() => router.push("/Survey/role")}
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


export default InterestSelection;





