import { Schema, model } from 'mongoose';

interface IService {
  name: string;
  description: string;
  price: number;
  duration: number;
  brand?: string;
  createdAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    brand: { type: String, default: 'Бүх марк' },
  },
  { timestamps: true }
);

// Add virtual field to alias _id as id
serviceSchema.virtual('id').get(function() {
  return this._id;
});

// Ensure virtual fields are included when converting to JSON
serviceSchema.set('toJSON', { virtuals: true });

export const Service = model<IService>('Service', serviceSchema);
