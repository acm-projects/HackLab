"use client";
import io, { Socket } from "socket.io-client";
import { useState, useEffect, useRef } from "react";
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
  const [username, setUsername] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [projectUsersMap, setProjectUsersMap] = useState<Record<number, User[]>>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [kickDropdownOpen, setKickDropdownOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<number[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch("http://52.15.58.198:3000/users");
        const users = await res.json();
        const matchedUser = users.find((u: any) => u.email === session.user.email);
        if (matchedUser) {
          setUserId(matchedUser.id);
          setUsername(matchedUser.name);
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
      } catch (err) {
        console.error("Failed to fetch projects or users:", err);
      }
    };
    fetchProjectsAndUsers();
  }, [userId]);

  useEffect(() => {
    if (!userId || (!selectedUser && !selectedProject)) return;

    const socket = io("http://52.15.58.198:3000", {
      transports: ["websocket"],
    });

    socketRef.current = socket;
    const isDM = !!selectedUser;
    const targetRoomId = isDM
      ? `dm-${[userId, selectedUser.id].sort().join("-")}`
      : `project-${selectedProject?.id}`;

    if (isDM) {
      socket.emit("joinDMRoom", userId, session?.user?.name || "Unknown", selectedUser.id, targetRoomId);
      console.log(targetRoomId);
      socket.on("loadDMMessages", async () => {
        socket.emit("getDMs", userId);
        socket.emit("sentDMs", userId);

        const [receivedDMs, sentDMs] = (await Promise.all([
          new Promise<any[]>((resolve) => socket.once("loadDMs", resolve)),
          new Promise<any[]>((resolve) => socket.once("loadSentDMs", resolve)),
        ])) as [any[], any[]];

        let chats: Message[] = [];

        for (const msg of receivedDMs) {
          if (String(msg.sender_id) === String(selectedUser.id)) {
            const userRes = await fetch(`http://52.15.58.198:3000/users/${msg.sender_id}`);
            const user = await userRes.json();
            chats.push({
              id: Math.random(),
              sender: {
                id: msg.sender_id,
                name: user.name,
                email: user.email,
                image: user.image,
              },
              content: msg.message,
              timestamp: msg.time,
            });
          }
        }

        for (const msg of sentDMs) {
          if (String(msg.receiver_id) === String(selectedUser.id)) {
            const userRes = await fetch(`http://52.15.58.198:3000/users/${msg.sender_id}`);
            const user = await userRes.json();
            chats.push({
              id: Math.random(),
              sender: {
                id: msg.sender_id,
                name: user.name,
                email: user.email,
                image: user.image,
              },
              content: msg.message,
              timestamp: msg.time,
            });
          }
        }

        chats.sort((a, b) => {
          const dateA = parseCustomTimestamp(a.timestamp);
          const dateB = parseCustomTimestamp(b.timestamp);
          console.log(dateA, dateB); // should show full dates WITH time
          if (!dateA || !dateB) return 0;
          return dateA.getTime() - dateB.getTime();
        });




        setMessages(chats);
      });
    } else {
      socket.emit("joinRoom", {
        user_id: userId,
        username: session?.user?.name || "Unknown",
        project_id: selectedProject?.id,
        room: targetRoomId,
      });

      socket.on("loadMessages", async (loadedMessages: any[]) => {
        const formattedMessages = await Promise.all(
          loadedMessages.map(async (msg) => {
            const userRes = await fetch(`http://52.15.58.198:3000/users/${msg.sender_id}`);
            const user = await userRes.json();

            return {
              id: Math.random(),
              sender: {
                id: msg.sender_id,
                name: user.name,
                email: user.email,
                image: user.image,
              },
              content: msg.message,
              timestamp: msg.time,
            };
          })
        );
        setMessages(formattedMessages);
      });
    }

    socket.on("message", async (msg: any) => {
      if (msg.username === session?.user?.name) return;

      const res = await fetch("http://52.15.58.198:3000/users");
      const users = await res.json();
      const matchedUser = users.find((u: any) => u.name === msg.username);

      if (!matchedUser) return;

      const formatted: Message = {
        id: Math.random(),
        sender: {
          id: matchedUser.id,
          name: matchedUser.name,
          email: matchedUser.email,
          image: matchedUser.image,
        },
        content: msg.text,
        timestamp: msg.time,
      };

      setMessages((prev) => [...prev, formatted]);
    });

    socket.on("userTyping", (typingUserId: number) => {
      if (typingUserId !== userId && !typingUsers.includes(typingUserId)) {
        setTypingUsers((prev) => [...prev, typingUserId]);
      }
    });

    socket.on("userStopTyping", (typingUserId: number) => {
      setTypingUsers((prev) => prev.filter((id) => id !== typingUserId));
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, selectedUser, selectedProject]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  

  const emitTyping = () => {
    if (!socketRef.current || !userId) return;
    const targetRoomId = selectedUser
      ? `dm-${[userId, selectedUser.id].sort().join("-")}`
      : `project-${selectedProject?.id}`;


    socketRef.current.emit("userTyping", userId, targetRoomId);


    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }


    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("userStopTyping", userId, targetRoomId);
    }, 3000);
  };


  const handleSend = () => {
    if (!newMessage.trim() || !socketRef.current || !userId) return;


    const targetRoomId = selectedUser
      ? `dm-${[userId, selectedUser.id].sort().join("-")}`
      : `project-${selectedProject?.id}`;


      socketRef.current.emit("chatMessage", userId, newMessage, selectedUser ? selectedUser.id : selectedProject?.id, selectedUser ? true: false);
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random(),
        sender: { id: userId, name: username || "You", email: "", image: "" },
        content: newMessage,
        timestamp: formatTime(new Date().toString()),
      },
    ]);
    setNewMessage("");
    socketRef.current.emit("userStopTyping", userId, targetRoomId);
  };


  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setSelectedUser(null);
    setMessages([]);
    setTypingUsers([]);
  };


  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setSelectedProject(null);
    setMessages([]);
    setTypingUsers([]);
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


  const formatTime = (timestamp: string) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date(timestamp);
    console.log(date)
    console.log(timestamp)
    const day = days[date.getDay()];
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${day}, ${hours}:${minutes} ${ampm}`
  };

  function parseCustomTimestamp(timestamp: string): Date | null {
    // Match things like "Apr:Wed:6:53 PM"
    const match = timestamp.match(/^([A-Za-z]{3}):[A-Za-z]{3}:(\d{1,2}:\d{2} (?:AM|PM))$/);
 
    if (!match) {
      console.warn("Invalid timestamp format:", timestamp);
      return null;
    }
 
    const [, monthStr, timeStr] = match;
 
    const now = new Date();
    const day = now.getDate();
    const year = now.getFullYear();
 
    const combined = `${monthStr} ${day}, ${year} ${timeStr}`;
 
    const parsedDate = new Date(combined);
 
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  }




  return (
    <div className="flex h-screen font-nunito">
        {/* <div className="w-screen h-full bg-[#f5f7fa] text-nunito"> */}
             <NavBar />
             <aside className="w-[250px] bg-[#385773] text-[#ffffff] p-[16px] text-[14px] flex flex-col h-[calc(100vh-50px)] mt-[50px] overflow-y-auto ml-[-10px]">

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


      <main className="flex-1 bg-[#e3ecf2] flex flex-col mt-[50px] h-[calc(100vh-60px)] ml-[10px] rounded-[10px] overflow-hidden">

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


          
        </div>


        <div
          ref={messagesContainerRef}
          className="flex-1 p-[20px] overflow-y-auto flex flex-col gap-[10px]"
        >


        {messages.map((msg, index) => {
  const isLast = index === messages.length - 1;




  return (
    <div
      key={msg.id}
      className={`flex ${msg.sender.id === userId ? "justify-end" : "justify-start"} items-end gap-[8px]`}
    >
      {msg.sender.id !== userId && (
        <img
          src={msg.sender.image || "/default-avatar.png"}
          alt={msg.sender.name}
          className="w-[32px] h-[32px] rounded-full object-cover border border-[#ccc]"
        />
      )}


      <div className="flex flex-col max-w-[70%]">
        <span className="text-[11px] text-[#6b7280] mb-[2px]">{msg.sender.name}</span>
        <div
          className={`px-[12px] py-[8px] rounded-[12px] shadow ${
            msg.sender.id === userId
              ? "bg-[#ffffff] text-[#385773] self-end"
              : "bg-[#385773] text-[#ffffff] self-start"
          }`}
        >
          {msg.content}
        </div>
        {isLast && (
        <div ref={messagesEndRef}>
          <span className={`text-[10px] mt-[2px] ${msg.sender.id === userId ? "text-right text-[#6b7280]" : "text-left text-[#d1d5db]"}`}>
            {msg.timestamp}
          </span>
        </div>
      )}

      </div>


      {msg.sender.id === userId && (
        <img
          src={session?.user?.image || "/default-avatar.png"}
          alt="You"
          className="w-[32px] h-[32px] rounded-full object-cover border border-[#ccc]"
        />
      )}
    </div>
  );
})}
        </div>


        <div className="h-[60px] px-[20px] bg-[#d9e3eb] flex items-center border-t border-[#a1b6c8] rounded-[10px]">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            emitTyping();
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          className="flex-1 px-[12px] py-[8px] rounded-[8px] border border-[#ccc] outline-none text-[14px]"
        />
          <button onClick={handleSend} className="ml-[12px] px-[15px] py-[8px] bg-[#385773] text-[#fff] rounded-[8px] text-[14px] border-none outline-none flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-[20px]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>


          </button>
        </div>
      </main>
    </div>
  );
}

