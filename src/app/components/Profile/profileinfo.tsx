

import React from "react";


interface ProfileInfoProps {
 name: string;
 email: string;
 linkedin: string;
 school: string;
 location: string;
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
 linkedin,
 school,
 location,
 joined,
}) => {
 const join = new Date(joined).toLocaleDateString("en-US", {
   year: "numeric",
   month: "long",
   day: "numeric",
 })
 return (
   <div
     className="w-1/2 h-[200px] bg-[#FFFFFF] rounded-[8px] p-[20px] shadow-sm border border-[#c1c1c1]"
   >
     <div className="grid grid-cols-2  gap-x-[48px] text-[14px] mt-[-15px] pt-[6px]">
       <div>
         <p className="font-[800] text-[#000000]">Name</p>
         <p className="text-[#111827] mt-[-10px]">{name}</p>
       </div>
       <div>
         <p className="font-[800] text-[#000000]">Linkedin</p>
         <p className="text-[#111827] mt-[-10px]">linkedin.com/in/aastha</p>
       </div>
       <div>
         <p className="font-[800] text-[#000000] ">Email</p>
         <p className="text-[#111827] mt-[-10px]">{email}</p>
       </div>
     
       <div>
         <p className="font-[800] text-[#000000]">School</p>
         <p className="text-[#111827] mt-[-10px]">UTD</p>
       </div>
       <div>
         <p className="font-[800] text-[#000000]">Location</p>
         <p className="text-[#111827] mt-[-10px]">Dallas, TX</p>
       </div>
       <div>
         <p className="font-[800] text-[#000000]">Joined on</p>
         <p className="text-[#111827] mt-[-10px]">24th March, 2025</p>
       </div>
     </div>
   </div>
 );
};




