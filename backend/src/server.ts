import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { authRoutes } from './routes/auth.js';
import { bookingRoutes } from './routes/bookings.js';
import { serviceRoutes } from './routes/services.js';
import { userRoutes } from './routes/users.js';
import { partRoutes } from './routes/parts.js';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-service';

// Middleware
app.use(cors());
app.use(express.json());

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server ажиллаж байна' });
});

app.listen(port, () => {
  console.log(`🚀 Server ${port}-р ажиллаж байна`);
  console.log(`📡 http://localhost:${port}`);

  console.log(`📍 API available at http://localhost:${port}/api`);
});
