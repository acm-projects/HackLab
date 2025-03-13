require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests

// Import route files
//const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const skillRoutes = require('./routes/skillRoutes');
const topicRoutes = require('./routes/topicRoutes');
const roleRoutes = require('./routes/roleRoutes');

// Use the routes
//app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/skills', skillRoutes);
app.use('/topics', topicRoutes);
app.use('/roles', roleRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
