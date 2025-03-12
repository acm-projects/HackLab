const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

// Configure AWS SDK with root access keys
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// Function to upload an image to S3
const uploadImageToS3 = async (file) => {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME, // Your S3 bucket name
        Key: `project-thumbnails/${Date.now()}_${file.originalname}`, // Unique file name
        Body: file.buffer, // The file content (buffer stored in memory by Multer)
        ContentType: file.mimetype // Content type
        //ACL: 'public-read', // Set permissions to public read
    };

    try {
        const s3Response = await s3.upload(params).promise();
        return s3Response.Location; // This is the URL of the uploaded image
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw new Error('Error uploading image to S3');
    }
};

module.exports = { uploadImageToS3 };