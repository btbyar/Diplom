import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuthStore } from '../store';
import { authAPI } from '../services/api';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import './Auth.css';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const from = location.state?.from || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;

      localStorage.setItem('auth_token', token);
      login(user, token);
      toast.success('Амжилттай нэвтэрлээ');

      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (axios.isAxiosError<{ error?: string }>(err)) {
        toast.error(err.response?.data?.error || 'Нэвтрэхэд алдаа гарлаа. Имэйл болон нууц үгээ шалгаарай.');
      } else {
        toast.error('Нэвтрэхэд алдаа гарлаа.');
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

      <div className="auth-glass-container">
        <Link to="/" className="auth-logo-center">
          <span className="logo-text">X</span><span className="logo-text-highlight">pand</span>
        </Link>

        <div className="auth-header-premium">
          <h2>Тавтай морилно уу</h2>
          <p>Системд нэвтэрч үйлчилгээгээ үргэлжлүүлнэ үү</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form-premium">
          <div className="input-group-premium">
            <FiMail className="input-icon-premium" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Имэйл хаяг"
              required
              disabled={loading}
              className="input-premium"
            />
          </div>

          <div className="input-group-premium">
            <FiLock className="input-icon-premium" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Нууц үг"
              required
              disabled={loading}
              className="input-premium"
            />
          </div>

          <div className="auth-options-premium" style={{ justifyContent: 'flex-end' }}>
            <a href="#" className="forgot-password-premium">Нууц үг сэргээх</a>
          </div>

          <button type="submit" disabled={loading} className="btn-auth-premium">
            <span>{loading ? 'Түр хүлээнэ үү...' : 'Нэвтрэх'}</span>
            {!loading && <FiArrowRight className="btn-icon" />}
          </button>
        </form>

        <div className="auth-footer-premium">
          <p>Бүртгэлгүй юу? <Link to="/register">Шинээр бүртгүүлэх</Link></p>
        </div>
      </div>
    </div>
  );
};
