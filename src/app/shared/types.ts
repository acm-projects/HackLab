// types.ts
export type ProjectData = {
  id: number;
  projectName: string;
  projectType: string;
  techToBeUsed: string[];
  description: string;
  mvps: string[];
  stretchGoals: string[];
  interests: string[];
  thumbnail?: string;
  timeline?: {
    frontend: string[],
    backend: string[],
  },
 };
 
 
 
 