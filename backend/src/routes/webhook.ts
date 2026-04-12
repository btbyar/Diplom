import { Router, Request, Response } from 'express';
import { Booking } from '../models/Booking.js';
import { Order } from '../models/Order.js';

export const webhookRoutes = Router();

webhookRoutes.post('/byl', async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    console.log('Byl.mn webhook received payload:', payload);

    // Check for explicit order_id or booking_id in query
    const bookingId = req.query.booking_id || (payload.booking_id);
    const orderId = req.query.order_id || (payload.order_id);
    const referenceId = payload.client_reference_id || payload.description?.match(/([0-9a-fA-F]{24})/)?.[0];

    // Byl status: "paid" or "success", depending on API
    const isSuccess = payload.status === 'paid' || payload.status === 'success' || payload.has_paid === true;

    if (isSuccess) {
      if (bookingId || (referenceId && !orderId)) {
        const idToUpdate = bookingId || referenceId;
        const booking = await Booking.findByIdAndUpdate(
          idToUpdate,
          { status: 'confirmed' },
          { new: true }
        );
        if (booking) console.log(`Booking ${idToUpdate} payment confirmed via webhook`);
      }
      
      if (orderId || referenceId) {
        const idToUpdate = orderId || referenceId;
        const order = await Order.findByIdAndUpdate(
          idToUpdate,
          { paymentStatus: 'paid' },
          { new: true }
        );
        if (order) console.log(`Order ${idToUpdate} payment confirmed via webhook`);
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook алдаа:', error);
    res.status(500).json({ error: 'Сервер алдаа' });
  }
});
