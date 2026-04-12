import { Router, Request, Response } from 'express';
import { User } from '../models/User.js';
import bcryptjs from 'bcryptjs';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';

export const userRoutes = Router();

// Admin only: get all users
userRoutes.get('/', authenticate, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error: any) {
    console.error('Users авах алдаа:', error);
    res.status(500).json({ error: 'Сервер алдаа' });
  }
});

userRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      res.status(400).json({ error: 'Нэр, имэйл, утас, нууц үг шаардлагатай' });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'Энэ имэйл аль хэдийн ашиглагдаж байна' });
      return;
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'user', // Always default to user for public registration
    });

    const userWithoutPassword = newUser.toObject() as any;
    delete userWithoutPassword.password;

    res.status(201).json(userWithoutPassword);
  } catch (error: any) {
    console.error('User үүсгэх алдаа:', error);
    res.status(500).json({ error: 'Сервер алдаа' });
  }
});

userRoutes.get('/:id', authenticate, async (req: any, res: Response) => {
  try {
    const userId = req.params.id;
    // Only admin or the user themselves can view this profile
    if (req.userRole !== 'admin' && req.userId !== userId) {
      res.status(403).json({ error: 'Танд энэ мэдээллийг харах эрх байхгүй' });
      return;
    }

    const user = await User.findById(userId).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'Хэрэглэгч олдсонгүй' });
    }
  } catch (error: any) {
    console.error('User авах алдаа:', error);
    res.status(500).json({ error: 'Сервер алдаа' });
  }
});

userRoutes.put('/:id', authenticate, async (req: any, res: Response) => {
  try {
    const userId = req.params.id;
    const { name, phone, role } = req.body;

    // Only admin or the user themselves can edit this profile
    if (req.userRole !== 'admin' && req.userId !== userId) {
      res.status(403).json({ error: 'Танд энэ мэдээллийг засах эрх байхгүй' });
      return;
    }

    if (!userId) {
      res.status(400).json({ error: 'Хэрэглэгчийн ID шаардлагатай' });
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, phone, role },
      { new: true }
    ).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'Хэрэглэгч олдсонгүй' });
    }
  } catch (error: any) {
    console.error('User засах алдаа:', error);
    res.status(500).json({ error: 'Сервер алдаа' });
  }
});

// Admin only: delete user
userRoutes.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
      res.json({ message: 'Хэрэглэгч устгалаа' });
    } else {
      res.status(404).json({ error: 'Хэрэглэгч олдсонгүй' });
    }
  } catch (error: any) {
    console.error('User устгах алдаа:', error);
    res.status(500).json({ error: 'Сервер алдаа' });
  }
});

