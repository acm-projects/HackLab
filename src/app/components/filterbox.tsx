import React, { useState, useEffect, useRef } from "react";
//changes made april 7
interface FilterBoxProps {
  onClose: () => void;
  onApply: (filters: any) => void;
}

export default function FilterBox({ onClose, onApply }: FilterBoxProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [skillsRes, topicsRes, rolesRes] = await Promise.all([
          fetch("http://52.15.58.198:3000/skills"),
          fetch("http://52.15.58.198:3000/topics"),
          fetch("http://52.15.58.198:3000/roles"),
        ]);

        const [skillsData, topicsData, rolesData] = await Promise.all([
          skillsRes.json(),
          topicsRes.json(),
          rolesRes.json(),
        ]);

        setSkills(skillsData.map((s: any) => s.skill).filter(Boolean));
        setTopics(topicsData.map((t: any) => t.topic).filter(Boolean));
        setRoles(rolesData.map((r: any) => r.role).filter(Boolean));
      } catch (error) {
        console.error("Failed to fetch filter data", error);
      }
    };

    fetchFilterData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        onClose(); // Close the box if click is outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleCheckboxChange = (
    value: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const handleApply = () => {
    onApply({
      topics: selectedTopics,
      skills: selectedSkills,
      roles: selectedRoles,
    });
  };

  return (
    <div 
      ref={boxRef}
      className="absolute top-[50px] right-[-222px] w-[280px] max-h-[300px] z-50 px-[10px] py-[10px] rounded-[8px] shadow-xl border px-4 py-5 overflow-y-auto ml-[50px] "
      style={{ backgroundColor: "#ffffff", color: "#000000", borderColor: "#d1d5db", boxShadow: "0px 0px 5px 3px rgba(0,0,0,0.6)"}}
    >
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search tags"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-[90%] mb-[5px] px-[5px] py-[5px] text-[13px] border border-gray-300 rounded-[6px] outline-none focus:ring-1 focus:ring-[#385773]"
        style={{ color: "#1f2937" }}
      />

      {/* Topics */}
      <div className="mb-4">
        <label className="text-[14px] font-bold mb-2 block text-[#000000] pb-[6px] pt-[10px]">
          Topics
        </label>
        <div className="grid grid-cols-2 gap-y-[6px] pl-1 gap-x-[20px]">
          {topics
            .filter((topic) => topic.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((topic, i) => (
              <label key={i} className="flex items-center text-[13px] gap-2 text-[#1f2937]">
                <input
                  type="checkbox"
                  checked={selectedTopics.includes(topic)}
                  onChange={() =>
                    handleCheckboxChange(topic, selectedTopics, setSelectedTopics)
                  }
                />
                {topic}
              </label>
            ))}
        </div>
      </div>

      <hr className="border-t border-[#e5e7eb] my-[10px]" />

      {/* Skills */}
      <div className="mb-4">
        <label className="text-[14px] font-bold mb-2 block text-[#000000] pb-[6px]">
          Skills
        </label>
        <div className="grid grid-cols-2 gap-y-[6px] pl-1 gap-x-[20px]">
          {skills
            .filter((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((skill, i) => (
              <label key={i} className="flex items-center text-[13px] gap-2 text-[#1f2937]">
                <input
                  type="checkbox"
                  checked={selectedSkills.includes(skill)}
                  onChange={() =>
                    handleCheckboxChange(skill, selectedSkills, setSelectedSkills)
                  }
                />
                {skill}
              </label>
            ))}
        </div>
      </div>

      <hr className="border-t border-[#e5e7eb] my-[10px]" />

      {/* Roles */}
      <div className="mb-4">
        <label className="text-[14px] font-bold mb-2 block text-[#000000] pb-[6px]">
          Roles
        </label>
        <div className="grid grid-cols-2 gap-y-[6px] pl-1 gap-x-[20px]">
          {roles
            .filter((role) => role.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((role, i) => (
              <label key={i} className="flex items-center text-[13px] gap-2 text-[#1f2937]">
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role)}
                  onChange={() =>
                    handleCheckboxChange(role, selectedRoles, setSelectedRoles)
                  }
                />
                {role}
              </label>
            ))}
        </div>
      </div>

      {/* Buttons */}
            <div className="flex justify-end gap-[5px] pt-[2px]">
        <button
          onClick={() => {
            setSelectedTopics([]);
            setSelectedSkills([]);
            setSelectedRoles([]);
            setSearchQuery("");
          }}
          className="text-[12px] px-[5]x py-[5px] rounded-[5px] border-transparent border-none outline-none"
          style={{ backgroundColor: "#e5e7eb", color: "#000000"}}
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          className="text-[12px] px-[5px] py-[5px] rounded-[5px] border-none outline-none"
          style={{ backgroundColor: "#385773", color: "#ffffff" }}
        >
          Apply
        </button>
      </div>
    </div>
  );
}
