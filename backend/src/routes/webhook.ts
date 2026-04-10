import { Router, Request, Response } from 'express';
import { Booking } from '../models/Booking.js';

export const webhookRoutes = Router();

webhookRoutes.post('/byl', async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    console.log('Byl.mn webhook received payload:', payload);

    // Byl usually sends order status here. Let's assume payload has checking info like status, amount
    // And ideally a reference to our booking ID usually passed through metadata/description/custom fields.
    // Given simple mock, we'll extract maybe booking ID from a query param or payload.
    const bookingId = req.query.booking_id || payload.order_id || payload.booking_id || payload.description?.match(/([0-9a-fA-F]{24})/)?.[0];

    if (!bookingId) {
       res.status(400).json({ error: 'Захиалгын ID олдсонгүй' });
       return;
    }

    // Byl status: "paid" or "success", depending on API
    const isSuccess = payload.status === 'paid' || payload.status === 'success' || payload.has_paid === true;

    if (isSuccess) {
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { status: 'confirmed' },
        { new: true }
      );
      if (booking) {
         console.log(`Booking ${bookingId} payment confirmed via webhook`);
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook алдаа:', error);
    res.status(500).json({ error: 'Сервер алдаа' });
  }
});
