import { Schema, model } from 'mongoose';

interface IUser {
  email: string;
  password: string;
  phone: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

// Add virtual field to alias _id as id
userSchema.virtual('id').get(function() {
  return this._id;
});

// Ensure virtual fields are included when converting to JSON
userSchema.set('toJSON', { virtuals: true });

export const User = model<IUser>('User', userSchema);
