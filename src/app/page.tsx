"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthButtons from "./components/AuthButtons";
import "./globals.css";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!session || !session.user) return;

    console.log("🎯 SESSION:", session);

    if (session.user.isNewUser) {
      router.push("/Survey");
    } else {
      router.push("/homeScreen");
    }
  }, [session, status, router]);


  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hidden">
      
      {/* Landing Page Section */}
      <div id="landingPage" className="h-screen w-full flex flex-col justify-between bg-black text-tertiary font-nunito snap-start">
         
        {/* Top Bar */}
        <div className="fixed left-[0px]  z-50 flex justify-between w-screen bg-[#ffffff] mt-[-10px] ">
          <h1 className="text-hacklab-title font-nunito px-[50px]">HackLab</h1> 
          <AuthButtons/> {/* Imported Sign In & Sign Up Buttons */}
        </div>

        {/* Content Section */}
        <div className="flex justify-between items-center h-full"> {/* I took out px 200 px from here */}
          
          {/* Left Side: Grid of Images */}
          <div className="grid grid-cols-3 grid-rows-2 w-[650px] h-[500px] ">
            <div className="relative -translate-y-[50px] translate-x-[50%] animate-fade-in-top"> 
              <img src="/images/img1.jpg" alt="Image 1" className="landing-page-images" />
            </div>
            <div className="relative translate-y-[50px] translate-x-[50%] animate-fade-in-top"> 
              <img src="/images/img2.jpg" alt="Image 2" className="landing-page-images" />
            </div>
            <div className="relative -translate-y-[50px] translate-x-[50%] animate-fade-in-top"> 
              <img src="/images/img3.jpg" alt="Image 3" className="landing-page-images" />
              <div className="landing-page-overlay"></div>
            </div>
            <div className="relative -translate-y-[20px] translate-x-[50%] animate-fade-in"> 
              <img src="/images/img4.jpg" alt="Image 4" className="landing-page-images" />
            </div>
            <div className="relative translate-y-[80px] translate-x-[50%] animate-fade-in"> 
              <img src="/images/img5.jpg" alt="Image 5" className="landing-page-images" />
            </div>
            <div className="relative -translate-y-[20px] translate-x-[50%] animate-fade-in"> 
              <img src="/images/img6.png" alt="Image 6" className="landing-page-images" />
              <div className="landing-page-overlay"></div>
            </div>
          </div>
          

          {/* Right Side: Text */}
          <div className="justify-center text-center mr-[15%]">
            <h2 className="text-landing-make">Build your vision</h2>
            <h2 className="text-landing-text text-[#7993AA]">Create Projects</h2>
            {/* <h2 className="text-landing-text text-[#698195]">Let Juno guide you</h2> */}
            <h2 className="text-landing-text text-[#385773]">Connect with people</h2>
          </div>
        </div>
      </div>

      {/* Scrolling Pages */}
      <div id="scrollingPage1" className="h-screen w-full flex items-center justify-start text-white snap-start">
        <div className="text-center max-w-2xl font-nunito flex flex-col justify-start items-start w-1/4 ml-[10%]  bg-[#fff]">
          <h1 className="font-[300]">Find a project</h1>
          <p className="text-lg text-tertiary flex text-left">Discover exciting projects that match your interests and skills. Jump into ongoing collaborations and make an impact with like-minded creators.</p>
        </div>
      </div>

      <div id="scrollingPage1" className="h-screen w-full flex items-center justify-end bg-gray-900 text-white snap-start">
        <div className="text-center max-w-2xl font-nunito flex flex-col justify-end items-end w-1/4 mr-[10%]  bg-[#fff]">
          <h1 className="font-[300]">Create a project</h1>
          <p className="text-lg text-tertiary flex text-right">Bring your ideas to life effortlessly by just following simpler steps </p>
        </div>
      </div>
      <div id="scrollingPage3" className="h-screen w-full flex items-center justify-start  text-white snap-start">
        <div className="text-center max-w-2xl font-nunito flex flex-col justify-start items-start w-1/4 ml-[10%] bg-[#fff]">
          <h1 className="font-[300]">Let Juno do it for you</h1>
          <p className="text-lg text-tertiary flex text-left">AI kickstarts your project with a dynamic timeline and overview, then refines your success into a compelling resume-worthy description—transforming effort into impact with smart, seamless storytelling.</p>
        </div>
        {/* <div className="w-[70%] h-[85%] translate-y-[50px] rounded-xl overflow-hidden shadow-lg bg-[#385773] py-[10px] mb-[10px]">
          <video
            src="/images/letJuno.mov"
            autoPlay
            loop
            muted
            playsInline
            className="w-[75%] h-[75%] object-fill justify-center translate-x-[18px]"
          />
        </div> */}
      </div>
    </div>
  );
}
