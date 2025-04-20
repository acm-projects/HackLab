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
  skillIconMap?: { [name: string]: string };
  rolePreference?: {
    role_preference_id: number;
    xp: number;
  }[];
  
  roleMap?: { [id: number]: string }; 
}

const TagRow: React.FC<{
  items: string[];
  color: string;
  showIcons?: boolean;
  iconMap?: { [name: string]: string };
}> = ({ items, color, showIcons = true, iconMap = {} }) => {
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
      {validItems.slice(0, hideThird ? 2 : 3).map((item, index) => {
        const normalizedKey = item.trim().toLowerCase();
        return (
          <span
            key={index}
            ref={index === 2 ? thirdRef : null}
            className="text-[11px] px-[8px] py-[4px] rounded-[8px] flex items-center gap-[4px]"
            style={{ backgroundColor: color, color: "#fff" }}
          >
            {showIcons && iconMap[normalizedKey] && (
              <img src={iconMap[normalizedKey]} alt={`${item} icon`} className="w-[12px] h-[12px]" />
            )}
            {item}
          </span>
        );
      })}
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
  skillIconMap = {},
  rolePreference,
  roleMap,
}) => {

  const truncatedDescription =
    description.length > 50 ? description.slice(0, 150) + "..." : description;

  return (
    <div
      className="relative h-[50vh] w-full rounded-[15px] border border-black bg-[#ffffff] overflow-hidden flex flex-col mb-[3px] cursor-pointer"
      style={{ boxShadow: "5px 5px 5px rgb(30 40 50 / 40%)", fontFamily: "'Nunito', sans-serif" }}
    >
      {/* Top Image */}
      <div className="h-[55%] w-full">
        <img src={image} alt={title} className="h-full w-full object-fill" />
      </div>

      {/* Bottom Content */}
      <div className="h-[45%] w-full px-[15px] py-[10px] flex mt-[-5px] gap-[4px]">
        {/* Left Side */}
        <div className="flex flex-col w-2/3 pr-[8px] ml-[10px]">
          <h2 className="text-[18px] font-bold text-[#000000] mt-[5px] mb-[3px]">{title}</h2>
          {topics.length > 0 && <TagRow items={topics.slice(0, 1)} color="#426c98" />}

          <div className="mt-[-5px]">
            {skills.length > 0 && <TagRow items={skills} color="#5888b5" iconMap={skillIconMap} />}
          </div>
            
          {/* Role preference */}
          <span className="text-[13px] text-[#000] rounded-[10px] w-full">
            Looking for:&nbsp;
            {rolePreference?.length ? (
            rolePreference.map((pref, index) => (
              <span
                key={index}
                className="font-semibold bg-[#df6100] px-[10px] py-[5px] rounded-[8px] text-[#fff] text-[10px] mr-[5px]"
              >
                {roleMap?.[pref.role_preference_id] || "Unknown Role"}
              </span>
            ))
          ) : (
            <span className="font-semibold text-[10px]">No roles specified</span>
          )}

          </span>




          <div className="flex items-center gap-[6px] mt-[10px]">
            <p className="text-[13px] text-[#2e2e2e] absolute mt-[35px]">
              Led by: <span className="font-semibold">{groupLeader?.name || "Unknown"}</span>
            </p>
          </div>

          {/* Members */}
          <div className="absolute flex flex-col pb-[8px] mt-[145px]">
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
                <span className="text-[12px] text-[#000]">{totalMembers} members</span>
              </div>
            </div>
          </div>
        
        </div>

     
        {/* Right Side */}
<div className="w-[500px] flex flex-col mr-[25px] justify-between">
  <div className="text-[16px] text-black break-words overflow-hidden pr-[10px]">
    <p>{truncatedDescription}</p>
  </div>

  <div className="flex justify-between items-end mt-auto pt-[15px] pr-[10px]">
    {/* Like & Bookmark */}
    <div className="flex gap-[1px] translate-x-[5vh] translate-y-[-0.5vh] items-center">
      <button
        className="flex items-center outline-none border-none bg-transparent cursor-pointer"
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
        className="flex items-center outline-none border-none bg-transparent cursor-pointer"
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
        <span className="text-[12px] ml-[4px]">{likes}</span>
      </button>
    </div>

    {/* Join Button */}
    {showJoinButton && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onJoin();
        }}
        className={`text-[12px] rounded-[8px] outline-none border-none cursor-pointer ${
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
  );
};

export default OngoingProjectCard;
