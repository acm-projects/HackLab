// uploadMiddleware.js
const multer = require('multer');

// Configure Multer to store uploaded files in memory (or disk if preferred)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Export the middleware so it can be used in other files
module.exports = upload;