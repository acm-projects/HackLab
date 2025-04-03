"use client";

import { useEffect, useState } from "react";
import Graphs from "../components/Profile/graphs";
import NavBar from "../components/NavBar";
import ProfileSidebar from "../components/Profile/ProfileSideBar";
import AllCreatedProjects from "../components/Profile/profileProjects";
import { ProjectStats, ProfileInfoCard } from "../components/Profile/profileinfo";

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

  useEffect(() => {
    async function fetchUserData() {
      try {
        const currentUserId = "1";

        const [userRes, skillsRes, topicsRes] = await Promise.all([
          fetch(`http://52.15.58.198:3000/users/${currentUserId}`),
          fetch(`http://52.15.58.198:3000/users/${currentUserId}/skills`),
          fetch(`http://52.15.58.198:3000/users/${currentUserId}/topics`),
        ]);

        const userData = await userRes.json();
        const skillsData = await skillsRes.json();
        const topicsData = await topicsRes.json();

        setProfileInfo({
          name: userData.name || "",
          email: userData.email || "",
          github: userData.github || "",
          school: userData.school || "",
          location: userData.location || "",
          position: userData.position || "",
          resume: userData.resume || "",
          joined: userData.joined || "",
          profilePic: userData.profilePic || null,
        });

        setUserLevel(userData.level || 1);
        setTopics(topicsData.map((t: any) => t.topic));
        setSkills(skillsData.map((s: any) => s.skill));
      } catch (error) {
        console.error("Failed to load user data:", error);
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
        />

        <div className="flex-1 flex flex-col gap-[16px] p-[20px]">
          <div className="flex flex-row gap-[16px]">
            <ProjectStats ongoing={0} created={0} completed={0} />
            <ProfileInfoCard {...profileInfo} />
          </div>

          <Graphs />
          <AllCreatedProjects />
        </div>
      </div>
    </div>
  );
}
