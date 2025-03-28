"use client"


import ProjectSidebar from "../../components/projectsidebar";
import ContentSidebar from "../../components/contentsidebar";
import NavBar from "../../components/NavBar";
import { useParams } from "next/navigation";


export default function ProjectLayout({ children }: { children: React.ReactNode }) {
 const { projectId } = useParams();


 return (
   <div>
   <NavBar/>
   <div className="flex h-screen bg-gray-100 py-[50px] w-[100%] translate-x-[-10px]">
     <ProjectSidebar />
     <div className="flex flex-col w-full">
       <div className="flex flex-row h-full">
         <ContentSidebar projectId={projectId as string} />
         <main className="flex-1 p-6 overflow-y-auto">{children}</main>
       </div>
     </div>
   </div>
   </div>
 );
}
