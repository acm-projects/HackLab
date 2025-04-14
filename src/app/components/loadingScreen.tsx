"use client"


import { Fullscreen } from "lucide-react"
import Image from "next/image"
export default function LoadingPage() {

 return (
   <div className="flex flex-col items-center justify-center min-h-screen bg-[#ffffff] dark:bg-[#111827]">
     <div className="w-full max-w-[420px] px-[16px]">
      
       {/* Character Image */}
       <div className="flex justify-center mb-[32px]">
       
           <Image
             src="/images/theo_versions_happy_sad.png"
             alt="Theo character"
             width ={200}
             height={200}
             className="object-contain translate-x-[-10px]"
             priority
             style={{
               backgroundColor: "transparent",
               mixBlendMode: "multiply",
             }}
           />
       </div>


       {/* Loading Text */}
       <h2 className="text-[24px] font-bold text-center text-[#0f766e] dark:text-[#2dd4bf] mb-[32px] animate-pulse">
         Loading...
       </h2>




       {/* Loading Dots */}
       <div className="flex justify-center mt-[32px] space-x-[8px]">
         {[0, 1, 2].map((dot) => (
           <div
             key={dot}
             className="w-[12px] h-[12px] rounded-full bg-[#14b8a6]"
             style={{
               animation: `bounce 1.4s infinite ease-in-out both`,
               animationDelay: `${dot * 0.16}s`,
             }}
           />
         ))}
       </div>
     </div>


     {/* Global Animation Styles */}
     <style jsx global>{`
       @keyframes bounce {
         0%, 80%, 100% {
           transform: scale(0);
         }
         40% {
           transform: scale(1.0);
         }
       }


       @keyframes sipping {
         0% {
           transform: translateX(-50%) translateY(0%);
         }
         50% {
           transform: translateX(-50%) translateY(30%);
         }
         100% {
           transform: translateX(-50%) translateY(0%);
         }
       }
     `}</style>
   </div>
 )
}



