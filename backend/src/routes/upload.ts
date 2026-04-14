import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';

export const uploadRoutes = Router();

// Ensure uploads directory exists
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up local storage
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
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
    
    // Буцаах хаяг нь /uploads/ файл-нэр.jpg байна
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
});
