"use client";
import React, { useRef, useState, useLayoutEffect } from "react";


interface OngoingProjectCardProps {
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
 moreNeeded: number;
 showJoinButton: boolean;
 isLiked: boolean;
 isBookmarked: boolean;
 joinRequested: boolean;
 onLike: () => void;
 onBookmark: () => void;
 onJoin: () => void;
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


const OngoingProjectCard: React.FC<OngoingProjectCardProps> = ({
 title,
 groupLeader,
 likes,
 image,
 description,
 topics = [],
 skills = [],
 members,
 totalMembers,
 moreNeeded,
 showJoinButton,
 isLiked,
 isBookmarked,
 joinRequested,
 onLike,
 onBookmark,
 onJoin,
}) => {
  const truncatedDescription =
  description.length > 50 ? description.slice(0, 150) + "..." : description;



 return (
   <div
     className="relative h-[370px] w-full rounded-[15px] border border-black bg-[#ffffff] overflow-hidden flex flex-col mb-[3px] cursor-pointer"
     style={{ boxShadow: "5px 5px 5px rgb(30 40 50 / 40%)" }}
   >
     {/* Top Image */}
     <div className="h-[40%] w-full">
       <img src={image} alt={title} className="h-full w-full object-cover" />
     </div>


     {/* Bottom Content */}
     <div className="h-[60%] w-full px-[15px] py-[10px] flex mt-[-10px] gap-[4px]">
       {/* Left Side */}
       <div className="flex flex-col w-1/2 pr-[8px] ml-[10px]">
         <h2 className="text-[18px] font-bold text-[#000000] mt-[4px] mb-[3px]">{title}</h2>
         {topics.length > 0 && <TagRow items={topics} color="#426c98" />}
         <div className = "mt-[-5px]">
         {skills.length > 0 && <TagRow items={skills} color="#5888b5" />}
         </div>


         <div className="flex items-center gap-[6px] mt-[4px]">
           <p className="text-[13px] text-[#2e2e2e] absolute mt-[40px]">
             Led by: <span className="font-semibold">{groupLeader?.name || "Unknown"}</span>
           </p>
         </div>


         {/* Members */}
         <div className="absolute flex flex-col pb-[8px] mt-[120px]">
           <div className="flex items-center gap-[6px]">
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
             <div className="flex flex-col">
               <span className="text-[12px] text-[#000] translate-y-[12px]">{totalMembers} members</span>
               <p className="text-[11px] text-[#aaaaaa]">{moreNeeded} member needed</p>
             </div>
           </div>
         </div>


         {/* Buttons */}
         <div className="absolute bottom-[16px] left-[16px] flex gap-[-4px] z-10">
           <button
             className="flex items-center outline-none border-none bg-transparent cursor-pointer "
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
             className="flex items-center outline-none border-none bg-transparent ml-[-5px] cursor-pointer"
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


       {/* Right Side */}
       <div className="w-[500px] flex flex-col justify-between mr-[40px] mt-[16px]">
         <div className="text-[16px] text-black break-words overflow-hidden pr-[10px]">
           <p>{truncatedDescription}</p>
         </div>
         {showJoinButton && (
         <div className="absolute bottom-[18px] right-[35px] z-10">
           <button
             onClick={(e) => {
               e.stopPropagation();
               onJoin();
             }}
             className={`text-[12px] px-[40px] py-[10px] rounded-[8px] transition-all duration-200 outline-none border-none cursor-pointer ${
               joinRequested
                 ? "bg-[#f0c040] text-[#000] hover:bg-[#e6b832]"
                 : "bg-[#385773] text-[#fff] hover:bg-[#2e475d]"
             }`}
           >
             {joinRequested ? "Sent Request" : "Join"}
           </button>
         </div>
       )}
       </div>
     </div>
   </div>
 );
};


export default OngoingProjectCard;





