const pool = require('../db');

const getAllSkills = async () => {
    const result = await pool.query('SELECT * FROM skill');
    return result.rows;
};

module.exports = {
    getAllSkills
};