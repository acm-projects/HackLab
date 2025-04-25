"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import NavBar from "../components/NavBar";
import CompletedProjectCard from "../components/homePageCard";
import ExpandedProjectModal from "../components/ExpandedProjectCard";
import { useSession } from "next-auth/react";
import LoadingPage from "../components/loadingScreen"; // adjust the path if needed
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
  // const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [completedProjects, setCompletedProjects] = useState<Project[]>([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [mostUsedTech, setMostUsedTech] = useState<string>("");
  const { data: session } = useSession();
  const [likedMap, setLikedMap] = useState<{ [projectId: number]: boolean }>({});
  const [bookmarkedMap, setBookmarkedMap] = useState<{ [projectId: number]: boolean }>({});
  const [showLoadingPage, setShowLoadingPage] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
const [selectedListType, setSelectedListType] = useState<"top" | "recent" | null>(null);
const [skillIconMap, setSkillIconMap] = useState<{ [name: string]: string }>({});

useEffect(() => {
  const fetchSkillIcons = async () => {
    try {
      const res = await fetch("http://52.15.58.198:3000/skills");
      const data = await res.json();
      const map: { [name: string]: string } = {};
      data.forEach((s: any) => {
        map[s.skill.trim().toLowerCase()] = s.icon_url;
      });
      setSkillIconMap(map);
    } catch (err) {
      console.error("❌ Failed to fetch skill icons:", err);
    }
  };

  fetchSkillIcons();
}, []);

      useEffect(() => {
        const timer = setTimeout(() => setShowLoadingPage(false), 2000);
        return () => clearTimeout(timer);
      }, []);

  const topProjectsRef = useRef<Project[]>([]); // UseRef for storing top projects, does not trigger re-renders
  const [slides, setSlides] = useState([
    { title: "Projects", description: `90+ total projects hosted.`, image: "../../../images/projects.png" },
    { title: "Users", description: `50+ total participants across all projects.`, image: "../../../images/community.png" },
    { title: "Most Tech Used", description: `Java is the most used technology!`, image: "../../../images/mostUsedLanguage.png" },
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
        const likedMapping: { [key: number]: boolean } = {};
        const bookmarkedMapping: { [key: number]: boolean } = {};

        completed.forEach((p) => {
          likedMapping[p.id] = p.isLiked;
          bookmarkedMapping[p.id] = p.isBookmarked;
        });

        setLikedMap(likedMapping);
        setBookmarkedMap(bookmarkedMapping);

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

  const handleLike = async (projectId: number) => {
    const liked = likedMap[projectId];
  
    try {
      if (liked) {
        await fetch(`http://52.15.58.198:3000/users/${session?.user?.id}/liked-projects/${projectId}`, { method: "DELETE" });
      } else {
        await fetch(`http://52.15.58.198:3000/users/${session?.user?.id}/liked-projects/${projectId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: session?.user?.id, project_id: projectId }),
        });
      }
  
      setLikedMap((prev) => ({
        ...prev,
        [projectId]: !liked,
      }));
  
      setCompletedProjects((prev) =>
        prev.map((proj) =>
          proj.id === projectId
            ? { ...proj, likes: proj.likes + (liked ? -1 : 1) }
            : proj
        )
      );
    } catch (err) {
      console.error("❌ Failed to toggle like:", err);
    }
  };
  

  const handleBookmark = async (projectId: number) => {
    const bookmarked = bookmarkedMap[projectId];
    const method = bookmarked ? "DELETE" : "POST";
  
    await fetch(`http://52.15.58.198:3000/users/${session?.user?.id}/bookmarked-projects/${projectId}`, { method });
  
    setBookmarkedMap((prev) => ({
      ...prev,
      [projectId]: !bookmarked,
    }));
  };
  

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const recentProjects = useMemo(() => {
    return [...completedProjects]
      .sort((a, b) => new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime())
      .slice(0, 6);
  }, [completedProjects]);

  const handleCardClick = (index: number, listType: "top" | "recent") => {
    setSelectedIndex(index);
    setSelectedListType(listType);
    setShowModal(true);
  };
  
  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 10000);
    return () => clearInterval(interval);
  }, []);

  const topProjects = [...completedProjects].sort((a, b) => b.likes - a.likes).slice(0, 2);
  const olderProjects = [...completedProjects].sort((a, b) => b.likes - a.likes).slice(3, 9);

  if (showLoadingPage) {
      return <LoadingPage />;
    }

    const selectedProject =
    selectedListType === "top"
      ? topProjects[selectedIndex!]
      : recentProjects[selectedIndex!];
  return (
    <div className="min-h-screen flex flex-col items-center bg-blue-900 text-white font-nunito">
      <NavBar />
      <div className="h-screen w-[90%] flex flex-col items-center overflow-y-scroll scrollbar-hide mb-[100px]">
        {/* Hero */}
        <div className="w-[93%] h-[300px] flex flex-col items-start justify-center text-center mb-[10px]">
          <h1 className="text-[30px] font-[500] text-white font-bold mb-[0px]">
            Hello {session?.user?.name || session?.user?.name || "USER"}
          </h1>
          <p className="mt-[-5px] mb-[40px]">Hope you are having a good day!</p>
        </div>

        {/* Slider */}
        <div className="w-[93%] h-[350px] bg-[#385773] flex items-center justify-evenly rounded-[15px] -translate-y-[25%]">
          <button onClick={prevSlide} className="text-[#fff] px-[10px] ml-[5px] border-transparent border-none outline-none bg-transparent">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[25px] h-[25px] mt-[-5px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            
          </button>
          <div className="flex flex-1 mx-[30px] h-[230px] ml-[15%] mr-[15%] justify-evenly items-center">

            <div className="w-1/2 text-left pl-[10px]">
              <h2 className="text-2xl font-bold text-[#fff]">{slides[currentSlide].title}</h2>
              <p className="mt-[-10px] text-[#d1d5db]">{slides[currentSlide].description}</p>
            </div>
            <div className="w-1/2 flex justify-end pr-8">
              <img src={slides[currentSlide].image} alt="slide" className="h-[200px]" />
            </div>
          </div>
          <button onClick={nextSlide} className="text-[#fff] px-[10px] mr-[5px] border-transparent border-none outline-none bg-transparent">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[25px] h-[25px] mt-[-5px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        <div className="w-[93%] h-[350px] rounded-[15px] -translate-y-[25%]">
        {/* Top Projects */}
        <h2 className="text-[36px] font-bold text-[#000] mt-[40px] mb-[40px] text-center flex item-start">Most Liked Projects</h2>
        <div className="grid grid-cols-2 gap-[80px]">
        {topProjects.map((project, index) => (
            <div className="transition-transform duration-300 hover:-translate-y-[4px]" key={index} onClick={() => handleCardClick(index, "top")}>
              <CompletedProjectCard
                {...project}
                isLiked={likedMap[project.id] || false}
                isBookmarked={bookmarkedMap[project.id] || false}
                onLike={() => handleLike(project.id)}
                onBookmark={() => handleBookmark(project.id)}
                github="https://github.com"
                completionDate={project.completionDate}
                isCompleted={true}
                skillIconMap={skillIconMap}

              />
            </div>
          ))}
        </div>

        {/* Recent Projects */}

        <h2 className="text-[36px] font-bold text-[#000] mt-[40px] mb-[40px] text-left">Recently Completed Projects</h2>
        <div className="grid grid-cols-2 gap-[80px]">
        {recentProjects.map((project, index) => (
          <div className="transition-transform duration-300 hover:-translate-y-[4px]" key={index}onClick={() => handleCardClick(index, "recent")}>
            <CompletedProjectCard
              {...project}
              likes={project.likes} // ✅ FIXED
              isLiked={likedMap[project.id] || false}
              isBookmarked={bookmarkedMap[project.id] || false}
              onLike={() => handleLike(project.id)}
              onBookmark={() => handleBookmark(project.id)}
              github="https://github.com"
              completionDate={project.completionDate}
              isCompleted={true}
              skillIconMap={skillIconMap}

            />
            
          </div>
        ))}

        </div>
        <div className="translate-y-[50px] text-[#fff]">.</div>
        </div>
        
        {/* Modal */}
       

        {showModal && selectedIndex !== null && (
          <div className="fixed inset-0 flex items-start justify-center translate-y-[150px] z-[40]">
            <ExpandedProjectModal
              {...selectedProject}
              onClose={() => setShowModal(false)}
              onLike={() => handleLike(selectedProject.id)}
              onBookmark={() => handleBookmark(selectedProject.id)}
              onJoin={() => {}}
              joinRequested={false}
              showJoinButton={false}
              // 👇 These ensure icons and count are always fresh
              isLiked={likedMap[selectedProject.id] || false}
              isBookmarked={bookmarkedMap[selectedProject.id] || false}
              likes={completedProjects.find(p => p.id === selectedProject.id)?.likes || 0}
              skillIconMap={skillIconMap} 
            />

          </div>
        )}
      </div>
    </div>
  );
}
