"use client";
import React, { useState } from "react";
import { Sparkles, Lightbulb } from "lucide-react";
import { useRouter } from "next/navigation";
import NavBar from "../components/NavBar";
export default function CreateProjectWithAI() {
  const [description, setDescription] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [generating, setGenerating] = useState(false);
  const router = useRouter();

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
        body: JSON.stringify({ prompt: description }),
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
      setGenerating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-blue-900 text-white font-nunito">
              <NavBar />
      <form className="mt-[150px]"
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
        <div style={{ height: "4px", width: "100%", background: "linear-gradient(to right, #5fa8e0, #9bbcf0, #5fa8e0)" }}></div>

        <div style={{ padding: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            <img
              src="/images/AIPROJECTTT.png"
              alt="Manual Project"
              className="w-[230px] h-[200px] object-contain mb-[10px] ml-[10px] rounded-[00px]"
            />
            <div>
              <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#385773" }}>Create with Juno</h2>
              <p style={{ color: "#385773", marginTop: "2px" }}>Transform your ideas into reality with AI assistance</p>
            </div>
          </div>

          <div style={{ position: "relative", marginBottom: "24px" }}>
            <textarea
              className="project-input"
              placeholder="Describe your dream project in detail..."
              value={description}
              onChange={handleInputChange}
              rows={10}
              style={{
                width: "94%",
                padding: "20px",
                backgroundColor: "#385773",
                border: "1px solid #7ea3c2",
                color: "#fff",
                fontSize: "16px",
                borderRadius: "16px",
                resize: "none",
                outline: "none",
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
            style={{
              width: "100%",
              height: "56px",
              background: "linear-gradient(to right, #5fa8e0, #4a7296)",
              border: "none",
              borderRadius: "16px",
              fontSize: "16px",
              color: "#fff",
              fontWeight: "500",
              cursor: generating ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              position: "relative",
              overflow: "hidden",
              opacity: generating ? 0.6 : 1,
            }}
          >
            <Sparkles style={{ height: "20px", width: "20px" }} />
            {generating ? "Generating..." : "Generate Project with AI"}
          </button>
        </div>
      </form>
    </div>
  );
}
