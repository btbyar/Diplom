import { Router, Request, Response } from 'express';
import { Part } from '../models/Part.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';

export const partRoutes = Router();

partRoutes.get('/', async (_req: Request, res: Response) => {
  try {
    const parts = await Part.find().sort({ createdAt: -1 });
    res.json(parts);
  } catch (error: any) {
    console.error('Parts fetch error:', error);
    res.status(500).json({ error: 'Сервер алдаа' });
  }
});

partRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const part = await Part.findById(req.params.id);
    if (!part) {
      res.status(404).json({ error: 'Сэлбэг олдсонгүй' });
      return;
    }
    res.json(part);
  } catch (error: any) {
    console.error('Part fetch error:', error);
    res.status(500).json({ error: 'Сервер алдаа' });
  }
});

partRoutes.post('/', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { name, description, partNumber, category, brand, price, quantity, imageUrl } = req.body;

    if (!name || price === undefined) {
      res.status(400).json({ error: 'Нэр болон үнэ шаардлагатай' });
      return;
    }

    if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
      res.status(400).json({ error: 'Үнэ эерэг тоо байх ёстой' });
      return;
    }

    if (
      quantity !== undefined &&
      (typeof quantity !== 'number' || Number.isNaN(quantity) || quantity < 0)
    ) {
      res.status(400).json({ error: 'Тоо хэмжээ эерэг тоо байх ёстой' });
      return;
    }

    const newPart = new Part({
      name,
      description,
      partNumber,
      category,
      brand,
      price,
      quantity: quantity ?? 0,
      imageUrl,
    });

    await newPart.save();
    res.status(201).json(newPart);
  } catch (error: any) {
    console.error('Part create error:', error);
    res.status(500).json({ error: 'Сервер алдаа' });
  }
});

partRoutes.put('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const partId = req.params.id;
    if (!partId) {
      res.status(400).json({ error: 'Сэлбэгийн ID шаардлагатай' });
      return;
    }

    const { name, description, partNumber, category, brand, price, quantity, imageUrl } = req.body;

    if (price !== undefined && (typeof price !== 'number' || Number.isNaN(price) || price < 0)) {
      res.status(400).json({ error: 'Үнэ эерэг тоо байх ёстой' });
      return;
    }

    if (
      quantity !== undefined &&
      (typeof quantity !== 'number' || Number.isNaN(quantity) || quantity < 0)
    ) {
      res.status(400).json({ error: 'Тоо хэмжээ эерэг тоо байх ёстой' });
      return;
    }

    const part = await Part.findByIdAndUpdate(
      partId,
      { name, description, partNumber, category, brand, price, quantity, imageUrl },
      { new: true }
    );

    if (!part) {
      res.status(404).json({ error: 'Сэлбэг олдсонгүй' });
      return;
    }

    res.json(part);
  } catch (error: any) {
    console.error('Part update error:', error);
    res.status(500).json({ error: 'Сервер алдаа' });
  }
});

partRoutes.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const partId = req.params.id;
    if (!partId) {
      res.status(400).json({ error: 'Сэлбэгийн ID шаардлагатай' });
      return;
    }

    const part = await Part.findByIdAndDelete(partId);
    if (!part) {
      res.status(404).json({ error: 'Сэлбэг олдсонгүй' });
      return;
    }

    res.json({ message: 'Сэлбэг устгалаа' });
  } catch (error: any) {
    console.error('Part delete error:', error);
    res.status(500).json({ error: 'Сервер алдаа' });
  }
});

