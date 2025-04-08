"use client";
import NavBar from "../components/NavBar";
import { useRouter } from "next/navigation";
import "../globals.css";

export default function CreateProject() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <NavBar />
      <div className="flex gap-[40px] mt-[50px]">
        {/* AI PROJECT CARD */}
        <div className="h-[500px] w-[400px] bg-[#385773] text-[#fff] rounded-[20px] font-nunito flex flex-col items-center px-[20px] py-[30px]">
          <h3 className="text-[20px] mb-[10px] text-center mt-[35px]">
            LET JUNO CREATE IT FOR YOU
          </h3>
          <p className="text-center text-sm mb-[20px]">
            Let our smart assistant suggest a fully built project idea for you based on your interests and skills.
          </p>

          {/* Juno Image */}
          <img
            src="/images/JUNOAI.png"
            alt="Juno AI"
            className="w-[280px] h-[250px] object-contain mb-[10px] ml-[10px]"
          />

          <button
            className="w-[250px] h-[50px] bg-[#ffffff] text-[#000] hover:bg-gray-900 border-none
              focus:ring-4 focus:outline-none focus:ring-blue-300 font-nunito text-[15px]
              flex text-center justify-center items-center gap-2 rounded-[10px]"
            onClick={() => router.push("/AIProject")}
          >
            Try Juno
          </button>
        </div>

        {/* MANUAL PROJECT CARD */}
        <div className="h-[500px] w-[400px] bg-[#385773] text-[#fff] rounded-[20px] font-nunito flex flex-col items-center px-[20px] py-[30px]">
          <h3 className="text-[20px] mb-[10px] text-center mt-[35px]">
            CREATE YOUR OWN PROJECT
          </h3>
          <p className="text-center text-sm mb-[20px]">
            Know what you want to build? Define your project manually with all the details you have in mind.
          </p>

          {/* Manual Image */}
          <img
            src="/images/Createyourown.png"
            alt="Manual Project"
            className="w-[280px] h-[250px] object-contain mb-[10px] ml-[10px] rounded-[00px]"
          />

          <button
            className="w-[250px] h-[50px] bg-[#ffffff] text-[#000] hover:bg-gray-900 border-none
              focus:ring-4 focus:outline-none focus:ring-blue-300 font-nunito text-[15px]
              flex text-center justify-center items-center gap-2 rounded-[10px]"
            onClick={() => router.push("/ManualProject")}
          >
            Start Manual Project
          </button>
        </div>
      </div>
    </div>
  );
}
