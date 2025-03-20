"use client";
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type ProjectData = {
  id: number;
  projectName: string;
  projectType: string;
  techToBeUsed: string[];
  description: string;
  mvps: string[];
  stretchGoals: string[];
};

export default function ReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Safely parse and default projectData
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
          <div>
            <h3>Project Name:</h3>
            <p>{projectData.projectName}</p>
          </div>
          <div>
            <h3>Project Type:</h3>
            <p>{projectData.projectType}</p>
          </div>
          <div>
            <h3>Tech to be Used:</h3>
            <ul>
              {projectData.techToBeUsed?.map((tech: string, index: number) => (
                <li key={index}>{tech}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Description:</h3>
            <p>{projectData.description}</p>
          </div>
          <div>
            <h3>MVP's:</h3>
            <ul>
              {projectData.mvps?.map((mvp: string, index: number) => (
                <li key={index}>{mvp}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Stretch Goals:</h3>
            <ul>
              {projectData.stretchGoals?.map((goal: string, index: number) => (
                <li key={index}>{goal}</li>
              ))}
            </ul>
          </div>
          <div className="flex space-x-4">
            <button onClick={handleEdit} className="mt-[20px] p-[10px] bg-[#fff] text-[#000] rounded-[10px] border-[#000]">
              Edit
            </button>
            <button onClick={handleConfirm} className="mt-[20px] p-[10px] bg-[#fff] text-[#000] rounded-[10px] border-[#000]">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}