require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Import the pool
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swaggerConfig");

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = socketio(server); // Initialize socket.io with the server

app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Import route files
const skillRoutes = require('./routes/skillRoutes');
const topicRoutes = require('./routes/topicRoutes');
const roleRoutes = require('./routes/roleRoutes');


// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Use the routes
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/skills', skillRoutes);
app.use('/topics', topicRoutes);
app.use('/roles', roleRoutes);
chatRoutes(io); // Pass the io instance to chatRoutes

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => { // Use server.listen instead of app.listen
    console.log(`Server running on port ${PORT}`);
    console.log("Swagger Docs available at http://localhost:3000/api-docs");
});