import { Schema, model } from 'mongoose';

interface IPart {
  name: string;
  description?: string;
  partNumber?: string;
  category?: string;
  brand?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  createdAt: Date;
}

const partSchema = new Schema<IPart>(
  {
    name: { type: String, required: true },
    description: { type: String },
    partNumber: { type: String },
    category: { type: String, default: 'General' },
    brand: { type: String, default: 'All brands' },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

partSchema.virtual('id').get(function () {
  return this._id;
});

partSchema.set('toJSON', { virtuals: true });

export const Part = model<IPart>('Part', partSchema);

