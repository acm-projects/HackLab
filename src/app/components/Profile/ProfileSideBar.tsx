"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProfileInfoProps {
  name: string;
  level: number;
  profilePic: string | null; // initial fallback
  topics: string[];
  roles: string[];
  skills: { id: number; skill: string; icon_url?: string | null }[];
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
  const [fetchedProfilePic, setFetchedProfilePic] = useState<string | null>(profilePic);

  useEffect(() => {
    const fetchUserImage = async () => {
      try {
        const res = await fetch("http://52.15.58.198:3000/users");
        const data = await res.json();

        // Match by name (better to use email if available)
        const matchedUser = data.find((user: any) => user.name === name);
        if (matchedUser && matchedUser.image) {
          setFetchedProfilePic(matchedUser.image);
        }
      } catch (error) {
        console.error("Failed to fetch user profile image:", error);
      }
    };

    fetchUserImage();
  }, [name]);

  return (
    <div className="flex-shrink-0 w-[220px] bg-[#FFFFFF] rounded-[10px] p-[16px] border border-[#E5E7EB] text-[#111827] text-[14px] pb-[20px] mt-[40px]">
      {/* Profile Header */}
      <div className="w-full flex flex-col items-center mb-[40px]">
        <div className="w-full flex items-center gap-[16px] mb-[16px]">
          <div className="w-[80px] h-[80px] rounded-[80px] bg-[#E5E7EB] flex items-center justify-center overflow-hidden">
            {fetchedProfilePic ? (
              <img
                src={fetchedProfilePic}
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
              Level <span className="font-[700]">3</span>
            </div>

            <div className="relative h-[10px] w-full bg-[#D1D5DB] rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-[#385773] transition-all duration-300 ease-in-out"
                style={{ width: `${(level / 10) * 100}%` }}
              ></div>
            </div>

            <p className="text-[12px] text-right font-[500] text-[#111827] mt-[2px]">
              {level * 15}/100
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
        <p className="text-[18px] font-[600] mb-[12px]">Interests</p>
        <div className="flex flex-wrap gap-[6px] mb-[24px]">
          {topics.slice(0, 5).map((topic, idx) => (
            <span
              key={idx}
              className="inline-block bg-[#EEF2F7] text-[#385773] font-medium px-[10px] py-[4px] rounded-full text-[12px] border border-[#D1D5DB]"
            >
              {topic}
            </span>
          ))}
        </div>

        {/* Roles */}
        <p className="text-[18px] font-[600] mb-[12px]">Role</p>
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
          {skills.slice(0, 7).map((s) => (
            <div
              key={s.id}
              className="inline-block bg-[#EEF2F7] text-[#385773] font-medium px-[10px] py-[4px] gap-[10px] rounded-full text-[12px] border border-[#D1D5DB]"
            >
              {s.icon_url && (
                <img
                  src={s.icon_url}
                  alt={s.skill}
                  className="size-[12px] rounded-[10px] px-[5px] translate-y-[2px]"
                />
              )}
              {s.skill}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
