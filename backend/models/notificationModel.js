const pool = require('../db');

const getNotifications = async (userId) => {
    const result = await pool.query(
        'SELECT * FROM notifications WHERE user_id = $1',
        [userId]
    );
    return result.rows[0];
}

const sendNotification = async (message, userId) => {
    const result = await pool.query(
        'INSERT INTO notifications (message, user_id) VALUES ($1, $2) RETURNING *',
        [message, userId]
    );
    return result.rows[0];
}


module.exports = {
    getNotifications,
    sendNotification
};

