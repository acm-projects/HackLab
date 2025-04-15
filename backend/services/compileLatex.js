const latex = require('latex');

async function compileLatexToPdfStream(latexContent, res) {
  try {
    // Create a readable stream from the LaTeX content
    const input = Buffer.from(latexContent, 'utf-8');

    // Compile the LaTeX content to a PDF
    const pdfStream = latex(input);

    // Set the response headers for PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="resume.pdf"');
    res.setHeader('X-Latex-Content', encodeURIComponent(latexContent)); // Encode LaTeX text for safe transmission

    // Pipe the PDF stream directly to the response
    pdfStream.pipe(res);

    pdfStream.on('error', (error) => {
      console.error('Error during LaTeX compilation:', error);
      res.status(500).send('Failed to compile LaTeX');
    });

    pdfStream.on('end', () => {
      console.log('PDF successfully sent to the client');
    });
  } catch (error) {
    console.error('Error during LaTeX compilation:', error);
    res.status(500).send('Failed to compile LaTeX');
  }
}

module.exports = { compileLatexToPdfStream };