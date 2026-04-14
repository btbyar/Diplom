import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();

export const uploadRoutes = Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'xpand_car_service',
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
    } as any,
});

const upload = multer({ 
    storage, 
    limits: { fileSize: 5 * 1024 * 1024 } 
});

uploadRoutes.post('/', authenticate, requireAdmin, upload.single('image'), (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).json({ error: 'Зураг оруулаагүй байна' });
        return;
    }
    
    // Cloudinary нь зурагны URL-ийг 'path' дотор буцаадаг
    const url = req.file.path;
    res.json({ url });
});
