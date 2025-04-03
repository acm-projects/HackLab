"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
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
      <div className="bg-[#ffffff] border border-[#d1d5db] rounded-[6px] shadow p-[8px] text-[14px]">
        <p className="font-[600] text-[#111827]">{`${data.rank}. ${data.name}`}</p>
        <p className="text-[#374151]">{`Projects: ${data.count}`}</p>
      </div>
    );
  }
  return null;
};

const Graphs: React.FC = () => {
  return (
    <div className="flex justify-between gap-[24px] w-[1000px] h-[200px] bg-[#ffffff] p-[24px] rounded-[10px] shadow border border-[#c1c1c1]">
      {/* Top Projects */}
      <div className="flex-1 text-center min-w-[300px]">
        <h3 className="font-[700] text-[#1f2937] text-[16px] mb-[40px] mt-[-15]">Top Projects</h3>
        <ResponsiveContainer width="100%" height={150}>
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
        <h3 className="font-[700] text-[#1f2937] text-[16px] mb-[16px] mt-[-15px]">Top Languages</h3>
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={sortedLanguageData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <Radar
              name="Languages"
              dataKey="count"
              stroke={radarColor}
              fill={radarColor}
              fillOpacity={0.6}
            />
            <Tooltip content={<CustomRadarTooltip />} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Graphs;
