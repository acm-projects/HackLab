"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface ProfileInfoProps {
  name: string;
  level: number;
  profilePic: string | null;
  topics: string[];
  roles: string[];
  skills: string[];
  isMyProfile: boolean;
  onEditClick: () => void;
}

const ProfileSidebar: React.FC<ProfileInfoProps> = ({
  name,
  level,
  profilePic,
  topics,
  roles,
  skills,
  onEditClick,
  isMyProfile
}) => {
  const router = useRouter();

  return (
    <div className="flex-shrink-0 w-[220px] h-[925px] bg-[#FFFFFF] rounded-[10px] p-[16px] border border-[#E5E7EB] text-[#111827] text-[14px] pb-[20px] mt-[40px]">
      {/* Profile Header */}
      <div className="w-full flex flex-col items-center mb-[40px]">
        <div className="w-full flex items-center gap-[16px] mb-[16px]">
          <div className="w-[80px] h-[80px] rounded-[80px] bg-[#E5E7EB] flex items-center justify-center overflow-hidden">
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-[#9CA3AF] text-[28px]">👤</div>
            )}
          </div>

          <div className="flex-1">
            <p className="text-[18px] font-[700] text-[#111827] mb-[4px]">{name}</p>
            <div className="text-[12px] font-[500] text-[#111827] mb-[6px]">
              Level <span className="font-[700]">{level}</span>
            </div>

            <div className="relative h-[10px] w-full bg-[#D1D5DB] rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-[#385773] transition-all duration-300 ease-in-out"
                style={{ width: `${(level / 10) * 100}%` }}
              ></div>
            </div>

            <p className="text-[12px] text-right font-[500] text-[#111827] mt-[2px]">
              {level * 25}/250
            </p>
          </div>
        </div>

        {isMyProfile ? (
          <button
            onClick={onEditClick}
            className="w-full bg-[#385773] text-[#FFFFFF] text-[14px] font-[500] py-[8px] rounded-[8px] hover:bg-[#2d475f] transition"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={() => router.push("/messages")}
            className="w-full bg-[#10b981] text-white text-[14px] font-[500] py-[8px] rounded-[8px] hover:bg-[#059669] transition"
          >
            Send Message
          </button>
        )}
      </div>

      {/* Topics */}
      <div className="mt-[10px]">
        <p className="text-[18px] font-[600] mb-[12px]">Topics</p>
        <div className="flex flex-wrap gap-[6px] mb-[24px]">
          {topics.map((topic, idx) => (
            <span
              key={idx}
              className="inline-block bg-[#EEF2F7] text-[#385773] font-medium px-[10px] py-[4px] rounded-full text-[12px] border border-[#D1D5DB]"
            >
              {topic}
            </span>
          ))}
        </div>

        {/* Roles */}
        <p className="text-[18px] font-[600] mb-[12px]">Roles</p>
        <div className="flex flex-wrap gap-[6px] mb-[24px]">
          {roles.map((role, idx) => (
            <span
              key={idx}
              className="inline-block bg-[#EEF2F7] text-[#385773] font-medium px-[10px] py-[4px] rounded-full text-[12px] border border-[#D1D5DB]"
            >
              {role}
            </span>
          ))}
        </div>

        {/* Skills */}
        <p className="text-[18px] font-[600] mb-[12px]">Skills</p>
        <div className="flex flex-wrap gap-[6px]">
          {skills.map((skill, idx) => (
            <span
              key={idx}
              className="inline-block bg-[#EEF2F7] text-[#385773] font-medium px-[10px] py-[4px] rounded-full text-[12px] border border-[#D1D5DB]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
