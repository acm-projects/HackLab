// chatRoutes.js
const Chat = require('../models/chat'); // Import the Chat model
const botName = 'HackLab Bot'; // for sending server messages

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');

        // Load projects for a user
        socket.on('loadProjects', async (UID) => {
            try {
                const projects = await Chat.getProjects(UID);
                socket.emit('projects', projects);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        });

        // Get user ID by username
        socket.on('getUID', async (username) => {
            try {
                const userID = await Chat.getUserID(username);
                socket.emit('returnUID', userID);
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        });

        // Get username by user ID
        socket.on('getUsername', async (UID, eventName) => {
            try {
                const username = await Chat.getUserName(UID);
                socket.emit(eventName, username);
            } catch (error) {
                console.error('Error fetching username:', error);
            }
        });

        // Get project ID by project name
        socket.on('getPID', async (project) => {
            try {
                const projectID = await Chat.getProjectID(project);
                socket.emit('returnPID', projectID);
            } catch (error) {
                console.error('Error fetching project ID:', error);
            }
        });

        // Get project name by project ID
        socket.on('getPName', async (PID, eventName) => {
            try {
                const name = await Chat.getProjectName(PID);
                socket.emit(eventName, name);
            } catch (error) {
                console.error('Error fetching project name:', error);
            }
        });

        // When a user joins a room
        socket.on('joinRoom', async ({ user_id, username, project_id }) => {
            try {
                const messages = await Chat.getMessagesByProject(project_id);
                const users = await Chat.getUsersByProject(project_id); // Fetch all users for the project
        
                socket.join(project_id);
                socket.emit('loadMessages', messages);
        
                // Emit the list of users to the client
                socket.emit('roomUsers', {
                    project_id,
                    users, // Send all users for the project
                });
        
                // Emit bot-alert with a timestamp
                socket.emit('bot-alert', { 
                    username: botName, 
                    text: `Welcome to ${await Chat.getProjectName(project_id)}!`, 
                    time: new Date().toISOString() 
                });
        
                socket.broadcast.to(project_id).emit('bot-alert', { 
                    username: botName, 
                    text: `${username} has joined the room`, 
                    time: new Date().toISOString() 
                });
            } catch (error) {
                console.error('Error joining room:', error);
            }
        });

        socket.on('joinDMRoom', async (user_id, username, other_id, roomName) => {
            try {
                socket.join(roomName); // Connect user's socket to the DM room
                socket.emit('loadDMMessages'); // Load past messages
        
                // Emit a welcome message or any other necessary setup
                socket.emit('bot-alert', { 
                    username: botName, 
                    text: `Welcome to your DM with ${await Chat.getUserName(other_id)}!`, 
                    time: new Date().toISOString() 
                });
            } catch (error) {
                console.error('Error joining DM room:', error);
            }
        });

        // Send a chat message
        socket.on('chatMessage', async (UID, msg, PID, isDM) => {
            try {
                await Chat.saveMessage(UID, PID, msg, isDM);
                const username = await Chat.getUserName(UID);
        
                if (isDM) {
                    // Construct the DM room name
                    const senderName = await Chat.getUserName(UID);
                    const receiverName = await Chat.getUserName(PID);
                    const roomName = senderName > receiverName ? `${receiverName + ' and ' + senderName}` : `${senderName + ' and ' + receiverName}`;
        
                    // Emit the message to the DM room
                    io.to(roomName).emit('message', { username, text: msg, time: Chat.formatTime(new Date()) });
                } else {
                    // Emit the message to the project room
                    io.to(PID).emit('message', { username, text: msg, time: Chat.formatTime(new Date()) });
                }
            } catch (error) {
                console.error('Error saving message:', error);
            }
        });

        // Get DMs for a user
        socket.on('getDMs', async (user_id) => {
            try {
                const rooms = await Chat.getDMs(user_id);
                socket.emit('loadDMs', rooms);
            } catch (error) {
                console.error('Error fetching DMs:', error);
            }
        });

        // Get sent DMs for a user
        socket.on('sentDMs', async (user_id) => {
            try {
                const rooms = await Chat.getSentDMs(user_id);
                socket.emit('loadSentDMs', rooms);
            } catch (error) {
                console.error('Error fetching sent DMs:', error);
            }
        });

        // User is typing
        socket.on('typing', ({ roomId, username }) => {
            socket.to(roomId).emit('userTyping', { username });
        });

        // User stopped typing
        socket.on('stopTyping', ({ roomId, username }) => {
            socket.to(roomId).emit('userStopTyping', { username });
        });

        // Handle user disconnect
        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
};


