const pool = require('../db');

const saveLatex = async (latexContent, id) => {
    const { rows } = await pool.query(
        `UPDATE users 
         SET generated_resume_latex = $1
         WHERE id = $2
         RETURNING generated_resume_latex`,
        [latexContent, id]
    );
    return rows[0];
};

const getLatex = async (id) => {
    const { rows } = await pool.query(
        `SELECT generated_resume_latex 
         FROM users 
         WHERE id = $1`,
        [id]
    );

    // Return the LaTeX content or null if not found
    return rows[0]?.generated_resume_latex || null;
};

module.exports = {
    saveLatex,
    getLatex
}