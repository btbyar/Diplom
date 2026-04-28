import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary-v2';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';

export const uploadRoutes = Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage — зургийг шууд Cloudinary руу хадгална
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'car-service-parts',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
  } as any,
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

uploadRoutes.post(
  '/',
  authenticate,
  requireAdmin,
  upload.single('image'),
  (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: 'Зураг оруулаагүй байна' });
      return;
    }

    // Cloudinary-аас буцаах URL (path property)
    const url = (req.file as any).path;
    res.json({ url });
  }
);
