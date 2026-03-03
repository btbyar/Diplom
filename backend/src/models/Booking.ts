import { Schema, model, Types } from 'mongoose';

interface IBooking {
  userId: Types.ObjectId;
  serviceId: Types.ObjectId;
  date: string;
  time: string;
  brand?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    brand: { type: String, default: 'Бүх марк' },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
    notes: { type: String },
  },
  { timestamps: true }
);

// Add virtual field to alias _id as id
bookingSchema.virtual('id').get(function() {
  return this._id;
});

// Ensure virtual fields are included when converting to JSON
bookingSchema.set('toJSON', { virtuals: true });

export const Booking = model<IBooking>('Booking', bookingSchema);
