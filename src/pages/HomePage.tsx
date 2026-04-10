import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiArrowRight, FiCheck } from 'react-icons/fi';
import { partsAPI } from '../services/api';
import { useCartStore } from '../store';
import type { Part } from '../types';
import './HomePage.css';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

export const HomePage: React.FC = () => {
  // Featured Parts
  const [featuredParts, setFeaturedParts] = useState<Part[]>([]);
  const [loadingParts, setLoadingParts] = useState(true);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const { addItem } = useCartStore();

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


  const handleAddToCart = (part: Part) => {
    const partId = part._id || part.id || '';
    addItem({
      id: partId,
      name: part.name,
      price: part.price,
      quantity: 1,
      imageUrl: part.imageUrl
    });
    setAddedItems(prev => ({ ...prev, [partId]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [partId]: false }));
    }, 2000);
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
              {featuredParts.map(part => {
                const partId = part._id || part.id || '';
                return (
                <div key={partId} className="part-card">
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
                    <button 
                      className="btn-add-cart" 
                      onClick={() => handleAddToCart(part)}
                      style={addedItems[partId] ? { background: 'var(--accent-secondary)' } : {}}
                    >
                      {addedItems[partId] ? (
                        <><FiCheck /> Нэмэгдлээ</>
                      ) : (
                        <><FiShoppingCart /> Сагсанд нэмэх</>
                      )}
                    </button>
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
