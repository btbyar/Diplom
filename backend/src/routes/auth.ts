import { Router, Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { User } from '../models/User.js';

export const authRoutes = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

authRoutes.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ error: 'Имэйл болон нууц үг шаардлагатай' });
      return;
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Хэрэглэгч олдсонгүй' });
      return;
    }

    // Check password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Нууц үг буруу байна' });
      return;
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Login алдаа:', error);
    res.status(500).json({ error: 'Сервер алдаа' });
  }
});

authRoutes.post('/logout', (_req: Request, res: Response) => {
  res.json({ message: 'Амжилттай гарлаа' });
});

authRoutes.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'Token шаардлагатай' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(404).json({ error: 'Хэрэглэгч олдсонгүй' });
      return;
    }

    res.json({
      id: user._id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Me алдаа:', error);
    res.status(401).json({ error: 'Мэдээлэл авах нь чадалгүй' });
  }
});

authRoutes.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Имэйл хаяг шаардлагатай' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Security best practice: don't reveal if user exists or not
      res.json({ message: 'Сэргээх линк илгээгдлээ (хэрэв бүртгэлтэй бол)' });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Нууц үг сэргээх хүсэлт - Xpand Car Service',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <h2 style="color: #0d274d; text-align: center;">Нууц үг сэргээх</h2>
            <p>Сайн байна уу?</p>
            <p>Таны бүртгэлээс нууц үг сэргээх хүсэлт ирлээ. Хэрэв та энэ хүсэлтийг гаргаагүй бол энэ имэйлийг үл тооно уу.</p>
            <p>Нууц үгээ шинэчлэхийн тулд доорх товч дээр дарна уу:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #fca311; color: #0d274d; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Нууц үг шинэчлэх</a>
            </div>
            <p>Энэхүү холбоос нь 1 цагийн дараа хүчингүй болно.</p>
            <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;" />
            <p style="font-size: 12px; color: #666; text-align: center;">
              Хүндэтгэсэн,<br/>
              Xpand Car Service баг
            </p>
          </div>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log('Эмейл амжилттай илгээгдлээ:', email);
      } catch (emailError) {
        console.error('Email sending error:', emailError);
      }
    } else {
      // Simulate email send (fallback when env is not set)
      console.log('\n=============================================');
      console.log('ЭНЭ НЬ МЕЙЛЭЭР ЯВСАН ЛИНК ГЭЖ БОДНО (TESTING):');
      console.log(`Нууц үг сэргээх линк: ${resetUrl}`);
      console.log('=============================================\n');
    }

    res.json({ message: 'Сэргээх линк илгээгдлээ (хэрэв бүртгэлтэй бол)' });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Серверийн алдаа гарлаа' });
  }
});

authRoutes.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({ error: 'Мэдээлэл дутуу байна' });
      return;
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      res.status(400).json({ error: 'Таны холбоос буруу эсвэл хугацаа нь дууссан байна' });
      return;
    }

    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Нууц үг амжилттай шинэчлэгдлээ' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Серверийн алдаа гарлаа' });
  }
});
