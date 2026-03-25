import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { FiSearch, FiUser, FiMenu } from 'react-icons/fi';
import './Header.css';

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

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
