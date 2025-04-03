
"use client";
import React from "react";

const AllCreatedProjects: React.FC = () => {
  return (
    <div className="bg-[#FFFFFF] rounded-[8px] p-[20px] shadow-sm border border-[#c1c1c1] pb-[300px]"
         style={{ boxShadow: "3px 3px 3px 3px rgb(30 40 50 / 20%)" }}>
      <div className="flex justify-around items-start">
        {/* All Projects */}
        <div className="w-[120px] text-center">
          <h4 className="text-[14px] font-semibold text-[#111827] mb-[6px]">All Projects</h4>
          <p className="text-[13px] text-[#6B7280]">No projects available</p>
        </div>

        {/* Created Projects */}
        <div className="w-[120px] text-center">
          <h4 className="text-[14px] font-semibold text-[#111827] mb-[6px]">Created Projects</h4>
          <p className="text-[13px] text-[#6B7280]">No projects available</p>
        </div>
      </div>
    </div>
  );
};

export default AllCreatedProjects;
