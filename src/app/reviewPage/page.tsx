"use client";
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProjectData } from "../shared/types";

export default function ReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const projectData: ProjectData = JSON.parse(
    decodeURIComponent(searchParams.get('data') || '{}')
  );

  const handleEdit = () => {
    router.push(`/ManualProject?data=${encodeURIComponent(JSON.stringify(projectData))}`);
  };

  const handleConfirm = () => {
    const existingProjects = JSON.parse(localStorage.getItem("createdProjects") || "[]");
  
    // Avoid duplicates
    if (!existingProjects.includes(projectData.projectName)) {
      const updatedProjects = [...existingProjects, projectData.projectName];
      localStorage.setItem("createdProjects", JSON.stringify(updatedProjects));
    }
  
    // Navigate to Developer Profile
    router.push('/profile');
  };
  
  

  return (
    <div className="h-screen flex flex-col items-center text-white font-nunito bg-blue-900">
      {/* Fixed Header */}
      <h2 className="py-[10px] text-[30px] sticky top-0 z-20 w-full text-center bg-blue-900 bg-[#fff]">
        REVIEW YOUR PROJECT
      </h2>

      {/* Content + Buttons */}
      <div className="w-[850px] flex flex-col flex-grow h-[450px] translate-x-[-50px]">
        <div
          className="flex-grow overflow-y-scroll bg-white text-black px-[50px] py-[20px] border-4 border-[#385773] rounded-[10px] w-full bg-[#fff] items-center justify-center"
          style={{ maxHeight: "calc(100vh - 180px)" }} // adjust based on your header + button height
        >
          {/* Project Name */}
          <div className="mb-4">
            <h3 className="font-bold text-lg mb-2">Project Name:</h3>
            <p className="pl-4 bg-[#38577361] rounded-[10px] px-[20px] py-[5px]">{projectData.projectName}</p>
          </div>

          {/* Project Type */}
          <div className="mb-4">
            <h3 className="font-bold text-lg mb-2">Project Type:</h3>
            <p className="pl-4 bg-[#38577361] rounded-[10px] px-[20px] py-[5px]">{projectData.projectType}</p>
          </div>

          {/* Tech to Be Used */}
          <div className="mb-4">
            <h3 className="font-bold text-lg mb-2">Tech To Be Used:</h3>
            <div className="pl-4 flex flex-wrap gap-[5px]">
              {projectData.techToBeUsed.map((tech, index) => (
                <span key={index} className="bg-white text-[#ffffff] px-3 py-1 rounded-full text-sm border border-[#385773] bg-[#385773] py-[5x] px-[20px]">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <h3 className="font-bold text-lg mb-2">Description:</h3>
            <p className="pl-4 bg-[#38577361] rounded-[10px] px-[20px] py-[5px]">{projectData.description}</p>
          </div>

          {/* MVPs */}
          <div className="mb-4">
            <h3 className="font-bold text-lg mb-2">MVPs:</h3>
            <ul className="pl-6 list-disc">
              {projectData.mvps.map((mvp, index) => (
                <li key={index}>{mvp}</li>
              ))}
            </ul>
          </div>

          {/* Stretch Goals */}
          <div className="mb-4">
            <h3 className="font-bold text-lg mb-2">Stretch Goals:</h3>
            <ul className="pl-6 list-disc">
              {projectData.stretchGoals.map((goal, index) => (
                <li key={index}>{goal}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Fixed Buttons */}
        <div className="flex space-x-4 justify-center mt-[20px] z-20 mb-[50px] gap-[10px]">
          <button
            onClick={handleEdit}
            className="p-[10px] bg-[#fff] text-[#000] rounded-[10px] border border-[#000] hover:bg-gray-200 transition-colors w-24"
          >
            Edit
          </button>
          <button
            onClick={handleConfirm}
            className="p-[10px] bg-[#fff] text-[#000] rounded-[10px] border border-[#000] hover:bg-gray-200 transition-colors w-24"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
