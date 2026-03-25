import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { vehiclesAPI, bookingsAPI } from '../services/api';
import type { Vehicle, Booking } from '../types';
import { FiUser, FiMail, FiPhone, FiTruck, FiCalendar, FiLogOut, FiPlus } from 'react-icons/fi';
import './ProfilePage.css';

export const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ make: '', modelName: '', plateNumber: '' });

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
      const [vehRes, bookRes] = await Promise.all([
        vehiclesAPI.getAll(),
        bookingsAPI.getAll()
      ]);

      // Filter vehicles belonging to the user
      const userVehicles = vehRes.data.filter(v => {
        const owner = v.ownerId as any;
        return owner === user?.id || owner?._id === user?.id || v._id === user?.id;
      });

      // Filter bookings belonging to the user
      const userBookings = bookRes.data.filter(b => b.userId === user?.id || b.userId === (user as any)?._id);

      setVehicles(userVehicles);
      setBookings(userBookings.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (err) {
      console.error("Error fetching user data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('auth_token');
    navigate('/');
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.make || !newVehicle.modelName || !newVehicle.plateNumber) return;

    try {
      const res = await vehiclesAPI.create({
        ownerId: user?.id as any,
        make: newVehicle.make,
        modelName: newVehicle.modelName,
        plateNumber: newVehicle.plateNumber
      });
      setVehicles([...vehicles, res.data]);
      setNewVehicle({ make: '', modelName: '', plateNumber: '' });
      setShowAddVehicle(false);
    } catch (err) {
      console.error("Failed to add vehicle", err);
    }
  };

  if (loading) {
    return <div className="profile-page"><div className="container" style={{paddingTop: '100px', textAlign: 'center'}}>Уншиж байна...</div></div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="container">
          <h1>Хувийн мэдээлэл</h1>
          <p>Таны бүртгэл, машинууд болон захиалгын түүх</p>
        </div>
      </div>

      <div className="container profile-container">
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
                <span className="info-label"><FiMail style={{marginRight: '4px'}}/> Имэйл</span>
                <span className="info-value">{user?.email}</span>
              </li>
              <li>
                <span className="info-label"><FiPhone style={{marginRight: '4px'}}/> Утас</span>
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
          
          {/* Vehicles Section */}
          <div className="profile-card">
            <div className="section-header">
              <h2 className="profile-card-title" style={{marginBottom: 0}}><FiTruck /> Миний машинууд</h2>
              <button 
                className="btn-add" 
                onClick={() => setShowAddVehicle(!showAddVehicle)}
                style={{padding: '6px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px'}}
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
                  onChange={e => setNewVehicle({...newVehicle, make: e.target.value})}
                  required
                />
                <input 
                  type="text" 
                  placeholder="Загвар (Prius 20)" 
                  value={newVehicle.modelName} 
                  onChange={e => setNewVehicle({...newVehicle, modelName: e.target.value})}
                  required
                />
                <input 
                  type="text" 
                  placeholder="Улсын дугаар" 
                  value={newVehicle.plateNumber} 
                  onChange={e => setNewVehicle({...newVehicle, plateNumber: e.target.value})}
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
              <p style={{color: 'var(--text-secondary)'}}>Бүртгэлтэй машин байхгүй байна.</p>
            ) : (
              <div className="vehicle-grid" style={{marginTop: showAddVehicle ? '20px' : '0'}}>
                {vehicles.map((v, i) => (
                  <div key={v._id || v.id || i} className="vehicle-card">
                    <span className="vehicle-plate">{v.plateNumber}</span>
                    <span className="vehicle-make">{v.make} {v.modelName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bookings Section */}
          <div className="profile-card">
            <div className="section-header">
              <h2 className="profile-card-title" style={{marginBottom: 0}}><FiCalendar /> Захиалгын түүх</h2>
            </div>
            
            {bookings.length === 0 ? (
              <p style={{color: 'var(--text-secondary)'}}>Та одоогоор цаг захиалаагүй байна.</p>
            ) : (
              <div className="booking-list">
                {bookings.map((b, i) => (
                  <div key={b._id || b.id || i} className="booking-item">
                    <div className="booking-info">
                      <span className="booking-date">{b.date} {b.time}</span>
                    </div>
                    <span className={`booking-status status-${b.status}`}>
                      {b.status === 'pending' ? 'Хүлээгдэж буй' : 
                       b.status === 'confirmed' ? 'Баталгаажсан' : 
                       b.status === 'completed' ? 'Дууссан' : 
                       'Цуцлагдсан'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
