require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Import the pool
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = socketio(server); // Initialize socket.io with the server

app.use(cors({
    exposedHeaders: ['X-Latex-Content'], // Expose the custom header to the frontend
}));
app.use(express.json()); // Middleware to parse JSON requests
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Import route files
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const skillRoutes = require('./routes/skillRoutes');
const topicRoutes = require('./routes/topicRoutes');
const roleRoutes = require('./routes/roleRoutes');
const chatRoutes = require('./routes/chatRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const latexRoutes = require('./routes/latexRoutes');

// Use the routes
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/skills', skillRoutes);
app.use('/topics', topicRoutes);
app.use('/roles', roleRoutes);
app.use('/recompile', latexRoutes);
chatRoutes(io); // Pass the io instance to chatRoutes
notificationRoutes(io);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => { // Use server.listen instead of app.listen
    console.log(`Server running on port ${PORT}`);
});