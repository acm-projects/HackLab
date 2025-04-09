'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const sampleProjects = [
  { id: 'project-alpha', icon: '1' },
  { id: 'project-beta', icon: '2' },
  { id: 'project-gamma', icon: '3' },
];

const ProjectSidebar = () => {
  const router = useRouter();

  return (
    <div className="bg-[#1E3A58] text-white w-[90px] min-h-screen py-6 flex flex-col items-center gap-4 shadow-md py-[30px]">
      {sampleProjects.map((project, index) => (
        <button
          key={project.id}
          onClick={() => router.push(`/my-projects/${project.id}/dashboard`)}
          className="w-12 h-12 bg-[#385773] hover:bg-[#3b5770] rounded-md flex items-center justify-center border-transparent border-none outline-none size-[50px] gap-[10px] text-[#fff] px-[10px] mt-[10px]"
          title={project.id} 
        >
          <span className="text-white font-semibold gap-[10px]">{project.icon}</span>
        </button>
      ))}
    </div>
  );
};

export default ProjectSidebar;