import React, { useState } from "react";
import ExpandedProjectCard from "../components/ExpandedProjectCard"; 

interface OngoingProjectCardProps {
  title: string;
  groupLeader: string;
  likes: number;
  image: string;
  description: string;
  tech: string[];
  members: string[];
  totalMembers: number;
  moreNeeded: number;
  showJoinButton: boolean;
}

const OngoingProjectCard: React.FC<OngoingProjectCardProps> = ({
  title,
  groupLeader,
  likes: initialLikes,
  image,
  description,
  tech,
  members,
  totalMembers,
  moreNeeded,
  showJoinButton,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [joinRequested, setJoinRequested] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleJoin = () => {
    setJoinRequested((prev) => !prev);
  };

  const handleLike = () => {
    setLikes((prev) => prev + (isLiked ? -1 : 1));
    setIsLiked((prev) => !prev);
  };

  const handleBookmark = () => {
    setIsBookmarked((prev) => !prev);
  };

  const descriptionWords = description.trim().split(" ");
  const truncatedDescription =
    descriptionWords.length > 45
      ? descriptionWords.slice(0, 45).join(" ") + "..."
      : description;

  return (
    <>
      <div
        className="h-[350px] w-full rounded-[15px] border border-black bg-[#ffffff] overflow-hidden flex flex-col mb-[3px] cursor-pointer"
        style={{ boxShadow: '5px 5px 5px rgb(30 40 50 / 40%)' }}
        onClick={() => setIsExpanded(true)}
      >
        {/* Top Image */}
        <div className="h-[40%] w-full">
          <img src={image} alt={title} className="h-full w-full object-cover" />
        </div>

        {/* Bottom Content */}
        <div className="h-[60%] w-full px-[15px] py-[10px] flex mt-[-10px] gap-[4px]">
          {/* Left Side */}
          <div className="flex flex-col w-1/2 pr-[8px] ml-[10px]">
            <div className="flex flex-col">
              <h2 className="text-[18px] font-bold text-[#000000]">{title}</h2>
              <p className="text-[12px] text-[#000000] mt-[-10px]">Led by: {groupLeader}</p>
            </div>

            <div className="flex gap-[4px] mt-[0px] flex-wrap">
              {tech.slice(0, 3).map((item, index) => (
                <span
                  key={index}
                  className="text-[12px] px-[10px] py-[5px] bg-[#385773] text-[#fff] border border-transparent rounded-[10px]"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="flex flex-col mt-[8px]">
              <div className="flex items-center gap-[6px]">
                <div className="flex">
                  {members.slice(0, 3).map((url, idx) => (
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
                  <span className="text-[12px] text-[#000] translate-y-[12px]">
                    {totalMembers} members
                  </span>
                  <p className="text-[11px] text-[#aaaaaa]">{moreNeeded} member needed</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-[1px] mt-[6px] justify-start">
              <button
                className="flex items-center outline-none border-none bg-transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookmark();
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
                  handleLike();
                }}
                className="flex items-center outline-none border-none bg-transparent ml-[-5px]"
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
          <div className="w-1/2 flex flex-col justify-between mr-[40px]">
            <div className="text-[12px] text-black break-words overflow-hidden pr-[10px]">
              <p>{truncatedDescription}</p>
            </div>
            <div className="flex justify-end pt-[10px] mb-[40px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleJoin();
                }}
                className={`text-[12px] px-[40px] py-[10px] rounded-[8px] transition-all duration-200 outline-none border-none ${
                  joinRequested
                    ? "bg-[#f0c040] text-[#000] hover:bg-[#e6b832]"
                    : "bg-[#385773] text-[#fff] hover:bg-[#2e475d]"
                }`}
              >
                {joinRequested ? "Sent Request" : "Join"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="fixed inset-0 z-[40]">
          <ExpandedProjectCard
            title={title}
            groupLeader={groupLeader}
            image={image}
            tech={tech}
            members={members}
            totalMembers={totalMembers}
            description={description}
            isLiked={isLiked}
            isBookmarked={isBookmarked}
            joinRequested={joinRequested}
            onLike={handleLike}
            onBookmark={handleBookmark}
            onJoin={handleJoin}
            onClose={() => setIsExpanded(false)}
            likes={likes}
            showJoinButton={true}
          />
        </div>
      )}
    </>
  );
};

export default OngoingProjectCard;