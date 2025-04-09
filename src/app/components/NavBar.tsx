"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "../components/LogoutButton";
import { usePathname } from "next/navigation";
import FilterBox from "./filterbox"; 
import { useSession } from "next-auth/react";

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
  const [userId, setUserId] = useState<number | null>(null);

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

  return (
    <div className="w-full fixed top-[0px] z-50">
      {/* Background image behind navbar on the left side */}

      <div className={`h-[60px] bg-[#385773] flex items-center justify-start px-4 transition-all duration-500 ${isMenuOpen ? "pl-[200px]" : "pl-4"}`}>
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
