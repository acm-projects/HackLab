export interface ProjectData {
  id: number;
  projectName: string;
  projectType: string;
  techToBeUsed: (string | number)[];
  interests: (string | number)[];
  description: string;
  mvps: string[];
  stretchGoals: string[];
  timeline: {
    frontend: string[];
    backend: string[];
  };
  thumbnail?: string;
  source?: string;
}
