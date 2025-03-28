"use client"

import { useEffect, useRef, useState } from "react"
import { Chart } from "chart.js/auto"
import NavBar from "../components/NavBar"
import { FaCrown, FaStar, FaAward, FaMedal, FaRocket } from "react-icons/fa"
import { useRouter } from "next/navigation"


interface Project {
  name: string
  value: number
  color: string
}

interface Language {
  name: string
  value: number
}

export default function DeveloperProfile() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()
  const [editMode, setEditMode] = useState<"languages" | "roles" | "interests" | "profile" | null>(null)
  const [tempItems, setTempItems] = useState<string[]>([])
  const [newItem, setNewItem] = useState("")

  const [profileLanguages, setProfileLanguages] = useState<string[]>(["Python", "C++"])
  const [profileRoles, setProfileRoles] = useState<string[]>(["Full Stack", "Frontend"])
  const [profileInterests, setProfileInterests] = useState<string[]>(["Games", "Web Application"])
  const [userLevel, setUserLevel] = useState(50)

  const [profileInfo, setProfileInfo] = useState({
    name: "Luke",
    email: "—",
    github: "—",
    school: "UTD",
    location: "Austin",
    position: "Freshman",
    resume: "Not uploaded",
    joined: "—",
    profilePic: null as string | null,
  })

  const [tempProfileInfo, setTempProfileInfo] = useState({ ...profileInfo })

  const projectsJoined = ["AI Resume Builder", "HackLab"]
  const [createdProjects, setCreatedProjects] = useState<string[]>([]);
  const [totalProjects, setTotalProjects] = useState<string[]>([]);
  
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("createdProjects") || "[]");
    setCreatedProjects(stored);
    setTotalProjects(["AI Resume Builder", "HackLab", ...stored]);
  }, []);
  


  const topProjects: Project[] = [
    { name: "HackLab", value: 80, color: "#B8C9D6" },
    { name: "Todo List", value: 60, color: "#3D4B5C" },
    { name: "Macros", value: 70, color: "#7A8899" },
  ]

  const languages: Language[] = [
    { name: "Java", value: 90 },
    { name: "C++", value: 85 },
    { name: "React", value: 75 },
    { name: "JavaScript", value: 65 },
    { name: "Python", value: 80 },
  ]
  const handleProjectClick = (projectName: string) => {
    const isMember = totalProjects.includes(projectName)
    if (isMember) {
      router.push("/dashboard")
    }
  }

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        new Chart(ctx, {
          type: "radar",
          data: {
            labels: languages.map((lang) => lang.name),
            datasets: [
              {
                label: "Languages",
                data: languages.map((lang) => lang.value),
                backgroundColor: "rgba(75, 85, 99, 0.2)",
                borderColor: "#4B5563",
                borderWidth: 2,
                pointBackgroundColor: "#4B5563",
                pointBorderColor: "#FFFFFF",
                pointHoverBackgroundColor: "#FFFFFF",
                pointHoverBorderColor: "#4B5563",
              },
            ],
          },
          options: {
            scales: {
              r: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  display: false,
                },
              },
            },
            plugins: {
              legend: {
                position: "bottom",
              },
            },
          },
        })
      }
    }
  }, [])

  const openEditModal = (type: "languages" | "roles" | "interests" | "profile") => {
    setEditMode(type)
    if (type === "profile") {
      setTempProfileInfo({ ...profileInfo })
    } else {
      switch (type) {
        case "languages":
          setTempItems([...profileLanguages])
          break
        case "roles":
          setTempItems([...profileRoles])
          break
        case "interests":
          setTempItems([...profileInterests])
          break
      }
    }
  }


  const closeEditModal = () => {
    setEditMode(null)
    setNewItem("")
  }

  const saveChanges = () => {
    if (!editMode) return

    if (editMode === "profile") {
      setProfileInfo({ ...tempProfileInfo })
      closeEditModal()
      return
    }

    switch (editMode) {
      case "languages":
        setProfileLanguages([...tempItems])
        break
      case "roles":
        setProfileRoles([...tempItems])
        break
      case "interests":
        setProfileInterests([...tempItems])
        break
    }

    closeEditModal()
  }

  const addItem = () => {
    if (newItem.trim() && !tempItems.includes(newItem.trim())) {
      setTempItems([...tempItems, newItem.trim()])
      setNewItem("")
    }
  }

  const removeItem = (itemToRemove: string) => {
    setTempItems(tempItems.filter((item) => item !== itemToRemove))
  }

  return (
    <div className="flex flex-col h-screen">
      {/* NavBar at the top */}
      <NavBar />
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden mt-[50px]">
        {/* Left Column - Profile Section */}
        <div className="w-[280px] flex flex-col gap-[20px] p-[20px] overflow-y-auto">
          {/* Profile Card */}
          <div className="bg-[#FFFFFF] rounded-[8px] p-[20px] shadow-sm flex flex-col items-center border border-[#c1c1c1]" style={{ boxShadow: "3px 3px 3px 3px rgb(30 40 50 / 20%)" }}>
          <div className="w-[100px] h-[100px] rounded-full bg-[#E5E7EB] mb-[12px] overflow-hidden">
            {profileInfo.profilePic ? (
              <img src={profileInfo.profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">No Pic</div>
            )}

          </div>
          <h2 className="text-[20px] font-medium text-[#111827]">{profileInfo.profilePic}</h2>
          <h2 className="text-[20px] font-medium text-[#111827] translate-y-[-50px]">{profileInfo.name}</h2>

            <p className="text-[14px] text-[#6B7280] mt-[-50px]">Level {userLevel}</p>
            
            {/* Level Progress Bar */}
            <div className="w-full mb-[20px]">
              <div className="flex items-center justify-between mt-[0px] mb-[7px]">
                <span className="text-[12px] text-[#6B7280]">Level {userLevel}</span>
                <span className="text-[12px] text-[#6B7280]">100</span>
              </div>
              <div className="relative h-[8px] w-full bg-[#E5E7EB] rounded-full">
                {/* Progress bar fill */}
                <div 
                  className="absolute h-full bg-[#385773] rounded-full"
                  style={{ width: `${userLevel}%` }}
                ></div>
                
                {/* Icon positioned on top of the progress bar */}
                <div 
                  className="absolute top-1/2 transform -translate-y-1/2 flex items-center justify-center w-[20px] h-[20px] rounded-full bg-[#0b1f30] text-[#fff] transition-all duration-300 z-10"
                  style={{ left: `calc(${userLevel}% - 8px)` }}
                >
                  {userLevel >= 90 ? (
                    <FaCrown className="text-[10px] text-yellow-400" />
                  ) : userLevel >= 80 ? (
                    <FaStar className="text-[10px] text-yellow-400" />
                  ) : userLevel >= 70 ? (
                    <FaAward className="text-[10px] text-blue-400" />
                  ) : userLevel >= 50 ? (
                    <FaMedal className="text-[10px] text-green-400" />
                  ) : (
                    <FaRocket className="text-[10px] text-purple-400" />
                  )}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => openEditModal("profile")}

              className="w-full bg-[#385773] text-[#FFFFFF] rounded-[10px] py-[6px] text-[13px] font-medium border-transparent border-none outline-none hover:text-[#cecdcd]"
            >
              Edit Profile
            </button>

          </div>

          {/* Languages */}
          <div className="bg-[#FFFFFF] rounded-[8px] p-[20px] shadow-sm relative border border-[#c1c1c1]" style={{ boxShadow: "3px 3px 3px 3px rgb(30 40 50 / 20%)" }}>
            <div className="flex justify-between items-center mb-[12px]">
              <h3 className="text-[15px] font-medium text-[#000000]">Languages</h3>
              <button 
                onClick={() => openEditModal("languages")}
                className="text-[#000000] hover:text-[#4B5563] bg-transparent border-none outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-[18px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              </button>
            </div>
            <div className="flex flex-wrap gap-[6px]">
              {profileLanguages.map((lang, index) => (
                <span key={index} className="inline-flex items-center px-[10px] py-[3px] rounded-full text-[13px] bg-[#EBF4FF] text-[#3182CE]">
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Roles */}
          <div className="bg-[#FFFFFF] rounded-[8px] p-[20px] shadow-sm relative border border-[#c1c1c1]" style={{ boxShadow: "3px 3px 3px 3px rgb(30 40 50 / 20%)" }}>
            <div className="flex justify-between items-center mb-[12px]">
              <h3 className="text-[15px] font-medium text-[#111827]">Roles</h3>
              <button 
                onClick={() => openEditModal("roles")}
                className="text-[#000000] hover:text-[#4B5563] bg-transparent border-none outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-[18px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              </button>
            </div>
            <div className="flex flex-wrap gap-[6px]">
              {profileRoles.map((role, index) => (
                <span key={index} className="inline-flex items-center px-[10px] py-[3px] rounded-full text-[13px] bg-[#F3F4F6] text-[#4B5563]">
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="bg-[#FFFFFF] rounded-[8px] p-[20px] shadow-sm relative border border-[#c1c1c1]" style={{ boxShadow: "3px 3px 3px 3px rgb(30 40 50 / 20%)" }}>
            <div className="flex justify-between items-center mb-[12px]">
              <h3 className="text-[15px] font-medium text-[#111827]">Interests</h3>
              <button 
                onClick={() => openEditModal("interests")}
                className="text-[#000000] hover:text-[#4B5563] bg-transparent border-none outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-[18px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              </button>
            </div>
            <div className="flex flex-wrap gap-[6px]">
              {profileInterests.map((interest, index) => (
                <span key={index} className="inline-flex items-center px-[10px] py-[3px] rounded-full text-[13px] bg-[#F3F4F6] text-[#4B5563]">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Content Section */}
        <div className="flex-1 flex flex-col gap-[16px] p-[20px] overflow-y-auto">
        <div className="flex gap-[16px]">
          {/* LEFT COLUMN */}
          <div className="w-1/2 flex flex-col gap-[16px]">
            
            {/* Top: Project Stats */}
            <div className="bg-[#FFFFFF] rounded-[8px] p-[20px] shadow-sm border border-[#c1c1c1] h-[30%]"
                style={{ boxShadow: "3px 3px 3px 3px rgb(30 40 50 / 20%)" }}>
              <h3 className="text-[15px] font-medium text-[#111827] mb-[12px]">Projects Completed</h3>
              <div className="flex justify-between gap-[10px] mb-[16px]">
                <div className="flex-1 bg-[#FED7D7] rounded-[4px] p-[10px] text-center">
                  <div className="text-[20px] font-bold text-[#E53E3E]">{totalProjects.length - createdProjects.length}</div>
                  <div className="text-[13px] text-[#E53E3E]">Ongoing</div>
                </div>
                <div className="flex-1 bg-[#C6F6D5] rounded-[4px] p-[10px] text-center">
                  <div className="text-[20px] font-bold text-[#38A169]">{createdProjects.length}</div>
                  <div className="text-[13px] text-[#38A169]">Created</div>
                </div>
                <div className="flex-1 bg-[#CEEDFF] rounded-[4px] p-[10px] text-center">
                  <div className="text-[20px] font-bold text-[#3182CE]">{totalProjects.length}</div>
                  <div className="text-[13px] text-[#3182CE]">Joined</div>
                </div>
              </div>
            </div>

            {/* Bottom: Project Lists */}
            <div className="bg-[#FFFFFF] rounded-[8px] p-[20px] shadow-sm border border-[#c1c1c1] h-[70%]"
                style={{ boxShadow: "3px 3px 3px 3px rgb(30 40 50 / 20%)" }}>
              <div className="flex justify-around items-start">
                {/* All Projects */}
                <div className="w-[120px] text-center">
                  <h4 className="text-[14px] font-semibold text-[#111827] mb-[6px]">All Projects</h4>
                  {projectsJoined.map((project, index) => {
                    const isMember = totalProjects.includes(project)
                    return (
                      <div
                        key={index}
                        className={`text-[13px] mb-[4px] ${
                          isMember ? "text-[#3182CE] cursor-pointer hover:underline" : "text-[#4B5563]"
                        }`}
                        onClick={() => isMember && handleProjectClick(project)}
                      >
                        {project}
                      </div>
                    )
                  })}
                </div>

                {/* Created Projects */}
                <div className="w-[120px] text-center">
                  <h4 className="text-[14px] font-semibold text-[#111827] mb-[6px]">Created Projects</h4>
                  {createdProjects.map((project, index) => {
                    const isMember = totalProjects.includes(project)
                    return (
                      <div
                        key={index}
                        className={`text-[13px] mb-[4px] ${
                          isMember ? "text-[#3182CE] cursor-pointer hover:underline" : "text-[#4B5563]"
                        }`}
                        onClick={() => isMember && handleProjectClick(project)}
                      >
                        {project}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
            <div className="w-1/2 bg-[#FFFFFF] rounded-[8px] p-[20px] shadow-sm border border-[#c1c1c1]" style={{ boxShadow: "3px 3px 3px 3px rgb(30 40 50 / 20%)" }}>
              <h3 className="text-[20px] font-medium text-[#111827] mb-[5px]">Profile Info</h3>
              <div className="grid grid-cols-2 gap-x-[20px] gap-y-[10px]">
                <div>
                  <p className="text-[13px] font-medium text-[#000000]">Name:</p>
                  <p className="text-[13px] text-[#ffffff] bg-[#385773] rounded-[10px] px-[10px] py-[5px] w">{profileInfo.name}</p>
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#000]">Email:</p>
                  <p className="text-[13px] text-[#ffffff] bg-[#385773] rounded-[10px] px-[10px] py-[5px]">{profileInfo.email}</p>
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#000]">GitHub:</p>
                  <p className="text-[13px] text-[#ffffff] bg-[#385773] rounded-[10px] px-[10px] py-[5px] ">{profileInfo.github}</p>
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#000]">School/Company:</p>
                  <p className="text-[13px] text-[#ffffff] bg-[#385773] rounded-[10px] px-[10px] py-[5px]">{profileInfo.school}</p>
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#000]">Location:</p>
                  <p className="text-[13px] text-[#ffffff] bg-[#385773] rounded-[10px] px-[10px] py-[5px]">{profileInfo.location}</p>
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#000]">Position:</p>
                  <p className="text-[13px] text-[#ffffff] bg-[#385773] rounded-[10px] px-[10px] py-[5px]">{profileInfo.position}</p>
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#000]">Resume:</p>
                  <p className="text-[13px] text-[#ffffff] bg-[#385773] rounded-[10px] px-[10px] py-[5px]">{profileInfo.resume}</p>
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#000]">Joined on:</p>
                  <p className="text-[13px] text-[#ffffff] bg-[#385773] rounded-[10px] px-[10px] py-[5px]">{profileInfo.joined}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Row - Top Projects and Top Languages */}
          <div className="grid grid-cols-2 gap-[16px]">
            {/* Top Projects */}
            <div className=" bg-[#FFFFFF] rounded-[8px] p-[20px] shadow-sm border border-[#c1c1c1]" style={{ boxShadow: "3px 3px 3px 3px rgb(30 40 50 / 20%)" }}>
              <h3 className="text-[15px] font-medium text-[#111827] mb-[12px]">Top Projects</h3>
              <div className="flex items-end h-[180px] gap-[20px] mt-[20px]">
                {topProjects.map((project, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full"
                      style={{
                        height: `${project.value * 1.8}px`,
                        backgroundColor: project.color,
                      }}
                    ></div>
                    <p className="text-[13px] text-[#4B5563] mt-[6px]">{project.name}</p>
                  </div>
                ))}
              </div>
            </div>


            {/* Top Languages */}
            <div className="bg-[#FFFFFF] rounded-[8px] p-[20px] shadow-sm border border-[#c1c1c1]" style={{ boxShadow: "3px 3px 3px 3px rgb(30 40 50 / 20%)" }}>
              <h3 className="text-[15px] font-medium text-[#111827] mb-[12px]">Top Languages</h3>
              <div className="h-[180px] w-full">
                <canvas ref={chartRef}></canvas>
              </div>
            </div>
            

          </div>

        </div>
        </div>

{editMode && (
  <div className="bg-[#fff] bg-opacity-50 flex items-center justify-center z-50 h-[750px] px-[50px] py-[20px] rounded-[30px] mb-[20px]">
    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
      <h3 className="text-lg font-medium text-gray-900 mb-4 ml-[400px]">
        Edit {editMode.charAt(0).toUpperCase() + editMode.slice(1)}
      </h3>
      {editMode === "profile" ? (
        <>
          {["name", "email", "github", "school", "location", "position", "joined"].map((key) => (
            <div className="mb-4 grid grid-cols-2 justify-center items-center ml-[200px] mr-[300px]" key={key}>
              <label className="text-sm font-medium text-gray-700 capitalize ml-[200px]">{key}:</label>
              <input
                type="text"
                value={tempProfileInfo[key as keyof typeof tempProfileInfo] ?? ""}
                onChange={(e) =>
                  setTempProfileInfo((prev) => ({ ...prev, [key]: e.target.value }))
                }
                className="w-full mt-[3px] mb-[5px] border border-transparent outline-none bg-[#385773] rounded-[10px] px-[10px] py-[7px] text-[#fff] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          {/* Resume Upload */}
          <div className="mb-4 grid grid-cols-2 justify-center items-center ml-[200px] mr-[300px]">
            <label className="text-sm font-medium text-gray-700 capitalize ml-[200px]">Resume:</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setTempProfileInfo((prev) => ({
                    ...prev,
                    resume: file.name, // Store filename for now (you can later use URL if uploaded to backend)
                  }))
                }
              }}
              className="w-full mt-[3px] mb-[5px] text-sm text-[#fff] bg-[#385773] rounded-[10px] px-[10px] py-[7px] cursor-pointer"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 ml-[400px]">Profile Picture:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onloadend = () =>
                    setTempProfileInfo((prev) => ({
                      ...prev,
                      profilePic: reader.result as string,
                    }))
                  reader.readAsDataURL(file)
                }
              }}
              className="w-full mt-[20px] text-sm ml-[400px]"
            />
            {tempProfileInfo.profilePic && (
              <img
                src={tempProfileInfo.profilePic}
                alt="Preview"
                className="w-[80px] h-[80px] mt-[20px] object-cover rounded-full border ml-[400px]"
              />
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={`Add new ${editMode.slice(0, -1)}`}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
            />
            <button
              onClick={addItem}
              className="bg-gray-800 text-white rounded-md px-3 py-2 text-sm hover:bg-gray-700 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto mb-4 border border-gray-200 rounded-md p-3">
            {tempItems.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">No items added yet</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tempItems.map((item, index) => (
                  <div key={index} className="inline-flex items-center bg-gray-100 rounded-full pl-3 pr-2 py-1 hover:bg-gray-200 transition-colors">
                    <span className="text-sm text-gray-700">{item}</span>
                    <button
                      onClick={() => removeItem(item)}
                      className="ml-1 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
      <div className="flex justify-end gap-[10px] ">
        <button
          onClick={closeEditModal}
          className="border border-gray-300 text-gray-700 rounded-[10px] px-4 py-2 text-sm hover:bg-gray-50 transition-colors border-transparent border-none outline-none px-[10px] py-[10px]"
        >
          Cancel
        </button>
        <button
          onClick={saveChanges}
          className="bg-[#385773] text-[#fff] rounded-[10px] px-4 py-2 text-sm hover:bg-gray-700 transition-colors border-transparent border-none outline-none px-[10px] py-[10px]"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}
</div>
)
}
