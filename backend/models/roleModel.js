const pool = require('../db');

const getAllRoles = async () => {
    const result = await pool.query('SELECT * FROM role');
    return result.rows;
};

const getRoleById = async (id) => {
    const result = await pool.query('SELECT * FROM roles WHERE id = $1', [id]);
    return result.rows[0];
};

module.exports = {
    getAllRoles, getRoleById
};