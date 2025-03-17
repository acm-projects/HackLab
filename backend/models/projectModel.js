const pool = require('../db');

const createProject = async (projectData) => {
    const { title, description, short_description, type, mvp, stretch, timeline, team_lead_id, github_repo_url, thumbnail } = projectData;
    const result = await pool.query(
        'INSERT INTO project (title, description, short_description, type, mvp, stretch, timeline, team_lead_id, github_repo_url, thumbnail) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
        [title, description, short_description, type, mvp, stretch, timeline, team_lead_id, github_repo_url, thumbnail]
    );
    return result.rows[0];
};

/*example post request

{
  "accessToken": "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",
  "title": "AI-Powered Task Manager",
  "description": "A task manager that uses AI to suggest priorities.",
  "short_description": "AI helps prioritize tasks.",
  "type": "Web App",
  "mvp": { "features": ["AI task prioritization", "Basic task management"] },
  "stretch": { "features": ["Team collaboration", "Voice input", "Calendar sync"] },
  "timeline": { "phase1": "Q2 2025", "phase2": "Q3 2025" },
  "team_lead_id": 1
}

*/

const updateProject = async (id, projectData) => {
    const { title, description, short_description, type, mvp, stretch, timeline, team_lead_id, thumbnail } = projectData;
    const result = await pool.query(
        'UPDATE project SET title = $1, description = $2, short_description = $3, type = $4, mvp = $5, stretch = $6, timeline = $7, team_lead_id = $8, thumbnail = $9 WHERE id = $10 RETURNING *',
        [title, description, short_description, type, mvp, stretch, timeline, team_lead_id, thumbnail, id]
    );
    return result.rows[0];
};

const getAllProjects = async () => {
    const result = await pool.query('SELECT * FROM project');
    return result.rows;
};

const getProjectById = async (id) => {
    const result = await pool.query('SELECT * FROM project WHERE id = $1', [id]);
    return result.rows[0];
};

const getGithubById = async (id) => {
    const result = await pool.query('SELECT github_repo_url FROM project WHERE id = $1', [id]);
    return result.rows[0]?.github_repo_url;
};

const deleteProject = async (id) => {
    const result = await pool.query('DELETE FROM project WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

const addSkillToProject = async (projectId, skillId) => {
    const result = await pool.query(
        'INSERT INTO project_skill (project_id, skill_id) VALUES ($1, $2) RETURNING *',
        [projectId, skillId]
    );
    return result.rows[0];
};

const getSkillsFromProject = async (projectId) => {
    const result = await pool.query(
        'SELECT skill_id FROM project_skill WHERE project_id = $1',
        [projectId]
    );
    return result.rows;
};

const deleteSkillFromProject = async (projectId, skillId) => {
    const result = await pool.query(
        'DELETE FROM project_skill WHERE project_id = $1 AND skill_id = $2 RETURNING *',
        [projectId, skillId]
    );
    return result.rows[0];
};

const addTopicToProject = async (projectId, topicId) => {
    const result = await pool.query(
        'INSERT INTO project_topic (project_id, topic_id) VALUES ($1, $2) RETURNING *',
        [projectId, topicId]
    );
    return result.rows[0];
};

const getTopicsFromProject = async (projectId) => {
    const result = await pool.query(
        'SELECT topic_id FROM project_topic WHERE project_id = $1',
        [projectId]
    );
    return result.rows;
};

const deleteTopicFromProject = async (projectId, topicId) => {
    const result = await pool.query(
        'DELETE FROM project_topic WHERE project_id = $1 AND topic_id = $2 RETURNING *',
        [projectId, topicId]
    );
    return result.rows[0];
};

const addTeamPreferenceToProject = async (projectId, rolePreferenceId, xp) => {
    const result = await pool.query(
        'INSERT INTO project_team_preference (project_id, role_preference_id, xp) VALUES ($1, $2, $3) RETURNING *',
        [projectId, rolePreferenceId, xp]
    );
    return result.rows[0];
};

const getTeamPreferencesFromProject = async (projectId) => {
    const result = await pool.query(
        'SELECT * FROM project_team_preference WHERE project_id = $1',
        [projectId]
    );
    return result.rows;
};

const deleteTeamPreferenceFromProject = async (projectId, preferenceId) => {
    const result = await pool.query(
        'DELETE FROM project_team_preference WHERE project_id = $1 AND id = $2 RETURNING *',
        [projectId, preferenceId]
    );
    return result.rows[0];
};

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    getGithubById,
    updateProject,
    deleteProject,
    addSkillToProject,
    addTopicToProject,
    addTeamPreferenceToProject,
    getTeamPreferencesFromProject,
    deleteTeamPreferenceFromProject,
    getSkillsFromProject,
    deleteSkillFromProject,
    getTopicsFromProject,
    deleteTopicFromProject
};