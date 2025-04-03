"use client";


import { signOut } from "next-auth/react";


export default function LogoutButton() {
 const handleLogout = () => {
   signOut({
     callbackUrl: "/", // 👈 Redirects to your landing page
   });
 };


 return (
   <button
     onClick={handleLogout}
     className="mb-[50px] bg-[#385773] text-[#fff] border-transparent border-none outline-none
               font-nunito rounded-[10px] text-[15px] px-[20px] py-[12px] text-center
               z-50 flex items-center gap-2 ml-[30px]"
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
 );
}





