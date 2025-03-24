// components/ProjectCard.tsx
import React, { useState } from "react";

interface ProjectCardProps {
  title: string;
  groupLeader: string;
  likes: number;
  image: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, groupLeader, likes: initialLikes, image }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  const handleLike = () => {
    setLikes((prevLikes) => prevLikes + (isLiked ? -1 : 1));
    setIsLiked((prev) => !prev);
  };

  const handleBookmark = () => {
    setIsBookmarked((prev) => !prev);
  };
  

  return (
    <div
      className="relative h-[250px] rounded-[15px] border border-black bg-[#ffffff] overflow-hidden"
      style={{ boxShadow: '5px 5px 5px rgb(30 40 50/ 40%)' }}
    >
      {/* Top Image Section */}
      <div className="h-[45%] w-full">
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </div>

      {/* Content Section */}
      <div className="px-[15px] flex flex-col h-[55%] py-[10px] mt-[-15px]">
        {/* Title and Group Leader */}
        <div className="flex flex-col gap-[2px]">
          <h3 className="text-xl font-bold text-[#000000] mb-[-10px]">{title}</h3>
          <p className="text-sm text-[#000000]">Led by: {groupLeader}</p>
        </div>

        {/* Like and Bookmark Buttons */}
        <div className="flex justify-between items-center">
          {/* Like Button */}
          <div className="flex items-center gap-2">
            <button onClick={handleLike} className="flex items-center outline-none border-none bg-transparent">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isLiked ? "red" : "none"}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke={isLiked ? "#000" : "#000000"}
                className="size-[25px] transition-colors duration-200"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
              <span className="text-sm text-[#000]"> &nbsp;{likes} Likes</span>
            </button>
          </div>

          {/* Bookmark Button */}
          <button onClick={handleBookmark} className="outline-none border-none bg-transparent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={isBookmarked ? "#EFD033" : "none"}
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke={isBookmarked ? "#000" : "#000000"}
              className="size-[25px] transition-colors duration-200"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;