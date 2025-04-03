// src/services/api.ts
import { ProjectData } from "../app/shared/types";


const API_BASE_URL = "http://52.15.58.198:3000";


// src/services/api.ts
export const createProject = async (projectData: Omit<ProjectData, 'id'>): Promise<ProjectData> => {
   const response = await fetch(`${API_BASE_URL}/projects`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(projectData),
   });
  
   if (!response.ok) {
     const errorData = await response.json();
     throw new Error(errorData.message || 'Failed to create project');
   }
  
   return response.json();
 };


export const updateProject = async (id: number, projectData: Partial<ProjectData>) => {
 const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
   method: 'PUT',
   headers: {
     'Content-Type': 'application/json',
   },
   body: JSON.stringify(projectData),
 });
  if (!response.ok) {
   throw new Error('Failed to update project');
 }
  return response.json();
};


export const deleteProject = async (id: number) => {
 const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
   method: 'DELETE',
 });
  if (!response.ok) {
   throw new Error('Failed to delete project');
 }
  return response.json();
};


export const generateProject = async (prompt: string) => {
 const response = await fetch(`${API_BASE_URL}/projects/generateProject`, {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json',
   },
   body: JSON.stringify({ prompt }),
 });
  if (!response.ok) {
   throw new Error('Failed to generate project');
 }
  return response.json();
};





