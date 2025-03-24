const pool = require('../db');

const getAllTopics = async () => {
    const result = await pool.query('SELECT * FROM topic');
    return result.rows;
};

const getTopicById = async (id) => {
    const result = await pool.query('SELECT * FROM topic WHERE id = $1', [id]);
    return result.rows[0];
};

module.exports = {
    getAllTopics,
    getTopicById
};