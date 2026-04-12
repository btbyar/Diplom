import { Schema, model, Types } from 'mongoose';

export interface IOrderItem {
  partId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder {
  userId: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  deliveryMethod: 'pickup' | 'delivery';
  shippingAddress?: string;
  phone: string;
  paymentMethod: 'cash' | 'transfer' | 'byl';
  paymentStatus: 'pending' | 'paid';
  createdAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  partId: { type: Schema.Types.ObjectId, ref: 'Part', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    deliveryMethod: {
      type: String,
      enum: ['pickup', 'delivery'],
      default: 'pickup',
    },
    shippingAddress: { type: String, required: false },
    phone: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ['cash', 'transfer', 'byl'],
      default: 'cash',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Add virtual field to alias _id as id
orderSchema.virtual('id').get(function () {
  return this._id;
});

// Ensure virtual fields are included when converting to JSON
orderSchema.set('toJSON', { virtuals: true });

export const Order = model<IOrder>('Order', orderSchema);
