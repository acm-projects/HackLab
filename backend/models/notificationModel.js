const pool = require('../db');

const getNotifications = async (userId) => {
    const result = await pool.query(
        'SELECT * FROM notifications WHERE user_id = $1',
        [userId]
    );
    return result.rows[0];
}

const deleteNotification = async (notificationId) => {
    const result = await pool.query(
        'DELETE FROM notifications WHERE id = $1 RETURNING *',
        [notificationId]
    );
    return result.rowCount > 0; // Return true if a row was deleted, false otherwise
};


module.exports = {
    getNotifications,
    deleteNotification
};

