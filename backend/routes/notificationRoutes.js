const express = require('express');
const router = express.Router();
const { getNotifications, sendNotification } = require('../models/notificationModel');

  module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');
        console.log(`User connected: ${socket.id}`);

        // Listen for a request to fetch notifications
        socket.on('getNotifications', async (userId) => {
            try {
                const notifications = await getNotifications(userId);
                socket.emit('notifications', notifications); // Send notifications back to the client
            } catch (error) {
                console.error('Error fetching notifications:', error);
                socket.emit('error', { message: 'Failed to fetch notifications' });
            }
        });

        // Listen for a request to send a notification (maybe not necessary)
        socket.on('sendNotification', async ({ message, userId }) => {
            try {
                const notification = await sendNotification(message, userId);
                io.emit(`notification_${userId}`, notification); // Broadcast to the specific user
            } catch (error) {
                console.error('Error sending notification:', error);
                socket.emit('error', { message: 'Failed to send notification' });
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

