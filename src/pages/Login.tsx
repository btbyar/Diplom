import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store';
import { authAPI } from '../services/api';
import { FiMail, FiLock, FiCheckSquare, FiSquare, FiArrowRight } from 'react-icons/fi';
import './Auth.css';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;

      localStorage.setItem('auth_token', token);
      login(user, token);
      
      navigate(-1);
    } catch (err: unknown) {
      if (axios.isAxiosError<{ error?: string }>(err)) {
        setError(err.response?.data?.error || 'Нэвтрэхэд алдаа гарлаа. Имэйл болон нууц үгээ шалгаарай.');
      } else {
        setError('Нэвтрэхэд алдаа гарлаа.');
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

          <div className="auth-options-premium">
            <label className="checkbox-premium">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <div className="checkbox-box">
                {rememberMe && <FiCheckSquare />}
              </div>
              <span>Намайг санах</span>
            </label>
            <a href="#" className="forgot-password-premium">Нууц үг сэргээх</a>
          </div>

          {error && <div className="auth-error-premium">{error}</div>}

          <button type="submit" disabled={loading} className="btn-auth-premium">
            <span>{loading ? 'Түр хүлээнэ үү...' : 'Нэвтрэх'}</span>
            {!loading && <FiArrowRight className="btn-icon" />}
            <div className="btn-glow"></div>
          </button>
        </form>

        <div className="auth-footer-premium">
          <p>Бүртгэлгүй юу? <Link to="/register">Шинээр бүртгүүлэх</Link></p>
        </div>
      </div>
    </div>
  );
};
