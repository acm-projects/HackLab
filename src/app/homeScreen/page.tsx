"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import NavBar from "../components/NavBar";
import CompletedProjectCard from "../components/homePageCard";
import ExpandedProjectModal from "../components/ExpandedProjectCard";
import { useSession } from "next-auth/react";

interface Project {
  id: number;
  title: string;
  groupLeader: { name: string; image: string };
  likes: number;
  image: string;
  isLiked: boolean;
  isBookmarked: boolean;
  description: string;
  tech: string[];
  totalMembers: number;
  skills: string[];
  topics: string[];
  mvps: string[];
  stretch: string[];
  members: { name: string; image: string }[];
  completionDate: string;
}

export default function HomeScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [completedProjects, setCompletedProjects] = useState<Project[]>([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [mostUsedTech, setMostUsedTech] = useState<string>("");
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState<boolean[]>([]);
  const [isBookmarked, setIsBookmarked] = useState<boolean[]>([]);

  const topProjectsRef = useRef<Project[]>([]); // UseRef for storing top projects, does not trigger re-renders
  const [slides, setSlides] = useState([
    { title: "PROJECTS", description: `90+ total projects hosted.`, image: "../../../images/projects.png" },
    { title: "USERS", description: `50+ total participants across all projects.`, image: "../../../images/community.png" },
    { title: "MOST USED TECH", description: `Java is the most used technology!`, image: "../../../images/mostUsedLanguage.png" },
  ]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://52.15.58.198:3000/projects");
        const data = await res.json();
        setTotalProjects(data.length);

        const [likedRes, bookmarkedRes] = await Promise.all([
          fetch(`http://52.15.58.198:3000/users/${session?.user?.id}/liked-projects`),
          fetch(`http://52.15.58.198:3000/users/${session?.user?.id}/bookmarked-projects`),
        ]);

        const likedProjectIds = likedRes.ok ? (await likedRes.json()).map((p: any) => Number(p.project_id)) : [];
        const bookmarkedProjectIds = bookmarkedRes.ok ? (await bookmarkedRes.json()).map((p: any) => Number(p.project_id)) : [];

        const completed = await Promise.all(
          data.filter((p: any) => p.completed).map(async (project: any) => {
            let membersData: any[] = [];
            let skillsData: string[] = [];
            let topicsData: string[] = [];
            let teamLeadData = { name: "Unknown", image: "../../../images/default.jpg" };

            try {
              const [teamLeadRes, membersRes, skillsRes, topicsRes] = await Promise.all([
                fetch(`http://52.15.58.198:3000/users/${project.team_lead_id}`),
                fetch(`http://52.15.58.198:3000/projects/${project.id}/users`),
                fetch(`http://52.15.58.198:3000/projects/${project.id}/skills`),
                fetch(`http://52.15.58.198:3000/projects/${project.id}/topics`),
              ]);

              if (teamLeadRes.ok) teamLeadData = await teamLeadRes.json();
              if (membersRes.ok) membersData = await membersRes.json();
              if (skillsRes.ok) skillsData = (await skillsRes.json()).map((s: any) => s.skill);
              if (topicsRes.ok) topicsData = (await topicsRes.json()).map((t: any) => t.topic);
            } catch (err) {
              console.error("Fetch error:", err);
            }

            return {
              id: project.id,
              title: project.title,
              groupLeader: teamLeadData,
              likes: project.likes || 0,
              image: project.thumbnail?.startsWith("http") ? project.thumbnail : "../../../images/default.jpg",
              isLiked: likedProjectIds.includes(project.id),
              isBookmarked: bookmarkedProjectIds.includes(project.id),
              description: project.description || "No description provided.",
              tech: project.technologies || [],
              topics: topicsData,
              skills: skillsData,
              members: membersData.map((u: any) => ({
                name: u.name,
                image: u.image || "../../../images/default.jpg",
              })),
              totalMembers: membersData.length,
              mvps: project.mvp || [],
              stretch: project.stretch || [],
              completionDate: project.completion_date || "",
            };
          })
        );

        setCompletedProjects(completed);
        setIsLiked(completed.map((p) => p.isLiked));
        setIsBookmarked(completed.map((p) => p.isBookmarked));
        setTotalUsers(completed.reduce((sum, p) => sum + p.totalMembers, 0));

        topProjectsRef.current = [...completed].sort((a, b) => b.likes - a.likes).slice(0, 3);

        const techCounts: { [key: string]: number } = {};
        data.forEach((p: any) => {
          (p.technologies || []).forEach((tech: string) => {
            techCounts[tech] = (techCounts[tech] || 0) + 1;
          });
        });
        setMostUsedTech(Object.entries(techCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "");
      } catch (err) {
        console.error("❌ Failed to load projects:", err);
      }
    };

    fetchProjects();
  }, [session?.user?.id]); // Only rerun this effect when session user id changes

  const handleLike = async (index: number) => {
    const project = completedProjects[index];
    const liked = isLiked[index];

    try {
      if (liked) {
        await fetch(`http://52.15.58.198:3000/users/${session?.user?.id}/liked-projects/${project.id}`, { method: "DELETE" });
      } else {
        await fetch(`http://52.15.58.198:3000/users/${session?.user?.id}/liked-projects/${project.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: session?.user?.id, project_id: project.id }),
        });
      }

      setIsLiked((prev) => {
        const copy = [...prev];
        copy[index] = !liked;
        return copy;
      });

      setCompletedProjects((prev) => {
        const copy = [...prev];
        copy[index] = {
          ...copy[index],
          likes: copy[index].likes + (liked ? -1 : 1),
        };
        return copy;
      });
    } catch (err) {
      console.error("❌ Failed to toggle like:", err);
    }
  };

  const handleBookmark = async (index: number) => {
    const projectId = completedProjects[index].id;
    const bookmarked = isBookmarked[index];

    const method = bookmarked ? "DELETE" : "POST";
    await fetch(`http://52.15.58.198:3000/users/${session?.user?.id}/bookmarked-projects/${projectId}`, { method });

    setIsBookmarked((prev) => {
      const copy = [...prev];
      copy[index] = !bookmarked;
      return copy;
    });
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const recentProjects = useMemo(() => {
    return [...completedProjects]
      .sort((a, b) => new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime())
      .slice(0, 6);
  }, [completedProjects]);

  const handleCardClick = (index: number) => {
    setSelectedIndex(index);
    setShowModal(true);
  };

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 10000);
    return () => clearInterval(interval);
  }, []);

  const topProjects = [...completedProjects].sort((a, b) => b.likes - a.likes).slice(0, 3);
  const olderProjects = [...completedProjects].sort((a, b) => b.likes - a.likes).slice(3, 9);

  return (
    <div className="min-h-screen flex flex-col items-center bg-blue-900 text-white font-nunito">
      <NavBar />
      <div className="h-screen flex flex-col items-center overflow-y-scroll w-[90%] scrollbar-hide mb-[100px]">
        {/* Hero */}
        <div className="w-[95%] h-[300px] flex flex-col items-start justify-center text-center mt-[60px]">
          <h1 className="text-[30px] font-[500] text-white font-bold mb-[0px]">
            Hello {session?.user?.name || session?.user?.name || "USER"}!!
          </h1>
          <p className="mt-[-5px] mb-[40px]">Hope you are having a good day</p>
        </div>

        {/* Slider */}
        <div className="w-[95%] h-[350px] bg-[#385773] flex items-center justify-center rounded-[15px]">
          <button onClick={prevSlide} className="text-[#fff] px-[10px] ml-[5px] border-transparent border-none outline-none bg-transparent">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[25px] h-[25px] mt-[-5px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            
          </button>
          <div className="flex w-full ml-[10%] mr-[10%] mt-[40px]">
            <div className="w-1/2 text-left pl-8">
              <h2 className="text-2xl font-bold text-[#fff]">{slides[currentSlide].title}</h2>
              <p className="mt-2 text-[#d1d5db]">{slides[currentSlide].description}</p>
            </div>
            <div className="w-1/2 flex justify-end pr-8">
              <img src={slides[currentSlide].image} alt="slide" className="h-[200px] mt-[-50px]" />
            </div>
          </div>
          <button onClick={nextSlide} className="text-[#fff] px-[10px] mr-[5px] border-transparent border-none outline-none bg-transparent">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[25px] h-[25px] mt-[-5px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        <div>
        {/* Top Projects */}
        <h2 className="text-[36px] font-bold text-[#000] mt-[40px] mb-[40px] text-center flex item-start">Top Projects</h2>
        <div className="grid grid-cols-3 gap-[40px]">
          {topProjectsRef.current.map((project, index) => (
            <div className="transition-transform duration-300 hover:-translate-y-[4px]" key={index} onClick={() => handleCardClick(index)}>
              <CompletedProjectCard
                {...project}
                isLiked={isLiked[index]}
                isBookmarked={isBookmarked[index]}
                onLike={() => handleLike(index)}
                onBookmark={() => handleBookmark(index)}
                github="https://github.com"
                completionDate={project.completionDate}
                isCompleted={true}
              />
            </div>
          ))}
        </div>

        {/* Recent Projects */}
        <h2 className="text-[36px] font-bold text-[#000] mt-[40px] mb-[40px] text-left">Recent Projects</h2>
        <div className="grid grid-cols-3 gap-[40px] mb-[50px] ">
          {recentProjects.map((project, index) => (
            <div className="transition-transform duration-300 hover:-translate-y-[4px]" key={index} onClick={() => handleCardClick(index)}>
              <CompletedProjectCard
                {...project}
                likes={completedProjects[index].likes}
                isLiked={isLiked[index]}
                isBookmarked={isBookmarked[index]}
                onLike={() => handleLike(index)}
                onBookmark={() => handleBookmark(index)}
                github="https://github.com"
                completionDate={project.completionDate}
                isCompleted={true}
              />
            </div>
          ))}
        </div>
        </div>
        {/* Modal */}
        {showModal && selectedIndex !== null && (
          <div className="fixed inset-0 flex items-start justify-center translate-y-[150px] z-[40] translate-x-[-25px]">
            <ExpandedProjectModal
              {...completedProjects[selectedIndex]}
              onClose={() => setShowModal(false)}
              onLike={() => handleLike(selectedIndex)}
              onBookmark={() => handleBookmark(selectedIndex)}
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
