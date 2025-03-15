"use client"; 

import "./globals.css";
import AuthButtons from "./components/AuthButtons"; // Import AuthButtons component

export default function LandingPage() {
  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory">
      
      {/* Landing Page Section */}
      <div id="landingPage" className="h-screen w-full flex flex-col justify-between bg-black text-tertiary font-nunito snap-start">
         
        {/* Top Bar */}
        <div className="fixed left-[50px] right-[50px] z-50 flex justify-between bg-[#ffffff] ">
          <h1 className="text-hacklab-title font-press">{"<"}H⒜CKLAB{"/>"}</h1> 
          <AuthButtons /> {/* Imported Sign In & Sign Up Buttons */}
        </div>

        {/* Content Section */}
        <div className="flex justify-between items-center h-full"> {/* I took out px 200 px from here */}
          
          {/* Left Side: Grid of Images */}
          <div className="grid grid-cols-3 grid-rows-2 w-[650px] h-[500px]">
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
          <div className="justify-center text-center -translate-x-[100%]">
            <h2 className="text-landing-make">Make</h2>
            <h2 className="text-landing-text text-[#7993AA]">Magic</h2>
            <h2 className="text-landing-text text-[#698195]">Projects</h2>
            <h2 className="text-landing-text text-[#385773]">Connections</h2>
          </div>
        </div>
      </div>

      {/* Scrolling Pages */}
      <div id="scrollingPage1" className="h-screen w-full flex items-center justify-center bg-gray-900 text-white snap-start">
        <div className="text-center max-w-2xl font-nunito">
          <h1 className="text-4xl font-bold mb-4">FIND A PROJECT</h1>
          <p className="text-lg text-tertiary">Discover exciting projects that match your interests and skills. Jump into ongoing collaborations and make an impact with like-minded creators.</p>
        </div>
      </div>

      <div id="scrollingPage2" className="h-screen w-full flex items-center justify-center bg-gray-900 text-white snap-start">
        <div className="text-center max-w-2xl font-nunito">
          <h1 className="text-4xl font-bold mb-4 ">CREATE A PROJECT</h1>
          <p className="text-lg text-tertiary">Bring your projects to life effortlessly with our AI-powered checklist and step-by-step walkthrough. From concept to completion, we guide you every step of the way.</p>
        </div>
      </div>
      <div id="scrollingPage3" className="h-screen w-full flex items-center justify-center bg-gray-900 text-white snap-start">
        <div className="text-center max-w-2xl font-nunito">
          <h1 className="text-4xl font-bold mb-4">LET AI DO IT FOR YOU</h1>
          <p className="text-lg text-tertiary">AI kickstarts your project with a dynamic timeline and overview, then refines your success into a compelling resume-worthy description—transforming effort into impact with smart, seamless storytelling.</p>
        </div>
      </div>
    </div>
  );
}
