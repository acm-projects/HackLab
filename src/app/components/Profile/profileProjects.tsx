"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SavedLikedProjectCard from "./savedLikedProjects";
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
 github: string;
 completionDate: string;
 isCompleted: boolean;
 userIsMember: boolean;
}

interface AllCreatedProjectsProps {
 completedProjects: Project[];
 ongoingProjects: Project[];
 likedProjects: Project[];
 bookmarkedProjects: Project[];
}
const isProjectInList = (projectId: string, list: Project[]) => {
 return list.some((p) => p.id === projectId);
};


const renderProjectGrid = (projects: Project[], type: "completed" | "ongoing" | "saved" | "liked", likedProjects: Project[], bookmarkedProjects: Project[]) => {
 if (!projects.length) {
   return <p className="text-sm text-muted-foreground">No projects available</p>;
 }
   
 return (
   <div className="grid grid-cols-2 md:grid-cols-2 gap-[60px]">
     {projects.map((project) => {
       return type === "completed" || type === "ongoing" ? (
        
         <CompletedProjectCard
           key={project.id}
           {...project}
           isLiked={isProjectInList(project.id, likedProjects)}
           isBookmarked={isProjectInList(project.id, bookmarkedProjects)}
           onLike={() => {}}
           onBookmark={() => {}}
          
         />
       ) : (
         <SavedLikedProjectCard
           key={project.id}
           {...project}
           showJoinButton={!project.isCompleted && !project.userIsMember}
           joinRequested={project.joinRequested}
           onLike={() => {}}
           onBookmark={() => {}}
           onJoin={() => {}}
         />
       )
       ;
     })}
   </div>
 );
};


const AllCreatedProjects: React.FC<AllCreatedProjectsProps> = ({
 completedProjects,
 ongoingProjects,
 likedProjects,
 bookmarkedProjects,
}) => {
 return (
   <div className="container mx-auto py-[20px]">
     <div className="mb-[50px] rounded-lg border bg-card py-[20px] shadow-sm">
       <h2 className="pl-[24px] mb-[10px] text-2xl font-bold">Projects</h2>
       <Tabs defaultValue="completed" className="w-[1000px] pl-[24px]">
         <TabsList className="mb-[8px] grid w-full grid-cols-4">
           <TabsTrigger value="completed">Completed Projects</TabsTrigger>
           <TabsTrigger value="ongoing">Ongoing Projects</TabsTrigger>
           <TabsTrigger value="saved">Saved Projects</TabsTrigger>
           <TabsTrigger value="liked">Liked Projects</TabsTrigger>
         </TabsList>


         <TabsContent value="completed">{renderProjectGrid(completedProjects, "completed", likedProjects, bookmarkedProjects)}</TabsContent>
         <TabsContent value="ongoing">{renderProjectGrid(ongoingProjects, "ongoing", likedProjects, bookmarkedProjects)}</TabsContent>
         <TabsContent value="saved">{renderProjectGrid(bookmarkedProjects, "saved", likedProjects, bookmarkedProjects)}</TabsContent>
         <TabsContent value="liked">{renderProjectGrid(likedProjects, "liked", likedProjects, bookmarkedProjects)}</TabsContent>
       </Tabs>
     </div>
   </div>
 );
};


export default AllCreatedProjects;
