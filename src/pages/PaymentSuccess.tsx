import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

export const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking_id');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Optionally trigger a backend check or webhook mock if needed for test mode
    if (bookingId && process.env.NODE_ENV === 'development') {
       fetch(`http://localhost:3000/api/webhook/byl?booking_id=${bookingId}`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ status: 'paid' })
       }).catch(console.error);
    }

    const timer = setInterval(() => {
       setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [bookingId]);

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
             Захиалгын дугаар: <strong>{bookingId}</strong>
           </p>
        )}
        <Link to="/" className="btn-primary" style={{ display: 'inline-block' }}>
          Нүүр хуудас руу буцах
        </Link>
      </div>
    </div>
  );
};
