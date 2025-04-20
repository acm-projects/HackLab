"use client";
import React, { useRef, useState, useLayoutEffect } from "react";

interface CompletedProjectCardProps {
  title: string;
  groupLeader: { name: string; image: string };
  likes: number;
  image: string;
  description: string;
  topics?: string[];
  skills?: string[];
  members: { name: string; image: string }[];
  totalMembers: number;
  isLiked: boolean;
  isBookmarked: boolean;
  onLike: () => void;
  onBookmark: () => void;
  github: string;
  isCompleted: boolean;
  completionDate: string;
  skillIconMap?: { [name: string]: string };
}

const TagRow: React.FC<{
  items: string[];
  color: string;
  showIcons?: boolean;
  iconMap?: { [name: string]: string };
}> = ({ items, color, showIcons = false, iconMap = {} }) => {
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
  skillIconMap = {},
}) => {
  const truncatedDescription = description.length > 100 ? description.slice(0, 150) + "..." : description;

  return (
    <div
      className="relative h-[50vh] w-full rounded-[15px] border border-black bg-[#ffffff] overflow-hidden flex flex-col mb-[3px] cursor-pointer"
      style={{ boxShadow: "5px 5px 5px rgb(30 40 50 / 40%", fontFamily: "'Nunito', sans-serif", }} 
    >
      {/* Top Image */}
      <div className="h-[55%] w-full">
        <img src={image} alt={title} className="h-full w-full object-fill" />
      </div>

      {/* Bottom Content */}
      <div className="h-[45%] w-full px-[15px] py-[10px] flex mt-[-10px] gap-[4px]" >
        {/* Left Section */}
        <div className="flex flex-col w-[50%] pl-[25px] relative">
          <h2 className="text-[18px] font-bold text-[#000000] mt-[4px] mb-[3px] whitespace-nowrap overflow-hidden text-ellipsis">
            {title}
          </h2>

          <div className="min-h-[28px] overflow-x-auto whitespace-nowrap scrollbar-hide" style={{
      fontFamily: "'Nunito', sans-serif",
    }}>
            {topics.length > 0 && <TagRow items={topics.slice(0, 1)} color="#426c98" />}
          </div>
          <div className="mt-[-5px] min-h-[28px] overflow-x-auto whitespace-nowrap scrollbar-hide" style={{
      fontFamily: "'Nunito', sans-serif",
    }}>
            {skills.length > 0 && (
              <TagRow items={skills} color="#5888b5" showIcons={true} iconMap={skillIconMap} />
            )}
          </div>

          {/* Former Right Section Now Moved Here */}
          <div className="flex flex-col gap-[6px] mt-[-10px]" style={{
      fontFamily: "'Nunito', sans-serif",
    }}>
            <p className="text-[13px] text-[#2e2e2e]" style={{
      fontFamily: "'Nunito', sans-serif",
    }}>
              Led by: <span className="font-semibold">{groupLeader?.name || "Unknown"}</span>
            </p>
            <div className="flex items-center gap-[6px] mt-[-10px]">
              <div className="flex">
                {members.slice(0, 3).map((member, idx) => (
                  <img
                    key={idx}
                    src={member.image}
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

          {/* Likes + Bookmark */}
          <div className="absolute bottom-[5px] ml-[-10px] flex z-10">
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
              className="flex items-center outline-none border-none bg-transparent"
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

        {/* Right Section: Now just the description + completionDate */}
        <div className="w-[50%] flex flex-col pr-[50px]">
          <p className="text-[13px] text-[#374151] leading-tight">{truncatedDescription}</p>
          {completionDate && (
            <span className="absolute text-[11px] translate-y-[18vh] translate-x-[10vh] text-[#374151] bg-[rgba(255,255,255,0.9)] flex justify-end backdrop-blur-[4px] px-[8px] py-[2px]" style={{
                  fontFamily: "'Nunito', sans-serif",
                }}>
              Completed on{" "}
              {new Date(completionDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompletedProjectCard;
