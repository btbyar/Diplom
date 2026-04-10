import { Router, Request, Response } from 'express';
import { Booking } from '../models/Booking.js';
import { Service } from '../models/Service.js';

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

    const service = await Service.findById(serviceId);
    if (!service) {
      res.status(404).json({ error: 'Үйлчилгээ олдсонгүй' });
      return;
    }

    const newBooking = new Booking({
      userId,
      serviceId,
      date,
      time,
      brand: brand || 'Бүх марк',
      status: 'payment_pending',
      notes,
    });

    await newBooking.save();
    await newBooking.populate('userId');
    await newBooking.populate('serviceId');

    // Call Byl.mn API
    let paymentUrl = '';
    const projectId = process.env.BYL_PROJECT_ID;
    const apiKey = process.env.BYL_API_KEY;

    try {
        const response = await fetch(`https://byl.mn/api/v1/projects/${projectId}/checkouts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            items: [
              {
                price_data: {
                  currency: 'MNT',
                  unit_amount: service.price,
                  product_data: {
                    name: service.name,
                    description: `Цаг захиалга: ${date} ${time}`
                  }
                },
                quantity: 1
              }
            ],
            success_url: `http://localhost:5173/payment-success?booking_id=${newBooking._id}`,
            cancel_url: `http://localhost:5173/`,
            client_reference_id: newBooking._id.toString()
          })
        });

        const responseText = await response.text();
        console.log('Byl API status:', response.status);
        console.log('Byl API response:', responseText);

        if (response.ok) {
           const data = JSON.parse(responseText) as any;
           paymentUrl = data.data?.url || data.url || data.checkoutUrl || data.checkout_url || '';
           console.log('Byl payment URL:', paymentUrl);
        } else {
           console.error('Byl API error:', responseText);
           paymentUrl = `http://localhost:5173/payment-success?booking_id=${newBooking._id}`;
        }
    } catch (apiError) {
      console.error('Byl API холболтын алдаа:', apiError);
      paymentUrl = `http://localhost:5173/payment-success?booking_id=${newBooking._id}`;
    }

    res.status(201).json({ booking: newBooking, paymentUrl });
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

