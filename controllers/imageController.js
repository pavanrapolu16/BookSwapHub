import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import admin from '../config/firebaseConfig.js';
import sharp from 'sharp';

const bucket = admin.storage().bucket();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadImage = async (req, res) => {
    try {
        const filePath = path.join(__dirname, '..', req.file.path);
        const fileName = `book_${Date.now()}_${req.file.originalname}`;
        const destination = bucket.file(fileName);

        // Desired file size in bytes (300 KB in this example)
        const desiredFileSizeBytes = 300 * 1024;

        // Determine the image's original size
        const imageOriginalSize = fs.statSync(filePath).size;

        // Calculate the scaling factor to achieve the desired file size
        const scaleFactor = Math.sqrt(desiredFileSizeBytes / imageOriginalSize);

        // Compress and resize the image using Sharp
        await sharp(filePath)
            .resize({ width: Math.round(scaleFactor * 800) }) // Resize the image with a proportional width
            .jpeg({ quality: 90 }) // Set JPEG quality to 90%
            .toBuffer() // Convert the image to buffer
            .then(async (buffer) => {
                // Save the compressed image buffer to Firebase Storage
                await destination.save(buffer, {
                    metadata: { contentType: req.file.mimetype },
                    public: true
                });
            });

        const imageUrl = destination.publicUrl();

        // Clean up the temporary file
        fs.unlinkSync(filePath);
        console.log("Success in uploading image url: ", imageUrl);
        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
};
