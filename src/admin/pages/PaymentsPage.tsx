import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from '../../store';
import { bookingsAPI } from '../../services/api';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Table } from '../components/Table';
import { FiRefreshCw, FiCheckCircle, FiClock, FiXCircle, FiDollarSign } from 'react-icons/fi';
import type { Booking } from '../../types';
import '../styles/Layout.css';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  payment_pending: { label: 'Төлбөр хүлээгдэж буй', color: '#f59e0b' },
  pending:         { label: 'Хүлээгдэж буй',        color: '#3b82f6' },
  confirmed:       { label: 'Баталгаажсан',          color: '#10b981' },
  completed:       { label: 'Дууссан',               color: '#6b7280' },
  cancelled:       { label: 'Цуцлагдсан',            color: '#ef4444' },
};

export const PaymentsPage = () => {
  const navigate = useNavigate();
  const { user } = useAdminAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (!user) navigate('/admin/login');
    else loadData();
  }, [user, navigate]);

  const loadData = async () => {
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

  const handleConfirm = async (booking: Booking) => {
    const id = booking._id || booking.id || '';
    try {
      await bookingsAPI.update(id, { status: 'confirmed' } as any);
      setBookings(prev => prev.map(b =>
        (b._id === id || b.id === id) ? { ...b, status: 'confirmed' } : b
      ));
    } catch (err) {
      console.error('Error confirming:', err);
    }
  };

  const handleCancel = async (booking: Booking) => {
    if (!window.confirm('Энэ захиалгын төлбөрийг цуцлах уу?')) return;
    const id = booking._id || booking.id || '';
    try {
      await bookingsAPI.update(id, { status: 'cancelled' } as any);
      setBookings(prev => prev.map(b =>
        (b._id === id || b.id === id) ? { ...b, status: 'cancelled' } : b
      ));
    } catch (err) {
      console.error('Error cancelling:', err);
    }
  };

  const filtered = filter === 'all'
    ? bookings
    : bookings.filter(b => b.status === filter);

  // Stats
  const total        = bookings.length;
  const paid         = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed').length;
  const pending      = bookings.filter(b => b.status === 'payment_pending').length;
  const cancelled    = bookings.filter(b => b.status === 'cancelled').length;

  // Total revenue from confirmed/completed bookings
  const revenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => {
      const price = typeof b.serviceId === 'object' && b.serviceId
        ? (b.serviceId as any).price || 0
        : 0;
      return sum + price;
    }, 0);

  const columns = [
    {
      key: 'userId' as const,
      label: 'Хэрэглэгч',
      render: (val: any) => typeof val === 'object' && val ? val.name : val,
    },
    {
      key: 'serviceId' as const,
      label: 'Үйлчилгээ / Үнэ',
      render: (val: any) =>
        typeof val === 'object' && val
          ? `${val.name} — ₮${(val.price || 0).toLocaleString()}`
          : val,
    },
    { key: 'date' as const, label: 'Огноо' },
    { key: 'time' as const, label: 'Цаг' },
    {
      key: 'status' as const,
      label: 'Төлбөрийн төлөв',
      render: (val: any) => {
        const s = STATUS_MAP[val] || { label: val, color: '#6b7280' };
        return (
          <span style={{
            background: s.color + '22',
            color: s.color,
            padding: '3px 10px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600,
            border: `1px solid ${s.color}44`,
          }}>
            {s.label}
          </span>
        );
      },
    },
  ];

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-layout-content">
        <TopBar title="Төлбөрийн хяналт" />
        <main className="admin-main">

          {/* Stat cards */}
          <div className="grid grid-4 mb-6">
            <div style={statCardStyle('#3b82f6')}>
              <FiDollarSign size={28} style={{ opacity: 0.8 }} />
              <div>
                <div style={{ fontSize: 22, fontWeight: 700 }}>₮{revenue.toLocaleString()}</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>Нийт орлого</div>
              </div>
            </div>
            <div style={statCardStyle('#10b981')}>
              <FiCheckCircle size={28} style={{ opacity: 0.8 }} />
              <div>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{paid}</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>Төлбөр хийгдсэн</div>
              </div>
            </div>
            <div style={statCardStyle('#f59e0b')}>
              <FiClock size={28} style={{ opacity: 0.8 }} />
              <div>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{pending}</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>Төлбөр хүлээгдэж буй</div>
              </div>
            </div>
            <div style={statCardStyle('#ef4444')}>
              <FiXCircle size={28} style={{ opacity: 0.8 }} />
              <div>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{cancelled}</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>Цуцлагдсан</div>
              </div>
            </div>
          </div>

          <Card
            title={`Төлбөрийн жагсаалт (Нийт: ${total})`}
            headerAction={
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <select
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: 8,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  <option value="all">Бүгд</option>
                  <option value="payment_pending">Төлбөр хүлээгдэж буй</option>
                  <option value="pending">Хүлээгдэж буй</option>
                  <option value="confirmed">Баталгаажсан</option>
                  <option value="completed">Дууссан</option>
                  <option value="cancelled">Цуцлагдсан</option>
                </select>
                <Button variant="secondary" size="sm" icon={<FiRefreshCw size={14} />} onClick={loadData}>
                  Шинэчлэх
                </Button>
              </div>
            }
          >
            <Table
              columns={columns}
              data={filtered}
              loading={loading}
              actions={(booking) => {
                const isPending = booking.status === 'payment_pending' || booking.status === 'pending';
                const isCancelled = booking.status === 'cancelled';
                return (
                  <div style={{ display: 'flex', gap: 8 }}>
                    {isPending && (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={<FiCheckCircle size={14} />}
                        onClick={() => handleConfirm(booking)}
                      >
                        Баталгаажуулах
                      </Button>
                    )}
                    {!isCancelled && booking.status !== 'completed' && (
                      <Button
                        variant="danger"
                        size="sm"
                        icon={<FiXCircle size={14} />}
                        onClick={() => handleCancel(booking)}
                      >
                        Цуцлах
                      </Button>
                    )}
                  </div>
                );
              }}
            />
          </Card>
        </main>
      </div>
    </div>
  );
};

function statCardStyle(color: string): React.CSSProperties {
  return {
    background: `linear-gradient(135deg, ${color}22, ${color}11)`,
    border: `1px solid ${color}44`,
    borderRadius: 16,
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    color: color,
  };
}
