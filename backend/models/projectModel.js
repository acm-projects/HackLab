const pool = require('../db');

const createProject = async (projectData) => {
    const { title, description, short_description, thumbnail, type, mvp, stretch, timeline, team_lead_id, github_repo_url } = projectData;
    const result = await pool.query(
        'INSERT INTO project (title, description, short_description, thumbnail, type, mvp, stretch, timeline, team_lead_id, github_repo_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
        [title, description, short_description, thumbnail, type, mvp, stretch, timeline, team_lead_id, github_repo_url]
    );
    return result.rows[0];
};

/*example post request

{
  "accessToken": "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",
  "title": "AI-Powered Task Manager",
  "description": "A task manager that uses AI to suggest priorities.",
  "short_description": "AI helps prioritize tasks.",
  "thumbnail": "https://yourwebsite.com/images/ai-task.jpg",
  "type": "Web App",
  "mvp": { "features": ["AI task prioritization", "Basic task management"] },
  "stretch": { "features": ["Team collaboration", "Voice input", "Calendar sync"] },
  "timeline": { "phase1": "Q2 2025", "phase2": "Q3 2025" },
  "team_lead_id": 1
}

*/

const getAllProjects = async () => {
    const result = await pool.query('SELECT * FROM project');
    return result.rows;
};

const getProjectById = async (id) => {
    const result = await pool.query('SELECT * FROM project WHERE id = $1', [id]);
    return result.rows[0];
};

module.exports = {
    createProject,
    getAllProjects,
    getProjectById
};