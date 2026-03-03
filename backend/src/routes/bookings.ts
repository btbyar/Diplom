import { Router, Request, Response } from 'express';
import { Booking } from '../models/Booking.js';

export const bookingRoutes = Router();

bookingRoutes.get('/', async (_req: Request, res: Response) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email phone')
      .populate('serviceId', 'name price duration');
    res.json(bookings);
  } catch (error: any) {
    console.error('Bookings авах алдаа:', error);
    res.status(500).json({ error: 'Сервер алдаа' });
  }
});

bookingRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId')
      .populate('serviceId');
    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ error: 'Захиалга олдсонгүй' });
    }
  } catch (error: any) {
    console.error('Booking авах алдаа:', error);
    res.status(500).json({ error: 'Сервер алдаа' });
  }
});

bookingRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, serviceId, date, time, brand, status, notes } = req.body;

    // Validate input
    if (!userId || !serviceId || !date || !time) {
      res.status(400).json({ error: 'Шаардлагатай мэдээлэл дутуу байна' });
      return;
    }

    const newBooking = new Booking({
      userId,
      serviceId,
      date,
      time,
      brand: brand || 'Бүх марк',
      status: status || 'pending',
      notes,
    });

    await newBooking.save();
    await newBooking.populate('userId').populate('serviceId');

    res.status(201).json(newBooking);
  } catch (error: any) {
    console.error('Booking үүсгэх алдаа:', error);
    res.status(500).json({ error: 'Сервер алдаа' });
  }
});

bookingRoutes.put('/:id', async (req: Request, res: Response) => {
  try {
    const { status, notes, brand } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, notes, brand },
      { new: true }
    )
      .populate('userId')
      .populate('serviceId');

    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ error: 'Захиалга олдсонгүй' });
    }
  } catch (error: any) {
    console.error('Booking засах алдаа:', error);
    res.status(500).json({ error: 'Сервер алдаа' });
  }
});

bookingRoutes.delete('/:id', async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (booking) {
      res.json({ message: 'Захиалга устгалаа' });
    } else {
      res.status(404).json({ error: 'Захиалга олдсонгүй' });
    }
  } catch (error: any) {
    console.error('Booking устгах алдаа:', error);
    res.status(500).json({ error: 'Сервер алдаа' });
  }
});

