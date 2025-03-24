const pool = require('../db');

const getAllSkills = async () => {
    const result = await pool.query('SELECT * FROM skill');
    return result.rows;
};

const getSkillById = async (id) => {
    const result = await pool.query('SELECT * FROM skills WHERE id = $1', [id]);
    return result.rows[0];
};

module.exports = {
    getAllSkills,
    getSkillById
};