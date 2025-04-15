const express = require('express');
const router = express.Router();
const { compileLatexToPdfStream } = require('../services/compileLatex');
const { saveLatex, getLatex } = require('../models/latex');

// Recompile from being sent latex
router.post('/:id', async (req, res) => {
    try {
        // Extract the LaTeX content from the request body
        const { resume } = req.body;
        const userId = req.params.id;

        if (!resume) {
            return res.status(400).send('LaTeX content (resume) is required');
        }

        const decodedLatex = decodeURIComponent(resume);

        await saveLatex(decodedLatex, userId);

        // Compile LaTeX and stream the PDF to the response
        console.log('Compiling LaTeX to PDF...');
        await compileLatexToPdfStream(decodedLatex, res);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Failed to generate PDF');
    }
});

// Recompile from user's saved LaTeX
router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // Retrieve the user's saved LaTeX content from the database
        const resume = await getLatex(userId);

        if (!resume) {
            return res.status(404).send('No saved LaTeX content found for this user');
        }

        const latexContent = resume;

        // Compile LaTeX and stream the PDF to the response
        console.log('Compiling saved LaTeX to PDF...');
        await compileLatexToPdfStream(latexContent, res);
    } catch (error) {
        console.error('Error recompiling saved LaTeX:', error);
        res.status(500).send('Failed to recompile saved LaTeX');
    }
});

module.exports = router;