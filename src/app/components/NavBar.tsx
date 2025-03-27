"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NotificationDropdown from "./NotificationDropdown";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); // State for notification dropdown
  const router = useRouter();

  const handleLogout = () => {
    router.push("/"); // Redirect to landing page
  };

  // Dummy notification data
  const notifications = [
    {
      type: "joinRequest",
      user: {
        name: "John Doe",
        profilePic: "../../../images/img2.jpg",
        project: "Project Alpha",
      },
    },
    {
      type: "like",
      user: {
        name: "Jane Smith",
        profilePic: "../../../images/img2.jpg",
        post: "My Awesome Project",
      },
    },
  ];

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <div className="w-full fixed top-[0px] z-50">
      {/* Top Navigation Bar */}
      <div className={`h-[60px] bg-[#385773] flex items-center justify-between px-4 transition-all duration-500 ${isMenuOpen ? "pl-[200px]" : "pl-4"}`}>
        {/* Menu Button */}
        <button
          className="bg-[#385773] text-primary hover:text-white border-none 
                      hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 
                      font-nunito text-md px-[35px] py-[16px] text-center z-50 ml-[-10px]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-[25px] text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
            />
          </svg>
        </button>

        {/* Search Bar */}
        <div className="flex flex-1 justify-start">
          <div className="bg-[#ffffff] text-[#38577368] border-none 
                        hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 
                        font-nunito rounded-[10px] ml-[20px] text-md px-[20px] py-[7px] text-center 
                        flex items-center justify-start w-[500px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-[25px] mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent border-none focus:outline-none w-full text-[#385773]"
            />
          </div>
        </div>

        {/* Notification Button */}
        <div className="relative">
          <button
            className="bg-[#385773] text-primary hover:text-white border-none 
                        hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 
                        font-nunito rounded-[10px] text-md px-[30px] py-[12px] text-center"
            onClick={handleNotificationClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-[30px] text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              />
            </svg>
          </button>

          {/* Notification Dropdown
          {isNotificationOpen && (
            <NotificationDropdown
              notifications={notifications}
              onClose={() => setIsNotificationOpen(false)}
            />
          )} */}
        </div>
      </div>

      {/* Black Overlay */}
      {isMenuOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-[#00000080] z-[1000]"
          onClick={() => setIsMenuOpen(false)}
          style={{
            zIndex: 40,
          }}
        />
      )}

      {/* Expanding Box Below Navigation */}
      <div
        className={`fixed top-[0px] w-[270px] h-screen bg-[#385773] ml-[-10px] rounded-br-[65px] text-[#fff] flex flex-col items-start transition-transform duration-500 
          ${isMenuOpen ? "translate-x-0" : "-translate-x-[270px]"}`}
        style={{
          zIndex: 50,
          boxShadow: isMenuOpen ? "10px 0 30px rgba(0,0,0,0.6)" : "none",
        }}
      >
        <button
          className="w-full bg-[#385773] text-[#fff] hover:bg-gray-900 border-none 
                    focus:ring-4 focus:outline-none focus:ring-blue-300 
                    font-nunito rounded-[10px] text-[30px]
                    text-start flex items-center gap-2 justify-start mt-[15px] px-[50px]"
          onClick={() => router.push("/homeScreen")} // Navigate to the home screen
        >
          HackLab
        </button>
        {/* Links to Pages */}
        <div className="w-full flex flex-col mt-[130px] space-y-4 items-start ml-[30px]">
          {/* Dashboard Link */}
          <button
            className="mb-[20px] bg-[#385773] text-primary hover:text-white border-none 
                    hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 
                    font-nunito rounded-[10px] text-[15px] px-[20px] text-center flex items-center"
            onClick={() => router.push("/myProject")} 
          >        {/* Testing this with the chat page for now */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-[25px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>

            &nbsp; My Projects
          </button>

          {/* FindProjects Link */}
          <button
            className="mb-[20px] bg-[#385773] text-primary hover:text-white border-none 
                    hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 
                    font-nunito rounded-[10px] text-[15px] px-[20px] text-center z-50 lex flex items-center gap-2"
            onClick={() => router.push("/findProjects")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-[25px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>

            &nbsp; Find Projects
          </button>

          {/* CreateProject Link */}
          <button
            className="mt-auto bg-[#385773] text-primary hover:text-white border-none 
                    hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 
                    font-nunito rounded-[10px] text-[15px] px-[20px] text-center z-50 flex items-center gap-2"
            onClick={() => router.push("/CreateProject")}
          >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-[25px]">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>


           &nbsp; Create Project
          </button>
        </div>

        {/* Profile Button */}
        <button
          className="mt-auto bg-[#385773] text-primary hover:text-white border-none 
                    hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 
                    font-nunito rounded-[10px] text-[15px] px-[20px] py-[12px] text-center z-50 flex items-center gap-2 ml-[30px]"
          onClick={() => router.push("/profile")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-[25px]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          &nbsp; Profile
        </button>

        {/* Logout Button */}
        <button
          className="mb-[50px] bg-[#385773] text-primary hover:text-white border-none 
                    hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 
                    font-nunito rounded-[10px] text-[15px] px-[20px] py-[12px] text-center z-50 flex items-center gap-2 ml-[30px]"
          onClick={handleLogout}
        >
          {/* Logout Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-[25px]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
            />
          </svg>
          {/* Logout Text */}
          &nbsp; Logout
        </button>
      </div>
    </div>
  );
}