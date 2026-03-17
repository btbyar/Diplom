import React from 'react';
import { Link } from 'react-router-dom';
import { FiSettings, FiTool, FiBox, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import './HomePage.css';

export const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      {/* Ambient background glows */}
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>
      <div className="ambient-glow glow-3"></div>
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">Шинэ үеийн авто үйлчилгээ</div>
            <h1 className="hero-title">
              Таны автомашинд зориулсан <span>ухаалаг шийдэл</span>
            </h1>
            <p className="hero-subtitle">
              Дэвшилтэт технологи, мэргэжлийн инженерүүд, баталгаат сэлбэг хэрэгсэл. Таны аюулгүй байдлын төлөөх цогц үйлчилгээ.
            </p>
            <div className="hero-actions">
              <Link to="/book" className="btn btn-primary btn-glow">
                Цаг захиалах <FiArrowRight />
              </Link>
              <Link to="/services" className="btn btn-secondary glass-btn">
                Үйлчилгээ харах
              </Link>
            </div>
            
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-value">5000+</span>
                <span className="stat-label">Сэтгэл ханамжтай үйлчлүүлэгч</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-value">100%</span>
                <span className="stat-label">Баталгаат сэлбэг</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="tech-ring ring-1"></div>
            <div className="tech-ring ring-2"></div>
            <div className="tech-ring ring-3"></div>
            <div className="visual-center">
              <FiSettings className="visual-icon" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Glassmorphism Grid */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Манай үйлчилгээнүүд</h2>
            <p className="section-desc">Орчин үеийн тоног төхөөрөмжөөр хийгдэх найдвартай үйлчилгээ</p>
          </div>
          
          <div className="categories-grid">
            <Link to="/parts?category=engine" className="glass-card category-card">
              <div className="card-glow"></div>
              <div className="category-icon blue-icon">
                <FiSettings />
              </div>
              <h3>Хөдөлгүүрийн засвар</h3>
              <p>Компьютер оношилгоо болон моторын бүрэн үйлчилгээ, засвар</p>
              <div className="card-arrow"><FiArrowRight /></div>
            </Link>
            
            <Link to="/parts?category=suspension" className="glass-card category-card">
              <div className="card-glow"></div>
              <div className="category-icon purple-icon">
                <FiTool />
              </div>
              <h3>Явах эд анги</h3>
              <p>Тэнхлэг тохиргоо, амортизатор болон уян эд ангиуд</p>
              <div className="card-arrow"><FiArrowRight /></div>
            </Link>
            
            <Link to="/parts?category=electrical" className="glass-card category-card">
              <div className="card-glow"></div>
              <div className="category-icon green-icon">
                <FiBox />
              </div>
              <h3>Сэлбэг хэрэгсэл</h3>
              <p>Оригинал болон үйлдвэрийн баталгаат өндөр чанартай сэлбэг</p>
              <div className="card-arrow"><FiArrowRight /></div>
            </Link>
            
            <Link to="/parts?category=body" className="glass-card category-card">
              <div className="card-glow"></div>
              <div className="category-icon pink-icon">
                <FiCheckCircle />
              </div>
              <h3>Кузов засвар</h3>
              <p>Мэргэжлийн будаг, гадаад өнгөлгөө болон сэв зураас арилгах</p>
              <div className="card-arrow"><FiArrowRight /></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Dark Tech Layout */}
      <section className="features-section">
        <div className="container">
          <div className="features-container glass-panel">
            <div className="features-info">
              <h2 className="section-title">Яагаад биднийг сонгох вэ?</h2>
              <p className="section-desc">Таны автомашин хамгийн сайн үйлчилгээг хүртэх эрхтэй.</p>
            </div>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <span className="feature-number">01</span>
                </div>
                <h3>Мэргэжлийн баг</h3>
                <p>Олон жилийн туршлагатай, байнга мэргэшдэг инженер техникийн ажилтнууд танд үйлчилнэ.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <span className="feature-number">02</span>
                </div>
                <h3>Найдвартай сэлбэг</h3>
                <p>Зөвхөн үйлдвэрийн баталгаат, оригиналаас дутахгүй чанартай сэлбэг хэрэгслийг ашигладаг.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <span className="feature-number">03</span>
                </div>
                <h3>Шуурхай үйлчилгээ</h3>
                <p>Онлайн цаг захиалгын систем нь таны алтан цагийг хэмнэж, хүлээгдэлгүй үйлчлүүлэх боломжийг олгоно.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
