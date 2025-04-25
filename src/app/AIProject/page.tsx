"use client";
import React, { useState } from "react";
import { Sparkles, Lightbulb } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import NavBar from "../components/NavBar";
import LoadingGears from "../components/LoadingGears";

export default function CreateProjectWithAI() {
  const [description, setDescription] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [generating, setGenerating] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as any;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setGenerating(true);

    try {
      const res = await fetch("http://52.15.58.198:3000/projects/generateProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: description,
          name: user?.name || "Unknown", // You can replace this with `user?.github` if that’s how it’s stored
        }),
      });

      if (!res.ok) {
        setGenerating(false);
        return;
      }

      const aiProject = await res.json();

      const enrichedProject = {
        projectName: aiProject.title,
        projectType: aiProject.type,
        techToBeUsed: aiProject.skills || [],
        interests: aiProject.topics || [],
        shortDescription: aiProject.short_description || "",
        description: aiProject.description || "",
        mvps: aiProject.mvp || [],
        stretchGoals: aiProject.stretch || [],
        timeline: {
          frontend: aiProject.timeline?.frontend || [],
          backend: aiProject.timeline?.backend || [],
        },
        thumbnail: aiProject.thumbnail || "",
        source: "ai",
      };

      const encoded = encodeURIComponent(JSON.stringify(enrichedProject));
      router.push(`/ManualProject?data=${encoded}`);
    } catch (err) {
      console.error("Failed to generate project:", err);
      setGenerating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1000);
  };

  if (generating) return <LoadingGears />;

  return (
    <div className="min-h-screen flex flex-col items-center font-nunito">
      <NavBar />
      <form className="mt-auto mb-auto translate-y-[25px]"
        onSubmit={handleSubmit}
        style={{
          width: "800px",
          backgroundColor: "#ffffff1A",
          backdropFilter: "blur(16px)",
          borderRadius: "24px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          zIndex: 2,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div style={{ height: "4px", width: "100%" }}></div>

        <div style={{ padding: "32px" }}>
          <div className="mt-[-30px]" style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            <img
              src="/images/AIPROJECTTT.png"
              alt="Manual Project"
              className="w-[230px] h-[200px] object-contain mb-[10px] ml-[10px] "
            />
            <div>
              <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#385773" }}>Create with Juno!</h2>
              <p style={{ color: "#385773", marginTop: "2px" }}> While you sip your coffee, have a complete project plan generated tailored to you. </p>
            </div>
          </div>

          <div style={{ position: "relative", marginBottom: "24px" }}>
            <textarea
              className="project-input font-nunito text-[#385773]"
              placeholder="Describe your dream project in detail..."
              value={description}
              onChange={handleInputChange}
              rows={10}
              style={{
                width: "94%",
                padding: "20px",
                backgroundColor: "#fff",
                border: "1px solid #7ea3c2",
                color: "#385773",
                fontSize: "16px",
                borderRadius: "16px",
                resize: "none",
                outline: "none",
                fontFamily: "'Nunito', sans-serif",
              }}
            />
            <style jsx>{`
              .project-input::placeholder {
                color: #c0d4e8;
                opacity: 1;
              }
            `}</style>

            <div
              style={{
                position: "absolute",
                bottom: "16px",
                right: "16px",
                backgroundColor: "#1a2a3a",
                border: "1px solid #7ea3c2",
                borderRadius: "12px",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                color: "#cbd5e1",
              }}
            >
              <Lightbulb style={{ height: "16px", width: "16px", color: "#9bbcf0" }} />
              <span>Be specific and imaginative</span>
            </div>
          </div>

          <button 
            type="submit"
            disabled={generating}
            className={`w-full h-[56px] bg-[#385773] rounded-[16px] text-[#fff] text-[16px] font-medium 
              flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden transition-opacity duration-200 hover:bg-[#5b7a9b] border-none outline-none`}
          >
            <Sparkles style={{ height: "20px", width: "20px" }} />
            {generating ? "Generating..." : "Generate Project with AI"}
          </button>
        </div>
      </form>
    </div>
  );
}
