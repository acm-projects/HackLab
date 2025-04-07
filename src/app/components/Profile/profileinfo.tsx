
import React from "react";

interface ProfileInfoProps {
  name: string;
  email: string;
  github: string;
  school: string;
  location: string;
  position: string;
  resume: string;
  joined: string;
}

interface ProjectStatsProps {
  ongoing: number;
  created: number;
  completed: number;
}

export const ProjectStats: React.FC<ProjectStatsProps> = ({ ongoing, created, completed }) => (
  <div className="w-1/2 h-[200px] bg-[#FFFFFF] rounded-[8px] p-[20px] flex flex-col justify-between text-center border border-[#c1c1c1]"
       >
    <h3 className="text-[16px] font-medium text-[#111827] mb-[10px]">Project Stats</h3>
    <div className="flex justify-between gap-[10px] mb-[50px]">
      <div className="flex-1 bg-[#FED7D7] rounded-[4px] p-[10px] text-center">
        <div className="text-[20px] font-bold text-[#E53E3E]">{ongoing}</div>
        <div className="text-[13px] text-[#E53E3E]">Ongoing</div>
      </div>
      <div className="flex-1 bg-[#C6F6D5] rounded-[4px] p-[10px] text-center">
        <div className="text-[20px] font-bold text-[#38A169]">{created}</div>
        <div className="text-[13px] text-[#38A169]">Created</div>
      </div>
      <div className="flex-1 bg-[#CEEDFF] rounded-[4px] p-[10px] text-center">
        <div className="text-[20px] font-bold text-[#3182CE]">{completed}</div>
        <div className="text-[13px] text-[#3182CE]">Completed</div>
      </div>
    </div>
  </div>
);

export const ProfileInfoCard: React.FC<ProfileInfoProps> = ({
  name,
  email,
  github,
  school,
  location,
  position,
  resume,
  joined,
}) => {
  return (
    <div
      className="w-1/2 h-[200px] bg-[#FFFFFF] rounded-[8px] p-[20px] shadow-sm border border-[#c1c1c1]"
    >
      <div className="grid grid-cols-2  gap-x-[24px] text-[12px] mt-[-15px]">
        <div>
          <p className="font-[800] text-[#000000]">Name</p>
          <p className="text-[#111827] mt-[-10px]">{name}</p>
        </div>
        <div>
          <p className="font-[800] text-[#000000]">Github</p>
          <p className="text-[#111827] mt-[-10px]">{github}</p>
        </div>
        <div>
          <p className="font-[800] text-[#000000] ">Email</p>
          <p className="text-[#111827] mt-[-10px]">{email}</p>
        </div>
        <div>
          <p className="font-[800] text-[#000000]">Resume</p>
          <p className="text-[#3182CE] mt-[-10px] underline cursor-pointer">document</p>
        </div>
        <div>
          <p className="font-[800] text-[#000000]">School/Company</p>
          <p className="text-[#111827] mt-[-10px]">{school}</p>
        </div>
        <div>
          <p className="font-[800] text-[#000000]">Status</p>
          <p className="text-[#111827] mt-[-10px]">{position}</p>
        </div>
        <div>
          <p className="font-[800] text-[#000000]">Location</p>
          <p className="text-[#111827] mt-[-10px]">{location}</p>
        </div>
        <div>
          <p className="font-[800] text-[#000000]">Joined on</p>
          <p className="text-[#111827] mt-[-10px]">{joined}</p>
        </div>
      </div>
    </div>
  );
};