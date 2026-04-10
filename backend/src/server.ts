import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { authRoutes } from './routes/auth.js';
import { bookingRoutes } from './routes/bookings.js';
import { serviceRoutes } from './routes/services.js';
import { userRoutes } from './routes/users.js';
import { partRoutes } from './routes/parts.js';
import { uploadRoutes } from './routes/upload.js';
import { vehicleRoutes } from './routes/vehicles.js';
import { webhookRoutes } from './routes/webhook.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-service';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server ажиллаж байна' });
});

app.listen(port, () => {
  console.log(`🚀 Server ${port}-р ажиллаж байна`);
  console.log(`📡 http://localhost:${port}`);
  console.log(`📍 API available at http://localhost:${port}/api`);
});
