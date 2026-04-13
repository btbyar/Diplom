import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { authAPI } from '../services/api';
import { FiMail, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import './Auth.css';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authAPI.forgotPassword(email);
      setSuccess(true);
      toast.success('Сэргээх линк илгээгдлээ');
    } catch (err: unknown) {
      if (axios.isAxiosError<{ error?: string }>(err)) {
        toast.error(err.response?.data?.error || 'Алдаа гарлаа.');
      } else {
        toast.error('Алдаа гарлаа.');
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

        {success ? (
          <div className="auth-header-premium" style={{ marginTop: '20px' }}>
            <h2 style={{ color: '#4ade80' }}>Амжилттай!</h2>
            <p style={{ marginBottom: '30px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>Бид <strong>{email}</strong> хаяг руу нууц үг сэргээх линк илгээлээ. Имэйлээ шалгана уу.</p>
            <Link to="/login" className="btn-auth-premium" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
              <span>Нэвтрэх хэсэг рүү буцах</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="auth-header-premium">
              <h2>Нууц үг сэргээх</h2>
              <p>Бүртгэлтэй имэйл хаягаа оруулна уу. Бид сэргээх линк илгээх болно.</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form-premium">
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

              <button type="submit" disabled={loading} className="btn-auth-premium" style={{ marginTop: '10px' }}>
                <span>{loading ? 'Илгээж байна...' : 'Сэргээх линк авах'}</span>
                {!loading && <FiArrowRight className="btn-icon" />}
              </button>
            </form>
          </>
        )}

        <div className="auth-footer-premium" style={{ marginTop: '30px' }}>
          <p><Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><FiArrowLeft /> Буцах</Link></p>
        </div>
      </div>
    </div>
  );
};
