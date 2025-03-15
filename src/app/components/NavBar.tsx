"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    setShowLogoutPopup(false);
    router.push("/"); // Redirect to landing page
  };

  return (
    <div className="w-full fixed top-[0px] z-50 flex flex-col">
      {/* Top Navigation Bar */}
      <div className={`h-[60px] bg-[#385773] flex items-center justify-between px-4 transition-all duration-500 ${isMenuOpen ? "pl-[200px]" : "pl-4"}`}>
        {/* Menu Button */}
        <button
          className="bg-[#385773] text-primary hover:text-white border-none 
                      hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 
                      font-nunito rounded-[10px] text-md px-[25px] py-[12px] text-center z-50"
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
                        font-nunito rounded-[10px] text-md px-[15px] py-[7px] text-center 
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
        <button className="bg-[#385773] text-primary hover:text-white border-none 
                        hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 
                        font-nunito rounded-[10px] text-md px-[30px] py-[12px] text-center">
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
      </div>

      {/* Expanding Box Below Navigation */}
      <div
        className={`fixed top-[0px] w-[270px] h-screen bg-[#385773] rounded-br-[65px] text-white flex flex-col items-start transition-transform duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-[270px]"}`}
        style={{ zIndex: 40 }} // Ensure the expanding box is below the menu button
      >
        <button
          className="w-full bg-[#385773] text-[#fff] hover:bg-gray-900 border-none 
                    focus:ring-4 focus:outline-none focus:ring-blue-300 
                    font-nunito rounded-[10px] text-[30px]
                    text-start flex items-center gap-2 justify-start mt-[15px] px-[50px] py-[10px]"
          onClick={() => router.push("/homeScreen")} // Navigate to the home screen
        >
          HackLab
        </button>
        {/* Links to Pages */}
        <div className="w-full flex flex-col mt-[130px] space-y-4 items-start ml-[30px]">
          {/* Dashboard Link */}
          <button
            className="mt-auto mb-[50px] bg-[#385773] text-primary hover:text-white border-none 
                    hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 
                    font-nunito rounded-[10px] text-[15px] px-[20px] text-center z-50 lex flex items-center gap-2"
            onClick={() => router.push("/my-projects")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-[25px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>

            &nbsp; My Projects
          </button>

          {/* FindProjects Link */}
          <button
            className="mt-auto mb-[50px] bg-[#385773] text-primary hover:text-white border-none 
                    hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 
                    font-nunito rounded-[10px] text-[15px] px-[20px] text-center z-50 lex flex items-center gap-2"
            onClick={() => router.push("/find-projects")}
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
            className="mt-auto mb-[50px] bg-[#385773] text-primary hover:text-white border-none 
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

        {/* Logout Button */}
        <button
          className="mt-auto mb-[50px] bg-[#385773] text-primary hover:text-white border-none 
                    hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 
                    font-nunito rounded-[10px] text-[15px] px-[20px] py-[12px] text-center z-50 flex items-center gap-2 ml-[30px]"
          onClick={() => setShowLogoutPopup(true)}
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

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          {/* Popup Box */}
          <div className="bg-white p-8 rounded-lg shadow-xl text-center font-nunito max-w-md w-full mx-4">
            {/* Popup Text */}
            <p className="text-lg font-semibold mb-6 text-black">
              Are you sure you want to logout?
            </p>
            {/* Buttons Container */}
            <div className="flex justify-center space-x-4">
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
              >
                Logout
              </button>
              {/* Back Button */}
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-6 rounded-lg transition duration-300"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}