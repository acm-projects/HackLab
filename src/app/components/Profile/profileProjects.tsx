"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OngoingProjectCard from "../OngoingProjects";
import CompletedProjectCard from "./completedProjectCard";


interface Project {
 id: string;
 title: string;
 description: string;
 image: string;
 topics: string[];
 skills: string[];
 groupLeader: { name: string; image: string };
 members: string[];
 totalMembers: number;
 moreNeeded: number;
 likes: number;
 isLiked: boolean;
 isBookmarked: boolean;
 joinRequested: boolean;
}


interface AllCreatedProjectsProps {
 completedProjects: Project[];
 ongoingProjects: Project[];
 createdProjects: Project[];
}


const renderProjectGrid = (projects: Project[], type: "completed" | "saved" | "ongoing" | "liked") => {
 if (!projects.length) {
   return <p className="text-sm text-muted-foreground">No projects available</p>;
 }


  return (
   <div className="grid grid-cols-2 md:grid-cols-2 gap-[60px]">
     {projects.map((project) => {
       console.log("Project:", project.members);


       return type === "completed" || type === "ongoing" ? (
        
         <CompletedProjectCard
           key={project.id}
           {...project}
           onLike={() => {}}
           onBookmark={() => {}}
         />
       ) : (
         <OngoingProjectCard
           key={project.id}
           {...project}
           showJoinButton={true}
           onLike={() => {}}
           onBookmark={() => {}}
           onJoin={() => {}}
         />
       );
     })}
   </div>
 );
};


const AllCreatedProjects: React.FC<AllCreatedProjectsProps> = ({
 completedProjects,
 ongoingProjects,
 createdProjects,
}) => {
 return (
   <div className="container mx-auto py-8">
     <div className="mb-[8px] rounded-lg border bg-card p-6 shadow-sm">
       <h2 className="pl-[24px] mb-6 text-2xl font-bold">Projects</h2>
       <Tabs defaultValue="completed" className="w-[1000px] pl-[24px]">
         <TabsList className="mb-[8px] grid w-full grid-cols-4">
           <TabsTrigger value="completed">Completed Projects</TabsTrigger>
           <TabsTrigger value="saved">Saved Projects</TabsTrigger>
           <TabsTrigger value="ongoing">Ongoing Projects</TabsTrigger>
           <TabsTrigger value="liked">Liked Projects</TabsTrigger>
         </TabsList>


         <TabsContent value="completed">{renderProjectGrid(completedProjects, "completed")}</TabsContent>
         <TabsContent value="saved">{renderProjectGrid(createdProjects, "saved")}</TabsContent>
         <TabsContent value="ongoing">{renderProjectGrid(ongoingProjects, "ongoing")}</TabsContent>
         <TabsContent value="liked">{renderProjectGrid(createdProjects, "liked")}</TabsContent>
       </Tabs>
     </div>
   </div>
 );
};


export default AllCreatedProjects;



