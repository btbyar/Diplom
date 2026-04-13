import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

import { authRoutes } from './routes/auth.js';
import { bookingRoutes } from './routes/bookings.js';
import { serviceRoutes } from './routes/services.js';
import { userRoutes } from './routes/users.js';
import { partRoutes } from './routes/parts.js';
import { uploadRoutes } from './routes/upload.js';
import { vehicleRoutes } from './routes/vehicles.js';
import { webhookRoutes } from './routes/webhook.js';
import { orderRoutes } from './routes/orders.js';



dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-service';

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  ...(process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map((url) => url.trim())
    : []),
];

// Middleware
app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: origin not allowed'));
    }
  },
  credentials: true,
}));
app.use(express.json());
// process.cwd() → always points to backend/ regardless of dev/prod
const uploadsPath = path.resolve(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));

// MongoDB холболт
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('✅ MongoDB холболт амжилттай');
  })
  .catch((err) => {
    console.error('❌ MongoDB холболт алдаа:', err.message);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/parts', partRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Server ажиллаж байна' });
});

app.listen(port, () => {
  console.log(`🚀 Server ${port}-р ажиллаж байна`);
  console.log(`📡 http://localhost:${port}`);
  console.log(`📍 API available at http://localhost:${port}/api`);
});
