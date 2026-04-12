import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore, useCartStore } from '../../store';
import { FiPhone, FiMenu, FiX, FiUser, FiShoppingCart, FiTrash2, FiLogOut } from 'react-icons/fi';
import { EmptyState } from '../ui/EmptyState';
import './Header.css';

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { items: cartItems, removeItem } = useCartStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const navLinks = [
    { to: '/', label: 'НҮҮР' },
    { to: '/about', label: 'БИДНИЙ ТУХАЙ' },
    { to: '/services', label: 'ҮЙЛЧИЛГЭЭ' },
    { to: '/parts', label: 'СЭЛБЭГ' },
    { to: '/contact', label: 'ХОЛБОО БАРИХ' },
  ];

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header className="main-header">
      <div className="header-inner">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <span className="logo-text">X</span>
          <span className="logo-text-highlight">pand</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-nav">
          {navLinks.map((link, i) => (
            <React.Fragment key={link.to}>
              {i > 0 && <span className="nav-divider">|</span>}
              <Link
                to={link.to}
                className={`nav-link${isActive(link.to) ? ' active' : ''}`}
              >
                {link.label}
              </Link>
            </React.Fragment>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="header-actions">
          {/* Phone Button */}
          <a href="tel:88608141" className="phone-btn">
            <FiPhone size={16} />
            <span>88608141</span>
          </a>

          {/* Auth */}
          {isAuthenticated ? (
            <div className="auth-group">
              <Link to="/profile" className="icon-btn" title={user?.name}>
                <FiUser size={18} />
              </Link>
              <button
                className="icon-btn"
                title="Гарах"
                onClick={() => { logout(); localStorage.removeItem('auth_token'); }}
              >
                <FiLogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="icon-btn" title="Нэвтрэх">
              <FiUser size={18} />
            </Link>
          )}

          {/* Cart */}
          <div className="cart-wrapper">
            <button className="icon-btn cart-btn" onClick={() => setIsCartOpen(!isCartOpen)}>
              <FiShoppingCart size={18} />
              {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
            </button>

            {isCartOpen && (
              <div className="cart-dropdown">
                <div className="cart-head">
                  <h3>Таны сагс</h3>
                  <button onClick={() => setIsCartOpen(false)} className="close-btn">
                    <FiX size={18} />
                  </button>
                </div>
                <div className="cart-body">
                  {cartItems.length === 0 ? (
                    <EmptyState 
                      icon={<FiShoppingCart />} 
                      title="Сагс хоосон байна" 
                      size="small" 
                    />
                  ) : (
                    cartItems.map(item => (
                      <div key={item.id} className="cart-item">
                        <div className="cart-item-info">
                          <span className="cart-item-name">{item.name}</span>
                          <span className="cart-item-price">{item.quantity} × ₮{item.price.toLocaleString()}</span>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="remove-btn">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                {cartItems.length > 0 && (
                  <div className="cart-foot">
                    <div className="cart-total">
                      <span>Нийт:</span>
                      <span>₮{cartTotal.toLocaleString()}</span>
                    </div>
                    <button className="checkout-btn" onClick={() => {
                      if (!isAuthenticated) {
                        navigate('/login', { state: { from: '/checkout' } });
                      } else {
                        navigate('/checkout');
                      }
                      setIsCartOpen(false);
                    }}>
                      Захиалах
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="hamburger-btn" onClick={() => setIsMobileOpen(!isMobileOpen)}>
            {isMobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="mobile-menu">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`mobile-nav-link${isActive(link.to) ? ' active' : ''}`}
              onClick={() => setIsMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a href="tel:88608141" className="mobile-phone-link">
            <FiPhone size={16} /> 88608141
          </a>
        </div>
      )}
    </header>
  );
};
