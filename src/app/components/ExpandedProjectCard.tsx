import React from "react";
import ProjectTimeline from "../components/timelineComponent";


interface ExpandedProjectModalProps {
 title: string;
 groupLeader: {
   name: string;
   image: string;
 };
 image: string;
 members: Array<{ name: string; image: string } | string>;
 totalMembers: number;
 description: string;
 onClose: () => void;
 isLiked: boolean;
 isBookmarked: boolean;
 joinRequested: boolean;
 onLike: () => void;
 onBookmark: () => void;
 onJoin: () => void;
 likes: number;
 topics?: string[];
 skills?: string[];
 mvps?: string[];
 stretch?: string[];
 showJoinButton?: boolean;
 id: number;
 skillIconMap?: { [name: string]: string };
 rolePreference?: {
  role_preference_id: number;
  xp: number;
}[];
roleMap?: { [id: number]: string };

}


const ExpandedProjectModal: React.FC<ExpandedProjectModalProps> = ({
 id,
 title,
 groupLeader,
 image,
 members,
 totalMembers,
 description,
 onClose,
 isLiked,
 isBookmarked,
 joinRequested,
 onLike,
 onBookmark,
 onJoin,
 likes,
 topics = [],
 skills = [],
 mvps = [],
 stretch = [],
 showJoinButton,
 skillIconMap,
 roleMap,
 rolePreference,

}) => {
  const renderTags = (
    items: string[],
    color: string,
    iconMap?: { [name: string]: string }
  ) => {
    const validItems = items.filter((item) => typeof item === "string" && item.trim() !== "");
    if (!validItems.length) return null;
  
    return (
      <div className="flex flex-wrap gap-[6px] mb-[10px]">
        {validItems.slice(0, 3).map((item, index) => {
          const normalizedKey = item.trim().toLowerCase();
          return (
            <span
              key={index}
              className="text-[11px] px-[8px] py-[4px] rounded-[8px] flex items-center gap-[4px]"
              style={{ backgroundColor: color, color: "#fff" }}
            >
              {iconMap && iconMap[normalizedKey] && (
                <img
                  src={iconMap[normalizedKey]}
                  alt={`${item} icon`}
                  className="w-[12px] h-[12px]"
                />
              )}
              {item}
            </span>
          );
        })}
      </div>
    );
  };
  


 return (
   <div className="fixed inset-0 z-[40] flex items-center justify-center mt-[-80px] ml-[8%] rounded-[10px]">
     <div
       className="relative z-10 rounded-[15px] shadow-[0_0_20px_rgba(0,0,0,1)] px-[20px] py-[30px]"
       style={{
         backgroundColor: "#ffffff",
         width: "70vw",
         height: "80vh",
         display: "flex",
         flexDirection: "column",
       }}
     >
       <button
         onClick={onClose}
         className="absolute font-bold z-[20] border-none bg-transparent mt-[-10px] translate-x-[10px] cursor-pointer"
         style={{
           top: "16px",
           right: "16px",
           fontSize: "20px",
           color: "#000",
         }}
       >
         ✖
       </button>


       <div className="overflow-y-scroll scrollbar-hide">
       <img
          src={image}
          alt={title}
          className="w-full h-[500px] rounded-[15px] object-fill"
        />


         <div className="px-[25px] rounded-[10px]">
         <h2 className="text-[28px] font-bold mt-[15px]">{title}</h2>
         {renderTags(topics, "#426c98")}
        {renderTags(skills, "#5888b5", skillIconMap)}
         
         {/* Role Preferences */}
{Array.isArray(rolePreference) && rolePreference.length > 0 ? (
  <div className="mb-[20px]">
    <h3 className="text-[16px] mb-[6px]" style={{ fontFamily: "'Nunito', sans-serif" }}>
      Looking for:
    </h3>
    <div className="flex flex-wrap gap-[8px]">
      {rolePreference.map((pref, idx) => (
        <span
          key={idx}
          className="bg-[#df6100] text-[#fff] text-[12px] px-[10px] py-[5px] rounded-[8px] font-semibold"
        >
          {roleMap?.[pref.role_preference_id] || "Unknown Role"} 
        </span>
      ))}
    </div>
  </div>
) : (
  <div className="mb-[20px] text-[12px] text-[#6B7280] font-semibold">No roles specified</div>
)}


         {/* Team Lead Info */}
         <div className="flex items-center mb-[12px] gap-[10px]">
           <img
             src={groupLeader.image}
             alt="Team Lead"
             className="w-[36px] h-[36px] rounded-full object-cover mr-3"
           />
           <p className="text-[16px] text-[#4B5563]" style={{
      fontFamily: "'Nunito', sans-serif",
    }}>Led by: {groupLeader.name}</p>
         </div>


         {/* Members */}
         <div className="flex items-center mb-[20px]">
           <div className="flex mr-[8px] " style={{
      fontFamily: "'Nunito', sans-serif",
    }}>
           {members.slice(0, 5).map((m, idx) => {
           const imageSrc = typeof m === "string" ? m : m.image;
           const altText = typeof m === "string" ? `member-${idx}` : m.name;


           return (
             <img
               key={idx}
               src={imageSrc}
               alt={altText}
               style={{
                 width: "36px",
                 height: "36px",
                 borderRadius: "9999px",
                 border: "2px solid #ffffff",
                 marginLeft: idx === 0 ? "0px" : "-12px",
                 zIndex: 10 - idx,
                 position: "relative",
               }}
             />
           );
         })}
                   </div>
           <span className="text-[14px] text-[#374151]" style={{
      fontFamily: "'Nunito', sans-serif",
    }}>{totalMembers} members</span>
         </div>


         {/* Tags Section */}
       

         <p className="text-[15px] mb-[24px] leading-[1.6]" style={{
      fontFamily: "'Nunito', sans-serif",
    }}>{description}</p>


         {/* MVPs and Stretch Goals Side-by-Side */}
         {(mvps?.length > 0 || stretch?.length > 0) && (
           <div className="flex justify-between gap-[40px] mb-[24px]">
             {/* MVPs Column */}
             {mvps.length > 0 && (
               <div className="w-1/2">
                 <h3 className="text-[18px] font-semibold mb-[10px]" style={{
      fontFamily: "'Nunito', sans-serif",
    }}>MVPs 🏆</h3>
                 <ul className="list-disc list-inside space-y-2 text-[14px] text-[#1f2937]" style={{
      fontFamily: "'Nunito', sans-serif",
    }}>
                   {mvps.map((item, idx) => (
                     <li key={idx}>{item}</li>
                   ))}
                 </ul>
               </div>
             )}


             {/* Stretch Goals Column */}
             {stretch.length > 0 && (
               <div className="w-1/2">
                 <h3 className="text-[18px] font-semibold mb-[10px]" style={{
      fontFamily: "'Nunito', sans-serif",
    }}>Stretch Goals 🏃</h3>
                 <ul className="list-disc list-inside space-y-2 text-[14px] text-[#1f2937]" style={{
      fontFamily: "'Nunito', sans-serif",
    }}>
                   {stretch.map((item, idx) => (
                     <li key={idx}>{item}</li>
                   ))}
                 </ul>
               </div>
             )}
           </div>
         )}
         <div>
         <h3 className="text-[18px] font-semibold translate-y-[50px] mb-[-50px]" style={{
            fontFamily: "'Nunito', sans-serif",
          }}>
          Project Timeline
          </h3>
         <ProjectTimeline projectId={id} />
       
         </div>


         <div className="flex justify-start gap-[16px] mt-[24px]">
           <button onClick={onBookmark} className="flex items-center outline-none border-none bg-transparent cursor-pointer">
             <svg
               xmlns="http://www.w3.org/2000/svg"
               fill={isBookmarked ? "#EFD033" : "none"}
               viewBox="0 0 24 24"
               strokeWidth="1.5"
               stroke="#000000"
               style={{ width: "20px", height: "20px" }}
             >
               <path
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
               />
             </svg>
           </button>
           <button onClick={onLike} className="flex items-center outline-none border-none bg-transparent ml-[-15px] cursor-pointer">
             <svg
               xmlns="http://www.w3.org/2000/svg"
               fill={isLiked ? "#FF0000" : "none"}
               viewBox="0 0 24 24"
               strokeWidth="1.5"
               stroke="#000000"
               style={{ width: "20px", height: "20px" }}
             >
               <path
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
               />
             </svg>
             <span className="text-[12px] ml-[2px] text-[#000]">{likes}</span>
           </button>


           {showJoinButton && (
             <button
             onClick={(e) => {
               onJoin();
             }}
             className={`text-[12px] rounded-[8px] flex translate-x-[90vh] outline-none border-none cursor-pointer translate-y-[-7px] ${
               joinRequested
                 ? "bg-[#f0c040] text-[#000] hover:bg-[#e6b832] px-[40px] py-[10px]"
                 : "bg-[#385773] text-[#fff] hover:bg-[#2e475d] px-[65px] py-[10px] "
             }`}
           >
             {joinRequested ? "Sent Request" : "Join"}
           </button>
           )}
         </div>
       </div>
       </div>
     </div>
   </div>
 );
};


export default ExpandedProjectModal;





