const pool = require('../db');

const getAllTopics = async () => {
    const result = await pool.query('SELECT * FROM topic');
    return result.rows;
};

module.exports = {
    getAllTopics
};