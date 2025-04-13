"use client";

import { useEffect, useState } from "react";

const EditProjectInline = ({
  projectId,
  onClose,
}: {
  projectId: string;
  onClose: () => void;
}) => {
  const [project, setProject] = useState<any>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [mvpInput, setMvpInput] = useState("");
  const [stretchGoalInput, setStretchGoalInput] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`http://52.15.58.198:3000/projects/${projectId}`);
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error("Failed to load project:", err);
      }
    };

    if (projectId) fetchProject();
  }, [projectId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("projectDataString", JSON.stringify(project));
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const res = await fetch(`http://52.15.58.198:3000/projects/${projectId}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        
        onClose();
      } else {
       
      }
    } catch (err) {
      console.error("Submit error:", err);
      
    } finally {
      setLoading(false);
    }
  };

  if (!project) return <div className="p-[20px] text-[#374151]">Loading...</div>;

  return (
    <div className="w-[95%] h-full py-[40px] px-[20px] bg-[#efefef] flex justify-center overflow-y-auto text-nunito">
      <div className="w-[90%] max-w-[1000px] bg-white rounded-[10px] shadow-lg px-[40px] py-[20px] mb-[30px]">

        <h1 className="text-[28px] font-bold text-[#1f2937] mb-[24px]">Edit Project</h1>

        {/* Title */}
        <label className="block text-sm font-medium text-gray-700 mb-[4px] text-nunito">Title</label>
        <input
          name="title"
          value={project.title}
          onChange={handleChange}
          className="w-full p-[12px] border border-[#d1d5db] rounded-[6px] mb-[16px] text-nunito"
        />

        {/* Description */}
        <label className="block text-sm font-medium text-gray-700 mb-[4px] text-nunito">Description</label>
        <textarea
          name="description"
          value={project.description}
          onChange={handleChange}
          rows={4}
          className="w-full p-[12px] border border-[#d1d5db] rounded-[6px] mb-[16px] resize-none text-nunito"
          style={{
            fontFamily: "'Nunito', sans-serif",
          }}
        />

        {/* Type */}
        <label className="block text-sm font-medium text-gray-700 mb-[4px]">Type</label>
        <input
          name="type"
          value={project.type}
          onChange={handleChange}
          className="w-full p-[12px] border border-[#d1d5db] rounded-[6px] mb-[24px]"
        />

        {/* MVPs */}
        <label className="block text-sm font-medium text-gray-700 mb-[4px]">MVPs</label>
        <div className="flex gap-[10px] mb-[10px]">
          <input
            type="text"
            placeholder="Enter MVP"
            value={mvpInput}
            onChange={(e) => setMvpInput(e.target.value)}
            className=" flex-1 px-[12px] py-[10px] border border-[#d1d5db] rounded-[6px]"
          />
          <button
            type="button"
            onClick={() => {
              if (mvpInput.trim()) {
                setProject({ ...project, mvp: [...project.mvp, mvpInput.trim()] });
                setMvpInput("");
              }
            }}
            className="px-[25px] py-[10px] bg-[#3b82f6] text-[#fff] translate-x-[25px] rounded-[6px] border-none outline-none cursor-pointer"
          >
            + Add
          </button>
        </div>

        {/* MVP tags */}
        <div className="flex flex-wrap gap-[10px] mb-[24px]">
          {project.mvp.map((mvp: string, index: number) => (
            <div key={index} className="flex items-center bg-[#e0f2fe] px-[10px] py-[6px] rounded-[20px] text-sm text-[#0369a1]">
              {mvp}
              <button
                onClick={() => {
                  const updated = project.mvp.filter((_: any, i: number) => i !== index);
                  setProject({ ...project, mvp: updated });
                }}
                className="ml-[8px] hover:text-[#dc2626] border-none outline-none bg-transparent cursor-pointer"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Stretch Goals */}
        <label className="block text-sm font-medium text-gray-700 mb-[4px]">Stretch Goals</label>
        <div className="flex gap-[10px] mb-[10px]">
          <input
            type="text"
            placeholder="Enter Stretch Goal"
            value={stretchGoalInput}
            onChange={(e) => setStretchGoalInput(e.target.value)}
            className="flex-1 px-[12px] py-[10px] border border-[#d1d5db] rounded-[6px]"
          />
          <button
            type="button"
            onClick={() => {
              if (stretchGoalInput.trim()) {
                setProject({ ...project, stretch: [...project.stretch, stretchGoalInput.trim()] });
                setStretchGoalInput("");
              }
            }}
            className="px-[25px] py-[10px] bg-[#8b5cf6] text-[#fff] translate-x-[25px] rounded-[6px] border-none outline-none cursor-pointer"
          >
            + Add
          </button>
        </div>

        {/* Stretch Goal tags */}
        <div className="flex flex-wrap gap-[10px] mb-[24px]">
          {project.stretch.map((goal: string, index: number) => (
            <div key={index} className="flex items-center bg-[#ede9fe] px-[10px] py-[6px] rounded-[20px] text-sm text-[#7c3aed]">
              {goal}
              <button
                onClick={() => {
                  const updated = project.stretch.filter((_: any, i: number) => i !== index);
                  setProject({ ...project, stretch: updated });
                }}
                className="ml-[8px] hover:text-[#dc2626] border-none outline-none bg-transparent cursor-pointer"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Thumbnail Upload */}
        <label className="block text-sm font-medium text-[#000] mb-[4px]">Thumbnail</label>
        <input type="file" accept="image/*" onChange={handleThumbnailChange} className="w-full mb-[24px] border-1 border-[#b7b7b7] p-[10px] rounded-[10px]" />

        {/* Submit Button */}
        <div className="flex justify-end py-[30px] mb-[100px]">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="py-[10px] px-[18px] bg-[#385773] hover:bg-[#3a4651] text-[#fff] rounded-[6px] text-[15px] font-medium border-none outline-none mb-[50px] translate-x-[25px]"
          >
            {loading ? "Saving..." : "Save Project"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectInline;
