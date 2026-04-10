import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useCartStore, useThemeStore } from '../../store';
import { FiSearch, FiUser, FiMenu, FiShoppingCart, FiTrash2, FiSun, FiMoon } from 'react-icons/fi';
import './Header.css';

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { items: cartItems, removeItem, clearCart } = useCartStore();
  const { theme, toggleTheme } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/parts?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="main-header">
      <div className="header-top">
        <div className="container header-container">
          <div className="header-left">
            <Link to="/" className="logo">
              <span className="logo-text">X</span>
              <span className="logo-text-highlight">pand</span>
            </Link>
          </div>

          <div className="header-center">
            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Сэлбэг, үйлчилгээ хайх..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                <FiSearch size={20} />
              </button>
            </form>
          </div>

          <div className="header-right">
            <nav className="desktop-nav">
              <Link to="/" className="nav-link">Нүүр</Link>
              <Link to="/services" className="nav-link">Үйлчилгээ</Link>
              <Link to="/parts" className="nav-link">Сэлбэг</Link>
            </nav>
            {isAuthenticated ? (
              <div className="user-menu">
                <Link to="/profile" className="user-name">
                  <FiUser size={18} /> {user?.name || 'Хэрэглэгч'}
                </Link>
                <button onClick={() => { logout(); localStorage.removeItem('auth_token'); }} className="logout-btn">
                  Гарах
                </button>
              </div>
            ) : (
              <Link to="/login" className="login-btn">
                <FiUser size={18} />
                <span>Нэвтрэх</span>
              </Link>
            )}
            
            <div className="cart-wrapper">
              <button className="cart-toggle-btn" onClick={() => setIsCartOpen(!isCartOpen)}>
                <FiShoppingCart size={20} />
                {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
              </button>
              
              {isCartOpen && (
                <div className="cart-dropdown">
                  <div className="cart-header">
                    <h3>Таны сагс</h3>
                    <button onClick={() => setIsCartOpen(false)} className="close-cart">&times;</button>
                  </div>
                  <div className="cart-body">
                    {cartItems.length === 0 ? (
                      <p className="empty-cart">Сагс хоосон байна</p>
                    ) : (
                      cartItems.map(item => (
                        <div key={item.id} className="cart-item">
                          <div className="cart-item-info">
                            <span className="cart-item-name">{item.name}</span>
                            <span className="cart-item-price">{item.quantity} x ₮{item.price.toLocaleString()}</span>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="remove-item-btn">
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  {cartItems.length > 0 && (
                     <div className="cart-footer">
                       <div className="cart-total">
                         <span>Нийт:</span>
                         <span>₮{cartTotal.toLocaleString()}</span>
                       </div>
                       <button className="checkout-btn" onClick={() => {
                         alert('Захиалга амжилттай бүртгэгдлээ! (Загвар)');
                         clearCart();
                         setIsCartOpen(false);
                       }}>
                         Захиалах
                       </button>
                     </div>
                  )}
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            <button className="mobile-menu-btn">
              <FiMenu size={24} />
            </button>
          </div>
        </div>
      </div>
{/*       <div className="header-bottom">
        <div className="container">
          <nav className="categories-nav">
            <Link to="/parts?category=engine" className="category-link">Хөдөлгүүр</Link>
            <Link to="/parts?category=suspension" className="category-link">Явах эд анги</Link>
            <Link to="/parts?category=electrical" className="category-link">Цахилгаан</Link>
            <Link to="/parts?category=body" className="category-link">Кузов</Link>
            <Link to="/parts?category=fluids" className="category-link">Тос, шингэн</Link>
          </nav>
        </div>
      </div> */}
    </header>
  );
};
