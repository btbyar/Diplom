import { Router, Request, Response } from 'express';
import { Order } from '../models/Order.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/authMiddleware.js';
import { Part } from '../models/Part.js';

export const orderRoutes = Router();

// Admin: get all orders
orderRoutes.get('/', authenticate, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email phone')
      .populate('items.partId', 'name price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    console.error('Orders fetch error:', error);
    res.status(500).json({ error: 'Сервер алдаа' });
  }
});

// Admin: update order status
orderRoutes.put('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, paymentStatus },
      { new: true }
    )
      .populate('userId')
      .populate('items.partId');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: 'Захиалга олдсонгүй' });
    }
  } catch (error: any) {
    console.error('Order update error:', error);
    res.status(500).json({ error: 'Сервер алдаа' });
  }
});

// User: get own orders
orderRoutes.get('/my/list', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate('items.partId', 'name imageUrl')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    console.error('My orders fetch error:', error);
    res.status(500).json({ error: 'Сервер алдаа' });
  }
});

// User: create order
orderRoutes.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { items, shippingAddress, phone, deliveryMethod } = req.body;
    const userId = req.userId!;

    if (!items || items.length === 0 || !phone) {
      res.status(400).json({ error: 'Шаардлагатай мэдээлэл дутуу байна' });
      return;
    }

    if (deliveryMethod === 'delivery' && !shippingAddress) {
      res.status(400).json({ error: 'Хүргэлтийн хаяг шаардлагатай' });
      return;
    }

    let totalAmount = 0;
    const orderItems = [];
    const bylItems = [];

    // Verify each part and calculate total
    for (const item of items) {
      const part = await Part.findById(item.partId);
      if (!part) {
        res.status(404).json({ error: `Сэлбэг олдсонгүй: ${item.name}` });
        return;
      }
      if (part.quantity < item.quantity) {
        res.status(400).json({ error: `${part.name} үлдэгдэл хүрэлцэхгүй байна.` });
        return;
      }
      
      const itemTotal = part.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        partId: part._id,
        name: part.name,
        price: part.price,
        quantity: item.quantity
      });

      bylItems.push({
        price_data: {
          currency: 'MNT',
          unit_amount: part.price,
          product_data: {
            name: part.name,
            description: `Сэлбэг захиалга`
          }
        },
        quantity: item.quantity
      });
      
      // Optionally decrement stock here:
      // await Part.findByIdAndUpdate(part._id, { $inc: { quantity: -item.quantity } });
    }

    const newOrder = new Order({
      userId,
      items: orderItems,
      totalAmount,
      status: 'pending',
      deliveryMethod: deliveryMethod || 'pickup',
      shippingAddress,
      phone,
      paymentMethod: 'byl',
      paymentStatus: 'pending'
    });

    await newOrder.save();

    // Call Byl.mn API
    let paymentUrl = '';
    const projectId = process.env.BYL_PROJECT_ID;
    const apiKey = process.env.BYL_API_KEY;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    try {
      const response = await fetch(`https://byl.mn/api/v1/projects/${projectId}/checkouts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          items: bylItems,
          success_url: `${frontendUrl}/payment-success?order_id=${newOrder._id}`,
          cancel_url: `${frontendUrl}/`,
          client_reference_id: newOrder._id.toString()
        })
      });

      const responseText = await response.text();
      console.log('Byl API status:', response.status);

      if (response.ok) {
        const data = JSON.parse(responseText) as any;
        paymentUrl = data.data?.url || data.url || data.checkoutUrl || data.checkout_url || '';
      } else {
        console.error('Byl API error:', responseText);
        paymentUrl = `${frontendUrl}/payment-success?order_id=${newOrder._id}`;
      }
    } catch (apiError) {
      console.error('Byl API холболтын алдаа:', apiError);
      paymentUrl = `${frontendUrl}/payment-success?order_id=${newOrder._id}`;
    }

    res.status(201).json({ order: newOrder, paymentUrl });
  } catch (error: any) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Сервер алдаа' });
  }
});
