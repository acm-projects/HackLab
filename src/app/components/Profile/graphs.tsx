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
  Legend,
} from "recharts";

interface GraphsProps {
  topProjects: { title: string; likes: number }[];
  topLanguages?: { name: string; count: number }[];
}

const projectColors = ["#C0D5DC", "#385773", "#6B89A7"];
const radarColor = "#385773";
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const CustomRadarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#ffffff] border border-[#d1d5db] rounded-[8px] shadow-md px-[12px] py-[10px] text-[13px] text-[#111827]">
       <p className="font-[600] mb-[4px]">{`${data.rank}. ${capitalize(data.name)}`}</p>
        <p className="text-[#374151]">{`Projects: ${data.count}`}</p>
      </div>
    );
  }
  return null;
};

const Graphs: React.FC<GraphsProps> = ({ topProjects, topLanguages }) => {
  const chartData = topProjects.map((project) => ({
    name: project.title,
    likes: project.likes,
  }));

  const sortedLanguageData = (topLanguages ?? [])
    .sort((a, b) => b.count - a.count)
    .map((lang, index) => ({
      ...lang,
      rank: index + 1,
    }));

  return (
    <div className="flex justify-between gap-[24px] w-[1000px] h-[200px] bg-[#fff] p-[24px] rounded-[10px] shadow border border-[#c1c1c1]">
      {/* Top Completed Projects */}
      <div className="flex-1 text-center min-w-[300px]">
        <h3 className="font-bold text-gray-800 text-[16px] mb-[40px] mt-[-15px]">
          Top Projects
        </h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <Tooltip />
              <Bar dataKey="likes">
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={projectColors[index % projectColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-sm mt-[20px]">
            No completed projects to show yet.
          </p>
        )}
      </div>

      {/* Top Languages */}
      <div className="flex-1 text-center min-w-[300px]">
        <h3 className="font-bold text-gray-800 text-[16px] mb-[16px] mt-[-15px]">
          Top Languages
        </h3>
        {sortedLanguageData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={sortedLanguageData}>
              <PolarGrid />
              <PolarAngleAxis
              dataKey="name"
              tickFormatter={(name) =>
                name.charAt(0).toUpperCase() + name.slice(1)
              }
            />
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
        ) : (
          <p className="text-gray-500 text-sm mt-[20px]">
            No language data to show yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Graphs;
