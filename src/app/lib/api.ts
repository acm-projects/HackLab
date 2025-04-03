const API_BASE_URL = 'http://52.15.58.198:3000'; // Replace with your actual API URL


export async function fetchUserProjects(userId: number) {
 const response = await fetch(`${API_BASE_URL}/users/${userId}/projects`);
 if (!response.ok) {
   throw new Error('Failed to fetch user projects');
 }
 return response.json();
}


export async function fetchAllUsers() {
 const response = await fetch(`${API_BASE_URL}/users`);
 if (!response.ok) {
   throw new Error('Failed to fetch users');
 }
 return response.json();
}



