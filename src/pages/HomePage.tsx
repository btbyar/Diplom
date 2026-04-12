import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiArrowRight, FiCheck, FiCalendar, FiTool, FiShield, FiClock, FiSettings } from 'react-icons/fi';
import { partsAPI, servicesAPI } from '../services/api';
import { useCartStore } from '../store';
import type { Part, Service } from '../types';
import { Skeleton } from '../components/ui/Skeleton';
import { PartModal } from '../components/parts/PartModal';
import toast from 'react-hot-toast';
import './HomePage.css';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

export const HomePage: React.FC = () => {
  const [featuredParts, setFeaturedParts] = useState<Part[]>([]);
  const [loadingParts, setLoadingParts] = useState(true);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);

  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingParts(true);
        setLoadingServices(true);
        const [partsRes, servicesRes] = await Promise.all([
          partsAPI.getAll(),
          servicesAPI.getAll(),
        ]);
        setFeaturedParts((partsRes.data || []).slice(0, 4));
        setServices((servicesRes.data || []).slice(0, 6));
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoadingParts(false);
        setLoadingServices(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleAddToCart = (part: Part) => {
    const partId = part._id || part.id || '';
    addItem({ id: partId, name: part.name, price: part.price, quantity: 1, imageUrl: part.imageUrl });
    setAddedItems(prev => ({ ...prev, [partId]: true }));
    setTimeout(() => setAddedItems(prev => ({ ...prev, [partId]: false })), 2000);
  };

  const handleModalAddToCart = (part: Part, quantity: number) => {
    const partId = part._id || part.id || '';
    addItem({
      id: partId,
      name: part.name,
      price: part.price,
      quantity: quantity,
      imageUrl: part.imageUrl
    });
    toast.success(`${part.name} (${quantity}ш) сагсанд нэмэгдлээ`);
  };

  const stats = [
    { icon: <FiClock />, value: '10+', label: 'Жилийн туршлага' },
    { icon: <FiTool />, value: '5000+', label: 'Хийсэн засвар' },
    { icon: <FiShield />, value: '100%', label: 'Баталгаат ажил' },
  ];

  return (
    <div className="home-page">

      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-bg-overlay" />

        <div className="hero-inner container animate-slide-up">
          {/* Left content */}
          <div className="hero-text">
            <h1 className="hero-title">
              АВТОМАШИН<br />
              <span className="hero-title-highlight">ЗАСВАРЫН ТӨВ</span>
            </h1>
            <p className="hero-subtitle">
              Тани машины найдвартай үйлчилгээ.<br />
              Дэвшилтэт оношилгоо, баталгаат сэлбэг.
            </p>

            <div className="hero-actions">
              <Link to="/services" className="hero-btn-primary">
                <FiCalendar size={18} />
                ЦАГ АВАХ
              </Link>
              <Link to="/about" className="hero-btn-outline">
                БИДНИЙ ТУХАЙ
              </Link>
            </div>

            {/* Stats row */}
            <div className="hero-stats">
              {stats.map((s, i) => (
                <div key={i} className="stat-item">
                  <div className="stat-icon">{s.icon}</div>
                  <div>
                    <div className="stat-value">{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right – mechanic image panel */}
          <div className="hero-image-panel">
            <div className="hero-image-wrap">
              <img
                src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80&auto=format&fit=crop"
                alt="Автомашины засвар"
                className="hero-img"
              />
              <div className="hero-image-gradient" />

              {/* Floating card */}
              <div className="hero-float-card">
                <div className="float-dot" />
                <div>
                  <div className="float-title">Онлайн цаг захиалах</div>
                  <div className="float-sub">24/7 боломжтой</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ── Services ── */}
      <section className="services-section">
        <div className="container animate-slide-up">
          <div className="section-header">
            <div>
              <h2 className="section-title">БИДНИЙ ҮЙЛЧИЛГЭЭ</h2>
            </div>
            <Link to="/services" className="btn-link">
              Бүгдийг үзэх <FiArrowRight />
            </Link>
          </div>

          {loadingServices ? (
            <div className="services-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="service-card" style={{ padding: '0', border: 'none', background: 'transparent' }}>
                  <Skeleton type="card" height="150px" />
                </div>
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="services-empty">
              <FiSettings size={40} />
              <p>Одоогоор үйлчилгээ бүртгэгдээгүй байна.</p>
            </div>
          ) : (
            <div className="services-grid">
              {services.map((svc) => {
                const svcId = svc._id || svc.id || '';
                return (
                  <div key={svcId} className="service-card">
                    <div className="service-icon-wrap">
                      <FiSettings size={26} />
                    </div>
                    <div className="service-body">
                      <h3 className="service-title">{svc.name}</h3>
                      <p className="service-desc">
                        {svc.description || 'Дэлгэрэнгүй мэдээлэл ороогүй байна.'}
                      </p>
                      <Link
                        to={`/book?service=${svcId}`}
                        className="service-detail-btn"
                      >
                        ЦАГ АВАХ
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Featured Parts ── */}
      <section className="featured-parts-section">
        <div className="container animate-slide-up">
          <div className="section-header">
            <div>
              <h2 className="section-title">СЭЛБЭГҮҮД</h2>
            </div>
            <Link to="/parts" className="btn-link">
              Бүгдийг үзэх <FiArrowRight />
            </Link>
          </div>

          {loadingParts ? (
            <div className="parts-grid">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} type="card" />
              ))}
            </div>
          ) : (
            <div className="parts-grid">
              {featuredParts.map(part => {
                const partId = part._id || part.id || '';
                return (
                  <div key={partId} className="part-card" onClick={() => setSelectedPart(part)} style={{ cursor: 'pointer' }}>
                    <div className="part-image">
                      {part.imageUrl ? (
                        <img src={`${API_BASE}${part.imageUrl}`} alt={part.name} />
                      ) : (
                        <div className="no-image">
                          <FiTool size={32} />
                        </div>
                      )}
                    </div>
                    <div className="part-info">
                      <span className="part-brand">{part.brand || 'Бренд тодорхойгүй'}</span>
                      <h3 className="part-name">{part.name}</h3>
                      <div className="part-price">
                        <span className="price-value">₮{part.price.toLocaleString()}</span>
                      </div>
                      <button
                        className={`btn-add-cart${addedItems[partId] ? ' added' : ''}`}
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(part); }}
                      >
                        {addedItems[partId] ? (
                          <><FiCheck /> Нэмэгдлээ</>
                        ) : (
                          <><FiShoppingCart /> Сагсанд нэмэх</>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <PartModal 
        part={selectedPart}
        isOpen={!!selectedPart}
        onClose={() => setSelectedPart(null)}
        onAddToCart={handleModalAddToCart}
      />
    </div>
  );
};
