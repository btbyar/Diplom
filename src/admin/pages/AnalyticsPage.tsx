import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from '../../store';
import { bookingsAPI, servicesAPI, usersAPI } from '../../services/api';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { FiTrendingUp, FiCalendar, FiDollarSign, FiBarChart2 } from 'react-icons/fi';
import type { Booking, Service, User } from '../../types';
import '../styles/Layout.css';

export const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { user } = useAdminAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) navigate('/login');
    else loadAnalyticsData();
  }, [user, navigate]);

  const loadAnalyticsData = async () => {
    try {
      const [bookingsRes, servicesRes, usersRes] = await Promise.all([
        bookingsAPI.getAll(),
        servicesAPI.getAll(),
        usersAPI.getAll(),
      ]);
      setBookings(bookingsRes.data || []);
      setServices(servicesRes.data || []);
      setUsers(usersRes.data || []);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Failed to load analytics data');
    }
  };

  // Calculate analytics metrics
  const totalBookings = bookings.length;
  const totalServices = services.length;
  const totalUsers = users.length;
  const totalRevenue = services.reduce((sum, service) => sum + (service.price || 0), 0) * totalBookings;

  // Booking status breakdown
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;

  // User roles breakdown
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const regularUsers = users.filter(u => u.role === 'user').length;

  // Monthly data simulation (in real app, this would come from backend)
  const monthlyData = [
    { month: 'Jan', bookings: 24, revenue: 2400 },
    { month: 'Feb', bookings: 30, revenue: 3200 },
    { month: 'Mar', bookings: 28, revenue: 2800 },
    { month: 'Apr', bookings: 35, revenue: 3800 },
    { month: 'May', bookings: 42, revenue: 4200 },
    { month: 'Jun', bookings: 38, revenue: 3900 },
  ];

  if (!user) return null;

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-layout-content">
        <TopBar title="Анализ ба Тайлан" />
        <main className="admin-main">
          {error && (
            <Card>
              <div className="text-center text-muted">{error}</div>
            </Card>
          )}

          {/* Key Metrics Grid */}
          <div className="grid grid-4 mb-6">
            <StatCard
              icon={<FiCalendar size={32} />}
              title="Нийт захиалга"
              value={totalBookings}
              change={12}
              color="primary"
            />
            <StatCard
              icon={<FiDollarSign size={32} />}
              title="Нийт орлого"
              value={`₮${totalRevenue.toLocaleString()}`}
              change={18}
              color="success"
            />
            <StatCard
              icon={<FiBarChart2 size={32} />}
              title="Идэвхтэй үйлчилгээ"
              value={totalServices}
              change={5}
              color="warning"
            />
            <StatCard
              icon={<FiTrendingUp size={32} />}
              title="Нийт хэрэглэгч"
              value={totalUsers}
              change={8}
              color="danger"
            />
          </div>

          {/* Analytics Cards Grid */}
          <div className="grid grid-2 gap-lg mb-6">
            {/* Booking Status Breakdown */}
            <Card title="Захиалгын төлөв" className="animate-slide">
              <div className="analytics-breakdown">
                <div className="breakdown-item">
                  <div className="breakdown-header">
                    <span className="breakdown-label">Хийгдсэн</span>
                    <span className="breakdown-value" style={{ color: '#22c55e' }}>
                      {completedBookings}
                    </span>
                  </div>
                  <div className="breakdown-bar">
                    <div
                      className="breakdown-progress"
                      style={{
                        width: `${(completedBookings / totalBookings) * 100}%`,
                        backgroundColor: '#22c55e'
                      }}
                    />
                  </div>
                  <span className="breakdown-percentage">
                    {((completedBookings / totalBookings) * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="breakdown-item">
                  <div className="breakdown-header">
                    <span className="breakdown-label">Хүлээгдэж буй</span>
                    <span className="breakdown-value" style={{ color: '#f59e0b' }}>
                      {pendingBookings}
                    </span>
                  </div>
                  <div className="breakdown-bar">
                    <div
                      className="breakdown-progress"
                      style={{
                        width: `${(pendingBookings / totalBookings) * 100}%`,
                        backgroundColor: '#f59e0b'
                      }}
                    />
                  </div>
                  <span className="breakdown-percentage">
                    {((pendingBookings / totalBookings) * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="breakdown-item">
                  <div className="breakdown-header">
                    <span className="breakdown-label">Цуцлагдсан</span>
                    <span className="breakdown-value" style={{ color: '#ef4444' }}>
                      {cancelledBookings}
                    </span>
                  </div>
                  <div className="breakdown-bar">
                    <div
                      className="breakdown-progress"
                      style={{
                        width: `${(cancelledBookings / totalBookings) * 100}%`,
                        backgroundColor: '#ef4444'
                      }}
                    />
                  </div>
                  <span className="breakdown-percentage">
                    {((cancelledBookings / totalBookings) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </Card>

            {/* User Distribution */}
            <Card title="Хэрэглэгчийн бүтэц" className="animate-slide">
              <div className="analytics-breakdown">
                <div className="breakdown-item">
                  <div className="breakdown-header">
                    <span className="breakdown-label">Энгийн хэрэглэгч</span>
                    <span className="breakdown-value" style={{ color: '#00d4ff' }}>
                      {regularUsers}
                    </span>
                  </div>
                  <div className="breakdown-bar">
                    <div
                      className="breakdown-progress"
                      style={{
                        width: `${(regularUsers / totalUsers) * 100}%`,
                        backgroundColor: '#00d4ff'
                      }}
                    />
                  </div>
                  <span className="breakdown-percentage">
                    {((regularUsers / totalUsers) * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="breakdown-item">
                  <div className="breakdown-header">
                    <span className="breakdown-label">Админ</span>
                    <span className="breakdown-value" style={{ color: '#8b5cf6' }}>
                      {adminUsers}
                    </span>
                  </div>
                  <div className="breakdown-bar">
                    <div
                      className="breakdown-progress"
                      style={{
                        width: `${(adminUsers / totalUsers) * 100}%`,
                        backgroundColor: '#8b5cf6'
                      }}
                    />
                  </div>
                  <span className="breakdown-percentage">
                    {((adminUsers / totalUsers) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Monthly Trends */}
          <Card title="Сарын хандлага" className="animate-slide">
            <div className="monthly-chart">
              <div className="chart-header">
                <h4>6 сарын захиалга болон орлого</h4>
              </div>
              <div className="chart-container">
                {monthlyData.map((data, idx) => (
                  <div key={idx} className="chart-column">
                    <div className="chart-bars">
                      <div
                        className="bar bar-bookings"
                        style={{ height: `${(data.bookings / 50) * 100}%` }}
                        title={`${data.bookings} захиалга`}
                      />
                      <div
                        className="bar bar-revenue"
                        style={{ height: `${(data.revenue / 5000) * 100}%` }}
                        title={`₮${data.revenue}`}
                      />
                    </div>
                    <span className="chart-label">{data.month}</span>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#00d4ff' }} />
                  <span>Захиалга</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#8b5cf6' }} />
                  <span>Орлого</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Summary Statistics */}
          <Card title="Хураангуй" className="mt-6 animate-slide">
            <div className="summary-grid">
              <div className="summary-item">
                <p className="summary-label">Дундаж захиалгын дүн</p>
                <p className="summary-value">
                  ₮{totalBookings > 0 ? (totalRevenue / totalBookings).toFixed(2) : '0.00'}
                </p>
              </div>
              <div className="summary-item">
                <p className="summary-label">Захиалга биелэлтийн хувь</p>
                <p className="summary-value">
                  {totalBookings > 0 ? ((completedBookings / totalBookings) * 100).toFixed(1) : '0'}%
                </p>
              </div>
              <div className="summary-item">
                <p className="summary-label">Нэг захиалга дахь дундаж үйлчилгээ</p>
                <p className="summary-value">
                  {totalBookings > 0 ? (totalServices / totalBookings).toFixed(2) : '0'}
                </p>
              </div>
              <div className="summary-item">
                <p className="summary-label">Нэг үйлчилгээний дундаж хэрэглэгч</p>
                <p className="summary-value">
                  {totalServices > 0 ? (totalUsers / totalServices).toFixed(2) : '0'}
                </p>
              </div>
            </div>
          </Card>
        </main>
      </div>

      <style>{`
        .analytics-breakdown {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .breakdown-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .breakdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .breakdown-label {
          font-size: 14px;
          color: #9ca3af;
        }

        .breakdown-value {
          font-weight: 600;
          font-size: 16px;
        }

        .breakdown-bar {
          height: 8px;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          overflow: hidden;
        }

        .breakdown-progress {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .breakdown-percentage {
          font-size: 12px;
          color: #6b7280;
        }

        .monthly-chart {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .chart-header {
          margin-bottom: 16px;
        }

        .chart-header h4 {
          margin: 0;
          font-size: 14px;
          color: #9ca3af;
        }

        .chart-container {
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          height: 200px;
          gap: 16px;
          margin-bottom: 24px;
        }

        .chart-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .chart-bars {
          display: flex;
          gap: 4px;
          height: 100%;
          align-items: flex-end;
          width: 100%;
          justify-content: center;
        }

        .bar {
          width: 12px;
          border-radius: 4px 4px 0 0;
          transition: all 0.3s ease;
          min-height: 4px;
        }

        .bar:hover {
          opacity: 0.8;
          filter: brightness(1.2);
        }

        .bar-bookings {
          background-color: #00d4ff;
        }

        .bar-revenue {
          background-color: #8b5cf6;
        }

        .chart-label {
          font-size: 12px;
          color: #6b7280;
          margin-top: auto;
        }

        .chart-legend {
          display: flex;
          gap: 24px;
          justify-content: center;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #9ca3af;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
        }

        .summary-item {
          padding: 16px;
          background-color: rgba(0, 212, 255, 0.05);
          border: 1px solid rgba(0, 212, 255, 0.1);
          border-radius: 8px;
          text-align: center;
        }

        .summary-label {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: #9ca3af;
        }

        .summary-value {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          color: #00d4ff;
        }

        @media (max-width: 768px) {
          .chart-container {
            height: 150px;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
