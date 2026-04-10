import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store';
import { usersAPI, authAPI, vehiclesAPI } from '../services/api';
import { FiMail, FiLock, FiUser, FiPhone, FiArrowRight, FiTruck, FiHash } from 'react-icons/fi';
import './Auth.css';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  
  const from = location.state?.from || '/';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    make: '',
    modelName: '',
    plateNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Нууц үгнүүд тохирохгүй байна.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create User
      await usersAPI.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'user',
      });

      // 2. Login newly created user to get token
      const response = await authAPI.login({ email: formData.email, password: formData.password });
      const { token, user } = response.data;
      
      // Save token directly to local storage so subsequent API calls use it
      localStorage.setItem('auth_token', token);
      login(user, token);
      
      // 3. Register user's vehicle
      if (formData.plateNumber && formData.make && formData.modelName) {
        try {
          await vehiclesAPI.create({
            ownerId: user.id || user._id,
            plateNumber: formData.plateNumber,
            make: formData.make,
            modelName: formData.modelName
          });
        } catch (vehicleErr) {
          console.error("Failed to register vehicle:", vehicleErr);
          // We can optionally show a toast error here, but the user is already successful
        }
      }

      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (axios.isAxiosError<{ error?: string; message?: string }>(err)) {
        setError(err.response?.data?.error || err.response?.data?.message || 'Бүртгүүлэхэд алдаа гарлаа.');
      } else {
        setError('Бүртгүүлэхэд алдаа гарлаа.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-premium-page client-theme">
      {/* Animated Background Elements */}
      <div className="auth-orb orb-1"></div>
      <div className="auth-orb orb-2"></div>
      <div className="auth-orb orb-3"></div>
      <div className="auth-grid-overlay"></div>

      <div className="auth-glass-container register-container" style={{ maxWidth: '700px' }}>
        <Link to="/" className="auth-logo-center">
          <span className="logo-text">X</span><span className="logo-text-highlight">pand</span>
        </Link>
        
        <div className="auth-header-premium">
          <h2>Шинээр бүртгүүлэх</h2>
          <p>Xpand ертөнцөд нэгдэж, үйлчилгээгээ хялбарчил</p>
        </div>

        <form onSubmit={handleRegister} className="auth-form-premium">
          <h3 style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '15px' }}>1. Хувийн мэдээлэл</h3>
          <div className="auth-form-grid">
            <div className="input-group-premium">
              <FiUser className="input-icon-premium" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Овог нэр"
                required
                disabled={loading}
                className="input-premium"
              />
            </div>

            <div className="input-group-premium">
              <FiPhone className="input-icon-premium" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Утасны дугаар"
                required
                disabled={loading}
                className="input-premium"
              />
            </div>
          </div>

          <div className="input-group-premium">
            <FiMail className="input-icon-premium" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Имэйл хаяг"
              required
              disabled={loading}
              className="input-premium"
            />
          </div>

          <div className="auth-form-grid">
            <div className="input-group-premium">
              <FiLock className="input-icon-premium" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Нууц үг"
                required
                disabled={loading}
                minLength={6}
                className="input-premium"
              />
            </div>

            <div className="input-group-premium">
              <FiLock className="input-icon-premium" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Нууц үг давтах"
                required
                disabled={loading}
                minLength={6}
                className="input-premium"
              />
            </div>
          </div>

          <h3 style={{ fontSize: '16px', color: 'var(--text-secondary)', marginTop: '20px', marginBottom: '15px' }}>2. Автомашины мэдээлэл</h3>
          <div className="auth-form-grid">
            <div className="input-group-premium">
              <FiTruck className="input-icon-premium" />
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleChange}
                placeholder="Үйлдвэрлэгч (Жнь: Toyota)"
                required
                disabled={loading}
                className="input-premium"
              />
            </div>

            <div className="input-group-premium">
              <FiTruck className="input-icon-premium" />
              <input
                type="text"
                name="modelName"
                value={formData.modelName}
                onChange={handleChange}
                placeholder="Загвар (Жнь: Prius 20)"
                required
                disabled={loading}
                className="input-premium"
              />
            </div>
          </div>

          <div className="input-group-premium">
            <FiHash className="input-icon-premium" />
            <input
              type="text"
              name="plateNumber"
              value={formData.plateNumber}
              onChange={handleChange}
              placeholder="Улсын дугаар (Жнь: 1234 УНЭ)"
              required
              disabled={loading}
              className="input-premium"
            />
          </div>

          {error && <div className="auth-error-premium">{error}</div>}

          <button 
            type="submit" 
            disabled={loading} 
            className="btn-auth-premium"
            style={{marginTop: '30px'}}
          >
            <span>{loading ? 'Түр хүлээнэ үү...' : 'Бүртгэл үүсгэх'}</span>
            {!loading && <FiArrowRight className="btn-icon" />}
          </button>
        </form>

        <div className="auth-footer-premium">
          <p>Бүртгэлтэй юу? <Link to="/login">Нэвтрэх хэсэг рүү очих</Link></p>
        </div>
      </div>
    </div>
  );
};
