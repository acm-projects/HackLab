"use client";
import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import ProjectCard from "../components/TopProjectCard";
import ExpandedProjectModal from "../components/ExpandedProjectCard";

export default function HomeScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [allProjects, setAllProjects] = useState([
    {
      title: "Project Alpha",
      groupLeader: "@EthanV",
      likes: 1200,
      image: "../../../images/img3.jpg",
      isLiked: false,
      isBookmarked: false,
    },
    {
      title: "Project Beta",
      groupLeader: "@Luke11",
      likes: 950,
      image: "../../../images/img2.jpg",
      isLiked: false,
      isBookmarked: false,
    },
    {
      title: "Project Gamma",
      groupLeader: "@Aastha2365",
      likes: 800,
      image: "../../../images/img1.jpg",
      isLiked: false,
      isBookmarked: false,
    },
    {
      title: "Project Delta",
      groupLeader: "@MariaK",
      likes: 750,
      image: "../../../images/img4.jpg",
      isLiked: false,
      isBookmarked: false,
    },
    {
      title: "Project Epsilon",
      groupLeader: "@JohnD",
      likes: 600,
      image: "../../../images/img5.jpg",
      isLiked: false,
      isBookmarked: false,
    },
    {
      title: "Project Zeta",
      groupLeader: "@SarahL",
      likes: 550,
      image: "../../../images/img6.png",
      isLiked: false,
      isBookmarked: false,
    },
    {
      title: "Project Eta",
      groupLeader: "@MikeT",
      likes: 500,
      image: "../../../images/img1.jpg",
      isLiked: false,
      isBookmarked: false,
    },
    {
      title: "Project Theta",
      groupLeader: "@EmmaW",
      likes: 450,
      image: "../../../images/img2.jpg",
      isLiked: false,
      isBookmarked: false,
    },
    {
      title: "Project Iota",
      groupLeader: "@DavidR",
      likes: 400,
      image: "../../../images/img4.jpg",
      isLiked: false,
      isBookmarked: false,
    },
  ]);

  const dummyExpandedData = {
    tech: ["React", "Tailwind", "Firebase"],
    members: [
      "https://i.pravatar.cc/150?img=1",
      "https://i.pravatar.cc/150?img=2",
      "https://i.pravatar.cc/150?img=3",
    ],
    totalMembers: 9,
    description: "This is a placeholder description for the selected project.",
  };

  const slides = [
    { title: "PROJECTS", description: "Over 8000+ projects and growing rapidly.", image: "../../../images/projects.png" },
    { title: "MOST USED LANGUAGE", description: "JavaScript dominates with 60% usage among developers.", image: "../../../images/mostUsedLanguage.png" },
    { title: "LEADERBOARD", description: "Top contributors include @EthanV, @Luke11, and @Aastha2365.", image: "../../../images/leaderBoard.png" },
    { title: "HACKATHONS HOSTED", description: "5 major hackathons held this year.", image: "../../../images/hackathons.png" },
    { title: "COMMUNITY GROWTH", description: "10,000+ active members engaging daily.", image: "../../../images/community.png" }
  ];

  const sortedProjects = [...allProjects].sort((a, b) => b.likes - a.likes);
  const topProjects = sortedProjects.slice(0, 3);
  const olderProjects = sortedProjects.slice(3, 9);

  const handleCardClick = (index: number) => {
    setSelectedIndex(index);
    setShowModal(true);
  };

  const toggleLike = (index: number) => {
    setAllProjects((prev) =>
      prev.map((p, i) =>
        i === index
          ? {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );
  };

  const toggleBookmark = (index: number) => {
    setAllProjects((prev) =>
      prev.map((p, i) =>
        i === index ? { ...p, isBookmarked: !p.isBookmarked } : p
      )
    );
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-blue-900 text-white font-nunito">
      
      <NavBar />
      <div className="h-screen flex flex-col items-center bg-blue-900 text-white font-nunito overflow-y-scroll">
        {/* Hero Section */}
        <div className="w-screen h-[300px] flex flex-col items-center justify-center text-center mt-[60px]">
          <h1 className="text-[#000] bg-[#fff]">WELCOME TO HACKLAB</h1>
          <p className="text-[#000000] translate-y-[-30px] bg-[#fff]">Explore, Build, and Contribute to Open Source Projects</p>
        </div>
        
        {/* Sliding Stats Section */}
        <div className="w-[85%] h-[350px] bg-[#385773] flex items-center justify-center rounded-[15px] mt-[-20px]">
          <button 
            onClick={prevSlide} 
            className="mb-[20px] bg-[#385773] text-primary hover:text-white border-none focus:outline-none font-nunito rounded-[10px] text-[15px] px-[20px] text-center z-[40] flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-[25px] text-[#fff]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          
          <div className="flex w-full justify-between items-center">
            <div className="w-1/2 text-left pl-8">
              <h2 className="text-2xl font-bold text-[#f8fafc]">{slides[currentSlide].title}</h2>
              <p className="text-md mt-2 text-[#d1d5db]">{slides[currentSlide].description}</p>
            </div>
            {slides[currentSlide].image && (
              <div className="w-1/2 flex justify-end pr-8">
                <img src={slides[currentSlide].image} alt={slides[currentSlide].title} className="h-[200px] w-auto rounded-lg" />
              </div>
            )}
          </div>
          
          <button 
            onClick={nextSlide} 
            className="mb-[20px] bg-[#385773] text-primary hover:text-white border-none focus:outline-none font-nunito rounded-[10px] text-[15px] px-[20px] text-center z-[40] flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-[25px] text-[#fff]">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
        
        {/* Content Section */}
        <div className="w-[85%] translate-y-[-90px] pb-10 mt-[70px]">
          {/* Top Projects Section */}
          <h2 className="text-3xl font-bold text-[#000000] flex items-center justify-center mb-4 mt-[50px]">TOP PROJECTS</h2>
          <div className="grid grid-cols-3 gap-[40px] mb-10">
            {topProjects.map((project, index) => (
              <div 
                key={index} 
                onClick={() => handleCardClick(index)} 
                className="transition-transform duration-300 hover:transform hover:-translate-y-[4px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] cursor-pointer"
              >
                <ProjectCard
                  title={project.title}
                  groupLeader={project.groupLeader}
                  likes={project.likes}
                  image={project.image}
                  isLiked={project.isLiked}
                  isBookmarked={project.isBookmarked}
                  onLike={(e) => {
                    e.stopPropagation();
                    toggleLike(index);
                  }}
                  onBookmark={(e) => {
                    e.stopPropagation();
                    toggleBookmark(index);
                  }}
                />
              </div>
            ))}
          </div>

          {/* Older Projects Section */}
          <h2 className="text-3xl font-bold text-[#000000] flex items-center justify-center mb-4">BROWSE THROUGH SOME OLD PROJECTS</h2>
          <div className="grid grid-cols-3 gap-[40px]">
            {olderProjects.map((project, index) => (
              <div 
                key={index + topProjects.length} 
                onClick={() => handleCardClick(index + topProjects.length)} 
                className="transition-transform duration-300 hover:transform hover:-translate-y-[4px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] cursor-pointer"
              >
                <ProjectCard
                  title={project.title}
                  groupLeader={project.groupLeader}
                  likes={project.likes}
                  image={project.image}
                  isLiked={project.isLiked}
                  isBookmarked={project.isBookmarked}
                  onLike={(e) => {
                    e.stopPropagation();
                    toggleLike(index + topProjects.length);
                  }}
                  onBookmark={(e) => {
                    e.stopPropagation();
                    toggleBookmark(index + topProjects.length);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && selectedIndex !== null && (
        <div className="fixed inset-0 flex items-start justify-center translate-y-[150px] z-[40] translate-x-[-25px]">
          <ExpandedProjectModal
            title={allProjects[selectedIndex].title}
            groupLeader={allProjects[selectedIndex].groupLeader}
            image={allProjects[selectedIndex].image}
            tech={dummyExpandedData.tech}
            members={dummyExpandedData.members}
            totalMembers={dummyExpandedData.totalMembers}
            description={dummyExpandedData.description}
            isLiked={allProjects[selectedIndex].isLiked}
            isBookmarked={allProjects[selectedIndex].isBookmarked}
            likes={allProjects[selectedIndex].likes}
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
  );
}