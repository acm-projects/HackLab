"use client";

import { useEffect, useState } from "react";
import Graphs from "../components/Profile/graphs";
import NavBar from "../components/NavBar";
import ProfileSidebar from "../components/Profile/ProfileSideBar";
import AllCreatedProjects from "../components/Profile/profileProjects";
import { ProjectStats, ProfileInfoCard } from "../components/Profile/profileinfo";
import EditProfilePage from "./edit/page";

export default function DeveloperProfile() {
  const [profileInfo, setProfileInfo] = useState({
    name: "",
    email: "",
    github: "",
    school: "",
    location: "",
    position: "",
    resume: "",
    joined: "",
    profilePic: null as string | null,
  });

  const [topics, setTopics] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [userLevel, setUserLevel] = useState<number>(1);
  const [isEditing, setIsEditing] = useState(false);
  const [projectCounts, setProjectCounts] = useState({ ongoing: 0, created: 0, completed: 0 });
  const [topProjects, setTopProjects] = useState<any[]>([]);
  const [topLanguages, setTopLanguages] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const currentUserId = "1";
  
        // Fetch user-related info
        const [userRes, skillsRes, topicsRes, userProjectsRes] = await Promise.all([
          fetch(`http://52.15.58.198:3000/users/${currentUserId}`),
          fetch(`http://52.15.58.198:3000/users/${currentUserId}/skills`),
          fetch(`http://52.15.58.198:3000/users/${currentUserId}/topics`),
          fetch(`http://52.15.58.198:3000/users/${currentUserId}/projects`)
        ]);
  
        const userData = await userRes.json();
        const skillsData = await skillsRes.json();
        const topicsData = await topicsRes.json();
        const userProjects = await userProjectsRes.json(); // [{ user_id, project_id, role_id }]
  
        let ongoing = 0, created = 0, completed = 0;
        const completedProjects: any[] = [];
        const skillFrequency: Record<string, number> = {};
  
        const excluded = ["react", "next.js", "vue", "angular", "express", "django", "flask", "jquery", "tailwind", "bootstrap"];
  
        await Promise.all(userProjects.map(async (assoc: any) => {
          const projectRes = await fetch(`http://52.15.58.198:3000/projects/${assoc.project_id}`);
          if (!projectRes.ok) return;
  
          const project = await projectRes.json();
          const isCompleted = !!project.completed;
          const isCreator = project.team_lead_id?.toString() === currentUserId;
  
          // Get project skills
          const skillsRes = await fetch(`http://52.15.58.198:3000/projects/${assoc.project_id}/skills`);
          if (skillsRes.ok) {
            const skills = await skillsRes.json();
            skills.forEach((s: any) => {
              const skill = s.skill.toLowerCase();
              if (!excluded.includes(skill)) {
                skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
              }
            });
          }
  
          if (isCompleted) {
            completed++;
            completedProjects.push(project);
          } else if (isCreator) {
            created++;
          } else {
            ongoing++;
          }
        }));
  
        // Top completed projects by likes
        const topCompletedProjects = completedProjects
          .sort((a, b) => b.likes - a.likes)
          .slice(0, 3)
          .map((p) => ({
            title: p.title,
            likes: p.likes
          }));
  
        // Top languages from project skills
        const topLangs = Object.entries(skillFrequency)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
  
        setProjectCounts({ ongoing, created, completed });
        setTopProjects(topCompletedProjects);
        setTopLanguages(topLangs);
  
        setProfileInfo({
          name: userData.name || "N/A",
          email: userData.email || "N/A",
          github: userData.github || "N/A",
          school: userData.school || "N/A",
          location: userData.location || "N/A",
          position: userData.position || "N/A",
          resume: userData.resume || "N/A",
          joined: userData.joined || "N/A",
          profilePic: userData.profilePic || null,
        });
  
        setUserLevel(userData.level || 1);
        setTopics(topicsData.map((t: any) => t.topic));
        setSkills(skillsData.map((s: any) => s.skill));
      } catch (error) {
        console.error("❌ Failed to load user/project data:", error);
      }
    }
  
    fetchUserData();
  }, []);
  
  
  

  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="flex flex-1 overflow-y-auto mt-[60px] ml-[80px] mr-[80px]">
        <ProfileSidebar
          name={profileInfo.name}
          level={userLevel}
          profilePic={profileInfo.profilePic}
          topics={topics}
          roles={roles}
          skills={skills}
          onEditClick={() => setIsEditing(true)}
        />

      <div className="flex-1 flex flex-col gap-[16px] p-[20px] mt-[20px]">
        {isEditing ? (
          <EditProfilePage onCancel={() => setIsEditing(false)} />
        ) : (
          <>
            <div className="flex flex-row gap-[16px]">
            <ProjectStats {...projectCounts} />
              <ProfileInfoCard {...profileInfo} />
            </div>

            <Graphs topProjects={topProjects} topLanguages={topLanguages} />

            <AllCreatedProjects />
          </>
        )}
      </div>
      </div>
    </div>
  );
}
