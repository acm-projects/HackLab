const db = require('../db'); 

// HANDLES INTERACTIONS WITH DATABASE RELATING TO USER INFORMATION
const User = {
    // user table interactions
    getAllUsers: async () => {
        const { rows } = await db.query('SELECT * FROM users');
        return rows;
    },

    getUserById: async (id) => {
        const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]); 
        return rows[0];
    },

    updateUser: async (id, userData) => {
        const { name, email, emailVerified, image, xp, bio, role_preference_id } = userData;
        const { rows } = await db.query(
            'UPDATE users SET name = $1, email = $2, "emailVerified" = $3, image = $4, xp = $5, bio = $6, role_preference_id = $7 WHERE id = $8 RETURNING *',
            [name, email, emailVerified, image, xp, bio, role_preference_id, id]
        );
        return rows[0];
    },

    deleteUser: async (id) => {
        const { rowCount } = await db.query('DELETE FROM users WHERE id = $1', [id]);
        return rowCount > 0;
    },

    // user_skill interactions
    getUserSkills: async (userId) => {
        const { rows } = await db.query(
            'SELECT skill.* FROM skill JOIN user_skill ON skill.id = user_skill.skill_id WHERE user_skill.user_id = $1',
            [userId]
        );
        return rows;
    },

    addUserSkill: async (userId, skillId) => {
        const { rows } = await db.query(
            'INSERT INTO user_skill (user_id, skill_id) VALUES ($1, $2) RETURNING *',
            [userId, skillId]
        );
        return rows[0];
    },

    deleteUserSkill: async (userId, skillId) => {
        const { rowCount } = await db.query(
            'DELETE FROM user_skill WHERE user_id = $1 AND skill_id = $2',
            [userId, skillId]
        );
        return rowCount > 0;
    },

    // user_topic interactions
    getUserTopics: async (userId) => {
        const { rows } = await db.query(
            'SELECT topic.* FROM topic JOIN user_topic ON topic.id = user_topic.topic_id WHERE user_topic.user_id = $1',
            [userId]
        );
        return rows;
    },

    addUserTopic: async (userId, topicId) => {
        const { rows } = await db.query(
            'INSERT INTO user_topic (user_id, topic_id) VALUES ($1, $2) RETURNING *',
            [userId, topicId]
        );
        return rows[0];
    },

    deleteUserTopic: async (userId, topicId) => {
        const { rowCount } = await db.query(
            'DELETE FROM user_topic WHERE user_id = $1 AND topic_id = $2',
            [userId, topicId]
        );
        return rowCount > 0;
    },

    // user_project interactions
    getUserProjects: async (userId) => {
        const { rows } = await db.query(
            'SELECT project.* FROM project JOIN user_project ON project.id = user_project.project_id WHERE user_project.user_id = $1',
            [userId]
        );
        return rows;
    },

    addUserProject: async (userId, projectId, roleId) => {
        const { rows } = await db.query(
            'INSERT INTO user_project (user_id, project_id, role_id) VALUES ($1, $2, $3) RETURNING *',
            [userId, projectId, roleId]
        );
        return rows[0];
    },

    deleteUserProject: async (userId, projectId) => {
        const { rowCount } = await db.query(
            'DELETE FROM user_project WHERE user_id = $1 AND project_id = $2',
            [userId, projectId]
        );
        return rowCount > 0;
    },

    // user_likes_project interactions
    getUserLikedProjects: async (userId) => {
        const { rows } = await db.query(
            'SELECT project.* FROM project JOIN user_likes_project ON project.id = user_likes_project.project_id WHERE user_likes_project.user_id = $1',
            [userId]
        );
        return rows;
    },

    addUserLikedProject: async (userId, projectId) => {
        const { rows } = await db.query(
            'INSERT INTO user_likes_project (user_id, project_id) VALUES ($1, $2) RETURNING *',
            [userId, projectId]
        );
        return rows[0];
    },

    deleteUserLikedProject: async (userId, projectId) => {
        const { rowCount } = await db.query(
            'DELETE FROM user_likes_project WHERE user_id = $1 AND project_id = $2',
            [userId, projectId]
        );
        return rowCount > 0;
    },

    // user_bookmarks_project interactions
    getUserBookmarkedProjects: async (userId) => {
        const { rows } = await db.query(
            'SELECT project.* FROM project JOIN user_bookmarks_project ON project.id = user_bookmarks_project.project_id WHERE user_bookmarks_project.user_id = $1',
            [userId]
        );
        return rows;
    },

    addUserBookmarkedProject: async (userId, projectId) => {
        const { rows } = await db.query(
            'INSERT INTO user_bookmarks_project (user_id, project_id) VALUES ($1, $2) RETURNING *',
            [userId, projectId]
        );
        return rows[0];
    },

    deleteUserBookmarkedProject: async (userId, projectId) => {
        const { rowCount } = await db.query(
            'DELETE FROM user_bookmarks_project WHERE user_id = $1 AND project_id = $2',
            [userId, projectId]
        );
        return rowCount > 0;
    },

    // user_project_join_request interactions
    getUserJoinRequests: async (userId) => {
        const { rows } = await db.query(
            'SELECT project.* FROM project JOIN user_project_join_request ON project.id = user_project_join_request.project_id WHERE user_project_join_request.user_id = $1',
            [userId]
        );
        return rows;
    },

    addUserJoinRequest: async (userId, projectId) => {
        const { rows } = await db.query(
            'INSERT INTO user_project_join_request (user_id, project_id) VALUES ($1, $2) RETURNING *',
            [userId, projectId]
        );
        return rows[0];
    },

    deleteUserJoinRequest: async (userId, projectId) => {
        const { rowCount } = await db.query(
            'DELETE FROM user_project_join_request WHERE user_id = $1 AND project_id = $2',
            [userId, projectId]
        );
        return rowCount > 0;
    }
};

module.exports = User;