"use client";
import React, { useState } from "react";
import NavBar from "../components/NavBar";

export default function ManualProject() {
  // State to manage the input values
  const [projectName, setProjectName] = useState<string>("");
  const [projectType, setProjectType] = useState<string>("");
  const [techToBeUsed, setTechToBeUsed] = useState<string>("");
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [description, setDescription] = useState<string>("");
  const [mvpInput, setMvpInput] = useState<string>(""); // Input for MVP's
  const [mvps, setMvps] = useState<string[]>([]); // List of MVP's
  const [stretchGoalInput, setStretchGoalInput] = useState<string>(""); // Input for Stretch Goals
  const [stretchGoals, setStretchGoals] = useState<string[]>([]); // List of Stretch Goals
  const [techOptions, setTechOptions] = useState<string[]>([
    "Java",
    "Python",
    "C++",
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "React",
    "Angular",
    "Vue.js",
    "Node.js",
    "Express.js",
    "Django",
    "Flask",
    "Spring Boot",
    "Ruby on Rails",
    "PHP",
    "Laravel",
    "Swift",
    "Kotlin",
    "Go",
    "Rust",
    "SQL",
    "MongoDB",
    "PostgreSQL",
    "Firebase",
    "AWS",
    "Docker",
    "Kubernetes",
    "Git",
    "GraphQL",
    "REST API",
    "Tailwind CSS",
    "Bootstrap",
    "SASS",
    "LESS",
    "Webpack",
    "Babel",
    "Jest",
    "Cypress",
    "Selenium",
    "TensorFlow",
    "PyTorch",
    "Pandas",
    "NumPy",
    "Unity",
    "Unreal Engine",
  ]);
  const [filteredTechOptions, setFilteredTechOptions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showMvpWarning, setShowMvpWarning] = useState<boolean>(false); // State for MVP warning
  const [showStretchGoalWarning, setShowStretchGoalWarning] = useState<boolean>(false); // State for Stretch Goal warning

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const projectData = {
      id: Date.now(), // Generate a unique ID (using timestamp for simplicity)
      projectName,
      projectType,
      techToBeUsed: selectedTechs, // Use selectedTechs instead of techToBeUsed
      description,
      mvps, // Include MVP's in the submitted data
      stretchGoals, // Include Stretch Goals in the submitted data
    };
    console.log(projectData); // You can replace this with your logic to store the data
  };

  // Function to handle tech input changes
  const handleTechInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTechToBeUsed(value);

    // Filter options based on input (case-insensitive)
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

  // Function to handle tech selection from dropdown
  const handleTechSelect = (tech: string) => {
    if (!selectedTechs.includes(tech)) {
      setSelectedTechs([...selectedTechs, tech]); // Add the selected tech to the list
    }
    setTechToBeUsed(""); // Clear the input after selection
    setShowDropdown(false);
  };

  // Function to add a new tech option
  const handleAddNewTech = () => {
    if (techToBeUsed && !techOptions.includes(techToBeUsed)) {
      setTechOptions([...techOptions, techToBeUsed]); // Add the new tech to the options list
      setSelectedTechs([...selectedTechs, techToBeUsed]); // Add the new tech to the selected list
      setTechToBeUsed(""); // Clear the input after adding
    }
    setShowDropdown(false);
  };

  // Function to remove a selected tech
  const handleRemoveTech = (tech: string) => {
    setSelectedTechs(selectedTechs.filter((t) => t !== tech));
  };

  // Function to handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      setShowDropdown(false); // Close the dropdown
    }
  };

  // Function to add an MVP
  const handleAddMvp = () => {
    if (mvpInput && mvps.length < 6) {
      setMvps([...mvps, mvpInput]); // Add the MVP to the list
      setMvpInput(""); // Clear the input after adding
      if (mvps.length === 5) {
        setShowMvpWarning(true); // Show warning after adding the 6th MVP
      }
    }
  };

  // Function to remove an MVP
  const handleRemoveMvp = (index: number) => {
    setMvps(mvps.filter((_, i) => i !== index)); // Remove the MVP at the specified index
    if (mvps.length === 6) {
      setShowMvpWarning(false); // Hide warning if an MVP is removed
    }
  };

  // Function to add a Stretch Goal
  const handleAddStretchGoal = () => {
    if (stretchGoalInput && stretchGoals.length < 6) {
      setStretchGoals([...stretchGoals, stretchGoalInput]); // Add the Stretch Goal to the list
      setStretchGoalInput(""); // Clear the input after adding
      if (stretchGoals.length === 5) {
        setShowStretchGoalWarning(true); // Show warning after adding the 6th Stretch Goal
      }
    }
  };

  // Function to remove a Stretch Goal
  const handleRemoveStretchGoal = (index: number) => {
    setStretchGoals(stretchGoals.filter((_, i) => i !== index)); // Remove the Stretch Goal at the specified index
    if (stretchGoals.length === 6) {
      setShowStretchGoalWarning(false); // Hide warning if a Stretch Goal is removed
    }
  };

  return (
    <div className="h-screen flex flex-col items-center bg-blue-900 text-white font-nunito overflow-hidden">
      {/* Fixed Heading */}
      <NavBar />
      <h2 className="py-[40px] text-[30px] sticky top-0 bg-blue-900 z-10 w-full text-center">
        BRING YOUR IDEAS TO LIFE!
      </h2>

      {/* Scrollable Form */}
      <form
        onSubmit={handleSubmit}
        className="w-[90%] max-w-[780px] flex flex-col items-end justify-start space-y-6 pb-8 overflow-y-auto flex-grow"
        style={{ maxHeight: "calc(100vh - 200px)" }} // Adjust height based on screen size
      >
        {/* Container for PROJECT NAME and PROJECT TYPE */}
        <div className="flex flex-row justify-between w-full">
          {/* PROJECT NAME */}
          <div className="flex flex-col w-[48%]">
            <p className="text-white mb-2">PROJECT NAME</p>
            <div className="bg-[#D9D9D9] text-[#000000] border border-[#D9D9D9] hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-nunito rounded-[10px] text-md px-[10px] py-[10px] -ml-[4px] text-center flex items-center justify-start w-[345px]">
              <input
                type="text"
                value={projectName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectName(e.target.value)}
                placeholder="ex: hacklab"
                className="bg-transparent border-none focus:outline-none w-full text-[#385773]"
              />
            </div>
          </div>

          {/* PROJECT TYPE */}
          <div className="flex flex-col w-[48%]">
            <p className="text-white mb-2">PROJECT TYPE</p>
            <div className="bg-[#D9D9D9] text-[#000000] border border-[#D9D9D9] hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-nunito rounded-[5px] text-md px-[10px] py-[10px] -ml-[4px] text-center flex items-center justify-start w-[345px]">
              <input
                type="text"
                value={projectType}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectType(e.target.value)}
                placeholder="ex: game"
                className="bg-transparent border-none focus:outline-none w-full text-[#385773]"
              />
            </div>
          </div>
        </div>

        {/* TECH TO BE USED */}
        <div className="flex flex-col w-full">
          <p className="text-white mb-2">TECH TO BE USED</p>
          <div className="relative">
            <div className="bg-[#D9D9D9] text-[#000000] border border-[#D9D9D9] hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-nunito rounded-[5px] text-md px-[10px] py-[10px] -ml-[4px] text-center flex items-center justify-start w-[750px]">
              <input
                type="text"
                value={techToBeUsed}
                onChange={handleTechInputChange}
                onKeyDown={handleKeyDown}
                placeholder="ex: React, Node.js"
                className="bg-transparent border-none focus:outline-none w-full text-[#385773]"
              />
            </div>
            {/* Dropdown for tech options */}
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
                {/* Option to add new tech */}
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

          {/* Display selected techs as tags */}
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
          <div className="bg-[#D9D9D9] text-[#000000] border border-[#D9D9D9] hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-nunito rounded-[5px] text-md px-[10px] py-[10px] -ml-[4px] text-center flex items-center justify-start w-[750px]">
            <textarea
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              placeholder="Enter a detailed description of your project..."
              className="bg-transparent border-none focus:outline-none w-full text-[#385773] resize-none"
              rows={4} // Adjust the number of rows as needed
            />
          </div>
        </div>

        {/* MVP's */}
        <div className="flex flex-col w-full">
          <p className="text-white mb-2">MVP's</p>
          <div className="bg-[#D9D9D9] text-[#000000] border border-[#D9D9D9] hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-nunito rounded-[5px] text-md px-[10px] py-[10px] -ml-[4px] text-center flex items-center justify-start w-[750px]">
            <input
              type="text"
              value={mvpInput}
              onChange={(e) => setMvpInput(e.target.value)}
              placeholder="Enter an MVP..."
              className="bg-transparent border-none focus:outline-none w-full text-[#385773]"
            />
            <button
              type="button"
              onClick={handleAddMvp}
              disabled={mvps.length >= 6} // Disable if 6 MVP's are added
              className="text-[#385773] hover:text-[#4b4b4b]"
            >
              Add
            </button>
          </div>
          {/* Display MVP's as tags */}
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
          {/* Show warning if MVP limit is reached */}
          {showMvpWarning && (
            <p className="text-red-500 text-sm mt-2">
              You have reached the maximum number of MVPs (6).
            </p>
          )}
        </div>

        {/* Stretch Goals */}
        <div className="flex flex-col w-full">
          <p className="text-white mb-2">STRETCH GOALS</p>
          <div className="bg-[#D9D9D9] text-[#000000] border border-[#D9D9D9] hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-nunito rounded-[5px] text-md px-[10px] py-[10px] -ml-[4px] text-center flex items-center justify-start w-[750px]">
            <input
              type="text"
              value={stretchGoalInput}
              onChange={(e) => setStretchGoalInput(e.target.value)}
              placeholder="Enter a stretch goal..."
              className="bg-transparent border-none focus:outline-none w-full text-[#385773]"
            />
            <button
              type="button"
              onClick={handleAddStretchGoal}
              disabled={stretchGoals.length >= 6} // Disable if 6 Stretch Goals are added
              className="text-[#385773] hover:text-[#4b4b4b]"
            >
              Add
            </button>
          </div>
          {/* Display Stretch Goals as tags */}
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
          {/* Show warning if Stretch Goal limit is reached */}
          {showStretchGoalWarning && (
            <p className="text-red-500 text-sm mt-2">
              You have reached the maximum number of Stretch Goals (6).
            </p>
          )}
        </div>

        {/* Save Button */}
        <button type="submit" className="mt-[20px] p-[10px] bg-[#fff] text-[#000] rounded-[5px] border-[#000]">
          Save Project
        </button>
      </form>
    </div>
  );
}