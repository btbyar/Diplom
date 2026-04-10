import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from '../../store';
import { bookingsAPI, servicesAPI } from '../../services/api';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Table } from '../components/Table';
import { Modal } from '../components/Modal';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import type { Booking, Service, User } from '../../types';
import { usersAPI } from '../../services/api';
import '../styles/Layout.css';

export const BookingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAdminAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [formData, setFormData] = useState<{
    userId: string;
    serviceId: string;
    date: string;
    time: string;
    brand: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    notes: string;
  }>({
    userId: '',
    serviceId: '',
    date: '',
    time: '',
    brand: 'Бүх марк',
    status: 'pending',
    notes: '',
  });

  useEffect(() => {
    if (!user) navigate('/login');
    else loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, servicesRes, usersRes] = await Promise.all([
        bookingsAPI.getAll(),
        servicesAPI.getAll(),
        usersAPI.getAll()
      ]);
      setBookings(bookingsRes.data || []);
      setServices(servicesRes.data || []);
      setUsers(usersRes.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingBooking(null);
    setFormData({
      userId: '',
      serviceId: '',
      date: '',
      time: '',
      brand: 'Бүх марк',
      status: 'pending',
      notes: '',
    });
    setShowModal(true);
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);

    // serviceId can be an object if populated by backend
    const currentServiceId = typeof booking.serviceId === 'object' && booking.serviceId
      ? (booking.serviceId as any)._id || (booking.serviceId as any).id || ''
      : booking.serviceId || '';

    const currentUserId = typeof booking.userId === 'object' && booking.userId
      ? (booking.userId as any)._id || (booking.userId as any).id || ''
      : booking.userId || '';

    setFormData({
      userId: currentUserId,
      serviceId: currentServiceId,
      date: booking.date || '',
      time: booking.time || '',
      brand: booking.brand || 'Бүх марк',
      status: booking.status || 'pending',
      notes: booking.notes || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.serviceId || !formData.date || !formData.time || !formData.userId) {
      alert('Хэрэглэгч, үйлчилгээ, огноо, цаг заавал бөглөнө үү.');
      return;
    }

    try {
      if (editingBooking) {
        const id = editingBooking._id || editingBooking.id || '';
        const res = await bookingsAPI.update(id, formData);

        // Re-load to get fully populated record or just patch locally
        const updated = res.data;
        setBookings(bookings.map(b => (b._id === id || b.id === id) ? updated : b));
      } else {
        const payload = { ...formData };
        await bookingsAPI.create(payload as any);
        // Refresh to get populated user/service names
        loadData();
      }

      setShowModal(false);
      setEditingBooking(null);
    } catch (err: any) {
      console.error('Error saving booking:', err);
      alert(err.response?.data?.error || 'Хадгалахад алдаа гарлаа');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Та итгэлтэй байна уу?')) return;
    try {
      await bookingsAPI.delete(id);
      setBookings(bookings.filter(b => b._id !== id && b.id !== id));
    } catch (err) {
      console.error('Error deleting booking:', err);
    }
  };

  const columns = [
    {
      key: 'userId' as const,
      label: 'Хэрэглэгч',
      render: (val: any) => typeof val === 'object' && val ? val.name : val
    },
    {
      key: 'serviceId' as const,
      label: 'Үйлчилгээ',
      render: (val: any) => typeof val === 'object' && val ? val.name : val
    },
    { key: 'date' as const, label: 'Огноо' },
    { key: 'time' as const, label: 'Цаг' },
    { key: 'brand' as const, label: 'Марк' },
    {
      key: 'status' as const,
      label: 'Төлөв',
      render: (val: any) => {
        const statusMap: Record<string, string> = {
          'pending': 'Хүлээгдэж буй',
          'confirmed': 'Баталгаажсан',
          'completed': 'Дууссан',
          'cancelled': 'Цуцлагдсан'
        };
        return statusMap[val] || val;
      }
    },
  ];

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-layout-content">
        <TopBar title="Захиалга удирдах" />
        <main className="admin-main">
          <Card
            title="Захиалгууд"
            headerAction={
              <Button
                variant="primary"
                size="sm"
                icon={<FiPlus size={16} />}
                onClick={handleAdd}
              >
                Шинэ захиалга
              </Button>
            }
          >
            <Table
              columns={columns}
              data={bookings}
              loading={loading}
              actions={(booking) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<FiEdit2 size={14} />}
                    onClick={() => handleEdit(booking)}
                  >
                    Засах
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<FiTrash2 size={14} />}
                    onClick={() => handleDelete(booking._id || booking.id || '')}
                  >
                    Устгах
                  </Button>
                </div>
              )}
            />
          </Card>

          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setEditingBooking(null);
            }}
            title={editingBooking ? 'Захиалга засах' : 'Шинэ захиалга'}
            footer={
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button variant="primary" onClick={handleSave}>
                  Хадгалах
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEditingBooking(null);
                  }}
                >
                  Цуцлах
                </Button>
              </div>
            }
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Хэрэглэгч *</label>
                <select
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  disabled={!!editingBooking} // Admin shouldn't change user after creation, or maybe they can, but let's disable for safety
                >
                  <option value="">-- Сонгоно уу --</option>
                  {users.map(u => (
                    <option key={u.id || u._id} value={u.id || u._id}>
                      {u.name} ({u.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Үйлчилгээ *</label>
                <select
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                >
                  <option value="">-- Сонгоно уу --</option>
                  {services.map(s => (
                    <option key={s._id || s.id} value={s._id || s.id || ''}>
                      {s.name} ({s.price}₮ - {s.duration} мин)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Огноо *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Цаг *</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Машины марк</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Төлөв</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pending' | 'confirmed' | 'completed' | 'cancelled' })}
                  disabled={!editingBooking} // status is pending for new
                >
                  <option value="pending">Хүлээгдэж буй</option>
                  <option value="confirmed">Баталгаажсан</option>
                  <option value="completed">Дууссан</option>
                  <option value="cancelled">Цуцлагдсан</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Тэмдэглэл</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                style={{ minHeight: '60px' }}
                placeholder="Захиалгын нэмэлт мэдээлэл..."
              />
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
};
