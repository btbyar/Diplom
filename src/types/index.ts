// User types
export interface User {
  _id?: string;
  id: string;
  email: string;
  phone: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
}

// User creation input (includes password)
export interface UserCreateInput extends Omit<User, 'id' | 'createdAt'> {
  password: string;
}

// Service types
export interface Service {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutes
  brand?: string; // машины үйлдвэрлэгч марк
  createdAt?: string;
}

// Spare part / inventory types
export interface Part {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  partNumber?: string;
  category?: string;
  brand?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Vehicle types
export interface Vehicle {
  _id?: string;
  id?: string;
  ownerId?: User; // Depending on population it might be string or User object
  plateNumber: string;
  make: string;
  modelName: string;
  year?: number;
  color?: string;
  vin?: string;
  notes?: string;
  createdAt?: string;
}

// Booking types
export interface Booking {
  _id?: string;
  id?: string;
  userId: string;
  serviceId: string;
  date: string;
  time: string;
  brand?: string;
  status: 'payment_pending' | 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  paymentUrl?: string;
  createdAt?: string;
}

// Auth types
export interface OrderItem {
  partId: any;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id?: string;
  id?: string;
  userId: any;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  deliveryMethod: 'pickup' | 'delivery';
  shippingAddress?: string;
  phone: string;
  paymentMethod: 'cash' | 'transfer' | 'byl';
  paymentStatus: 'pending' | 'paid';
  createdAt?: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
