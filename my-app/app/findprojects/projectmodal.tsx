import React from "react";

interface ProjectModalProps {
  project: any;
  onClose: () => void;
}

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
        >
          ✕
        </button>
        <div className="bg-[#385773] h-[150px] rounded-lg mb-6"></div>
        <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
        <p className="mb-4 text-sm text-gray-600">Posted on {project.datePosted}</p>
        <p className="text-gray-800">{project.fullDescription}</p>

        <h3 className="mt-6 font-semibold text-[#385773]">MVP</h3>
        <ul className="list-disc pl-6 text-sm text-gray-700">
          <li>User Authentication</li>
          <li>Project Posting & Joining</li>
          <li>Progress System</li>
        </ul>

        <h3 className="mt-4 font-semibold text-[#385773]">Stretch Goals</h3>
        <ul className="list-disc pl-6 text-sm text-gray-700">
          <li>Real-Time Chat</li>
          <li>AI-Powered Support</li>
          <li>Project Management</li>
        </ul>
      </div>
    </div>
  );
};

export default ProjectModal;