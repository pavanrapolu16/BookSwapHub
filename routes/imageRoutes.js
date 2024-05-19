import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/imageController.js';

const router = express.Router();


const upload = multer({ dest: 'uploads/' });

router.post('/upload-image', upload.single('image'), uploadImage);

export default router;
