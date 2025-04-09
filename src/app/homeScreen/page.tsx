"use client";
import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import ProjectCard from "../components/TopProjectCard";
import ExpandedProjectModal from "../components/ExpandedProjectCard";
import { useSession } from "next-auth/react";
interface Project {
  id: number;
  title: string;
  groupLeader: {
    name: string;
    image: string;
  };
  likes: number;
  image: string;
  isLiked: boolean;
  isBookmarked: boolean;
  description: string;
  tech: string[];
  members: string[];
  totalMembers: number;
}

export default function HomeScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [mostUsedTech, setMostUsedTech] = useState<string>("");
  const { data: session } = useSession();
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://52.15.58.198:3000/projects");
        const projects = await res.json();

        let allTechs: string[] = [];
        let totalUserCount = 0;

        const projectsWithUsers = await Promise.all(
          projects.map(async (project: any) => {
            let membersData: any[] = [];
            let leader = { name: "Unknown", image: "../../../images/default.jpg" };

            try {
              const leaderRes = await fetch(`http://52.15.58.198:3000/users/${project.team_lead_id}`);
              if (leaderRes.ok) {
                const leaderData = await leaderRes.json();
                leader = {
                  name: leaderData.name,
                  image: leaderData.image || "../../../images/default.jpg"
                };
              }
            } catch (err) {
              console.error("Leader fetch failed", err);
            }

            try {
              const userRes = await fetch(`http://52.15.58.198:3000/projects/${project.id}/users`);
              if (userRes.ok) {
                membersData = await userRes.json();
              }
            } catch (err) {
              console.error("User fetch failed", err);
            }

            allTechs.push(...(project.technologies || []));
            totalUserCount += membersData.length;

            return {
              id: project.id,
              title: project.title,
              groupLeader: leader,
              likes: project.likes || 0,
              image: project.thumbnail?.startsWith("http") ? project.thumbnail : "../../../images/default.jpg",
              isLiked: false,
              isBookmarked: false,
              description: project.description || "No description provided.",
              tech: project.technologies || [],
              members: membersData.map((user: any) => user.image),
              totalMembers: membersData.length,
            };
          })
        );

        const techCounts: { [key: string]: number } = {};
        allTechs.forEach((tech) => {
          techCounts[tech] = (techCounts[tech] || 0) + 1;
        });
        const mostUsed = Object.entries(techCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "";

        setAllProjects(projectsWithUsers);
        setTotalUsers(totalUserCount);
        setMostUsedTech(mostUsed);
      } catch (error) {
        console.error("Failed to load projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const topProjects = [...allProjects].sort((a, b) => b.likes - a.likes).slice(0, 3);
  const olderProjects = [...allProjects].sort((a, b) => b.likes - a.likes).slice(3, 9);

  const slides = [
    { title: "PROJECTS", description: `${allProjects.length} total projects hosted.`, image: "../../../images/projects.png" },
    { title: "USERS", description: `${totalUsers} total participants across all projects.`, image: "../../../images/community.png" },
    { title: "MOST USED TECH", description: `${mostUsedTech} is the most used technology!`, image: "../../../images/mostUsedLanguage.png" },
  ];

  const handleCardClick = (index: number) => {
    setSelectedIndex(index);
    setShowModal(true);
  };

  const toggleLike = (index: number) => {
    setAllProjects(prev =>
      prev.map((p, i) =>
        i === index ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p
      )
    );
  };

  const toggleBookmark = (index: number) => {
    setAllProjects(prev =>
      prev.map((p, i) => (i === index ? { ...p, isBookmarked: !p.isBookmarked } : p))
    );
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const interval = setInterval(nextSlide, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-blue-900 text-white font-nunito">
      <NavBar />
      <div className="h-screen flex flex-col items-center overflow-y-scroll w-[90%] scrollbar-hide">
  
        {/* Personalized Greeting */}
        <div className="w-[85%] h-[300px] flex flex-col items-start justify-center text-center mt-[60px] mb-[20px]">
          <h1 className="text-[30px] font-[500] text-white font-bold mb-[0px]">
          Hello {session?.user?.name ? `${session.user.name}` : "USER"}!!
          </h1>
          <p className="mt-[-5px]">Hope you are having a good day</p>
        </div>
  
        {/* Slider */}
        <div className="w-[85%] h-[350px] bg-[#385773] flex items-center justify-center rounded-[15px] mt-[-10px]">
        <button onClick={prevSlide} className="text-[#fff] px-[10px] ml-[5px] border-transparent border-none outline-none bg-transparent">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[25px] h-[25px]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
          <div className="flex w-full justify-between items-center ml-[10%] mr-[10%]">
            <div className="w-1/2 text-left pl-8">
              <h2 className="text-2xl font-bold text-[#fff]">{slides[currentSlide].title}</h2>
              <p className="mt-2 text-[#d1d5db]">{slides[currentSlide].description}</p>
            </div>
            <div className="w-1/2 flex justify-end pr-8">
              <img src={slides[currentSlide].image} alt="slide" className="h-[200px]" />
            </div>
          </div>
          <button onClick={nextSlide} className="text-[#fff] px-[10px] mr-[5px] border-transparent border-none outline-none bg-transparent">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[25px] h-[25px]">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
        </div>
  
        {/* Projects Section */}
        <div className="w-[85%] -translate-y-[90px] mt-[70px]">
          <h2 className="text-3xl font-bold text-center text-[#000] pt-[40px] pb-[20px] text-[24px]">TOP PROJECTS</h2>
          <div className="grid grid-cols-3 gap-[40px]">
            {topProjects.map((project, index) => (
              <div key={index} onClick={() => handleCardClick(index)}>
                <ProjectCard
                  {...project}
                  groupLeaderName={project.groupLeader.name}
                  onLike={() => toggleLike(index)}
                  onBookmark={() => toggleBookmark(index)}
                />
              </div>
            ))}
          </div>
  
          <h2 className="text-3xl font-bold text-center text-[#000] mt-[60px] mb-6">RECENT PROJECTS</h2>
          <div className="grid grid-cols-3 gap-[40px]">
            {olderProjects.map((project, index) => (
              <div key={index + 3} onClick={() => handleCardClick(index + 3)}>
                <ProjectCard
                  {...project}
                  groupLeaderName={project.groupLeader.name}
                  onLike={() => toggleLike(index + 3)}
                  onBookmark={() => toggleBookmark(index + 3)}
                />
              </div>
            ))}
          </div>
        </div>
  
        {/* Modal */}
        {showModal && selectedIndex !== null && (
          <div className="fixed inset-0 flex items-start justify-center translate-y-[150px] z-[40] translate-x-[-25px]">
            <ExpandedProjectModal
              {...allProjects[selectedIndex]}
              onClose={() => setShowModal(false)}
              onLike={() => toggleLike(selectedIndex)}
              onBookmark={() => toggleBookmark(selectedIndex)}
              onJoin={() => {}}
              joinRequested={false}
              showJoinButton={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
