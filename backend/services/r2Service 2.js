const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Initialize R2 Client (Cloudflare R2 is S3-compatible)
const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || 'dummy',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || 'dummy',
    },
});

/**
 * Upload a file to Cloudflare R2
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} fileName - The name to save the file as
 * @param {string} contentType - MIME type of the file
 * @returns {Promise<string>} - The public URL of the uploaded file
 */
async function uploadToR2(fileBuffer, fileName, contentType) {
    const bucketName = process.env.R2_BUCKET_NAME;

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: contentType,
    });

    try {
        await r2Client.send(command);
        // Return the public URL
        const publicUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;
        return publicUrl;
    } catch (error) {
        console.error('Error uploading to R2:', error);
        throw new Error('Failed to upload image to R2');
    }
}

/**
 * Delete a file from Cloudflare R2
 * @param {string} fileName - The name of the file to delete
 */
async function deleteFromR2(fileName) {
    const bucketName = process.env.R2_BUCKET_NAME;

    const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileName,
    });

    try {
        await r2Client.send(command);
        console.log(`Deleted ${fileName} from R2`);
    } catch (error) {
        console.error('Error deleting from R2:', error);
        throw new Error('Failed to delete image from R2');
    }
}

/**
 * Generate a presigned URL for temporary access to a private file
 * @param {string} fileName - The name of the file
 * @param {number} expiresIn - Expiration time in seconds (default: 3600)
 * @returns {Promise<string>} - The presigned URL
 */
async function getPresignedUrl(fileName, expiresIn = 3600) {
    const bucketName = process.env.R2_BUCKET_NAME;

    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileName,
    });

    try {
        const url = await getSignedUrl(r2Client, command, { expiresIn });
        return url;
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        throw new Error('Failed to generate presigned URL');
    }
}

module.exports = {
    uploadToR2,
    deleteFromR2,
    getPresignedUrl,
    r2Client,
};
