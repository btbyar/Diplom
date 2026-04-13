import React from 'react';
import { FiCheckCircle, FiUsers, FiTool, FiShield } from 'react-icons/fi';
import './AboutPage.css';

export const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-overlay" />
        <div className="container about-hero-content animate-slide-up">
          <div className="hero-badge">БИДНИЙ ТУХАЙ</div>
          <h1 className="about-title">
            ЧАНАРТАЙ ҮЙЛЧИЛГЭЭ<br />
            <span className="about-title-highlight">НАЙДВАРТАЙ ТҮНШ</span>
          </h1>
          <p className="about-subtitle">
            Бид 2014 оноос хойш авто засвар, сэлбэг худалдааны чиглэлээр үйл ажиллагаа явуулж байгаа бөгөөд автомашины бүх төрлийн засвар үйлчилгээг мэргэжлийн өндөр түвшинд хийж гүйцэтгэнэ.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="about-mission">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon"><FiUsers size={32} /></div>
              <h3>Бидний эрхэм зорилго</h3>
              <p>Үйлчлүүлэгчдийнхээ аюулгүй, тав тухтай аяллыг хангахын тулд чанартай, баталгаат сэлбэгээр мэргэжлийн өндөр түвшний үйлчилгээг үзүүлэхэд оршино.</p>
            </div>
            <div className="mission-card">
              <div className="mission-icon"><FiTool size={32} /></div>
              <h3>Бидний алсын хараа</h3>
              <p>Монгол улсын авто үйлчилгээний салбарт тэргүүлэгч, хамгийн найдвартай төв болон өргөжих зорилготой.</p>
            </div>
            <div className="mission-card">
              <div className="mission-icon"><FiShield size={32} /></div>
              <h3>Бидний үнэт зүйл</h3>
              <p>Чанартай үйлчилгээ, найдвартай байдал, харилцагчийн сэтгэл ханамж, тасралтгүй хөгжил.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="about-features">
        <div className="container">
          <div className="features-inner">
            <div className="features-text">
              <h2>ЯАГААД БИДНИЙГ СОНГОХ ВЭ?</h2>
              <div className="features-list">
                <div className="feature-item">
                  <FiCheckCircle className="feature-check" />
                  <div>
                    <h4>Олон жилийн туршлагатай хамт олон</h4>
                    <p>Манай инженер техникийн ажилчид нь мэргэжлээрээ олон жил ажилласан туршлагатай.</p>
                  </div>
                </div>
                <div className="feature-item">
                  <FiCheckCircle className="feature-check" />
                  <div>
                    <h4>Оригинал, баталгаат сэлбэг</h4>
                    <p>Бид зөвхөн үйлдвэрийн баталгаат, чанартай сэлбэгүүдийг үйлчилгээндээ ашигладаг.</p>
                  </div>
                </div>
                <div className="feature-item">
                  <FiCheckCircle className="feature-check" />
                  <div>
                    <h4>Орчин үеийн тоног төхөөрөмж</h4>
                    <p>Хамгийн сүүлийн үеийн компьютер оношилгоо, засварын тоног төхөөрөмжөөр тоноглогдсон.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="features-image">
              <img src="https://images.unsplash.com/photo-1632823462943-4310a0d4c919?w=800&q=80&auto=format&fit=crop" alt="Auto repair" />
              <div className="features-image-gradient" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Banner */}
      <section className="about-contact-banner">
        <div className="container banner-content">
          <h2>Таны автомашинд гэмтэл гарсан уу?</h2>
          <p>Бидэнтэй холбогдож мэргэжлийн зөвлөгөө аваарай. Бид танд туслахад бэлэн байна.</p>
          <a href="tel:88608141" className="contact-btn">
            ХОЛБОО БАРИХ (88608141)
          </a>
        </div>
      </section>
    </div>
  );
};
