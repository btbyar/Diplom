import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore, useAuthStore } from '../store';
import './CheckoutPage.css';

export const CheckoutPage: React.FC = () => {
  const { items, clearCart } = useCartStore();
  const { token, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cartTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Redirect if cart is empty or not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    } else if (items.length === 0) {
      navigate('/parts');
    }
  }, [isAuthenticated, items.length, navigate]);

  if (!isAuthenticated || items.length === 0) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setError('Утасны дугаараа оруулна уу.');
      return;
    }
    if (deliveryMethod === 'delivery' && !address) {
      setError('Хаягаа оруулна уу.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const orderItems = items.map(item => ({
        partId: item.id,
        quantity: item.quantity,
        name: item.name,
        price: item.price
      }));

      const response = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: orderItems,
          deliveryMethod,
          shippingAddress: deliveryMethod === 'delivery' ? address : '',
          phone: phone
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Захиалга үүсгэхэд алдаа гарлаа');
      }

      clearCart();
      
      // Redirect to Byl payment paymentUrl if provided
      if (data.paymentUrl) {
         window.location.href = data.paymentUrl;
      } else {
         navigate(`/payment-success?order_id=${data.order._id}`);
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page page-transition container">
      <div className="checkout-header">
        <h1>Захиалга баталгаажуулах</h1>
        <p>Сэлбэг авах хаяг болон мэдээллээ оруулна уу</p>
      </div>

      <div className="checkout-content">
        <div className="checkout-form-section">
          <h2>Хүлээн авах мэдээлэл</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="delivery-methods">
              <div 
                className={`method-card ${deliveryMethod === 'pickup' ? 'selected' : ''}`}
                onClick={() => setDeliveryMethod('pickup')}
              >
                <div className="method-radio"></div>
                <span>Засварын төв дээр очиж авах (Суурилуулах)</span>
              </div>
              
              <div 
                className={`method-card ${deliveryMethod === 'delivery' ? 'selected' : ''}`}
                onClick={() => setDeliveryMethod('delivery')}
              >
                <div className="method-radio"></div>
                <span>Хүргүүлж авах</span>
              </div>
            </div>

            {deliveryMethod === 'delivery' && (
              <div className="form-group">
                <label>Хүргүүлэх хаяг (Дэлгэрэнгүй)</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Аймаг/Хот, Дүүрэг, Хороо, Гудамж, Байр/Тоот"
                  rows={3}
                  required
                />
              </div>
            )}
            
            <div className="form-group">
              <label>Утасны дугаар</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Утасны дугаар"
                required
              />
            </div>

            <div className="payment-method-info">
              <p>Төлбөр: <strong>Byl</strong> системээр төлнө.</p>
            </div>

            <button type="submit" className="checkout-submit-btn" disabled={loading}>
              {loading ? 'Уншиж байна...' : 'Захиалах ба Төлбөр төлөх'}
            </button>
          </form>
        </div>

        <div className="order-summary">
          <h2>Захиалгын мэдээлэл</h2>
          <div className="summary-items">
            {items.map(item => (
              <div key={item.id} className="summary-item">
                <div className="summary-item-info">
                  <span className="summary-item-name">{item.name}</span>
                  <span className="summary-item-qty">Тоо: {item.quantity} ширхэг</span>
                </div>
                <div className="summary-item-price">
                  ₮{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <span>Нийт дүн:</span>
            <span>₮{cartTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
