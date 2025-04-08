"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Graphs from "../../components/Profile/graphs";
import NavBar from "../../components/NavBar";
import ProfileSidebar from "../../components/Profile/ProfileSideBar";
import AllCreatedProjects from "../../components/Profile/profileProjects";
import { ProjectStats, ProfileInfoCard } from "../../components/Profile/profileinfo";
import EditProfilePage from "../edit/page";
import { useParams } from "next/navigation";

export default function DeveloperProfile() {
  const { data: session } = useSession();
  const [userId, setUserId] = useState<number | null>(null);
  const { id } = useParams();

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
    linkedin: "",
  });

  const [topics, setTopics] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [role, setRole] = useState<string[]>([]);
  const [userLevel, setUserLevel] = useState<number>(1);
  const [isEditing, setIsEditing] = useState(false);
  const [projectCounts, setProjectCounts] = useState({ ongoing: 0, created: 0, completed: 0 });
  const [topProjects, setTopProjects] = useState<any[]>([]);
  const [topLanguages, setTopLanguages] = useState<{ name: string; count: number }[]>([]);
  const [completedProjects, setCompletedProjects] = useState<any[]>([]);
  const [ongoingProjects, setOngoingProjects] = useState<any[]>([]);
  const [createdProjects, setCreatedProjects] = useState<any[]>([]);
  const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null);
  const [isMyProfile, setIsMyProfile] = useState(true); // default to true
  
  useEffect(() => {
    const getUserIdFromSession = async () => {
      if (session?.user?.email) {
        try {
          const res = await fetch("http://52.15.58.198:3000/users");
          const users = await res.json();
          const matched = users.find((u: any) => u.email === session.user?.email);
          if (matched?.id) {
            setUserId(matched.id);
          }
        } catch (err) {
          console.error("Error fetching user ID from session:", err);
        }
      }
    };

    getUserIdFromSession();
  }, [session]);

  useEffect(() => {
    if (session?.user?.email) {
      setLoggedInEmail(session.user.email);
    }
  }, [session]);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        //add this block starting from here
        const storedInfo = localStorage.getItem("userInfo");
        if (storedInfo) {
          const parsed = JSON.parse(storedInfo);
          setProfileInfo((prev) => ({
            ...prev,
            location: parsed.location || prev.location,
            position: parsed.position || prev.position,
            school: parsed.school || prev.school,
            linkedin: parsed.linkedin || "",
          }));
        }
        //ending here - future in luke's code 

        const [userRes, skillsRes, topicsRes, userProjectsRes, roleRes] = await Promise.all([
          fetch(`http://52.15.58.198:3000/users/${id}`),
          fetch(`http://52.15.58.198:3000/users/${id}/skills`),
          fetch(`http://52.15.58.198:3000/users/${id}/topics`),
          fetch(`http://52.15.58.198:3000/users/${id}/projects`),
          fetch(`http://52.15.58.198:3000/users/${id}/role`)
        ]);

        const userData = await userRes.json();
        const skillsData = await skillsRes.json();
        const topicsData = await topicsRes.json();
        const roleData = await roleRes.json();
        const userProjects = await userProjectsRes.json();

        let ongoing = 0, created = 0, completed = 0;
        const completedList: any[] = [];
        const ongoingList: any[] = [];
        const createdList: any[] = [];
        const skillFrequency: Record<string, number> = {};

        const excluded = ["react", "next.js", "vue", "angular", "express", "django", "flask", "jquery", "tailwind", "bootstrap"];

        await Promise.all(userProjects.map(async (assoc: any) => {
          const projectRes = await fetch(`http://52.15.58.198:3000/projects/${assoc.project_id}`);
          if (!projectRes.ok) return;

          const project = await projectRes.json();
          const teamLeadRes = await fetch(`http://52.15.58.198:3000/users/${project.team_lead_id}`);
          const teamLeadData = await teamLeadRes.json();
          const membersRes = await fetch(`http://52.15.58.198:3000/projects/${assoc.project_id}/users`);
          const memberData = await membersRes.json();
          const memberImages = memberData.map((u: any) => u.image || "/default.jpg");

          const skillsRes = await fetch(`http://52.15.58.198:3000/projects/${assoc.project_id}/skills`);
          const skillList = skillsRes.ok ? await skillsRes.json() : [];
          const skillNames = skillList.map((s: any) => s.skill);

          skillList.forEach((s: any) => {
            const skill = s.skill.toLowerCase();
            if (!excluded.includes(skill)) {
              skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
            }
          });

          const groupLeader = {
            name: teamLeadData.name || "Unknown",
            image: teamLeadData.profilePic || "/default.jpg",
          };

          const enrichedProject = {
            id: project.id,
            title: project.title,
            description: project.description,
            image: project.thumbnail || "/default-project.jpg",
            topics: project.topics || [],
            skills: skillNames,
            groupLeader,
            members: memberImages,
            totalMembers: memberImages.length,
            moreNeeded: project.moreNeeded || 0,
            likes: project.likes || 0,
            isLiked: false,
            isBookmarked: false,
            joinRequested: false
          };

          const isCompleted = !!project.completed;
          const isCreator = project.team_lead_id?.toString() === userId.toString();

          if (isCompleted) {
            completed++;
            completedList.push(enrichedProject);
          } else if (isCreator) {
            created++;
            createdList.push(enrichedProject);
          } else {
            ongoing++;
            ongoingList.push(enrichedProject);
          }
        }));

        const topCompletedProjects = completedList
          .sort((a, b) => b.likes - a.likes)
          .slice(0, 3)
          .map((p) => ({ title: p.title, likes: p.likes }));

        const topLangs = Object.entries(skillFrequency)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setProjectCounts({ ongoing, created, completed });
        setTopProjects(topCompletedProjects);
        setTopLanguages(topLangs);
        setCompletedProjects(completedList);
        setCreatedProjects(createdList);
        setOngoingProjects(ongoingList);

        setProfileInfo((prev) => ({
          ...prev,
          name: userData.name || "N/A",
          email: userData.email || "N/A",
          github: userData.github || "N/A",
          school: userData.school || prev.school,
          location: userData.location || prev.location,
          position: userData.position || prev.position,
          resume: userData.resume || "N/A",
          joined: userData.joined || "N/A",
          profilePic: userData.profilePic || null,
        }));

        // ✅ Set if viewing own profile
        setIsMyProfile(userData.email === session?.user?.email);
        setUserLevel(userData.level || 1);
        setTopics(topicsData.map((t: any) => t.topic));
        setSkills(skillsData.map((s: any) => s.skill));
        setRole([roleData.role]);
      } catch (error) {
        console.error("❌ Failed to load user/project data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

 return (
   <div className="flex flex-col h-screen">
     <NavBar />
     <div className="flex flex-1 overflow-y-auto mt-[60px] ml-[80px] mr-[80px]">
       <ProfileSidebar
         name={profileInfo.name}
         level={userLevel}
         profilePic={profileInfo.profilePic}
         topics={topics}
         roles={role}
         skills={skills}
         onEditClick={() => setIsEditing(true)}
          isMyProfile={isMyProfile} // ✅ Add this line
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


             <AllCreatedProjects
               completedProjects={completedProjects}
               ongoingProjects={ongoingProjects}
               createdProjects={createdProjects}
             />
           </>
         )}
       </div>
     </div>
   </div>
 );
}

