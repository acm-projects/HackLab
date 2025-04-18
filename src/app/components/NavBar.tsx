"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "../components/LogoutButton";
import { usePathname } from "next/navigation";
import FilterBox from "./filterbox"; 
import { useSession } from "next-auth/react";
import {io} from 'socket.io-client';


interface NavBarProps {
  onApplyFilters?: (filters: { topics: string[]; skills: string[] }) => void;
  onSearchChange?: (query: string) => void;
  searchInput?: string;
  setSearchInput?: (value: string) => void;
  onSearchSubmit?: () => void;
  onClearFilters?: () => void;
  showSearch?: boolean;
}

export default function NavBar({
  onClearFilters,
  onApplyFilters,
  searchInput,
  setSearchInput,
  onSearchSubmit,
  showSearch = false,
}: NavBarProps) {
  const [showFilterBox, setShowFilterBox] = useState(false);
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  // const [userId, setUserId] = useState<number | null>(null);
  // const [showNotifications, setShowNotifications] = useState(false);
  // const socket = io('http://52.15.58.198:3000')
  const socketref = useRef<any>(null);
  // const [notifications, setNotifications] = useState<any[]>([]);
  
  const [showNotifications, setShowNotifications] = useState(false);
const [notifications, setNotifications] = useState<any[]>([]);
const socketRef = useRef<any>(null);
const [userId, setUserId] = useState<number | null>(null); // already exists in your code

const unseenCount = notifications.filter((n) => n.isNew).length;
const [messageNotifications, setMessageNotifications] = useState<any[]>([]);
const messageUnseenCount = messageNotifications.filter((n) => n.isNew).length;

useEffect(() => {
  if (!session?.user?.email) return;

  const socket = io("http://52.15.58.198:3000", {
    transports: ["websocket"],
  });

  socketRef.current = socket;

  socket.on("connect", () => {
    console.log("✅ Connected to Socket.IO");
    socket.emit("subscribeToNotifications", { email: session.user.email });
  });

  socket.on("new-join-request", async (notification) => {
    console.log("📩 New join request:", notification);

    try {
      const userRes = await fetch(`http://52.15.58.198:3000/users/${notification.user_id}`);
      const user = await userRes.json();

      const enrichedNotification = {
        id: `${notification.user_id}-${notification.project_id}`,
        userId: notification.user_id,
        projectId: notification.project_id,
        projectTitle: notification.projectTitle,
        userName: user.name,
        userImage: user.image,
        isNew: true,
      };

      setNotifications((prev) => [enrichedNotification, ...prev]);
    } catch (err) {
      console.error(`Failed to enrich join request:`, err);
    }
  });

  socket.on("notification-deleted", (deletedNotificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== deletedNotificationId));
  });

  // socket.on("new-message", async (msg: any) => {
  //   try {
  //     const userRes = await fetch(`http://52.15.58.198:3000/users/${msg.senderId}`);
  //     const user = await userRes.json();

  //     const enriched = {
  //       id: `msg-${Date.now()}`,
  //       userId: user.id,
  //       userName: user.name,
  //       userImage: user.image,
  //       projectTitle: msg.projectTitle || null,
  //       isDM: msg.isDM,
  //       isNew: true,
  //     };

  //     setMessageNotifications((prev) => [enriched, ...prev]);
  //   } catch (err) {
  //     console.error("❌ Failed to enrich new message:", err);
  //   }
  // });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected from socket.io");
  });

  return () => {
    socket.disconnect();
  };
}, [session]);




useEffect(() => {
  if (!socketRef.current) {
    socketRef.current = io("http://52.15.58.198:3000");

    socketRef.current.on("connect", () => {
      console.log("✅ Connected to socket.io");
    });

    socketRef.current.on("new-notification", async (notification: any) => {
      try {
        const userRes = await fetch(`http://52.15.58.198:3000/users/${notification.user_id}`);
        const user = await userRes.json();
    
        const enriched = {
          id: `${notification.user_id}-${notification.project_id}-${Date.now()}`,
          userId: notification.user_id,
          projectId: notification.project_id,
          userName: user.name,
          userImage: user.image,
          projectTitle: notification.projectTitle || "",
          isNew: true,
          type: notification.type,
          isDM: notification.type === "dm_message",
        };
    
        if (notification.type === "join_request") {
          setNotifications((prev) => [enriched, ...prev]);
        } else if (notification.type === "dm_message" || notification.type === "project_message") {
          setMessageNotifications((prev) => [enriched, ...prev]);
        }
      } catch (err) {
        console.error("❌ Failed to enrich notification:", err);
      }
    });
    

    socketRef.current.on("disconnect", () => {
      console.log("❌ Disconnected from socket.io");
    });
  }

  return () => {
    socketRef.current?.disconnect();
  };
}, []);

// 1. Marks notifications as seen when panel is opened
useEffect(() => {
  if (showNotifications) {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isNew: false }))
    
    );
  }
}, [showNotifications]);

// 2. Fetch join requests when panel is opened
useEffect(() => {
  const fetchJoinRequests = async () => {
    if (!userId) return;

    try {
      const resProjects = await fetch("http://52.15.58.198:3000/projects");
      const projects = await resProjects.json();
      const myProjects = projects.filter((proj: any) => proj.team_lead_id === userId);

      let allJoinRequests: any[] = [];

      for (const project of myProjects) {
        const resReqs = await fetch(`http://52.15.58.198:3000/projects/${project.id}/join-requests`);
        const joinRequests = await resReqs.json();

        for (const req of joinRequests) {
          try {
            const userRes = await fetch(`http://52.15.58.198:3000/users/${req.user_id}`);
            const user = await userRes.json();

            allJoinRequests.push({
              id: `${req.user_id}-${req.project_id}`,
              userId: req.user_id,
              projectId: req.project_id,
              projectTitle: project.title,
              userName: user.name,
              userImage: user.image,
              isNew: true,
            });
          } catch (err) {
            console.error(`Failed to fetch user ${req.user_id}:`, err);
          }
        }
      }

      setNotifications((prev) => {
        const existingIds = new Set(prev.map((n) => `${n.userId}-${n.projectId}`));
        const newOnes = allJoinRequests.filter((n) => !existingIds.has(`${n.userId}-${n.projectId}`));
        return [...newOnes, ...prev];
      });
    } catch (err) {
      console.error("❌ Error fetching join requests:", err);
    }
  };

  if (showNotifications) {
    fetchJoinRequests();
  }
}, [userId, showNotifications]);



  useEffect(() => {
    const fetchUserId = async () => {
      if (session?.user?.email) {
        try {
          const res = await fetch("http://52.15.58.198:3000/users");
          const users = await res.json();
          const matchedUser = users.find((u: any) => u.email === session.user.email);
          if (matchedUser) {
            setUserId(matchedUser.id);
          }
        } catch (err) {
          console.error("Failed to fetch user ID:", err);
        }
      }
    };

    fetchUserId();
  }, [session]);
  
  const handleAccept = async (notif: any) => {
    try {
      const res = await fetch(`http://52.15.58.198:3000/users/${notif.userId}/projects/${notif.projectId}/2`, {
        method: "POST"
      });
      if (!res.ok) throw new Error("Accept failed");
  
      await handleReject(notif); // clean up notification
  
      socketRef.current?.emit("notification-handled", {
        userId: notif.userId,
        projectId: notif.projectId,
        status: "accepted"
      });
    } catch (err) {
      console.error("Accept error:", err);
    }
  };
  
  const handleReject = async (notif: any) => {
    if (!socketRef.current) return;
  
    try {
      // 1. Emit to delete notification via socket
      socketRef.current.emit("delete-notification", {
        notification_id: notif.id,
      });
  
      // 2. Call backend API to delete the join request
      const res = await fetch(`http://52.15.58.198:3000/users/${notif.userId}/join-requests/${notif.projectId}`, {
        method: "DELETE",
      });
  
      if (!res.ok) throw new Error("Failed to delete join request");
  
      // 3. Optimistically remove from local state
      setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
    } catch (err) {
      console.error("❌ Error handling rejection:", err);
    }
  };
  
  
  
  
  return (
    <div className="w-full fixed top-[0px] z-50">
      {/* Background image behind navbar on the left side */}

      <div className={`h-[60px] bg-[#385773] flex items-center justify-start transition-all duration-500 ${isMenuOpen ? "pl-[200px]" : "pl-4"} `} style={{boxShadow: "10px 0 30px rgba(0,0,0,0.3)" }}>
        <button
          className="bg-[#385773] text-primary border-transparent border-none outline-none cursor-pointer font-nunito text-md px-[35px] py-[16px] text-center z-50 ml-[-10px]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-[25px] text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
          </svg>
        </button>

        {showSearch ? (
          <div className="flex flex-1 justify-start">
            <div className="bg-[#ffffff] text-[#38577368] border-none outline-none font-nunito rounded-[10px] ml-[20px] text-md px-[20px] py-[7px] text-center flex items-center justify-start w-[500px]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-[25px] mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                placeholder="Search"
                value={searchInput}
                onChange={(e) => setSearchInput?.(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onSearchSubmit?.();
                    onClearFilters?.();
                  }
                }}
                className="bg-transparent border-none outline-none focus:outline-none w-full text-[#385773]"
              />
            </div>
            {pathname === "/findProjects" && (
              <div className="relative">
                <button
                  className="ml-8 w-[80px] flex items-center gap-[1px] px-[13px] py-[8px] bg-[#fff] text-[#2e2e2e] rounded-[10px] shadow border border-gray-300 text-sm border-transparent border-none outline-none ml-[20px]"
                  onClick={() => setShowFilterBox(!showFilterBox)}
                >
                  Filter
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-[25px]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showFilterBox && (
                  <FilterBox
                    onClose={() => setShowFilterBox(false)}
                    onApply={(filters) => {
                      console.log("Apply filters:", filters);
                      onApplyFilters?.(filters);
                      setShowFilterBox(false);
                    }}
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          !isMenuOpen && (
            <span className="text-[#fff] text-[35px] font-bold ml-[10px] font-nunito flex justify-start items-start">HackLab</span>
            
          )
        )}
      </div>
      {/* Notifications */}
      <div className="absolute right-[30px] top-1/2 transform -translate-y-1/2 z-50 flex items-end justify-end">
        <div className="relative">
        {unseenCount > 0 && (
              <span className="absolute -top-[5px] -right-[1px] bg-[#0b3e72] text-[#fff] text-[10px] font-bold rounded-full w-[18px] h-[18px] flex items-center justify-center">
                {unseenCount}
              </span>
            )}
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="text-[#fff] hover:text-[#d1d1d1] transition duration-300 border-none outline-none bg-transparent cursor-pointer"
            aria-label="Notifications"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-[25px] h-[25px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              />
            </svg>
            

          </button>

          {showNotifications && (
  <div className="absolute right-[10px] mt-[15px] w-[450px] bg-[#fff] rounded-[10px] shadow-lg border border-gray-200 p-[10px] z-50">
    {notifications.length === 0 && messageNotifications.length === 0 ? (
  <p className="text-[#333] text-sm text-center">No notifications</p>
) : (
  <>
    {notifications.length > 0 && (
      <>
        <h3 className="text-[13px] font-semibold text-[#385773] mb-[5px]">Join Requests</h3>
        <ul className="space-y-[10px] mb-[10px] translate-x-[-20px]">
          {notifications.map((notif) => (
            <li key={notif.id} className="flex items-center justify-between border-b pb-[5px]">
              <div className="flex items-center gap-[5px]">
                <img src={notif.userImage || "/default-profile.png"} className="w-[30px] h-[30px] rounded-full object-cover" />
                <div className="text-sm">
                  <a href={`/profile/${notif.userId}`} className="text-[12px] text-[#111827]">{notif.userName}</a>
                  <span className="ml-[2px] text-[#555] text-[12px]">requested to join</span>
                  <span className="ml-[2px] italic text-[#333] text-[12px]">{notif.projectTitle}</span>
                </div>
              </div>
              <div className="flex gap-[10px]">
                <button onClick={() => handleAccept(notif)} className="text-[#fff] bg-[#0fe100] hover:bg-[#3e6e3a] px-[10px] py-[5px] text-[12px] rounded-[10px] border-none outline-none cursor-pointer">Accept</button>
                <button onClick={() => handleReject(notif)} className="text-[#fff] bg-[#ca0101] hover:bg-[#573131] px-[10px] py-[5px] text-[12px] rounded-[10px] border-none outline-none cursor-pointer">Reject</button>
              </div>
            </li>
          ))}
        </ul>
      </>
    )}

    {messageNotifications.length > 0 && (
      <>
        <h3 className="text-[13px] font-semibold text-[#385773] mb-[5px]">Messages</h3>
        <ul className="space-y-[10px]">
          {messageNotifications.map((msg) => (
            <li key={msg.id} className="flex items-start gap-2 border-b pb-[5px]">
              <img src={msg.userImage || "/default-profile.png"} className="w-[30px] h-[30px] rounded-full object-cover" />
              <div className="text-sm">
                <a href={`/profile/${msg.userId}`} className="text-[12px] font-medium text-[#111827] hover:underline">{msg.userName}</a>
                <span className="ml-1 text-[12px] text-[#555]">
                  {msg.isDM ? "sent you a DM" : `messaged in ${msg.projectTitle}`}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </>
    )}
  </>
)}

  </div>
)}

        </div>
      </div>



      {isMenuOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-[#00000080] z-[1000] cursor-pointer"
          onClick={() => setIsMenuOpen(false)}
          style={{ zIndex: 40 }}
        />
        
      )}
      {/** remove this div section if needed lol its just for juno to pop in ITS ACTUALLY SO FUNNY */}
      <div
        className={`absolute top-0 left-0 w-[250px] h-[200px] z-[45] transition-all duration-[500ms] ease-in-out ${
          isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        }`}
      >
        <img
          src="images/nav-bg-image.png"
          alt="Nav Background"
          className="w-full h-full object-cover rounded-br-[40px] ml-[145px]"
        />
      </div>

      <div
        className={`fixed top-[0px] w-[270px] h-screen bg-[#385773] ml-[-10px] rounded-br-[65px] text-[#fff] flex flex-col items-start transition-transform duration-500  
          ${isMenuOpen ? "translate-x-0" : "-translate-x-[270px]"}`}
        style={{ zIndex: 50, boxShadow: isMenuOpen ? "10px 0 30px rgba(0,0,0,0.6)" : "none" }}
      >
        <button
          className="w-full bg-[#385773] text-[#fff] border-none outline-none font-nunito rounded-[10px] text-[30px] text-start flex items-center gap-2 justify-start mt-[15px] px-[50px]"
          onClick={() => router.push("/homeScreen")}
        >
          HackLab
        </button>
        
        <div className="w-full flex flex-col mt-[130px] space-y-4 items-start px-[30px]">
          {/* Home Page Button at the Top */}
            <button
              className=" bg-[#385773] hover:text-[#d3e8ff] hover:bg-[#8383831a] py-[15px] pr-[130px] pl-[10px] cursor-pointer text-primary border-none outline-none font-nunito rounded-[10px] text-[15px] text-center flex items-center"
              onClick={() => router.push("/homeScreen")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-[25px] ">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              &nbsp; Home
            </button>
          <button
            className=" bg-[#385773] hover:text-[#d3e8ff] hover:bg-[#8383831a] py-[15px] pr-[90px] pl-[10px] cursor-pointer text-primary border-none outline-none font-nunito rounded-[10px] text-[15px] text-center flex items-center"
            onClick={() => router.push("/myProject")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-[25px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            &nbsp; My Projects
          </button>

          <button
            className=" bg-[#385773] hover:text-[#d3e8ff] hover:bg-[#8383831a] pr-[80px] py-[15px]  pl-[10px] cursor-pointer text-primary border-none outline-none font-nunito rounded-[10px] text-[15px] text-center flex items-center"
            onClick={() => router.push("/findProjects")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-[25px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            &nbsp; Find Projects
          </button>

          <button
            className=" bg-[#385773] hover:text-[#d3e8ff] hover:bg-[#8383831a] py-[15px] pr-[70px] pl-[10px] cursor-pointer text-primary border-none outline-none font-nunito rounded-[10px] text-[15px] text-center flex items-center"
            onClick={() => router.push("/CreateProject")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-[25px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            &nbsp; Create Project
          </button>

          <button
            className=" bg-[#385773] hover:text-[#d3e8ff] hover:bg-[#8383831a] py-[15px] pr-[45px] pl-[10px] cursor-pointer text-primary border-none outline-none font-nunito rounded-[10px] text-[15px] text-center flex items-center"
            onClick={() => router.push("/ProjectCompletion")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-[23px]">
            <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
          </svg>

            &nbsp; Generate Resume
          </button>

          
            <button
            className=" bg-[#385773] hover:text-[#d3e8ff] hover:bg-[#8383831a] py-[15px] pr-[100px] pl-[10px] cursor-pointer text-primary border-none outline-none font-nunito rounded-[10px] text-[15px] text-center flex items-center"
            onClick={() => router.push("/messages")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-[25px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
            &nbsp; Messages
          </button>
        </div>

        <button
          className="mt-auto bg-[#385773] text-[#fff] hover:text-[#d3e8ff] hover:bg-[#8383831a] py-[15px] pr-[125px] pl-[10px] cursor-pointer border-none outline-none font-nunito rounded-[10px] text-[15px] px-[20px] text-center z-50 flex items-center gap-2 ml-[30px]"
          onClick={() => {
            if (userId) {
              router.push(`/profile/${userId}`);
            } else {
              console.warn("User ID not found. Cannot navigate to profile.");
            }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-[25px]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          &nbsp; Profile
        </button>

        <LogoutButton />
      </div>
    </div>
  );
}
