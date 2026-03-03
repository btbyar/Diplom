import { Router, Request, Response } from 'express';
import { Part } from '../models/Part.js';

export const partRoutes = Router();

partRoutes.get('/', async (_req: Request, res: Response) => {
  try {
    const parts = await Part.find().sort({ createdAt: -1 });
    res.json(parts);
  } catch (error: any) {
    console.error('Parts fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

partRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const part = await Part.findById(req.params.id);
    if (!part) {
      res.status(404).json({ error: 'Part not found' });
      return;
    }
    res.json(part);
  } catch (error: any) {
    console.error('Part fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

partRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, partNumber, category, brand, price, quantity } = req.body;

    if (!name || price === undefined) {
      res.status(400).json({ error: 'Name and price are required' });
      return;
    }

    if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
      res.status(400).json({ error: 'Price must be a non-negative number' });
      return;
    }

    if (
      quantity !== undefined &&
      (typeof quantity !== 'number' || Number.isNaN(quantity) || quantity < 0)
    ) {
      res.status(400).json({ error: 'Quantity must be a non-negative number' });
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
    });

    await newPart.save();
    res.status(201).json(newPart);
  } catch (error: any) {
    console.error('Part create error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

partRoutes.put('/:id', async (req: Request, res: Response) => {
  try {
    const partId = req.params.id;
    if (!partId) {
      res.status(400).json({ error: 'Part id is required' });
      return;
    }

    const { name, description, partNumber, category, brand, price, quantity } = req.body;

    if (price !== undefined && (typeof price !== 'number' || Number.isNaN(price) || price < 0)) {
      res.status(400).json({ error: 'Price must be a non-negative number' });
      return;
    }

    if (
      quantity !== undefined &&
      (typeof quantity !== 'number' || Number.isNaN(quantity) || quantity < 0)
    ) {
      res.status(400).json({ error: 'Quantity must be a non-negative number' });
      return;
    }

    const part = await Part.findByIdAndUpdate(
      partId,
      { name, description, partNumber, category, brand, price, quantity },
      { new: true }
    );

    if (!part) {
      res.status(404).json({ error: 'Part not found' });
      return;
    }

    res.json(part);
  } catch (error: any) {
    console.error('Part update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

partRoutes.delete('/:id', async (req: Request, res: Response) => {
  try {
    const partId = req.params.id;
    if (!partId) {
      res.status(400).json({ error: 'Part id is required' });
      return;
    }

    const part = await Part.findByIdAndDelete(partId);
    if (!part) {
      res.status(404).json({ error: 'Part not found' });
      return;
    }

    res.json({ message: 'Part deleted' });
  } catch (error: any) {
    console.error('Part delete error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

