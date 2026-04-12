import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiXCircle, FiLoader } from 'react-icons/fi';

export const PaymentCancelled: React.FC = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking_id');
  const orderId = searchParams.get('order_id');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

    const cancelPayment = async () => {
      try {
        if (bookingId) {
          await fetch(`${apiUrl}/bookings/${bookingId}/cancel-payment`, {
            method: 'DELETE',
          });
        }
        if (orderId) {
          await fetch(`${apiUrl}/orders/${orderId}/cancel-payment`, {
            method: 'DELETE',
          });
        }
      } catch (err) {
        console.error('Cancel error:', err);
      } finally {
        setDone(true);
      }
    };

    cancelPayment();
  }, [bookingId, orderId]);

  return (
    <div
      className="booking-page"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}
    >
      <div className="auth-card" style={{ textAlign: 'center', maxWidth: '500px' }}>
        {!done ? (
          <>
            <FiLoader size={64} color="#f39c12" style={{ marginBottom: '20px', animation: 'spin 1s linear infinite' }} />
            <h2>Боловсруулж байна...</h2>
          </>
        ) : (
          <>
            <FiXCircle size={64} color="#e74c3c" style={{ marginBottom: '20px' }} />
            <h2>Төлбөр цуцлагдлаа</h2>
            <p style={{ margin: '15px 0', opacity: 0.8 }}>
              Таны захиалга цуцлагдаж, системээс устгагдлаа. Дахин захиалга хийх боломжтой.
            </p>
          </>
        )}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
          <Link to="/book" className="btn-primary" style={{ display: 'inline-block' }}>
            Дахин захиалах
          </Link>
          <Link to="/" className="btn-secondary" style={{ display: 'inline-block' }}>
            Нүүр хуудас
          </Link>
        </div>
      </div>
    </div>
  );
};
