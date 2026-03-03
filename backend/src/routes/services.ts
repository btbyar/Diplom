import { Router, Request, Response } from 'express';
import { Service } from '../models/Service.js';

export const serviceRoutes = Router();

serviceRoutes.get('/', async (_req: Request, res: Response) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error: any) {
    console.error('Services авах алдаа:', error);
    res.status(500).json({ error: 'Сервер алдаа' });
  }
});

serviceRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ error: 'Үйлчилгээ олдсонгүй' });
    }
  } catch (error: any) {
    console.error('Service авах алдаа:', error);
    res.status(500).json({ error: 'Сервер алдаа' });
  }
});

serviceRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, price, duration, brand } = req.body;

    // Validate input
    if (!name || !description || price === undefined || !duration) {
      res.status(400).json({ error: 'Шаардлагатай мэдээлэл дутуу байна' });
      return;
    }

    const newService = new Service({
      name,
      description,
      price,
      duration,
      brand: brand || 'Бүх марк',
    });

    await newService.save();
    res.status(201).json(newService);
  } catch (error: any) {
    console.error('Service үүсгэх алдаа:', error);
    res.status(500).json({ error: 'Сервер алдаа' });
  }
});

serviceRoutes.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, description, price, duration, brand } = req.body;
    const serviceId = req.params.id;

    if (!serviceId) {
      res.status(400).json({ error: 'Үйлчилгээний ID шаардлагатай' });
      return;
    }

    const service = await Service.findByIdAndUpdate(
      serviceId,
      { name, description, price, duration, brand },
      { new: true }
    );

    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ error: 'Үйлчилгээ олдсонгүй' });
    }
  } catch (error: any) {
    console.error('Service засах алдаа:', error);
    res.status(500).json({ error: 'Сервер алдаа' });
  }
});

serviceRoutes.delete('/:id', async (req: Request, res: Response) => {
  try {
    const serviceId = req.params.id;

    if (!serviceId) {
      res.status(400).json({ error: 'Үйлчилгээний ID шаардлагатай' });
      return;
    }

    const service = await Service.findByIdAndDelete(serviceId);
    if (service) {
      res.json({ message: 'Үйлчилгээ устгалаа' });
    } else {
      res.status(404).json({ error: 'Үйлчилгээ олдсонгүй' });
    }
  } catch (error: any) {
    console.error('Service устгах алдаа:', error);
    res.status(500).json({ error: 'Сервер алдаа' });
  }
});

