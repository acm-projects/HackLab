"use client";
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProjectData } from "../shared/types";

export default function ReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const projectData: ProjectData = JSON.parse(
    decodeURIComponent(searchParams.get('data') || '{}')
  ) || {
    id: 0,
    projectName: '',
    projectType: '',
    techToBeUsed: [],
    description: '',
    mvps: [],
    stretchGoals: [],
  };

  const handleEdit = () => {
    router.push(`/ManualProject?data=${encodeURIComponent(JSON.stringify(projectData))}`);
  };

  const handleConfirm = () => {
    router.push('/successPage');
  };

  return (
    <div className="h-screen flex flex-col items-center bg-blue-900 text-white font-nunito overflow-hidden">
      <h2 className="py-[40px] text-[30px] translate-y-[50px] sticky bg-blue-900 z-10 w-full text-center">
        REVIEW YOUR PROJECT
      </h2>
      <div className="w-[90%] max-w-[780px]">
        <div className="flex flex-col space-y-6">
          {/* Display project details */}
          <div className="bg-[#385773] p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Project Name:</h3>
            <p className="pl-4">{projectData.projectName}</p>
          </div>
          
          {/* Other fields... */}
          
          <div className="flex space-x-4 justify-center">
            <button 
              onClick={handleEdit} 
              className="mt-[20px] p-[10px] bg-[#fff] text-[#000] rounded-[10px] border-[#000] hover:bg-gray-200 transition-colors w-24"
            >
              Edit
            </button>
            <button 
              onClick={handleConfirm} 
              className="mt-[20px] p-[10px] bg-[#fff] text-[#000] rounded-[10px] border-[#000] hover:bg-gray-200 transition-colors w-24"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}