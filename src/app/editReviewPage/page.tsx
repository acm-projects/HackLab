"use client";


import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";


export default function EditReviewPage() {
 const router = useRouter();
 const searchParams = useSearchParams();
 const projectId = searchParams.get("id");


 const [project, setProject] = useState<any>(null);
 const [thumbnail, setThumbnail] = useState<File | null>(null);
 const [loading, setLoading] = useState(false);


 const [mvpInput, setMvpInput] = useState<string>("");
   const [stretchGoalInput, setStretchGoalInput] = useState<string>("");


 useEffect(() => {
   if (!projectId) return;


   const fetchProject = async () => {
     try {
       const res = await fetch(`http://52.15.58.198:3000/projects/${projectId}`);
       const data = await res.json();
       setProject(data);
     } catch (err) {
       console.error("Failed to load project:", err);
     }
   };


   fetchProject();
 }, [projectId]);


 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
   setProject({ ...project, [e.target.name]: e.target.value });
 };


 const handleArrayChange = (field: string, index: number, value: string) => {
   const updated = [...project[field]];
   updated[index] = value;
   setProject({ ...project, [field]: updated });
 };


 const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   if (e.target.files && e.target.files[0]) {
     setThumbnail(e.target.files[0]);
   }
 };


 const handleSubmit = async () => {
   if (!projectId) return;


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
       alert("Project updated successfully!");
       router.push("/myProject");
     } else {
       alert("Update failed");
     }
   } catch (err) {
     console.error("Submit error:", err);
     alert("Something went wrong");
   } finally {
     setLoading(false);
   }
 };


 if (!project) return <div className="p-[20px] text-[#374151]">Loading...</div>;


 return (
<div className="px-[100px] py-[40px] max-w-[90%] mx-auto bg-[#f9fafb] rounded-[10px] shadow-lg">
 <h1 className="text-[28px] font-bold text-[#1f2937] mb-[24px]">Edit Project</h1>


 {/* Title */}
 <label className="block text-[14px] font-medium text-[#374151] mb-[4px]">Title</label>
 <input
   name="title"
   value={project.title}
   onChange={handleChange}
   className="w-full p-[12px] border border-[#d1d5db] rounded-[6px] mb-[16px] text-[#111827] bg-white"
 />


 {/* Description */}
 <label className="block text-[14px] font-medium text-[#374151] mb-[4px]">Description</label>
 <textarea
   name="description"
   value={project.description}
   onChange={handleChange}
   rows={4}
   className="w-full p-[12px] border border-[#d1d5db] rounded-[6px] mb-[16px] text-[#111827] bg-white resize-none"
 />


 {/* Type */}
 <label className="block text-[14px] font-medium text-[#374151] mb-[4px]">Type</label>
 <input
   name="type"
   value={project.type}
   onChange={handleChange}
   className="w-full p-[12px] border border-[#d1d5db] rounded-[6px] mb-[24px] text-[#111827] bg-white"
 />


 {/* MVPs */}
 <label className="block text-[14px] font-medium text-[#374151] mb-[4px]">MVPs</label>
 <div className="flex items-center gap-[10px] mb-[10px]">
   <input
     type="text"
     placeholder="Enter MVP"
     value={mvpInput}
     onChange={(e) => setMvpInput(e.target.value)}
     className="flex-1 px-[12px] py-[10px] border border-[#d1d5db] rounded-[6px] bg-white text-[#111827]"
   />
   <button
     type="button"
     onClick={() => {
       if (mvpInput.trim()) {
         setProject({ ...project, mvp: [...project.mvp, mvpInput.trim()] });
         setMvpInput("");
       }
     }}
     className="px-[14px] py-[10px] bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-[6px] text-[14px] font-semibold"
   >
     + Add
   </button>
 </div>
 <div className="flex flex-wrap gap-[10px] mb-[24px]">
   {project.mvp.map((mvp: string, index: number) => (
     <div key={index} className="flex items-center bg-[#e0f2fe] text-[#0369a1] px-[10px] py-[6px] rounded-[20px] text-[13px]">
       {mvp}
       <button
         type="button"
         onClick={() => {
           const updated = (project.mvp as string[]).filter((__, i: number) => i !== index);
           setProject({ ...project, mvp: updated });
         }}
         className="ml-[8px] text-[#0369a1] hover:text-[#dc2626] font-bold bg-transparent border-none"
       >
         ×
       </button>
     </div>
   ))}
 </div>


 {/* Stretch Goals */}
 <label className="block text-[14px] font-medium text-[#374151] mb-[4px]">Stretch Goals</label>
 <div className="flex items-center gap-[10px] mb-[10px]">
   <input
     type="text"
     placeholder="Enter Stretch Goal"
     value={stretchGoalInput}
     onChange={(e) => setStretchGoalInput(e.target.value)}
     className="flex-1 px-[12px] py-[10px] border border-[#d1d5db] rounded-[6px] bg-white text-[#111827]"
   />
   <button
     type="button"
     onClick={() => {
       if (stretchGoalInput.trim()) {
         setProject({ ...project, stretch: [...project.stretch, stretchGoalInput.trim()] });
         setStretchGoalInput("");
       }
     }}
     className="px-[14px] py-[10px] bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-[6px] text-[14px] font-semibold"
   >
     + Add
   </button>
 </div>
 <div className="flex flex-wrap gap-[10px] mb-[24px]">
   {project.stretch.map((goal: string, index: number) => (
     <div key={index} className="flex items-center bg-[#ede9fe] text-[#7c3aed] px-[10px] py-[6px] rounded-[20px] text-[13px]">
       {goal}
       <button
         type="button"
         onClick={() => {
           const updated = (project.stretch as string[]).filter((__, i: number) => i !== index);
           setProject({ ...project, stretch: updated });
         }}
         className="ml-[8px] text-[#7c3aed] hover:text-[#dc2626] font-bold bg-transparent border-none"
       >
         ×
       </button>
     </div>
   ))}
 </div>


 {/* Thumbnail */}
 <label className="block text-[14px] font-medium text-[#374151] mb-[4px]">Thumbnail</label>
 <input
   type="file"
   accept="image/*"
   onChange={handleThumbnailChange}
   className="w-full mb-[24px] text-[#374151]"
 />


 {/* Submit */}
 <button
   onClick={handleSubmit}
   disabled={loading}
   className="w-full py-[12px] bg-[#10b981] hover:bg-[#059669] text-white rounded-[6px] text-[16px] font-semibold transition-all duration-200"
 >
   {loading ? "Saving..." : "Save Project"}
 </button>
</div>


 );
}



