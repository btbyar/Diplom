import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

export const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking_id');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

    if (bookingId) {
      fetch(`${apiUrl}/bookings/${bookingId}/confirm-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).catch(console.error);
    }
    if (orderId) {
      fetch(`${apiUrl}/orders/${orderId}/confirm-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).catch(console.error);
    }

    return () => { };
  }, [bookingId, orderId]);

  return (
    <div className="booking-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="auth-card" style={{ textAlign: 'center', maxWidth: '500px' }}>
        <FiCheckCircle size={64} color="#4cd137" style={{ marginBottom: '20px' }} />
        <h2>Төлбөр амжилттай</h2>
        <p style={{ margin: '15px 0', opacity: 0.8 }}>
          Таны захиалга болон төлбөр амжилттай баталгаажлаа. Бид танилцаад удахгүй холбогдох болно.
        </p>
        {bookingId && (
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
            Цаг захиалгын дугаар: <strong>{bookingId}</strong>
          </p>
        )}
        {orderId && (
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
            Сэлбэг захиалгын дугаар: <strong>{orderId}</strong>
          </p>
        )}
        <Link to="/" className="btn-primary" style={{ display: 'inline-block' }}>
          Нүүр хуудас руу буцах
        </Link>
      </div>
    </div>
  );
};
