import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { servicesAPI, bookingsAPI } from '../services/api';
import { useAuthStore } from '../store';
import type { Service } from '../types';
import './BookingPage.css';

export const BookingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialServiceId = searchParams.get('service') || '';
  const initialDate = searchParams.get('date') || '';

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    serviceId: initialServiceId,
    date: initialDate,
    time: '10:00',
    notes: '',
  });

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await servicesAPI.getAll();
        setServices(res.data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    
    try {
      setSubmitting(true);
      await bookingsAPI.create({
        serviceId: formData.serviceId,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        status: 'pending',
        userId: user?.id || user?._id || '',
      } as any);
      
      alert('Захиалга амжилттай бүртгэгдлээ!');
      navigate('/');
    } catch (error: any) {
      console.error('Error submitting booking:', error);
      alert('Алдаа гарлаа: ' + (error.response?.data?.message || 'Одоохондоо боломжгүй байна'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="booking-auth-required">
        <div className="auth-card">
          <h2>Нэвтрэх шаардлагатай</h2>
          <p>Цаг захиалахын тулд та системд нэвтэрч орсон байх шаардлагатай.</p>
          <div className="auth-actions">
            <Link to="/login" className="btn-primary">Нэвтрэх</Link>
            <Link to="/" className="btn-secondary">Арагш буцах</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="container">
        <div className="booking-card">
          <div className="booking-header">
            <h2>Үйлчилгээний цаг захиалах</h2>
            <p>Та өөрт тохиромжтой цагаа сонгон захиалгаа өгнө үү</p>
          </div>

          {loading ? (
            <div className="loading-state">Мэдээлэл уншиж байна...</div>
          ) : (
            <form className="booking-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Үйлчилгээ сонгох</label>
                <select 
                  required
                  value={formData.serviceId}
                  onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
                >
                  <option value="">-- Үйлчилгээ сонгоно уу --</option>
                  {services.map(s => (
                    <option key={s._id || s.id} value={s._id || s.id}>
                      {s.name} (₮{s.price.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Огноо</label>
                  <input 
                    type="date" 
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Цаг</label>
                  <select 
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  >
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Нэмэлт мэдээлэл</label>
                <textarea 
                  placeholder="Машины марк, улсын дугаар эсвэл нэмэлт тайлбар (заавал биш)"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={4}
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn-submit" 
                disabled={submitting || !formData.serviceId || !formData.date}
              >
                {submitting ? 'Захиалж байна...' : 'Баталгаажуулах'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
