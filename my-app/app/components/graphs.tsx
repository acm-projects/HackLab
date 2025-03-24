"use client";
import React from "react";
import {
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend
} from "recharts";

const projectData = [
  { name: "HackLab", projects: 6 },
  { name: "Todo List", projects: 3 },
  { name: "Macro+", projects: 4 },
];

const languageData = [
  { name: "React", count: 5 },
  { name: "Java", count: 6 },
  { name: "Python", count: 4 },
  { name: "C++", count: 3 },
  { name: "JavaScript", count: 5 },
];

const sortedLanguageData = [...languageData]
  .sort((a, b) => b.count - a.count)
  .map((lang, index) => ({ ...lang, rank: index + 1 }));

const projectColors = ["#C0D5DC", "#385773", "#6B89A7"];
const radarColor = "#385773";

const CustomRadarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border rounded shadow p-2 text-sm">
        <p className="font-bold">{`${data.rank}. ${data.name}`}</p>
        <p>{`Projects: ${data.count}`}</p>
      </div>
    );
  }
  return null;
};

const Graphs: React.FC = () => {
  return (
    <div className="flex justify-between gap-6 w-full bg-white p-6 rounded-lg shadow">
      {/* Top Projects */}
      <div className="flex-1 text-center min-w-[300px]">
        <h3 className="font-bold text-gray-800 mb-4">Top Projects</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={projectData}>
            <XAxis dataKey="name" />
            <Tooltip />
            <Bar dataKey="projects">
              {projectData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={projectColors[index % projectColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Languages */}
      <div className="flex-1 text-center min-w-[300px]">
        <h3 className="font-bold text-gray-800 mb-4">Top Languages</h3>
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={sortedLanguageData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={30} domain={[0, 10]} />
            <Radar name="Languages" dataKey="count" stroke={radarColor} fill={radarColor} fillOpacity={0.6} />
            <Tooltip content={<CustomRadarTooltip />} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Graphs;