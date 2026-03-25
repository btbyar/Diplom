import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import { partsAPI } from '../services/api';
import type { Part } from '../types';
import './HomePage.css';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  // Quick Search & Featured Parts
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredParts, setFeaturedParts] = useState<Part[]>([]);
  const [loadingParts, setLoadingParts] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingParts(true);
        const partsRes = await partsAPI.getAll();
        setFeaturedParts((partsRes.data || []).slice(0, 4));
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoadingParts(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/parts?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/parts');
    }
  };

  return (
    <div className="home-page client-parts-page">
      {/* Centered Hero Section without Booking Widget */}
      <section className="booking-hero-section centered-hero">
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Автомашины хэрэгцээт <span>бүх үйлчилгээ</span> нэг дороос
            </h1>
            <p className="hero-subtitle">
              Дэвшилтэт оношилгоо, баталгаат сэлбэг, мэргэжлийн үйлчилгээ. Та машинаа бидэнд даатга.
            </p>
            <div className="hero-actions">
              <Link to="/services" className="btn btn-primary hero-btn">
                Цаг захиалах
              </Link>
              <Link to="/parts" className="btn btn-secondary hero-btn outline-btn">
                Сэлбэгийн каталог
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Search Strip */}
      <section className="quick-search-strip">
        <div className="container">
          <form onSubmit={handleSearch} className="quick-search-form">
            <label className="strip-label">Сэлбэг хурдан хайх:</label>
            <div className="strip-input-group">
              <input 
                type="text" 
                placeholder="Жишээ: Амортизатор, Тос..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="btn-search">
                <FiSearch /> Хайх
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Featured Parts Section */}
      <section className="featured-parts-section">
        <div className="container">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
            <div>
              <h2 className="section-title">Онцлох сэлбэгүүд</h2>
            </div>
            <Link to="/parts" className="btn-link">Бүгдийг үзэх <FiArrowRight /></Link>
          </div>
          
          {loadingParts ? (
            <div className="loading-state">Уншиж байна...</div>
          ) : (
            <div className="parts-grid">
              {featuredParts.map(part => (
                <div key={part._id || part.id} className="part-card">
                  <div className="part-image">
                    {part.imageUrl ? (
                      <img src={`${API_BASE}${part.imageUrl}`} alt={part.name} />
                    ) : (
                      <div className="no-image">Зураггүй</div>
                    )}
                  </div>
                  <div className="part-info">
                    <span className="part-brand">{part.brand || 'Бренд тодорхойгүй'}</span>
                    <h3 className="part-name">{part.name}</h3>
                    <div className="part-price">
                      <span className="price-value">₮{part.price.toLocaleString()}</span>
                    </div>
                    <button className="btn-add-cart" onClick={() => navigate(`/parts?search=${encodeURIComponent(part.name)}`)}>
                      <FiShoppingCart /> Дэлгэрэнгүй
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
