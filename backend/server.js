require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Import the pool

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests

// Import route files
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes.js');

// Use the routes
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
