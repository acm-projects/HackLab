"use client";

// new changes made: removed sign in button and made the sign up button a sign in button with github- april 7

import { signIn, signOut, useSession } from "next-auth/react";
import { FaGithub } from "react-icons/fa";


export default function AuthButtons() {
 const { data: session } = useSession(); // Check if user is logged in


 return (
   <div className="flex gap-[10px] items-center">
     {/* If the user is NOT logged in, show Sign In & Sign Up */}
     {!session ? (
       <>
         {/* Sign Up with GitHub (For New Users) */}
         <button
           onClick={() =>
            signIn("github", { prompt: "login" })         
           }
           className="bg-[#385773] text-primary font-nunito rounded-[10px] text-md px-[20px] py-[10px] text-center
                     flex items-center gap-2 me-2 mb-2 border-transparent border-none outline-none cursor-pointer transition-transform duration-200 hover:scale-105"
         >
           <FaGithub className="w-[18px] h-[18px] text-white" />
           &nbsp; Sign In with GitHub
         </button>
         
       </>
     ) : (
       // If the user IS logged in, show the Logout Button
       <button
         onClick={() => signOut({ callbackUrl: "/" })} // Redirects to landing page after logout
         className="mb-[50px] bg-[#385773] text-[#fff] border-transparent border-none outline-none
                   font-nunito rounded-[10px] text-[15px] px-[20px] py-[12px] text-center
                   z-50 flex items-center gap-2 ml-[30px] mt-[50px] cursor-pointer"
       >
         {/* Logout Icon */}
         <svg
           xmlns="http://www.w3.org/2000/svg"
           fill="none"
           viewBox="0 0 24 24"
           strokeWidth="1.5"
           stroke="currentColor"
           className="size-[25px]"
         >
           <path
             strokeLinecap="round"
             strokeLinejoin="round"
             d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
           />
         </svg>
         Log Out
       </button>
     )}
   </div>
 );
}





