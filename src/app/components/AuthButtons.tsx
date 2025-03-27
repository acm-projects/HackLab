"use client";


import { signIn, signOut, useSession } from "next-auth/react";
import { FaGithub } from "react-icons/fa";

<FaGithub className="w-[18px] h-[18px] text-white" />


export default function AuthButtons() {
  const { data: session } = useSession(); // Check if user is logged in

  return (
    <div className="flex gap-[10px] items-center">
      {/* If the user is NOT logged in, show Sign In & Sign Up */}
      {!session ? (
        <>
          {/*  Sign In Button (Existing Users) */}
          <button 
            onClick={() => signIn(undefined, { callbackUrl: "/homeScreen" })}  // ✅ Fixed this line
            className="bg-black text-tertiary hover:text-white border-none 
                      focus:outline-none
                      font-nunito rounded-[10px] text-md px-[20px] py-[12px] text-center 
                      me-2 mb-2">
            Sign In
          </button>

          {/*  Sign Up with GitHub (For New Users) */}
          <button 
            onClick={() => signIn("github", { callbackUrl: "/homeScreen" })}  
            className="bg-[#385773] text-primary hover:text-primary border-none 
                      hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 
                      font-nunito rounded-[10px] text-md px-[20px] py-[10px] text-center 
                      flex items-center gap-2 me-2 mb-2"
          >
            {/* GitHub Icon using React Icons */}
            <FaGithub className="w-[18px] h-[18px] text-white" />
            &nbsp; Sign Up with GitHub
          </button>

        </>
      ) : (
        // ✅ If Signed In, Show Log Out Button
        <button 
          onClick={() => signOut({ callbackUrl: "/" })}  // ✅ Fixed this line
          className="bg-red-600 text-white border-none 
                    hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 
                    font-nunito rounded-[10px] text-md px-[15px] py-[7px] text-center 
                    me-2 mb-2">
          Log Out
        </button>
      )}
    </div>
  );
}
