import { Router, Request, Response } from 'express';
import { User } from '../models/User.js';
import bcrypt from 'bcrypt';

export const userRoutes = Router();

userRoutes.get('/', async (_req: Request, res: Response) => {
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
    const { name, email, phone, password, role } = req.body;

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
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || 'user',
    });

    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;

    res.status(201).json(userWithoutPassword);
  } catch (error: any) {
    console.error('User үүсгэх алдаа:', error);
    res.status(500).json({ error: 'Сервер алдаа' });
  }
});

userRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
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

userRoutes.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, phone, role } = req.body;
    const userId = req.params.id;

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

userRoutes.delete('/:id', async (req: Request, res: Response) => {
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

