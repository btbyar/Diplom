import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { bookingsAPI, servicesAPI } from '../../services/api';
import type { Service, Booking } from '../../types';
import '../styles/BookingForm.css';

export const BookingForm = () => {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    serviceId: '',
    date: '',
    time: '',
    brand: 'Бүх марк',
    notes: '',
  });

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }
    loadServices();
  }, [user, token, navigate]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const res = await servicesAPI.getAll();
      setServices(res.data);
    } catch (err: any) {
      console.error('Үйлчилгээ ачаалахад алдаа:', err);
      setError('Үйлчилгээнүүдийг ачаалахад алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.serviceId || !formData.date || !formData.time) {
      setError('Бүх шаардлагатай талбарыг бөглөнө үү');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const bookingData: Omit<Booking, 'id' | 'createdAt'> = {
        userId: user?.id || '',
        serviceId: formData.serviceId,
        date: formData.date,
        time: formData.time,
        brand: formData.brand,
        status: 'pending',
        notes: formData.notes,
      };

      await bookingsAPI.create(bookingData);
      setSuccess(true);
      setFormData({
        serviceId: '',
        date: '',
        time: '',
        brand: 'Бүх марк',
        notes: '',
      });

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      console.error('Захиалга үүсгэх алдаа:', err);
      setError('Захиалгыг үүсгэхэд алдаа гарлаа');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-form-container">
      <div className="booking-form-card">
        <h1>Цаг захиалах</h1>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">✅ Захиалга амжилттай үүслээ! Эргүүлэх гэж байна...</div>}

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label>Үйлчилгээ сонгох <span className="required">*</span></label>
            <select
              value={formData.serviceId}
              onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
              className="input"
              disabled={loading}
            >
              <option value="">-- Үйлчилгээ сонгоно уу --</option>
              {services.map((service) => (
                <option key={service._id || service.id} value={service._id || service.id || ''}>
                  {service.name} ({service.price}₮ - {service.duration} мин)
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Огноо <span className="required">*</span></label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Цаг <span className="required">*</span></label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Машины марк</label>
            <input
              type="text"
              placeholder="жишээ: Toyota, BMW, Audi"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="input"
              disabled={loading}
            />
            <small>Үйлчилгээ авах машины үйлдвэрлэгч марк</small>
          </div>

          <div className="form-group">
            <label>Нэмэлт тайлбар</label>
            <textarea
              placeholder="Асуудал, тусгай сонголт гэх мэт"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="textarea"
              disabled={loading}
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Хүлээгдэж байна...' : 'Захиалга үүсгэх'}
          </button>
        </form>
      </div>
    </div>
  );
};
