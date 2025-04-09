import React, { useState, useEffect, useRef } from "react";

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
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const toggleSelection = (
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
      style={{
        position: 'absolute',
        top: '50px',
        right: '-255px',
        width: '300px',
        maxHeight: '400px',
        zIndex: 50,
        borderRadius: '8px',
        boxShadow: '0px 0px 5px 3px rgba(0,0,0,0.1)',
        backgroundColor: '#ffffff',
        color: '#000000',
        border: '1px solid #d1d5db',
        overflowY: 'auto',
        marginLeft: '50px',
        padding: '16px'
      }}
    >
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search tags..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          width: '90%',
          marginBottom: '16px',
          padding: '8px 12px',
          fontSize: '14px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          outline: 'none',
          color: '#1f2937'
        }}
      />

      {/* Topics - Single Column */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: 700,
          marginBottom: '12px',
          color: '#000000'
        }}>
          Topics
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {topics
            .filter((topic) => topic.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((topic, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={() => toggleSelection(topic, selectedTopics, setSelectedTopics)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: '1px solid',
                    marginRight: '8px',
                    transition: 'all 0.2s',
                    backgroundColor: '#ffffff',
                    borderColor: selectedTopics.includes(topic) ? '#3b82f6' : '#d1d5db',
                    outline: 'none',
                    position: 'relative'
                  }}
                >
                  {selectedTopics.includes(topic) && (
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#3b82f6',
                      position: 'absolute'
                    }}></div>
                  )}
                </button>
                <label 
                  onClick={() => toggleSelection(topic, selectedTopics, setSelectedTopics)}
                  style={{
                    fontSize: '14px',
                    color: '#1f2937',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  {topic}
                </label>
              </div>
            ))}
        </div>
      </div>

      <hr style={{ borderTop: '1px solid #e5e7eb', margin: '16px 0' }} />

      {/* Skills - Two Columns */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: 700,
          marginBottom: '12px',
          color: '#000000'
        }}>
          Skills
        </h3>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px 16px'
        }}>
          {skills
            .filter((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((skill, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={() => toggleSelection(skill, selectedSkills, setSelectedSkills)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: '1px solid',
                    marginRight: '8px',
                    transition: 'all 0.2s',
                    backgroundColor: '#ffffff',
                    borderColor: selectedSkills.includes(skill) ? '#3b82f6' : '#d1d5db',
                    outline: 'none',
                    position: 'relative'
                  }}
                >
                  {selectedSkills.includes(skill) && (
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#3b82f6',
                      position: 'absolute'
                    }}></div>
                  )}
                </button>
                <label 
                  onClick={() => toggleSelection(skill, selectedSkills, setSelectedSkills)}
                  style={{
                    fontSize: '14px',
                    color: '#1f2937',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {skill}
                </label>
              </div>
            ))}
        </div>
      </div>

      <hr style={{ borderTop: '1px solid #e5e7eb', margin: '16px 0' }} />

      {/* Roles - Two Columns */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: 700,
          marginBottom: '12px',
          color: '#000000'
        }}>
          Roles
        </h3>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px 16px'
        }}>
          {roles
            .filter((role) => role.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((role, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={() => toggleSelection(role, selectedRoles, setSelectedRoles)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: '1px solid',
                    marginRight: '8px',
                    transition: 'all 0.2s',
                    backgroundColor: '#ffffff',
                    borderColor: selectedRoles.includes(role) ? '#3b82f6' : '#d1d5db',
                    outline: 'none',
                    position: 'relative'
                  }}
                >
                  {selectedRoles.includes(role) && (
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#3b82f6',
                      position: 'absolute'
                    }}></div>
                  )}
                </button>
                <label 
                  onClick={() => toggleSelection(role, selectedRoles, setSelectedRoles)}
                  style={{
                    fontSize: '14px',
                    color: '#1f2937',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {role}
                </label>
              </div>
            ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        paddingTop: '16px'
      }}>
        <button
          onClick={() => {
            setSelectedTopics([]);
            setSelectedSkills([]);
            setSelectedRoles([]);
            setSearchQuery("");
          }}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151',
            backgroundColor: '#f3f4f6',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#ffffff',
            backgroundColor: '#385773',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2c4560'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#385773'}
        >
          Apply
        </button>
      </div>
    </div>
  );
}