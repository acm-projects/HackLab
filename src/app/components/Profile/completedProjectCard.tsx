"use client";
import React, { useRef, useState, useLayoutEffect } from "react";


interface CompletedProjectCardProps {
 title: string;
 groupLeader: {
   name: string;
   image: string;
 };
 likes: number;
 image: string;
 description: string;
 topics?: string[];
 skills?: string[];
 members: string[];
 totalMembers: number;
 isLiked: boolean;
 isBookmarked: boolean;
 onLike: () => void;
 onBookmark: () => void;
 completionDate: string;
 github: string;
 isCompleted: boolean;
}


const TagRow: React.FC<{ items: string[]; color: string }> = ({ items, color }) => {
 const validItems = items.filter((item) => typeof item === "string" && item.trim() !== "");
 const containerRef = useRef<HTMLDivElement>(null);
 const thirdRef = useRef<HTMLSpanElement>(null);
 const [hideThird, setHideThird] = useState(false);


 useLayoutEffect(() => {
   if (containerRef.current && thirdRef.current) {
     const containerTop = containerRef.current.getBoundingClientRect().top;
     const thirdTop = thirdRef.current.getBoundingClientRect().top;
     setHideThird(thirdTop > containerTop);
   }
 }, [items]);


 if (!validItems.length) return null;


 return (
   <div ref={containerRef} className="flex flex-wrap gap-[6px] mb-[10px] overflow-hidden">
     {validItems.slice(0, hideThird ? 2 : 3).map((item, index) => (
       <span
         key={index}
         ref={index === 2 ? thirdRef : null}
         className="text-[11px] px-[8px] py-[4px] rounded-[8px]"
         style={{ backgroundColor: color, color: "#fff" }}
       >
         {item}
       </span>
     ))}
   </div>
 );
};


const CompletedProjectCard: React.FC<CompletedProjectCardProps> = ({
 title,
 groupLeader,
 likes,
 image,
 description,
 topics = [],
 skills = [],
 members,
 totalMembers,
 isLiked,
 isBookmarked,
 onLike,
 onBookmark,
 completionDate,
 github,
 isCompleted,
}) => {
 const descriptionWords = description.trim().split(" ");
 const truncatedDescription =
   descriptionWords.length > 45 ? descriptionWords.slice(0, 45).join(" ") + "..." : description;


 console.log("📌 Topics for:", title, topics);
 return (
  
   <div
     className="relative h-[370px] w-full rounded-[15px] border border-black bg-[#ffffff] overflow-hidden flex flex-col mb-[3px] cursor-pointer"
     style={{ boxShadow: "5px 5px 5px rgb(30 40 50 / 40%)" }}
   >
     {/* Top Image */}
     <div className="h-[40%] w-full">
       <img src={image} alt={title} className="h-full w-full object-cover" />
     </div>


     {/* Completion Tag, Date, GitHub Button */}
     <div className="absolute top-[10px] right-[10px] flex flex-col items-end gap-[6px] z-10">


       {/* Completion Date */}
       {completionDate && (
       <span className="text-[11px] text-[#374151] bg-[rgba(255,255,255,0.9)] backdrop-blur-[4px] px-[8px] py-[2px] rounded-[6px] border border-[#e5e7eb] shadow-sm">
         Done:{" "}
         {new Date(completionDate).toLocaleDateString("en-US", {
           year: "numeric",
           month: "short",
           day: "numeric",
         })}
       </span>
     )}


       {/* GitHub Button */}
       <a
       href={github?.trim() || "https://github.com"}
       target="_blank"
       rel="noopener noreferrer"
       className="no-underline bg-[#24292e] hover:bg-[#1b1f23] text-[#ffffff] text-[11px] px-[8px] py-[4px] rounded-[6px] shadow-sm flex items-center gap-[4px] transition-colors duration-[150ms]"
     >
       <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
       <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
       </svg>
       GitHub
     </a>
     </div>


     {/* Bottom Content */}
     <div className="h-[60%] w-full px-[15px] py-[10px] flex mt-[-10px] gap-[4px]">
       {/* Left Side */}
       <div className="flex flex-col w-1/2 pr-[8px] ml-[10px]">


       <h2
         className="text-[18px] font-bold text-[#000000] mt-[4px] mb-[3px] whitespace-nowrap overflow-hidden text-ellipsis">
         {title}
       </h2>


        <div className="min-h-[28px] overflow-x-auto whitespace-nowrap scrollbar-hide">
       {topics.length > 0 && <TagRow items={topics} color="#426c98" />}
     </div>
     <div className="mt-[-5px] min-h-[28px] overflow-x-auto whitespace-nowrap scrollbar-hide">
       {skills.length > 0 && <TagRow items={skills} color="#5888b5" />}
     </div>
      
             {/* Group Leader and members */}
     <div className="mt-[6px]">
     <p className="text-[13px] text-[#2e2e2e] truncate max-w-[180px]">
         Led by: <span className="font-semibold">{groupLeader?.name || "Unknown"}</span>
       </p>
       <div className="flex items-center gap-[6px] mt-[6px] ml-[-6]">
         <div className="flex">
           {(members || []).slice(0, 3).map((url, idx) => (
             <img
               key={idx}
               src={url}
               alt={`member-${idx}`}
               className="w-[26px] h-[26px] rounded-full border-[1.5px] border-white object-cover"
               style={{
                 marginLeft: idx === 0 ? "0px" : "-8px",
                 zIndex: members.length - idx,
               }}
             />
           ))}
         </div>
         <span className="text-[12px] text-[#000]">{totalMembers} members</span>
       </div>
     </div>




         {/* Like & Bookmark Buttons */}
         <div className="absolute bottom-[16px] left-[16px] flex z-10">
           <button
             className="flex items-center outline-none border-none bg-transparent"
             onClick={(e) => {
               e.stopPropagation();
               onBookmark();
             }}
           >
             <svg
               xmlns="http://www.w3.org/2000/svg"
               fill={isBookmarked ? "#EFD033" : "none"}
               viewBox="0 0 24 24"
               strokeWidth="1.5"
               stroke="#000"
               className="w-[20px] h-[20px]"
             >
               <path
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
               />
             </svg>
           </button>
           <button
             onClick={(e) => {
               e.stopPropagation();
               onLike();
             }}
             className="ml-[-5px] flex items-center outline-none border-none bg-transparent"
           >
             <svg
               xmlns="http://www.w3.org/2000/svg"
               fill={isLiked ? "red" : "none"}
               viewBox="0 0 24 24"
               strokeWidth="1.5"
               stroke="#000"
               className="w-[20px] h-[20px]"
             >
               <path
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
               />
             </svg>
             <span className="text-[12px] ml-[2px]">{likes}</span>
           </button>
         </div>
       </div>


       {/* Right Side - Description */}
       <div className="w-[500px] flex flex-col justify-between mr-[40px] mt-[16px]">
         <div className="text-[16px] text-black break-words overflow-hidden pr-[10px]">
           <p>{truncatedDescription}</p>
         </div>
       </div>
     </div>
   </div>
 );
};


export default CompletedProjectCard;



