const pool = require('../db');

const getAllRoles = async () => {
    const result = await pool.query('SELECT * FROM role');
    return result.rows;
};

module.exports = {
    getAllRoles
};