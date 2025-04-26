"use client";
import React from "react";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ProjectData } from "../shared/types";
import NavBar from "../components/NavBar";

const fetchCurrentUser = async (email: string) => {
  try {
    const response = await fetch("http://52.15.58.198:3000/users");
    if (!response.ok) throw new Error("Failed to fetch users");

    const users = await response.json();
    const currentUser = users.find((user: any) => user.email === email);

    if (!currentUser) throw new Error("User not found");
    return currentUser;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export default function ReviewPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [projectData, setProjectData] = React.useState<ProjectData | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [skillIconMap, setSkillIconMap] = React.useState<{ [name: string]: string }>({});

  React.useEffect(() => {
    const fetchSkillIcons = async () => {
      try {
        const res = await fetch("http://52.15.58.198:3000/skills");
        if (!res.ok) throw new Error("Failed to fetch skills");
        const skills = await res.json();
        const map: { [name: string]: string } = {};
        for (const skill of skills) {
          map[skill.skill] = skill.icon_url;
        }
        setSkillIconMap(map);
      } catch (err) {
        console.error("Error fetching skill icons:", err);
      }
    };

    fetchSkillIcons();
  }, []);

  React.useEffect(() => {
    const saved = localStorage.getItem("projectReviewData");
    if (saved) {
      try {
        setProjectData(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse project data from localStorage", err);
        setProjectData(null);
      }
    }
  }, []);

  const handleEdit = () => {
    if (!projectData) return;
    const dataToPass = {
      ...projectData,
      source: "manual", // Optional, helps in autofill logic
    };
    router.push(`/ManualProject?data=${encodeURIComponent(JSON.stringify(dataToPass))}`);
  };
  

  const handleConfirm = async () => {
    if (!session?.accessToken) {
      alert("GitHub access token is missing. Please log in with GitHub.");
      return;
    }

    if (!projectData) return;

    console.log("Using GitHub access token:", session.accessToken);

    setIsSubmitting(true);

    try {
      if (!session.user?.email) throw new Error("No email in session");
      const currentUser = await fetchCurrentUser(session.user.email);
      const userId = currentUser.id;

      if (currentUser.role_preference_id === undefined) {
        throw new Error("Missing role_preference_id in user data.");
      }
      const roleId = currentUser.role_preference_id;

      const formData = new FormData();
      formData.append("accessToken", session.accessToken);
      formData.append(
        "projectDataString",
        JSON.stringify({
          title: projectData.projectName || "Trial Project",
          description: projectData.description || "Temporary fallback description.",
          short_description: "",
          type: projectData.projectType || "Trial",
          mvp: projectData.mvps || ["Trial MVP"],
          stretch: projectData.stretchGoals || ["Trial Stretch"],
          timeline: {
            frontend: projectData.timeline?.frontend || [],
            backend: projectData.timeline?.backend || [],
          },
          team_lead_id: userId,
        })
      );
      if (projectData.teamPreferences && projectData.teamPreferences.length > 0) {
        if (projectData.teamPreferences && projectData.teamPreferences.length > 0) {
          formData.append("teamPreferences", JSON.stringify(projectData.teamPreferences));
        }
        
      }
      
      if (projectData.thumbnail) {
        if (typeof projectData.thumbnail === "string" && projectData.thumbnail.startsWith("http")) {
          formData.append("thumbnail", projectData.thumbnail);
        } else if (
          typeof projectData.thumbnail === "string" &&
          projectData.thumbnail.startsWith("data:image/")
        ) {
          const binaryImage = new Blob(
            [
              new Uint8Array(
                atob(projectData.thumbnail.split(",")[1])
                  .split("")
                  .map((c) => c.charCodeAt(0))
              ),
            ],
            { type: "image/png" }
          );
          formData.append("thumbnail", binaryImage);
        }
      }

      const response = await fetch("http://52.15.58.198:3000/projects", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      const createdProject = await response.json();
      if (!createdProject?.id) throw new Error("Project ID was not returned from the backend.");
      const specificProjectId = createdProject.id;

      const existing = JSON.parse(localStorage.getItem("createdProjects") || "[]");
      const projectId = projectData.projectName || `temp-${Math.random().toString(36).substring(2, 9)}`;
      if (!existing.some((p: any) => p.id === projectId)) {
        localStorage.setItem(
          "createdProjects",
          JSON.stringify([
            ...existing,
            {
              id: projectId,
              title: projectData.projectName || "Untitled Project",
            },
          ])
        );
      }

      if (createdProject?.github_repo_url) {
        alert(`${createdProject.github_repo_url}`);
        window.open(createdProject.github_repo_url, "_blank");
      } else {
        alert("✅ Project created successfully, but no repository URL was returned.");
      }

      const linkUserProjectRes = await fetch(
        `http://52.15.58.198:3000/users/${userId}/projects/${specificProjectId}/${roleId}`,
        { method: "POST" }
      );
      if (!linkUserProjectRes.ok) throw new Error("Failed to link project to user.");

      const [topicRes, skillRes] = await Promise.all([
        fetch("http://52.15.58.198:3000/topics"),
        fetch("http://52.15.58.198:3000/skills"),
      ]);
      const [allTopics, allSkills] = await Promise.all([topicRes.json(), skillRes.json()]);

      for (const interest of projectData.interests || []) {
        const matchedTopic = allTopics.find((t: any) => t.topic === interest);
        if (matchedTopic) {
          await fetch(
            `http://52.15.58.198:3000/projects/${specificProjectId}/topics/${matchedTopic.id}`,
            { method: "POST" }
          );
          await fetch(`http://52.15.58.198:3000/users/${userId}/topics/${matchedTopic.id}`, {
            method: "POST",
          });
        }
      }

      for (const tech of projectData.techToBeUsed || []) {
        const matchedSkill = allSkills.find((s: any) => s.skill === tech);
        if (matchedSkill) {
          await fetch(
            `http://52.15.58.198:3000/projects/${specificProjectId}/skills/${matchedSkill.id}`,
            { method: "POST" }
          );
          await fetch(`http://52.15.58.198:3000/users/${userId}/skills/${matchedSkill.id}`, {
            method: "POST",
          });
        }
      }

    } catch (error) {
      console.error("Error during project creation:", error);
    } finally {
      setIsSubmitting(false);
      router.push("/myProject");
    }
  };

  if (!projectData) {
    return (
      <div className="flex items-center justify-center w-screen h-screen text-[#fff] bg-gradient-to-br from-[#2c3640] via-[#385773] to-[#00d4ff]">
        Loading project data...
      </div>
    );
  }


 return (
  <div className="min-h-screen flex flex-col items-center bg-blue-900 text-white font-nunito mt-auto mb-auto">
        <NavBar />

    {/* Title */}
    <h2 className="absolute mt-auto text-[25px] py-[50px] font-bold text-[#385773] z-10 mb-auto translate-y-[30%]">
      Review your project
    </h2>

    {/* Review Card */}
    <div className="z-10 flex flex-col w-[50%] h-[65vh] p-[50px] mt-auto mb-auto overflow-y-auto translate-y-[5%] text-[#385773] rounded-[16px] shadow-[0px_8px_32px_rgba(0,0,0,0.1)] bg-[#f5f9fc] backdrop-blur-lg scrollbar-hidden">
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Project Name:</h3>
        <p className="px-[10px] py-[10px] rounded-[10px] bg-white border border-[#cfdce5]">{projectData.projectName}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Project Type:</h3>
        <p className="px-[10px] py-[10px] rounded-[10px] bg-white border border-[#cfdce5]">{projectData.projectType}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Description:</h3>
        <p className="px-[10px] py-[10px] rounded-[10px] bg-white border border-[#cfdce5]">{projectData.description}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Tech To Be Used:</h3>
        <div className="flex flex-wrap gap-[10px]">
        {projectData.techToBeUsed.map((tech, index) => (
      <div
        key={index}
        className="flex items-center gap-[8px] px-[10px] py-[10px] text-sm rounded-[10px] bg-white border border-[#cfdce5]"
      >
        {skillIconMap[tech] && (
          <img
            src={skillIconMap[tech]}
            alt={`${tech} icon`}
            className="w-[18px] h-[18px] object-contain"
          />
        )}
        <span>{tech}</span>
      </div>
    ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Interests:</h3>
        <div className="flex flex-wrap gap-[10px]">
          {(projectData.interests || []).map((interest, index) => (
            <span key={index} className="px-[10px] py-[10px] text-sm rounded-[10px] bg-white border border-[#cfdce5]">
              {interest}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold mb-[5px]">MVPs:</h3>
        <ul className="pl-[10px] list-disc">
          {projectData.mvps.map((mvp, index) => (
            <li key={index}>{mvp}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Stretch Goals:</h3>
        <ul className="pl-6 list-disc">
          {projectData.stretchGoals.map((goal, index) => (
            <li key={index}>{goal}</li>
          ))}
        </ul>
      </div>

      {projectData.timeline && (
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Timeline:</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-1">Frontend:</h4>
              {projectData.timeline.frontend.length > 0 ? (
                <ul className="pl-5 list-disc">
                  {projectData.timeline.frontend.map((task, index) => (
                    <li key={index}>{task}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#385773]/60 italic">No frontend tasks added.</p>
              )}
            </div>

            <div>
              <h4 className="font-semibold mb-1">Backend:</h4>
              {projectData.timeline.backend.length > 0 ? (
                <ul className="pl-5 list-disc">
                  {projectData.timeline.backend.map((task, index) => (
                    <li key={index}>{task}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#385773]/60 italic">No backend tasks added.</p>
              )}
            </div>
          </div>
        </div>
      )}
    
    {projectData.teamPreferences && projectData.teamPreferences.length > 0 && (
  <div className="mb-4">
    <h3 className="text-lg font-bold mb-2">Team Role Preferences:</h3>
    <ul className="list-disc pl-5">
      {projectData.teamPreferences.map((id, index) => (
        <li key={index}>
          Role ID: {id}
          {/* You can show prettier names if you fetch /roles again */}
        </li>
      ))}
    </ul>
  </div>
)}




      {projectData.thumbnail && typeof projectData.thumbnail === "string" && (
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Thumbnail:</h3>
          <img
            src={projectData.thumbnail}
            alt="Project Thumbnail"
            className="object-fill w-full max-h-[350px] rounded-[12px] border border-[#cfdce5]"
          />
        </div>
      )}


      <div className="flex justify-center gap-[10px] mt-[10px]">
        <button
          onClick={handleEdit}
          disabled={isSubmitting}
          className="px-[10px] py-[10px] text-[#385773] cursor-pointer font-bold transition-colors bg-[#e8eff5] border border-[#385773] rounded-[10px] hover:bg-[#93a6ba] disabled:opacity-50"
        >
          Edit
        </button>
        <button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="px-[10px] py-[10px] text-white font-bold cursor-pointer transition-colors bg-[#e8eff5] border border-[#385773] rounded-[10px] hover:bg-[#93a6ba] disabled:opacity-50"
        >
          {isSubmitting ? "Processing..." : "Confirm"}
        </button>
      </div>
    </div>
  </div>
);

}


