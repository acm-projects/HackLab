"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProjectData } from "../shared/types";

export default function ManualProject() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State to manage the input values
  const [projectName, setProjectName] = useState<string>("");
  const [projectType, setProjectType] = useState<string>("");
  const [techToBeUsed, setTechToBeUsed] = useState<string>("");
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [description, setDescription] = useState<string>("");
  const [mvpInput, setMvpInput] = useState<string>("");
  const [mvps, setMvps] = useState<string[]>([]);
  const [stretchGoalInput, setStretchGoalInput] = useState<string>("");
  const [stretchGoals, setStretchGoals] = useState<string[]>([]);
  const [techOptions, setTechOptions] = useState<string[]>([
    "Java", "Python", "C++", "HTML", "CSS", "JavaScript", "TypeScript", 
    "React", "Angular", "Vue.js", "Node.js", "Express.js", "Django", 
    "Flask", "Spring Boot", "Ruby on Rails", "PHP", "Laravel", "Swift", 
    "Kotlin", "Go", "Rust", "SQL", "MongoDB", "PostgreSQL", "Firebase", 
    "AWS", "Docker", "Kubernetes", "Git", "GraphQL", "REST API", 
    "Tailwind CSS", "Bootstrap", "SASS", "LESS", "Webpack", "Babel", 
    "Jest", "Cypress", "Selenium", "TensorFlow", "PyTorch", "Pandas", 
    "NumPy", "Unity", "Unreal Engine"
  ]);
  const [filteredTechOptions, setFilteredTechOptions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showMvpWarning, setShowMvpWarning] = useState<boolean>(false);
  const [showStretchGoalWarning, setShowStretchGoalWarning] = useState<boolean>(false);

  // Load data if coming from review page
  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const data: ProjectData = JSON.parse(decodeURIComponent(dataParam));
        setProjectName(data.projectName);
        setProjectType(data.projectType);
        setSelectedTechs(data.techToBeUsed);
        setDescription(data.description);
        setMvps(data.mvps);
        setStretchGoals(data.stretchGoals);
      } catch (error) {
        console.error('Error parsing project data:', error);
      }
    }
  }, [searchParams]);

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Basic validation
    if (!projectName || !projectType || selectedTechs.length === 0) {
      alert('Please fill in all required fields');
      return;
    }
  
    const projectData: ProjectData = {
      id: Date.now(),
      projectName,
      projectType,
      techToBeUsed: selectedTechs,
      description,
      mvps,
      stretchGoals,
    };
    
    // Changed from '/review' to '/reviewPage' to match your folder name
    router.push(`/reviewPage?data=${encodeURIComponent(JSON.stringify(projectData))}`);
  };

  // Rest of your existing functions remain the same...
  const handleTechInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTechToBeUsed(value);

    if (value) {
      const filtered = techOptions.filter((tech) =>
        tech.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTechOptions(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleTechSelect = (tech: string) => {
    if (!selectedTechs.includes(tech)) {
      setSelectedTechs([...selectedTechs, tech]);
    }
    setTechToBeUsed("");
    setShowDropdown(false);
  };

  const handleAddNewTech = () => {
    if (techToBeUsed && !techOptions.includes(techToBeUsed)) {
      setTechOptions([...techOptions, techToBeUsed]);
      setSelectedTechs([...selectedTechs, techToBeUsed]);
      setTechToBeUsed("");
    }
    setShowDropdown(false);
  };

  const handleRemoveTech = (tech: string) => {
    setSelectedTechs(selectedTechs.filter((t) => t !== tech));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setShowDropdown(false);
    }
  };

  const handleAddMvp = () => {
    if (mvpInput && mvps.length < 6) {
      setMvps([...mvps, mvpInput]);
      setMvpInput("");
      if (mvps.length === 5) {
        setShowMvpWarning(true);
      }
    }
  };

  const handleRemoveMvp = (index: number) => {
    setMvps(mvps.filter((_, i) => i !== index));
    if (mvps.length === 6) {
      setShowMvpWarning(false);
    }
  };

  const handleAddStretchGoal = () => {
    if (stretchGoalInput && stretchGoals.length < 6) {
      setStretchGoals([...stretchGoals, stretchGoalInput]);
      setStretchGoalInput("");
      if (stretchGoals.length === 5) {
        setShowStretchGoalWarning(true);
      }
    }
  };

  const handleRemoveStretchGoal = (index: number) => {
    setStretchGoals(stretchGoals.filter((_, i) => i !== index));
    if (stretchGoals.length === 6) {
      setShowStretchGoalWarning(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-blue-900 text-white font-nunito overflow-hidden">
      <h2 className="py-[10px] text-[30px] sticky bg-blue-900 z-10 w-full text-center">
        BRING YOUR IDEAS TO LIFE!
      </h2>

      <div className="w-[90%] max-w-[780px] mt-[0px]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-end justify-start space-y-6 pb-8"
        >
          {/* Container for PROJECT NAME and PROJECT TYPE */}
          <div className="flex flex-row justify-between w-full">
            {/* PROJECT NAME */}
            <div className="flex flex-col w-[48%]">
              <p className="text-white mb-2">PROJECT NAME</p>
              <div className="bg-[#D9D9D9] text-[#000000] border border-[#D9D9D9] hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-nunito rounded-[10px] text-md px-[10px] py-[10px] -ml-[4px] text-center flex items-center justify-start w-full">
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="ex: hacklab"
                  className="bg-transparent border-none focus:outline-none w-full text-[#385773] rounded-[10px]"
                  required
                />
              </div>
            </div>

            {/* PROJECT TYPE */}
            <div className="flex flex-col w-[48%]">
              <p className="text-white mb-2">PROJECT TYPE</p>
              <div className="bg-[#D9D9D9] text-[#000000] border border-[#D9D9D9] hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-nunito rounded-[10px] text-md px-[10px] py-[10px] -ml-[4px] text-center flex items-center justify-start w-full">
                <input
                  type="text"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  placeholder="ex: game"
                  className="bg-transparent border-none focus:outline-none w-full text-[#385773] rounded-[10px]"
                  required
                />
              </div>
            </div>
          </div>

          {/* TECH TO BE USED */}
          <div className="flex flex-col w-full">
            <p className="text-white mb-2">TECH TO BE USED</p>
            <div className="relative">
              <div className="bg-[#D9D9D9] text-[#000000] border border-[#D9D9D9] hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-nunito rounded-[10px] text-md px-[10px] py-[10px] -ml-[4px] text-center flex items-center justify-start w-full">
                <input
                  type="text"
                  value={techToBeUsed}
                  onChange={handleTechInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="ex: React, Node.js"
                  className="bg-transparent border-none focus:outline-none w-full text-[#385773] rounded-[10px]"
                />
              </div>
              {showDropdown && (
                <div className="absolute z-10 mt-2 w-full bg-[#385773] text-[#fff] border border-gray-300 rounded-[5px] shadow-lg">
                  {filteredTechOptions.map((tech, index) => (
                    <div
                      key={index}
                      className="px-[10px] py-[5px] hover:bg-gray-700 cursor-pointer text-white"
                      onClick={() => handleTechSelect(tech)}
                    >
                      {tech}
                    </div>
                  ))}
                  {techToBeUsed && !techOptions.includes(techToBeUsed) && (
                    <div
                      className="px-[10px] py-[5px] hover:bg-gray-700 cursor-pointer text-blue-500"
                      onClick={handleAddNewTech}
                    >
                      Add "{techToBeUsed}"
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-[10px] mt-2 py-[10px] justify-start ">
              {selectedTechs.map((tech, index) => (
                <div
                  key={index}
                  className="bg-[#385773] text-[#fff] px-[10px] py-[7px] rounded-[5px] flex items-center gap-[2px] text-[12px]"
                >
                  {tech} &nbsp;
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(tech)}
                    className="text-[#000] hover:text-[#4b4b4b]"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="flex flex-col w-full">
            <p className="text-white mb-2">DESCRIPTION</p>
            <div className="bg-[#D9D9D9] text-[#000000] border border-[#D9D9D9] hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-nunito rounded-[10px] text-md px-[10px] py-[10px] -ml-[4px] text-center flex items-center justify-start w-full">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a detailed description of your project..."
                className="bg-transparent border-none focus:outline-none w-full text-[#385773] resize-none rounded-[10px]"
                rows={4}
              />
            </div>
          </div>

          {/* MVP's */}
          <div className="flex flex-col w-full">
            <p className="text-white mb-2">MVP's</p>
            <div className="bg-[#D9D9D9] text-[#000000] border border-[#D9D9D9] hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-nunito rounded-[10px] text-md px-[10px] py-[10px] -ml-[4px] text-center flex items-center justify-start w-full">
              <input
                type="text"
                value={mvpInput}
                onChange={(e) => setMvpInput(e.target.value)}
                placeholder="Enter an MVP..."
                className="bg-transparent border-none focus:outline-none w-full text-[#385773] rounded-[10px]"
              />
              <button
                type="button"
                onClick={handleAddMvp}
                disabled={mvps.length >= 6}
                className="text-[#385773] hover:text-[#4b4b4b]"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-[10px] mt-2 py-[10px] justify-start ">
              {mvps.map((mvp, index) => (
                <div
                  key={index}
                  className="bg-[#385773] text-[#fff] px-[10px] py-[7px] rounded-[5px] flex items-center gap-[2px] text-[12px]"
                >
                  {mvp} &nbsp;
                  <button
                    type="button"
                    onClick={() => handleRemoveMvp(index)}
                    className="text-[#000] hover:text-[#4b4b4b]"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {showMvpWarning && (
              <p className="text-red-500 text-sm mt-2">
                You have reached the maximum number of MVPs (6).
              </p>
            )}
          </div>

          {/* Stretch Goals */}
          <div className="flex flex-col w-full">
            <p className="text-white mb-2">STRETCH GOALS</p>
            <div className="bg-[#D9D9D9] text-[#000000] border border-[#D9D9D9] hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-nunito rounded-[10px] text-md px-[10px] py-[10px] -ml-[4px] text-center flex items-center justify-start w-full">
              <input
                type="text"
                value={stretchGoalInput}
                onChange={(e) => setStretchGoalInput(e.target.value)}
                placeholder="Enter a stretch goal..."
                className="bg-transparent border-none focus:outline-none w-full text-[#385773] rounded-[10px]"
              />
              <button
                type="button"
                onClick={handleAddStretchGoal}
                disabled={stretchGoals.length >= 6}
                className="text-[#385773] hover:text-[#4b4b4b]"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-[10px] mt-2 py-[10px] justify-start ">
              {stretchGoals.map((goal, index) => (
                <div
                  key={index}
                  className="bg-[#385773] text-[#fff] px-[10px] py-[7px] rounded-[5px] flex items-center gap-[2px] text-[12px]"
                >
                  {goal} &nbsp;
                  <button
                    type="button"
                    onClick={() => handleRemoveStretchGoal(index)}
                    className="text-[#000] hover:text-[#4b4b4b]"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {showStretchGoalWarning && (
              <p className="text-red-500 text-sm mt-2">
                You have reached the maximum number of Stretch Goals (6).
              </p>
            )}
          </div>

          {/* Save Button */}
          <button 
            type="submit" 
            className="mt-[20px] p-[10px] bg-[#fff] text-[#000] rounded-[10px] border-[#000] hover:bg-gray-200 transition-colors"
          >
            Save Project
          </button>
        </form>
      </div>
    </div>
  );
}