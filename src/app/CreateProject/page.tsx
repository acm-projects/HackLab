"use client";
import NavBar from "../components/NavBar";
import { useRouter } from "next/navigation";
import "../globals.css";

export default function CreateProject() {
  const router = useRouter();
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <NavBar/>
      <div className="h-[500px] w-[850px] bg-black justify-center items-center bg-[#385773] text-[#fff] rounded-[20px] font-nunito">
        <h3 className="text-[20px] flex justify-center items-center mt-[70px]">
            CREATE YOUR OWN PROJECT
        </h3>
        <div className="items-center mt-[75px]">
          <button className="w-[350px] h-[50px] bg-[#ffffff] text-[#000] hover:bg-gray-900 border-none 
                      focus:ring-4 focus:outline-none focus:ring-blue-300 
                      font-nunito text-[15px] flex text-center justify-center items-center gap-2 rounded-[10px] ml-[250px]" onClick={() => router.push("/ManualProject")}>
              <p>DO IT MANUALLY</p>
          </button>
          
          <div className="flex items-center justify-center w-[400px] ml-[222px]">
            <hr className="w-[160px] border-t border-white" /> {/* Left line */}
            <p >OR</p> {/* OR text with horizontal margin */}
            <hr className="w-[160px] border-t border-white" /> {/* Right line */}
          </div>

          <button className="w-[350px] h-[50px] bg-[#ffffff] text-[#000] hover:bg-gray-900 border-none 
                      focus:ring-4 focus:outline-none focus:ring-blue-300 
                      font-nunito text-[15px] flex text-center justify-center items-center gap-2 rounded-[10px] ml-[250px]">
              <p>LET AI DO IT FOR YOU</p>

          </button>
        </div>
        
      </div>
    </div>
  );
}
