import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { bookingsAPI } from '../../services/api';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Table } from '../components/Table';
import { Modal } from '../components/Modal';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import type { Booking } from '../../types';
import '../styles/Layout.css';

export const BookingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    brand: 'All',
    notes: '',
  });

  useEffect(() => {
    if (!user) navigate('/login');
    else loadBookings();
  }, [user, navigate]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingsAPI.getAll();
      setBookings(res.data || []);
    } catch (err) {
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setFormData({
      date: booking.date,
      time: booking.time,
      brand: booking.brand || 'All',
      notes: booking.notes || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.date || !formData.time) return;
    try {
      if (editingBooking) {
        await bookingsAPI.update(editingBooking._id || editingBooking.id || '', formData);
        setBookings(bookings.map(b => 
          (b._id === editingBooking._id || b.id === editingBooking.id) 
            ? { ...b, ...formData }
            : b
        ));
      }
      setShowModal(false);
      setEditingBooking(null);
      setFormData({ date: '', time: '', brand: 'All', notes: '' });
    } catch (err) {
      console.error('Error saving booking:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await bookingsAPI.delete(id);
      setBookings(bookings.filter(b => b._id !== id && b.id !== id));
    } catch (err) {
      console.error('Error deleting booking:', err);
    }
  };

  const columns = [
    { key: 'date' as const, label: 'Date' },
    { key: 'time' as const, label: 'Time' },
    { key: 'brand' as const, label: 'Brand' },
    { key: 'status' as const, label: 'Status' },
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
              <Button variant="primary" size="sm" icon={<FiPlus size={16} />}>
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
                    Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    icon={<FiTrash2 size={14} />}
                    onClick={() => handleDelete(booking._id || booking.id || '')}
                  >
                    Delete
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
            title={editingBooking ? 'Edit Booking' : 'New Booking'}
            footer={
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button 
                  variant="primary"
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEditingBooking(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            }
          >
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                style={{ minHeight: '100px' }}
              />
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
};
