"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import NavBar from "../components/NavBar";
interface Project {
  id: number;
  title: string;
  thumbnail: string;
  team_lead_id: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  image: string;
}

interface Message {
  id: number;
  sender: User;
  content: string;
  timestamp: string;
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const [userId, setUserId] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [projectUsersMap, setProjectUsersMap] = useState<Record<number, User[]>>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [kickDropdownOpen, setKickDropdownOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<number[]>([]); // <- Track user IDs who are typing

  useEffect(() => {
    const fetchUserId = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch("http://52.15.58.198:3000/users");
        const users = await res.json();
        const matchedUser = users.find((u: any) => u.email === session.user.email);
        if (matchedUser) {
          setUserId(matchedUser.id);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUserId();
  }, [session]);

  useEffect(() => {
    const fetchProjectsAndUsers = async () => {
      if (!userId) return;
      try {
        const userProjectsRes = await fetch(`http://52.15.58.198:3000/users/${userId}/projects`);
        const projectLinks = await userProjectsRes.json();
        const allProjectsRes = await fetch("http://52.15.58.198:3000/projects");
        const allProjects = await allProjectsRes.json();
        const associatedProjects: Project[] = allProjects.filter((p: any) =>
          projectLinks.some((link: any) => link.project_id === p.id)
        );
        setProjects(associatedProjects);
        if (associatedProjects.length > 0) setSelectedProject(associatedProjects[0]);

        const usersMap: Record<number, User[]> = {};
        const userSet = new Map<number, User>();
        for (const project of associatedProjects) {
          const res = await fetch(`http://52.15.58.198:3000/projects/${project.id}/users`);
          const users = await res.json();
          usersMap[project.id] = users;
          users.forEach((u: User) => {
            if (u.id !== userId) userSet.set(u.id, u);
          });
        }
        setProjectUsersMap(usersMap);
        setAllUsers(Array.from(userSet.values()));

        // Simulate who is typing (randomly pick 1 user to simulate typing)
        setTimeout(() => {
          const randomUser = Array.from(userSet.values())[0];
          if (randomUser && (!selectedUser || selectedUser.id !== randomUser.id)) {
            setTypingUsers([randomUser.id]);
          }
        }, 2000);
      } catch (err) {
        console.error("Failed to fetch projects or users:", err);
      }
    };
    fetchProjectsAndUsers();
  }, [userId]);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setSelectedUser(null);
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setSelectedProject(null);
    setTypingUsers((prev) => prev.filter((id) => id !== user.id)); // remove typing if clicked
  };

  const handleKick = async (userIdToKick: number) => {
    if (!selectedProject) return;
    try {
      await fetch(`http://52.15.58.198:3000/projects/${selectedProject.id}/users/${userIdToKick}`, {
        method: "DELETE",
      });
      const updated = { ...projectUsersMap };
      updated[selectedProject.id] = updated[selectedProject.id].filter(u => u.id !== userIdToKick);
      setProjectUsersMap(updated);
      const newUserSet = new Map<number, User>();
      Object.values(updated).flat().forEach(u => newUserSet.set(u.id, u));
      setAllUsers(Array.from(newUserSet.values()));
      setKickDropdownOpen(false);
    } catch (err) {
      console.error("Failed to kick user:", err);
    }
  };

  const handleLeaveGroup = async () => {
    if (!selectedProject || !userId) return;
    try {
      await fetch(`http://52.15.58.198:3000/users/${userId}/projects/${selectedProject.id}`, {
        method: "DELETE",
      });
      setProjects(prev => prev.filter(p => p.id !== selectedProject.id));
      setSelectedProject(null);
    } catch (err) {
      console.error("Failed to leave project:", err);
    }
  };

  return (
    <div className="flex h-screen font-nunito">
        {/* <div className="w-screen h-full bg-[#f5f7fa] text-nunito"> */}
             <NavBar />
      <aside className="w-[200px] bg-[#385773] text-[#ffffff] p-[16px] text-[14px] flex flex-col mt-[50px] h-full ml-[-10px]">
        <div className="mb-[30px]">
          <div className="text-left w-full font-bold mb-[12px] border-none outline-none bg-transparent text-[#ffffff]">
            Projects:
          </div>
          {projects.map((p) => (
            <div
              key={p.id}
              onClick={() => handleProjectClick(p)}
              className={`cursor-pointer flex items-center gap-[8px] p-[6px] rounded-[6px] hover:bg-[#2e455c] ${selectedProject?.id === p.id ? "bg-[#2e455c]" : ""}`}
            >
              <img
                src={p.thumbnail || "/placeholder.jpg"}
                className="w-[30px] h-[30px] rounded-[4px] border border-white object-cover"
                alt="Project Thumbnail"
              />
              <span className="text-[#ffffff]">{p.title}</span>
            </div>
          ))}
        </div>

        <div>
          <div className="text-left w-full font-bold mb-[12px] border-none outline-none bg-transparent text-[#ffffff]">
            Users:
          </div>
          {allUsers.map((u) => (
            <div
              key={u.id}
              onClick={() => handleUserClick(u)}
              className={`cursor-pointer flex items-center gap-[8px] p-[6px] rounded-[6px] hover:bg-[#2e455c] ${selectedUser?.id === u.id ? "bg-[#2e455c]" : ""}`}
            >
              <img
                src={u.image || "/default-avatar.png"}
                className="w-[30px] h-[30px] rounded-full border border-white object-cover"
                alt={u.name}
              />
              {typingUsers.includes(u.id) && (!selectedUser || selectedUser.id !== u.id) ? (
                <div className="flex items-center gap-[2px]">
                  <div className="w-[6px] h-[6px] bg-white rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                  <div className="w-[6px] h-[6px] bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-[6px] h-[6px] bg-white rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              ) : (
                <span className="text-[#ffffff]">{u.name}</span>
              )}
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 bg-[#e3ecf2] flex flex-col mt-[60px] h-[91%] justify-center ml-[10px] border-1 border-[#385773] rounded-[10px]">
        <div className="h-[60px] px-[20px] bg-[#cfdce6] flex justify-between items-center border-b border-[#a1b6c8] rounded-[10px]">
          <div className="flex items-center gap-[12px]">
            <img
              src={selectedUser?.image || selectedProject?.thumbnail || "/default-avatar.png"}
              className="w-[40px] h-[40px] rounded-full object-cover border border-[#385773]"
              alt="Chat Target"
            />
            <span className="text-[#385773] text-[16px] font-semibold">
              {selectedUser?.name || selectedProject?.title || "Messages"}
            </span>
          </div>

          {selectedProject && selectedProject.team_lead_id === userId && (
            <div className="relative">
              <button
                onClick={() => setKickDropdownOpen(!kickDropdownOpen)}
                className="text-[#385773] text-[13px] px-[12px] py-[6px] border border-[#385773] rounded-[6px] bg-[#f0f4f8]"
              >
                Manage Members
              </button>
              {kickDropdownOpen && (
                <div className="absolute left-[-90px] top-[50px] w-[220px] bg-white border border-[#ccc] rounded-[8px] shadow-lg z-10">
                  {projectUsersMap[selectedProject.id]?.map((u) => (
                    <div
                      key={u.id}
                      className="flex justify-between items-center px-[10px] py-[6px] hover:bg-[#f3f4f6]"
                    >
                      <span className="text-[#374151] text-[13px]">{u.name}</span>
                      <button
                        onClick={() => handleKick(u.id)}
                        className="text-[12px] text-[#ef4444] hover:text-[#dc2626] border-none bg-transparent outline-none"
                      >
                        Kick Out
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedProject && selectedProject.team_lead_id !== userId && (
            <button
              onClick={handleLeaveGroup}
              className="text-[#ef4444] text-[13px] px-[12px] py-[6px] border border-[#ef4444] rounded-[6px] bg-[#fff] hover:bg-[#fef2f2]"
            >
              Leave Group
            </button>
          )}
        </div>

        <div className="flex-1 p-[20px] overflow-y-auto flex flex-col gap-[10px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender.id === userId ? "items-end" : "items-start"}`}
            >
              <span className="text-[11px] text-[#6b7280] mb-[2px]">
                {msg.sender.name}
              </span>
              <div
                className={`px-[12px] py-[8px] rounded-[12px] max-w-[60%] shadow ${msg.sender.id === userId ? "bg-[#ffffff] text-[#385773]" : "bg-[#385773] text-[#ffffff]"}`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <div className="h-[60px] px-[20px] bg-[#d9e3eb] flex items-center border-t border-[#a1b6c8] rounded-[10px]">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 px-[12px] py-[8px] rounded-[8px] border border-[#ccc] outline-none text-[14px]"
          />
          <button className="ml-[12px] px-[15px] py-[8px] bg-[#385773] text-[#fff] rounded-[8px] text-[14px] border-none outline-none flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-[20px]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>

          </button>
        </div>
      </main>
    </div>
  );
}