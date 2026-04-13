import React, { useEffect } from 'react';
import { FiUsers, FiTool, FiShield, FiTarget, FiAward, FiClock, FiSettings } from 'react-icons/fi';
import './AboutPage.css';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-section').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const stats = [
    { number: '10+', label: 'Жилийн туршлага', icon: <FiClock /> },
    { number: '5000+', label: 'Сэтгэл ханамжтай харилцагч', icon: <FiUsers /> },
    { number: '30+', label: 'Мэргэшсэн инженер', icon: <FiTool /> },
    { number: '100%', label: 'Баталгаат үйлчилгээ', icon: <FiShield /> },
  ];

  return (
    <div className="about-page-v2">
      {/* ── Hero Section ── */}
      <section className="about-hero-v2">
        <div className="hero-v2-bg">
          <div className="bg-glow"></div>
          <div className="bg-img-overlay"></div>
        </div>
        <div className="container about-hero-v2-inner">
          <div className="hero-text-content fade-in-section">
            <div className="modern-badge">БИДНИЙ ТАНИЛЦУУЛГА</div>
            <h1 className="hero-title-v2">
              АВТО ҮЙЛЧИЛГЭЭНИЙ ШИНЭ<br />
              <span className="text-gradient">СТАНДАРТЫГ ТОГТООНО</span>
            </h1>
            <p className="hero-desc-v2">
              2014 оноос хойш бид автомашины үйлчилгээг шинэ шатанд гаргаж, хамгийн сүүлийн үеийн технологи, өндөр ур чадвартай баг хамт олонтойгоор үйлчлүүлэгчдийнхээ итгэлийг хүлээсээр байна.
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className="about-stats">
        <div className="container">
          <div className="stats-grid-v2 fade-in-section">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-card-v2" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="stat-icon-v2">{stat.icon}</div>
                <div className="stat-number-v2">{stat.number}</div>
                <div className="stat-label-v2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Values (Split Layout) ── */}
      <section className="about-core-values">
        <div className="container">
          <div className="split-layout fade-in-section">
            <div className="split-text">
              <h2 className="section-title-v2">Бидний алсын хараа<br />ба <span className="text-orange">зорилго</span></h2>
              <p className="split-desc">
                Монгол улсын авто үйлчилгээний салбарт тэргүүлэгч, хамгийн найдвартай төв болон өргөжих нь бидний алсын хараа юм. Харилцагч бүрийнхээ аюулгүй, тав тухтай аяллыг хангахад бид эрхэм зорилгоо чиглүүлдэг.
              </p>

              <div className="value-points">
                <div className="value-item">
                  <div className="value-icon"><FiTarget /></div>
                  <div className="value-info">
                    <h4>Төгс гүйцэтгэл</h4>
                    <p>Ажил бүрийг олон улсын стандартын дагуу 100% чанартай хийж гүйцэтгэх.</p>
                  </div>
                </div>
                <div className="value-item">
                  <div className="value-icon"><FiAward /></div>
                  <div className="value-info">
                    <h4>Найдвартай түншлэл</h4>
                    <p>Үйлчлүүлэгчидтэйгээ урт хугацааны, үнэ цэнтэй харилцааг бий болгох.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="split-image">
              <div className="image-composition">
                <img src="/images/about-mechanic-1.jpg" alt="Mechanic Team" className="comp-img comp-img-1" />
                <img src="/images/about-mechanic-2.jpg" alt="Car Repair" className="comp-img comp-img-2" />
                <div className="comp-shape"></div>
                <div className="comp-dots"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="about-why-us">
        <div className="container">
          <div className="text-center fade-in-section">
            <div className="modern-badge">ДАВУУ ТАЛ</div>
            <h2 className="section-title-v2" style={{ marginBottom: '50px' }}>Яагаад биднийг сонгох вэ?</h2>
          </div>

          <div className="features-grid-v2 fade-in-section">
            <div className="feature-card-v2">
              <div className="fc-icon"><FiUsers /></div>
              <h3>Туршлагатай хамт олон</h3>
              <p>Салбартаа тасралтгүй 10+ жил ажилласан, нарийн мэргэшлийн инженер техникийн баг.</p>
            </div>
            <div className="feature-card-v2 center-card">
              <div className="fc-icon"><FiSettings /></div>
              <h3>Баталгаат сэлбэг</h3>
              <p>Зөвхөн үйлдвэрийн баталгаат, хамгийн чанартай оригинал сэлбэг хэрэгслийг ашигладаг.</p>
            </div>
            <div className="feature-card-v2">
              <div className="fc-icon"><FiTool /></div>
              <h3>Орчин үеийн төхөөрөмж</h3>
              <p>Хамгийн сүүлийн үеийн компьютер оношилгоо, бүрэн автомат засварын төхөөрөмжтэй.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="about-cta-banner fade-in-section">
        <div className="container">
          <div className="cta-box">
            <div className="cta-glow"></div>
            <div className="cta-content">
              <h2>Асуудал гарсан уу? Бид шийднэ.</h2>
              <p>Бидэнтэй холбогдож автомашины бүх төрлийн зөвлөгөө, үйлчилгээг түргэн шуурхай аваарай.</p>
            </div>
            <div className="cta-action">
              <a href="tel:88608141" className="btn-glow">
                ХОЛБОО БАРИХ (88608141)
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
