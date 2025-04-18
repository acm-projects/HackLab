"use client";
import React from "react";

export default function LoadingGears() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff] text-white font-nunito">
      <div className="flex items-center gap-[40px]">
        <img src="/images/gearGenerating.png" alt="GearGenerating" className="w-[200px] h-[160px]"/>
        <div className="w-[60px] h-[60px] animate-spin-slow fill-[#60a5fa]">
          <Gear />
        </div>
        <div className="w-[80px] h-[80px] animate-spin-reverse fill-[#3b82f6]">
          <Gear />
        </div>
        <div className="w-[50px] h-[50px] animate-spin-slow fill-[#93c5fd]">
          <Gear />
        </div>
      </div>
      <p className="mt-[30px] text-[18px] text-[#385773] font-medium">Juno is crafting your project...</p>

      <style jsx global>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 2.5s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 3s linear infinite;
        }
      `}</style>
    </div>
  );
}

function Gear() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M78.9 45.5c.1 1 .1 2 .1 3s0 2-.1 3l8.7 6.8c.8.6 1 1.7.4 2.6l-8.2 14.2c-.6.9-1.6 1.2-2.5.9l-10.3-4.2c-1.7 1.3-3.6 2.5-5.6 3.3l-1.6 11.1c-.2 1-1 1.7-2 1.7H41.2c-1 0-1.9-.7-2-1.7l-1.6-11.1c-2-.9-3.9-2-5.6-3.3l-10.3 4.2c-.9.4-2-.1-2.5-.9L11 60.9c-.6-.9-.4-2 .4-2.6l8.7-6.8c-.1-1-.1-2-.1-3s0-2 .1-3l-8.7-6.8c-.8-.6-1-1.7-.4-2.6L21.3 20c.6-.9 1.6-1.2 2.5-.9l10.3 4.2c1.7-1.3 3.6-2.5 5.6-3.3l1.6-11.1c.2-1 1-1.7 2-1.7h17.5c1 0 1.9.7 2 1.7l1.6 11.1c2 .9 3.9 2 5.6 3.3l10.3-4.2c.9-.4 2 .1 2.5.9l8.2 14.2c.6.9.4 2-.4 2.6l-8.7 6.8zM50 65c8.3 0 15-6.7 15-15S58.3 35 50 35 35 41.7 35 50s6.7 15 15 15z" />
    </svg>
  );
}
