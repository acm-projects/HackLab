"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useRef } from "react";
import type { ProjectData } from "../shared/types"
import NavBar from "../components/NavBar";
export default function ManualProject() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const techDropdownRef = useRef<HTMLDivElement>(null);
  const interestDropdownRef = useRef<HTMLDivElement>(null);
  
  const [frontendInput, setFrontendInput] = useState<string>("")
  const [frontendTimeline, setFrontendTimeline] = useState<string[]>([])
  const [backendInput, setBackendInput] = useState<string>("")
  const [backendTimeline, setBackendTimeline] = useState<string[]>([])

  const [projectName, setProjectName] = useState<string>("")
  const [projectType, setProjectType] = useState<string>("")
  const [techToBeUsed, setTechToBeUsed] = useState<string>("")
  // const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [interestInput, setInterestInput] = useState<string>("")
  const [selectedTechs, setSelectedTechs] = useState<{ id: number, name: string }[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<{ id: number, name: string }[]>([]);

  
  const [description, setDescription] = useState<string>("")
  const [mvpInput, setMvpInput] = useState<string>("")
  const [mvps, setMvps] = useState<string[]>([])
  const [stretchGoalInput, setStretchGoalInput] = useState<string>("")
  const [stretchGoals, setStretchGoals] = useState<string[]>([])

  const [techOptions, setTechOptions] = useState<string[]>([])
  const [filteredTechOptions, setFilteredTechOptions] = useState<string[]>([])
  const [showDropdown, setShowDropdown] = useState<boolean>(false)

  const [interestOptions, setInterestOptions] = useState<string[]>([])
  const [filteredInterestOptions, setFilteredInterestOptions] = useState<string[]>([])
  const [showInterestDropdown, setShowInterestDropdown] = useState<boolean>(false)
  const [thumbnail, setThumbnail] = useState<File | null>(null)

  const [showMvpWarning, setShowMvpWarning] = useState<boolean>(false)
  const [showStretchGoalWarning, setShowStretchGoalWarning] = useState<boolean>(false)
  const [skillMap, setSkillMap] = useState<{ [id: number]: string }>({});
  const [topicMap, setTopicMap] = useState<{ [id: number]: string }>({});
  const lowercaseTechOptions = techOptions.map(opt => opt.toLowerCase());
  const lowercaseInterestOptions = interestOptions.map(opt => opt.toLowerCase());
  const [reverseSkillMap, setReverseSkillMap] = useState<{ [skill: string]: number }>({});
const [reverseTopicMap, setReverseTopicMap] = useState<{ [topic: string]: number }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        techDropdownRef.current &&
        !techDropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
  
      if (
        interestDropdownRef.current &&
        !interestDropdownRef.current.contains(event.target as Node)
      ) {
        setShowInterestDropdown(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  useEffect(() => {
    const fetchSkillsAndTopics = async () => {
      try {
        const [skillsRes, topicsRes] = await Promise.all([
          fetch("http://52.15.58.198:3000/skills"),
          fetch("http://52.15.58.198:3000/topics"),
        ]);
        
        const skillsData = await skillsRes.json();
        const topicsData = await topicsRes.json();
        
        const skillMapTemp: { [id: number]: string } = {};
        skillsData.forEach((s: { id: number; skill: string }) => {
          skillMapTemp[s.id] = s.skill;
        });
        
        const topicMapTemp: { [id: number]: string } = {};
        topicsData.forEach((t: { id: number; topic: string }) => {
          topicMapTemp[t.id] = t.topic;
        });
        
        setSkillMap(skillMapTemp);
        setTopicMap(topicMapTemp);
        setTechOptions(skillsData.map((s: { skill: string }) => s.skill));
        setInterestOptions(topicsData.map((t: { topic: string }) => t.topic));
        // Create reverse maps for name-to-ID mapping
          const reverseSkillMap: { [skill: string]: number } = {};
          skillsData.forEach((s: { id: number; skill: string }) => {
            reverseSkillMap[s.skill.toLowerCase()] = s.id;
          });

          const reverseTopicMap: { [topic: string]: number } = {};
          topicsData.forEach((t: { id: number; topic: string }) => {
            reverseTopicMap[t.topic.toLowerCase()] = t.id;
          });

          setReverseSkillMap(reverseSkillMap); // Add new state
          setReverseTopicMap(reverseTopicMap);


      } catch (err) {
        console.error("Failed to fetch skills/topics", err);
      }
    };
    
    fetchSkillsAndTopics();
  }, []);

  useEffect(() => {
    const dataParam = searchParams.get("data");
  
    // ⛔️ Don’t proceed if maps aren’t ready
    if (!dataParam || Object.keys(skillMap).length === 0 || Object.keys(topicMap).length === 0) return;
  
    try {
      const data: ProjectData = JSON.parse(decodeURIComponent(dataParam));
  
      setProjectName(data.projectName || "");
      setProjectType(data.projectType || "");
  
      setSelectedTechs(
        (data.techToBeUsed || []).map((entry: string | number) => {
          if (typeof entry === "number") {
            const name = skillMap[entry] || "Unknown";
            return { id: entry, name };
          } else {
            const id = reverseSkillMap[entry.toLowerCase()] || Date.now();
            return { id, name: entry };
          }
        })
      );
  
      setSelectedInterests(
        (data.interests || []).map((entry: string | number) => {
          if (typeof entry === "number") {
            const name = topicMap[entry] || "Unknown";
            return { id: entry, name };
          } else {
            const id = reverseTopicMap[entry.toLowerCase()] || Date.now();
            return { id, name: entry };
          }
        })
      );
  
      setDescription(data.description || "");
      setMvps(data.mvps || []);
      setStretchGoals(data.stretchGoals || []);
    } catch (error) {
      console.error("Error parsing project data:", error);
    }
  }, [searchParams, skillMap, topicMap]); // 👈 add skillMap + topicMap to dependencies
  

  useEffect(() => {
    const dataParam = searchParams.get("data");
    if (!dataParam || techOptions.length === 0 || interestOptions.length === 0) return;
    
    try {
      const data = JSON.parse(decodeURIComponent(dataParam));
      
      if (data.source !== "ai") {
        console.log("👤 Manual project creation detected. Skipping AI autofill.");
        return;
      }
      
      console.log("🤖 AI project data detected. Pre-filling form...");
      
      setProjectName(data.projectName || data.title || "");
      setProjectType(data.projectType || data.type || "");
      setDescription(data.description || "");
      setMvps(Array.isArray(data.mvps) ? data.mvps : data.mvp || []);
      setStretchGoals(Array.isArray(data.stretchGoals) ? data.stretchGoals : data.stretch || []);
      
      const matchedTechs = (data.techToBeUsed || data.skills || []).map((entry: any) => {
        const name = typeof entry === "string" ? entry : entry.name;
        const id = reverseSkillMap[name?.toLowerCase?.()] || Date.now();
        return { id, name };
      });
      
      
      
      const matchedInterests = (data.interests || data.topics || []).map((entry: any) => {
        const name = typeof entry === "string" ? entry : entry.name;
        const id = reverseTopicMap[name?.toLowerCase?.()] || Date.now();
        return { id, name };
      });
      
      
      
      setFrontendTimeline(data.timeline?.frontend || []);
      setBackendTimeline(data.timeline?.backend || []);
      setThumbnail(data.thumbnail || null); // ✅ Add this line

    } catch (error) {
      console.error("❌ Failed to parse AI project data:", error);
    }
  }, [searchParams, techOptions, interestOptions]);

  const [formErrors, setFormErrors] = useState({
    projectName: false,
    projectType: false,
    selectedTechs: false,
    selectedInterests: false,
    description: false,
    mvps: false,
  });
  

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const newErrors = {
      projectName: projectName.trim() === "",
      projectType: projectType.trim() === "",
      selectedTechs: selectedTechs.length === 0,
      selectedInterests: selectedInterests.length === 0,
      description: description.trim() === "",
      mvps: mvps.length === 0,
    };
  
    setFormErrors(newErrors);
  
    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError) return;
  
    const projectData: ProjectData = {
      id: Date.now(),
      projectName,
      projectType,
      techToBeUsed: selectedTechs.map((t) => t.name),  // ✅ Fix here
      interests: selectedInterests.map((i) => i.name),
      description,
      mvps,
      stretchGoals,
      timeline: {
        frontend: frontendTimeline,
        backend: backendTimeline,
      },
    };
  
    if (thumbnail) {
      // If it's a File (user-uploaded), convert to base64
      if (thumbnail instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Image = reader.result;
          const enrichedData = { ...projectData, thumbnail: base64Image };
          localStorage.setItem("projectReviewData", JSON.stringify(enrichedData));
          router.push(`/reviewPage`);
        };
        reader.readAsDataURL(thumbnail);
      } else if (typeof thumbnail === "string" && (thumbnail as string).startsWith("http")) {
        // If it's already a URL from AI, just store as-is
        const enrichedData = { ...projectData, thumbnail };
        localStorage.setItem("projectReviewData", JSON.stringify(enrichedData));
        router.push(`/reviewPage`);
      } else {
        // Fallback in case thumbnail is something unexpected
        localStorage.setItem("projectReviewData", JSON.stringify(projectData));
        router.push(`/reviewPage`);
      }
    }
     else {
      localStorage.setItem("projectReviewData", JSON.stringify(projectData));
      router.push(`/reviewPage`);
    }
  };
  

  const handleTechInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTechToBeUsed(value)

    if (value) {
      const filtered = techOptions.filter((tech) => tech.toLowerCase().includes(value.toLowerCase()))
      setFilteredTechOptions(filtered)
      setShowDropdown(true)
    } else {
      setShowDropdown(false)
    }
  }

  const handleTechSelect = (tech: string) => {
    const id = reverseSkillMap[tech.toLowerCase()];
    if (id && !selectedTechs.some(t => t.id === id)) {
      setSelectedTechs([...selectedTechs, { id, name: tech }]);
    }
    setTechToBeUsed("");
    setShowDropdown(false);
  };
  
  
  const handleAddNewTech = () => {
    if (techToBeUsed && !techOptions.includes(techToBeUsed)) {
      const id = Date.now(); // fallback for frontend-only new techs
      setTechOptions([...techOptions, techToBeUsed]);
      setSelectedTechs([...selectedTechs, { id, name: techToBeUsed }]);
      setTechToBeUsed("");
    }
    setShowDropdown(false);
  };
  


  const handleInterestInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInterestInput(value)

    if (value) {
      const filtered = interestOptions.filter((interest) => interest.toLowerCase().includes(value.toLowerCase()))
      setFilteredInterestOptions(filtered)
      setShowInterestDropdown(true)
    } else {
      setShowInterestDropdown(false)
    }
  }

  const handleInterestSelect = (interest: string) => {
    const id = reverseTopicMap[interest.toLowerCase()];
    if (id && !selectedInterests.some(t => t.id === id)) {
      setSelectedInterests([...selectedInterests, { id, name: interest }]);
    }
    setInterestInput("");
    setShowInterestDropdown(false);
  };
  
  const handleAddNewInterest = () => {
    if (interestInput && !interestOptions.includes(interestInput)) {
      const id = Date.now();
      setInterestOptions([...interestOptions, interestInput]);
      setSelectedInterests([...selectedInterests, { id, name: interestInput }]);
      setInterestInput("");
    }
    setShowInterestDropdown(false);
  };
  

  const handleRemoveTech = (techId: number) => {
    setSelectedTechs(selectedTechs.filter(t => t.id !== techId));
  };
  
  const handleRemoveInterest = (interestId: number) => {
    setSelectedInterests(selectedInterests.filter(t => t.id !== interestId));
  };
  

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      setShowDropdown(false)
      setShowInterestDropdown(false)
    }
  }

  const handleAddMvp = () => {
    if (mvpInput && mvps.length < 6) {
      setMvps([...mvps, mvpInput])
      setMvpInput("")
      if (mvps.length === 5) setShowMvpWarning(true)
    }
  }

  const handleRemoveMvp = (index: number) => {
    setMvps(mvps.filter((_, i) => i !== index))
    if (mvps.length === 6) setShowMvpWarning(false)
  }

  const handleAddStretchGoal = () => {
    if (stretchGoalInput && stretchGoals.length < 6) {
      setStretchGoals([...stretchGoals, stretchGoalInput])
      setStretchGoalInput("")
      if (stretchGoals.length === 5) setShowStretchGoalWarning(true)
    }
  }

  const handleRemoveStretchGoal = (index: number) => {
    setStretchGoals(stretchGoals.filter((_, i) => i !== index))
    if (stretchGoals.length === 6) setShowStretchGoalWarning(false)
  }

  const handleAddFrontend = () => {
    if (frontendInput && frontendTimeline.length < 6) {
      setFrontendTimeline([...frontendTimeline, frontendInput])
      setFrontendInput("")
    }
  }

  const handleRemoveFrontend = (index: number) => {
    setFrontendTimeline(frontendTimeline.filter((_, i) => i !== index))
  }

  const handleAddBackend = () => {
    if (backendInput && backendTimeline.length < 6) {
      setBackendTimeline([...backendTimeline, backendInput])
      setBackendInput("")
    }
  }

  const handleRemoveBackend = (index: number) => {
    setBackendTimeline(backendTimeline.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-blue-900 text-white font-nunito mt-[20px]">
          <NavBar />
      

      {/* Fixed Header */}
      <h2
        style={{
          padding: "5px",
          fontSize: "30px",
          fontWeight: "700",
          textAlign: "center",
          margin: "25px 0",
          position: "sticky",
          top: "0",
          zIndex: 10,
          width: "100%",
          backdropFilter: "blur(10px)",
          paddingTop: "40px",
          paddingBottom: "20px",
          color: "#385773"
        }}>
        Bring your ideas to life!
      </h2>

      {/* Fixed Form Container */}
      <div
        className="translate-y-[-50px] flex justify-center"
        style={{
          width: "800px",
          height: "650px",
          position: "relative",
          zIndex: 10,
          marginTop: "20px",
          marginBottom: "40px",
          padding: "0 20px",
        }}>
        <div
          style={{
            backdropFilter: "blur(16px)",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.1)",
            width: "100%",
            overflow: "scroll",
          }}
        >
          {/* Form Content */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              width: "100%",
              overflow: "scroll",
            }}
          >
            {/* Project Name and Type - Equal Width */}
            <div style={{
              display: "flex",
              gap: "16px",
              width: "100%",
            }}>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="Project Name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(56, 87, 115, 0.1)",
                    color: "#385773",
                    border: "1px solid rgba(56, 87, 115, 0.3)",
                    boxSizing: "border-box",
                  }}
                  
                />
                {formErrors.projectName && (
                  <p style={{ color: "#f87171", fontSize: "14px", marginTop: "4px" }}>
                    Project Name is required.
                  </p>
                )}

              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="Project Type"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(56, 87, 115, 0.1)",
                    color: "#385773",
                    border: "1px solid rgba(56, 87, 115, 0.3)",
                    boxSizing: "border-box",
                  }}
                />
                {formErrors.projectType && (
                  <p style={{ color: "#f87171", fontSize: "14px", marginTop: "4px" }}>
                    Project Type is required.
                  </p>
                )}

              </div>
            </div>

            {/* Tech Stack - Full Width */}
            <div style={{ width: "100%" }}>
              <input
                type="text"
                placeholder="Add Tech"
                value={techToBeUsed}
                onChange={handleTechInputChange}
                onFocus={() => {
                  setFilteredTechOptions(techOptions);
                  setShowDropdown(true);
                }}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(56, 87, 115, 0.1)",
                  color: "#385773",
                  border: "1px solid rgba(56, 87, 115, 0.3)",
                  boxSizing: "border-box",
                }}
              />
              {formErrors.selectedTechs && (
                <p style={{ color: "#f87171", fontSize: "14px", marginTop: "4px" }}>
                  Please select at least one tech
                </p>
              )}

{showDropdown && (
  <div
    ref={techDropdownRef}
    style={{
      marginTop: "8px",
      backgroundColor: "rgba(56, 87, 115, 0.9)",
      borderRadius: "8px",
      padding: "8px",
      width: "100%",
      maxHeight: "150px",
      overflowY: "auto",
    }}
  >
    {filteredTechOptions.map((tech, index) => (
      <div
        key={index}
        onClick={() => handleTechSelect(tech)}
        style={{
          color: "#fff",
          cursor: "pointer",
          padding: "4px 0",
          width: "100%",
        }}
      >
        {tech}
      </div>
    ))}
    {techToBeUsed && !techOptions.includes(techToBeUsed) && (
      <div
        onClick={handleAddNewTech}
        style={{
          color: "#93c5fd",
          cursor: "pointer",
          paddingTop: "4px",
          width: "100%",
        }}
      >
        Add "{techToBeUsed}"
      </div>
    )}
  </div>
)}

              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginTop: "8px",
                width: "100%",
              }}>
                {selectedTechs.map((tech, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "rgba(56, 87, 115, 0.2)",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      color: "#385773",
                      maxWidth: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {tech.name}
                    <span
                      onClick={() => handleRemoveTech(tech.id)}
                      style={{
                        marginLeft: "8px",
                        cursor: "pointer"
                      }}
                    >
                      ×
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interests - Full Width */}
            <div style={{ width: "100%" }}>
            <input
              type="text"
              placeholder="Add Interest"
              value={interestInput}
              onChange={handleInterestInputChange}
              onFocus={() => {
                setFilteredInterestOptions(interestOptions);
                setShowInterestDropdown(true);
              }}
              onKeyDown={handleKeyDown}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: "rgba(56, 87, 115, 0.1)",
                color: "#385773",
                border: "1px solid rgba(56, 87, 115, 0.3)",
                boxSizing: "border-box",
              }}
            />

              {formErrors.selectedInterests && (
                <p style={{ color: "#f87171", fontSize: "14px", marginTop: "4px" }}>
                  Please select at least one interest.
                </p>
              )}

                {showInterestDropdown && (
                  <div
                    ref={interestDropdownRef}
                    style={{
                      marginTop: "8px",
                      backgroundColor: "rgba(56, 87, 115, 0.9)",
                      borderRadius: "8px",
                      padding: "8px",
                      width: "100%",
                      maxHeight: "150px",
                      overflowY: "auto",
                    }}
                  >
                    {filteredInterestOptions.map((interest, index) => (
                      <div
                        key={index}
                        onClick={() => handleInterestSelect(interest)}
                        style={{
                          color: "#fff",
                          cursor: "pointer",
                          padding: "4px 0",
                          width: "100%",
                        }}
                      >
                        {interest}
                      </div>
                    ))}
                    {interestInput && !interestOptions.includes(interestInput) && (
                      <div
                        onClick={handleAddNewInterest}
                        style={{
                          color: "#93c5fd",
                          cursor: "pointer",
                          paddingTop: "4px",
                          width: "100%",
                        }}
                      >
                        Add "{interestInput}"
                      </div>
                    )}
                  </div>
                )}

              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginTop: "8px",
                width: "100%",
              }}>
                {selectedInterests.map((interest, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "rgba(56, 87, 115, 0.2)",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      color: "#385773",
                      maxWidth: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {interest.name}
                    <span
                      onClick={() => handleRemoveInterest(interest.id)}
                      style={{
                        marginLeft: "8px",
                        cursor: "pointer"
                      }}
                    >
                      ×
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description - Taller and Full Width */}
            <div style={{ width: "100%", fontFamily: "'Nunito', sans-serif", }}>
              <textarea
                placeholder="Project Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: "100%",
                  height: "150px",
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(56, 87, 115, 0.1)",
                  color: "#385773",
                  border: "1px solid rgba(56, 87, 115, 0.3)",
                  resize: "none",
                  boxSizing: "border-box",
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "16px",
                }}
              />
              {formErrors.description && (
                <p style={{ color: "#f87171", fontSize: "14px", marginTop: "4px" }}>
                  Please provide a short description
                </p>
              )}

            </div>

            {/* MVPs - Full Width */}
            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="Add MVP"
                  value={mvpInput}
                  onChange={(e) => setMvpInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(56, 87, 115, 0.1)",
                    color: "#385773",
                    border: "1px solid rgba(56, 87, 115, 0.3)",
                    boxSizing: "border-box",
                  }}
                />
                {formErrors.mvps && (
                <p style={{ color: "#f87171", fontSize: "14px", marginTop: "4px" }}>
                  Please add atleast one mvp
                </p>
              )}

                <button
                  type="button"
                  onClick={handleAddMvp}
                  style={{
                    padding: "0 16px",
                    backgroundColor: "#385773",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Add
                </button>
              </div>
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginTop: "8px",
                width: "100%",
              }}>
                {mvps.map((mvp, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "rgba(56, 87, 115, 0.2)",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      color: "#385773",
                      maxWidth: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {mvp}
                    <span
                      onClick={() => handleRemoveMvp(index)}
                      style={{
                        marginLeft: "8px",
                        cursor: "pointer"
                      }}
                    >
                      ×
                    </span>
                  </div>
                ))}
              </div>
              {showMvpWarning && <p style={{ color: "#f87171", marginTop: "4px" }}>Max 6 MVPs allowed</p>}
            </div>

            {/* Stretch Goals - Full Width */}
            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="Add Stretch Goal"
                  value={stretchGoalInput}
                  onChange={(e) => setStretchGoalInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(56, 87, 115, 0.1)",
                    color: "#385773",
                    border: "1px solid rgba(56, 87, 115, 0.3)",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddStretchGoal}
                  style={{
                    padding: "0 16px",
                    backgroundColor: "#385773",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Add
                </button>
              </div>
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginTop: "8px",
                width: "100%",
              }}>
                {stretchGoals.map((goal, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "rgba(56, 87, 115, 0.2)",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      color: "#385773",
                      maxWidth: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {goal}
                    <span
                      onClick={() => handleRemoveStretchGoal(index)}
                      style={{
                        marginLeft: "8px",
                        cursor: "pointer"
                      }}
                    >
                      ×
                    </span>
                  </div>
                ))}
              </div>
              {showStretchGoalWarning && <p style={{ color: "#f87171", marginTop: "4px" }}>Max 6 stretch goals allowed</p>}
            </div>

            {/* Timeline - Frontend and Backend Inputs */}
            <div style={{ width: "100%" }}>
              <label style={{ marginBottom: "12px", fontWeight: "bold", display: "block", color: "#385773" }}>Timeline</label>
              <div style={{ display: "flex", gap: "16px" }}>
                {/* Frontend Timeline */}
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    placeholder="Add Frontend Task"
                    value={frontendInput}
                    onChange={(e) => setFrontendInput(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      backgroundColor: "rgba(56, 87, 115, 0.1)",
                      color: "#385773",
                      border: "1px solid rgba(56, 87, 115, 0.3)",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddFrontend}
                    style={{
                      marginTop: "8px",
                      width: "100%",
                      padding: "8px",
                      backgroundColor: "#385773",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                    }}
                  >
                    Add Frontend Task
                  </button>
                  <div style={{ marginTop: "8px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {frontendTimeline.map((task, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundColor: "rgba(56, 87, 115, 0.2)",
                          padding: "6px 10px",
                          borderRadius: "6px",
                          color: "#385773",
                        }}
                      >
                        {task}
                        <span
                          onClick={() => handleRemoveFrontend(index)}
                          style={{ marginLeft: "8px", cursor: "pointer" }}
                        >
                          ×
                        </span>
                      </div>
                    ))}
                  </div>
                  {frontendTimeline.length === 6 && (
                   <p style={{ color: "#f87171", marginTop: "4px" }}>Max 6 frontend tasks allowed</p>
                 )}
               </div>


               {/* Backend Timeline */}
               <div style={{ flex: 1 }}>
                 <input
                   type="text"
                   placeholder="Add Backend Task"
                   value={backendInput}
                   onChange={(e) => setBackendInput(e.target.value)}
                   style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(56, 87, 115, 0.1)",
                    color: "#385773",
                    border: "1px solid rgba(56, 87, 115, 0.3)",
                    boxSizing: "border-box",
                   }}
                 />
                 <button
                   type="button"
                   onClick={handleAddBackend}
                   style={{
                     marginTop: "8px",
                     width: "100%",
                     padding: "8px",
                     backgroundColor: "#385773",
                     color: "#fff",
                     border: "none",
                     borderRadius: "6px",
                   }}
                 >
                   Add Backend Task
                 </button>
                 <div style={{ marginTop: "8px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                   {backendTimeline.map((task, index) => (
                     <div
                       key={index}
                       style={{
                        backgroundColor: "rgba(56, 87, 115, 0.2)",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        color: "#385773",
                       }}
                     >
                       {task}
                       <span
                         onClick={() => handleRemoveBackend(index)}
                         style={{ marginLeft: "8px", cursor: "pointer" }}
                       >
                         ×
                       </span>
                     </div>
                   ))}
                 </div>
                 {backendTimeline.length === 6 && (
                   <p style={{ color: "#f87171", marginTop: "4px" }}>Max 6 backend tasks allowed</p>
                 )}
               </div>
             </div>
           </div>


           {/* Thumbnail Upload - Full Width */}
      <div className="w-[99%]">
        <label style={{ marginBottom: "8px", display: "block" }}>Upload Project Thumbnail</label>

            {typeof thumbnail === "string" && (thumbnail as string).startsWith("http") && (
              <div style={{ marginBottom: "12px" }}>
                <img
                  src={thumbnail}
                  alt="AI-generated Thumbnail"
                  style={{
                    width: "100%",
                    maxHeight: "350px",
                    objectFit: "fill",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            )}

            {/* Existing upload input */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setThumbnail(file);
              }}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: "rgba(56, 87, 115, 0.1)",
                color: "#385773",
                border: "1px solid rgba(56, 87, 115, 0.3)",
                boxSizing: "border-box",
              }}
            />
          </div>



           {/* Save Button - Full Width */}
           <button
             type="submit"
             style={{
               width: "100%",
               padding: "14px",
               backgroundColor: "#385773",
               color: "#ffffff",
               fontWeight: "bold",
               border: "none",
               borderRadius: "8px",
               cursor: "pointer",
               marginTop: "10px",
             }}
           >
             Save Project
           </button>
         </form>
       </div>
     </div>
   </div>
 );
}