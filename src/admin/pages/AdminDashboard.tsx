import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { bookingsAPI, servicesAPI, usersAPI } from '../../services/api';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { StatCard } from '../components/StatCard';
import { Card } from '../components/Card';
import { Table } from '../components/Table';
import { Button } from '../components/Button';
import { FiCalendar, FiTool, FiUsers, FiTrendingUp } from 'react-icons/fi';
import type { Booking, Service, User } from '../../types';
import '../styles/Layout.css';
import '../styles/Sidebar.css';
import '../styles/TopBar.css';
import '../styles/StatCard.css';
import '../styles/Card.css';
import '../styles/Table.css';
import '../styles/Button.css';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [bookingsRes, servicesRes, usersRes] = await Promise.all([
        bookingsAPI.getAll().catch(() => ({ data: [] })),
        servicesAPI.getAll().catch(() => ({ data: [] })),
        usersAPI.getAll().catch(() => ({ data: [] })),
      ]);

      setBookings(bookingsRes.data || []);
      setServices(servicesRes.data || []);
      setUsers(usersRes.data || []);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      icon: <FiCalendar size={32} />,
      title: 'Нийт захиалгууд',
      value: bookings.length,
      change: 12,
      color: 'primary' as const,
    },
    {
      icon: <FiTool size={32} />,
      title: 'Үйлчилгээнүүд',
      value: services.length,
      change: 5,
      color: 'success' as const,
    },
    {
      icon: <FiUsers size={32} />,
      title: 'Хэрэглэгчид',
      value: users.length,
      change: 8,
      color: 'warning' as const,
    },
    {
      icon: <FiTrendingUp size={32} />,
      title: 'Орлого',
      value: '₮0',
      change: 15,
      color: 'danger' as const,
    },
  ];

  const recentBookingsColumns = [
    { key: 'id' as const, label: 'ID' },
    { key: 'date' as const, label: 'Date' },
    { key: 'time' as const, label: 'Time' },
    { key: 'brand' as const, label: 'Brand' },
  ];

  const recentBookings = bookings.slice(0, 5);

  if (!user) return null;

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-layout-content">
        <TopBar title="Dashboard" />
        <main className="admin-main">
          {error && (
            <Card>
              <div className="text-center text-muted">{error}</div>
            </Card>
          )}

          {/* Statistics Grid */}
          <div className="grid grid-4 mb-6">
            {stats.map((stat, idx) => (
              <StatCard
                key={idx}
                icon={stat.icon}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                color={stat.color}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-2 gap-lg">
            {/* Recent Bookings */}
            <Card title="Сүүлийн захиалгууд" className="animate-slide">
              <Table
                columns={recentBookingsColumns}
                data={recentBookings}
                loading={loading}
                emptyMessage="Захиалга олдсонгүй"
              />
              <div className="flex-between mt-4">
                <span className="text-muted text-sm">
                  {recentBookings.length} of {bookings.length} bookings shown
                </span>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => navigate('/admin/bookings')}
                >
                  Бүгдийг харах →
                </Button>
              </div>
            </Card>

            {/* Services Overview */}
            <Card title="Үйлчилгээнүүд" className="animate-slide">
              <div className="flex flex-col gap-md">
                {services.slice(0, 4).map((service) => (
                  <div
                    key={service.id || service._id}
                    className="flex-between p-3"
                    style={{
                      background: 'rgba(0, 212, 255, 0.05)',
                      borderRadius: '8px',
                      border: '1px solid rgba(0, 212, 255, 0.1)',
                    }}
                  >
                    <div>
                      <p className="font-semibold mb-1">{service.name}</p>
                      <p className="text-sm text-muted">{service.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">₮{service.price}</p>
                      <p className="text-sm text-muted">{service.duration}мин</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/admin/services')}
                className="mt-4"
                style={{ width: '100%' }}
              >
                Үйлчилгээ удирдах →
              </Button>
            </Card>
          </div>

          {/* Users Management */}
          <Card title="Хэрэглэгчийн менежмент" className="mt-6 animate-slide">
            <div className="grid grid-2 gap-md">
              {users.slice(0, 6).map((u) => (
                <div
                  key={u.id || u._id}
                  className="p-3"
                  style={{
                    background: 'rgba(0, 212, 255, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 212, 255, 0.1)',
                  }}
                >
                  <div className="flex-center gap-md mb-2">
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #00d4ff, #0099ff)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        color: 'white',
                      }}
                    >
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{u.name}</p>
                      <p className="text-sm text-muted">{u.email}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted">
                    Role: <span className="font-semibold">{u.role}</span>
                  </p>
                </div>
              ))}
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/admin/users')}
              className="mt-4"
              style={{ width: '100%' }}
            >
              Хэрэглэгчид удирдах →
            </Button>
          </Card>
        </main>
      </div>
    </div>
  );
};
