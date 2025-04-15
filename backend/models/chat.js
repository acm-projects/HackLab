const db = require('../db.js');

// SHOULD PROBABLY CHANGE SOME OF THESE THINGS TO JUST USE THE OTHER MODELS BUT IDK
const Chat = {
    getUserID: async (username) => {
        const query = 'SELECT id FROM users WHERE name = $1'; // gets user_id from username (name in your schema)
        const result = await db.query(query, [username]);
        return result.rows[0]?.id; // return the user_id or undefined if not found
    },
    
    getProjectID: async (projectName) => {
        try {
            const query = 'SELECT id FROM project WHERE title = $1'; // gets project_id from project name (title in your schema)
            const result = await db.query(query, [projectName]);
            return result.rows[0]?.id; // return the project_id or undefined if not found
        } catch (error) {
            console.error('Error in getProjectID:', error); 
            throw error; 
        }
    },
    
    getProjectName: async (projectID) => {
        try {
            const query = 'SELECT title FROM project WHERE id = $1'; // get project name (title) from project_id
            const result = await db.query(query, [projectID]);
            return result.rows[0]?.title; // Return the project name or undefined if not found
        } catch (error) {
            console.error('Error in getProjectName:', error); 
            throw error; 
        }
    },
    
    getUserName: async (userID) => {
        try {
            const query = 'SELECT name FROM users WHERE id = $1'; // get username for given user ID
            const result = await db.query(query, [userID]);
            const username = result.rows[0]?.name; // store name
            return username; // return name
        } catch (error) {
            console.error('Error fetching username:', error);
            return 'Unknown User';
        }
    },
    
    getProjects: async (UID) => {
        // have to first get array of project id for user id and then get those project ids from project table
        try {
            console.log(UID)
            const query = 'SELECT * FROM user_project WHERE user_id = $1'; // gets all projects that aren't dms (assuming "dm" is a type)
            const result = await db.query(query, [UID]);
            console.log(result.rows)
            //console.log(result.rows.project_id)
    
            return result.rows; // should return array of all project id's user is a part of
        } catch (error) {
            console.error('Error fetching projects', error);
            throw error;
        }
    },

    getUsersByProject: async (project_id) => {
        try {
            const query = `
                SELECT u.id, u.name 
                FROM users u
                JOIN user_project up ON u.id = up.user_id
                WHERE up.project_id = $1;
            `;
            const result = await db.query(query, [project_id]);
            return result.rows; // Returns an array of users with their id and name
        } catch (error) {
            console.error('Error fetching users by project:', error);
            throw error;
        }
    },
    
    saveMessage: async (user_id, project_id, message, is_dm) => {
        if (!is_dm){ // project chat
            const query = 'INSERT INTO projects_chat (project_id, sender_id, message) VALUES ($1, $2, $3) RETURNING *'; // save message to database
            const values = [project_id, user_id, message];
            await db.query(query, values);
        }
        else{
            console.log(user_id)
            const query = 'INSERT INTO dm_chat (sender_id, receiver_id, message) VALUES ($1, $2, $3) RETURNING *'; // save message to database
            const values = [user_id, project_id, message]; // just use project_id as receiver_id when calling method for dms
            await db.query(query, values);
        }
    },
    getMessagesByProject: async (project_id) => {
        const query = 'SELECT * FROM projects_chat WHERE project_id = $1 ORDER BY time ASC'; // get messages from project chat in chronological order
        const result = await db.query(query, [project_id]);
        return result.rows.map((message) => ({
            ...message,
            time: message.time, // format time
        }));
    },
    getDMs: async (user_id) => {
        console.log(user_id)
        const query = 'SELECT * FROM dm_chat WHERE receiver_id = $1'; // gets all DM projects where user is initial recipient
        const result = await db.query(query, [user_id]);
        return result.rows.map((message) => ({
            ...message,
            time: message.time, // format time
        }));
    },
    
    getSentDMs: async (user_id) => {
        const query = 'SELECT * FROM dm_chat WHERE sender_id = $1'; // gets all DM projects where the user initially sent DM
        const result = await db.query(query, [user_id]);
        return result.rows.map((message) => ({
            ...message,
            time: message.time, // format time
        }));
    },
    
    // formatTime: (timestamp) => { // converts PostgreSQL timestamp to pretty time format
    //     const date = new Date(timestamp);
    //     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    //     const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    //     const month = months[date.getMonth()];
    //     const day = days[date.getDay()];
    //     const hours = date.getHours() % 12 || 12; 
    //     const minutes = date.getMinutes().toString().padStart(2, '0');
    //     const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    
    //     return `${month}:${day}:${hours}:${minutes} ${ampm}`;
    // },
}


module.exports = Chat;