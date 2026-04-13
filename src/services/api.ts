import axios from 'axios';
import type { User, Booking, Service, Part, Vehicle, LoginRequest, UserCreateInput, Order } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const isAdminPath = window?.location?.pathname?.startsWith('/admin');
  const token = isAdminPath 
    ? localStorage.getItem('admin_auth_token') 
    : localStorage.getItem('auth_token');
    
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials: LoginRequest) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, newPassword: string) => api.post('/auth/reset-password', { token, newPassword }),
};

// Bookings API
export const bookingsAPI = {
  getAll: () => api.get<Booking[]>('/bookings'),
  getMy: () => api.get<Booking[]>('/bookings/my/list'),
  getById: (id: string) => api.get<Booking>(`/bookings/${id}`),
  create: (booking: Omit<Booking, 'id' | 'createdAt'>) =>
    api.post<Booking>('/bookings', booking),
  update: (id: string, booking: Partial<Booking>) =>
    api.put<Booking>(`/bookings/${id}`, booking),
  delete: (id: string) => api.delete(`/bookings/${id}`),
};

// Services API
export const servicesAPI = {
  getAll: () => api.get<Service[]>('/services'),
  getById: (id: string) => api.get<Service>(`/services/${id}`),
  create: (service: Omit<Service, 'id' | 'createdAt'>) =>
    api.post<Service>('/services', service),
  update: (id: string, service: Partial<Service>) =>
    api.put<Service>(`/services/${id}`, service),
  delete: (id: string) => api.delete(`/services/${id}`),
};

// Parts (inventory) API
export const partsAPI = {
  getAll: () => api.get<Part[]>('/parts'),
  getById: (id: string) => api.get<Part>(`/parts/${id}`),
  create: (part: Omit<Part, '_id' | 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Part>('/parts', part),
  update: (id: string, part: Partial<Part>) =>
    api.put<Part>(`/parts/${id}`, part),
  delete: (id: string) => api.delete(`/parts/${id}`),
};

// Upload API
export const uploadAPI = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post<{ url: string }>('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Users API
export const usersAPI = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: string) => api.get<User>(`/users/${id}`),
  create: (user: UserCreateInput) =>
    api.post<User>('/users', user),
  update: (id: string, user: Partial<User>) =>
    api.put<User>(`/users/${id}`, user),
  delete: (id: string) => api.delete(`/users/${id}`),
};

// Vehicles API
export const vehiclesAPI = {
  getAll: () => api.get<Vehicle[]>('/vehicles'),
  getMy: () => api.get<Vehicle[]>('/vehicles/my'),
  getById: (id: string) => api.get<Vehicle>(`/vehicles/${id}`),
  create: (vehicle: Partial<Vehicle>) =>
    api.post<Vehicle>('/vehicles', vehicle),
  update: (id: string, vehicle: Partial<Vehicle>) =>
    api.put<Vehicle>(`/vehicles/${id}`, vehicle),
  delete: (id: string) => api.delete(`/vehicles/${id}`),
};

// Orders API
export const ordersAPI = {
  getAll: () => api.get<Order[]>('/orders'),
  getMy: () => api.get<Order[]>('/orders/my/list'),
  getById: (id: string) => api.get<Order>(`/orders/${id}`),
  create: (data: any) => api.post<{ order: Order; paymentUrl?: string }>('/orders', data),
  updateStatus: (id: string, update: { status?: string, paymentStatus?: string }) =>
    api.put<Order>(`/orders/${id}`, update),
};

export default api;
