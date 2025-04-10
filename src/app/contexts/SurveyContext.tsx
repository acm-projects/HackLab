"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface Topic {
  id: number;
  topic: string;
}

interface Skill {
  id: number;
  skill: string;
}

interface SurveyData {
  name: string;
  selectedSkills: Skill[];
  selectedTopics: string[];
  selectedRole: string | null;
  setName: (name: string) => void;
  setSelectedSkills: (skills: Skill[]) => void;
  setSelectedTopics: (topics: string[]) => void;
  setSelectedRole: (role: string | null) => void;
}

const SurveyContext = createContext<SurveyData | undefined>(undefined);

export const SurveyProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  return (
    <SurveyContext.Provider
      value={{
        name,
        selectedSkills,
        selectedTopics,
        selectedRole,
        setName,
        setSelectedSkills,
        setSelectedTopics,
        setSelectedRole,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) throw new Error("useSurvey must be used within SurveyProvider");
  return context;
};
