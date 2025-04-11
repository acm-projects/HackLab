const express = require('express');
const router = express.Router();
const { getNotifications, deleteNotification } = require('../models/notificationModel');

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


        // Listen for a request to delete a notification
        socket.on('deleteNotification', async (notificationId) => {
            try {
                const result = await deleteNotification(notificationId);
                if (result) {
                    socket.emit('notificationDeleted', { notificationId }); // Notify the client of successful deletion
                } else {
                    socket.emit('error', { message: 'Failed to delete notification' });
                }
            } catch (error) {
                console.error('Error deleting notification:', error);
                socket.emit('error', { message: 'Failed to delete notification' });
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

