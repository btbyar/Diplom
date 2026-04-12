import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store';
import { vehiclesAPI, bookingsAPI, ordersAPI } from '../services/api';
import type { Vehicle, Booking, Order } from '../types';
import { EmptyState } from '../components/ui/EmptyState';
import { FiUser, FiMail, FiPhone, FiTruck, FiCalendar, FiLogOut, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import './ProfilePage.css';

const STATUS_LABELS: Record<string, string> = {
  payment_pending: '💳 Төлбөр хүлээгдэж байна',
  pending: '⏳ Хүлээгдэж буй',
  processing: '🔄 Боловсруулж байна',
  shipped: '🚚 Хүргэлтэнд гарсан',
  delivered: '📬 Хүргэгдсэн',
  confirmed: '✅ Баталгаажсан',
  completed: '🏁 Дууссан',
  cancelled: '❌ Цуцлагдсан',
};

export const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'vehicles' | 'bookings' | 'orders'>('vehicles');

  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ make: '', modelName: '', plateNumber: '' });
  const [deletingVehicleId, setDeletingVehicleId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    fetchUserData();
  }, [isAuthenticated, user, navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Fetch own vehicles, bookings and orders from dedicated endpoints
      const [vehRes, bookRes, ordRes] = await Promise.all([
        vehiclesAPI.getMy(),
        bookingsAPI.getMy(),
        ordersAPI.getMy(),
      ]);

      setVehicles(vehRes.data);
      setBookings(bookRes.data);
      setOrders(ordRes.data);
    } catch (err) {
      console.error('Error fetching user data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.make || !newVehicle.modelName || !newVehicle.plateNumber) return;

    try {
      const res = await vehiclesAPI.create({
        make: newVehicle.make,
        modelName: newVehicle.modelName,
        plateNumber: newVehicle.plateNumber,
      });
      setVehicles([...vehicles, res.data]);
      setNewVehicle({ make: '', modelName: '', plateNumber: '' });
      setShowAddVehicle(false);
      toast.success('Автомашин амжилттай бүртгэлээ');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Машин нэмэхэд алдаа гарлаа');
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!window.confirm('Энэ машиныг устгах уу?')) return;
    setDeletingVehicleId(vehicleId);
    try {
      await vehiclesAPI.delete(vehicleId);
      setVehicles(vehicles.filter(v => (v._id || v.id) !== vehicleId));
      toast.success('Автомашин устгагдлаа');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Устгахад алдаа гарлаа');
    } finally {
      setDeletingVehicleId(null);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="container" style={{ paddingTop: '150px' }}>
          <div className="loading-state">
            <div className="loading-dots"><span /><span /><span /></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header animate-slide-up">
        <div className="container">
          <h1>Хувийн мэдээлэл</h1>
          <p>Таны бүртгэл, машинууд болон захиалгын түүх</p>
        </div>
      </div>

      <div className="container profile-container animate-slide-up">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-card">
            <h3 className="profile-card-title"><FiUser /> Миний хаяг</h3>
            <ul className="profile-info-list">
              <li>
                <span className="info-label">Овог нэр</span>
                <span className="info-value">{user?.name}</span>
              </li>
              <li>
                <span className="info-label"><FiMail style={{ marginRight: '4px' }} /> Имэйл</span>
                <span className="info-value">{user?.email}</span>
              </li>
              <li>
                <span className="info-label"><FiPhone style={{ marginRight: '4px' }} /> Утас</span>
                <span className="info-value">{user?.phone || '-'}</span>
              </li>
            </ul>
          </div>

          <button onClick={handleLogout} className="logout-btn-full">
            <FiLogOut /> Гарах
          </button>
        </div>

        {/* Main Content */}
        <div className="profile-content">
          <div className="profile-tabs">
            <button 
              className={`tab-btn ${activeTab === 'vehicles' ? 'active' : ''}`}
              onClick={() => setActiveTab('vehicles')}
            >
              <FiTruck /> Миний машинууд
            </button>
            <button 
              className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              <FiCalendar /> Захиалгын түүх
            </button>
            <button 
              className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <FiShoppingBag /> Сэлбэгийн захиалгууд
            </button>
          </div>

          {/* Vehicles Section */}
          {activeTab === 'vehicles' && (
            <div className="profile-card animate-fade-in">
              <div className="section-header">
                <h2 className="profile-card-title" style={{ marginBottom: 0 }}>Миний машинууд</h2>
                <button
                className="btn-add"
                onClick={() => setShowAddVehicle(!showAddVehicle)}
                style={{ padding: '6px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <FiPlus /> Машин нэмэх
              </button>
            </div>

            {showAddVehicle && (
              <form className="add-vehicle-form" onSubmit={handleAddVehicle}>
                <input
                  type="text"
                  placeholder="Үйлдвэрлэгч (Toyota)"
                  value={newVehicle.make}
                  onChange={e => setNewVehicle({ ...newVehicle, make: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Загвар (Prius 20)"
                  value={newVehicle.modelName}
                  onChange={e => setNewVehicle({ ...newVehicle, modelName: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Улсын дугаар"
                  value={newVehicle.plateNumber}
                  onChange={e => setNewVehicle({ ...newVehicle, plateNumber: e.target.value })}
                  required
                />
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowAddVehicle(false)}>
                    Цуцлах
                  </button>
                  <button type="submit" className="btn-add submit-btn">
                    Хадгалах
                  </button>
                </div>
              </form>
            )}

            {vehicles.length === 0 && !showAddVehicle ? (
              <EmptyState 
                icon={<FiTruck />} 
                title="Машин бүртгэгдээгүй байна" 
                description="Та үйлчилгээ авах автомашинуудаа энд бүртгүүлээрэй." 
                action={<button className="btn-secondary" onClick={() => setShowAddVehicle(true)}>Машин нэмэх</button>}
              />
            ) : (
              <div className="vehicle-grid" style={{ marginTop: showAddVehicle ? '20px' : '0' }}>
                {vehicles.map((v, i) => {
                  const vid = v._id || v.id || String(i);
                  return (
                    <div key={vid} className="vehicle-card">
                      <div style={{ flex: 1 }}>
                        <span className="vehicle-plate">{v.plateNumber}</span>
                        <span className="vehicle-make">{v.make} {v.modelName}</span>
                      </div>
                      <button
                        className="btn-delete-vehicle"
                        onClick={() => handleDeleteVehicle(vid)}
                        disabled={deletingVehicleId === vid}
                        title="Устгах"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-error, #e74c3c)',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          opacity: deletingVehicleId === vid ? 0.5 : 1,
                        }}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          )}

          {/* Bookings Section */}
          {activeTab === 'bookings' && (
            <div className="profile-card animate-fade-in">
              <div className="section-header">
                <h2 className="profile-card-title" style={{ marginBottom: 0 }}><FiCalendar /> Захиалгын түүх</h2>
            </div>

            {bookings.length === 0 ? (
              <EmptyState 
                icon={<FiCalendar />} 
                title="Захиалгын түүх хоосон байна" 
                description="Та одоогоор засварын үйлчилгээнд цаг захиалаагүй байна."
              />
            ) : (
              <div className="booking-list">
                {bookings.map((b, i) => (
                  <div key={b._id || b.id || i} className="booking-item">
                    <div className="booking-info">
                      <span className="booking-date">{b.date} {b.time}</span>
                    </div>
                    <span className={`booking-status status-${b.status}`}>
                      {STATUS_LABELS[b.status] ?? b.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          )}

          {/* Orders Section */}
          {activeTab === 'orders' && (
            <div className="profile-card animate-fade-in">
              <div className="section-header">
                <h2 className="profile-card-title" style={{ marginBottom: 0 }}><FiShoppingBag /> Сэлбэгийн захиалгууд</h2>
            </div>

            {orders.length === 0 ? (
              <EmptyState 
                icon={<FiShoppingBag />} 
                title="Сэлбэг захиалаагүй байна" 
                description="Таны сэлбэг худалдан авалтын түүх энд харагдана."
              />
            ) : (
              <div className="booking-list">
                {orders.map((o, i) => {
                  const itemsCount = o.items.reduce((acc, it) => acc + it.quantity, 0);
                  return (
                    <div key={o._id || o.id || i} className="booking-item">
                      <div className="booking-info">
                        <span className="booking-date">
                          {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Саяхан'} - ₮{o.totalAmount.toLocaleString()}
                        </span>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                          {itemsCount} ширхэг сэлбэг
                        </span>
                      </div>
                      <span className={`booking-status status-${o.status}`}>
                        {STATUS_LABELS[o.status] ?? o.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          )}

        </div>
      </div>
    </div>
  );
};
