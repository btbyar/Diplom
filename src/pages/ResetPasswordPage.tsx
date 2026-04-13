import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { authAPI } from '../services/api';
import { FiLock, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import './Auth.css';

export const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (password !== confirmPassword) {
      toast.error('Нууц үгс таарахгүй байна');
      return;
    }

    if (password.length < 6) {
      toast.error('Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой');
      return;
    }

    setLoading(true);

    try {
      await authAPI.resetPassword(token, password);
      setSuccess(true);
      toast.success('Нууц үг амжилттай шинэчлэгдлээ');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: unknown) {
      if (axios.isAxiosError<{ error?: string }>(err)) {
        toast.error(err.response?.data?.error || 'Алдаа гарлаа, магадгүй таны линкийн хугацаа дууссан байна.');
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
            <h2 style={{ color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <FiCheckCircle /> Амжилттай
            </h2>
            <p style={{ marginBottom: '30px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>Таны нууц үг амжилттай шинэчлэгдлээ. Түр хүлээнэ үү...</p>
          </div>
        ) : (
          <>
            <div className="auth-header-premium">
              <h2>Шинэ нууц үг зохиох</h2>
              <p>Аюулгүй байдлаа хангахын тулд хүчтэй нууц үг сонгоно уу.</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form-premium">
              <div className="input-group-premium">
                <FiLock className="input-icon-premium" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Шинэ нууц үг"
                  required
                  disabled={loading}
                  className="input-premium"
                />
              </div>

              <div className="input-group-premium">
                <FiLock className="input-icon-premium" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Нууц үг давтах"
                  required
                  disabled={loading}
                  className="input-premium"
                />
              </div>

              <button type="submit" disabled={loading} className="btn-auth-premium" style={{ marginTop: '10px' }}>
                <span>{loading ? 'Хадгалж байна...' : 'Нууц үг шинэчлэх'}</span>
                {!loading && <FiArrowRight className="btn-icon" />}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
