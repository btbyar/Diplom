import React, { useState, useEffect } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './ContactPage.css';

export const ContactPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Таны зурвас амжилттай илгээгдлээ. Бид удахгүй холбогдох болно.');
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className="contact-page-v2">
      {/* ── Hero Section ── */}
      <section className="contact-hero-v2">
        <div className="hero-v2-bg">
          <div className="bg-glow"></div>
        </div>
        <div className="container contact-hero-v2-inner">
          <div className="hero-text-content fade-in-section">
            <div className="modern-badge">ХОЛБОО БАРИХ</div>
            <h1 className="hero-title-v2">
              БИДЭНТЭЙ <span className="text-gradient">ХОЛБОГДОХ</span>
            </h1>
            <p className="hero-desc-v2">
              Танд автомашины талаар асуух зүйл, зөвлөгөө эсвэл үйлчилгээний цаг авах хэрэгцээ гарсан бол бидэнтэй хэдийд ч холбогдох боломжтой.
            </p>
          </div>
        </div>
      </section>

      {/* ── Contact Info & Form ── */}
      <section className="contact-main">
        <div className="container">
          <div className="contact-grid-v2 fade-in-section">

            {/* Left Box: Info Card */}
            <div className="contact-info-card">
              <div className="info-card-bg"></div>
              <h2 className="info-title">Мэдээлэл</h2>
              <p className="info-desc">Бидэнтэй доорх сувгуудаар холбогдож дэлгэрэнгүй мэдээлэл аваарай.</p>

              <div className="info-list">
                <div className="info-item">
                  <div className="info-icon"><FiMapPin /></div>
                  <div className="info-text">
                    <h4>Хаяг</h4>
                    <p>Улаанбаатар хот, Баянзүрх дүүрэг, Xpand төв</p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon"><FiPhone /></div>
                  <div className="info-text">
                    <h4>Утас</h4>
                    <p>+976 8860-8141<br />+976 99XX-XXXX</p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon"><FiMail /></div>
                  <div className="info-text">
                    <h4>И-мэйл</h4>
                    <p>info@xpand.mn<br />support@xpand.mn</p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon"><FiClock /></div>
                  <div className="info-text">
                    <h4>Цагийн хуваарь</h4>
                    <p>Даваа - Баасан: 09:00 - 19:00<br />Бямба, Ням: 10:00 - 17:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Box: Form */}
            <div className="contact-form-card">
              <h2 className="form-title">Зурвас илгээх</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group-v2">
                  <label htmlFor="name">Таны нэр</label>
                  <input type="text" id="name" placeholder="Овог, нэрээ оруулна уу" required />
                </div>
                <div className="form-row-2">
                  <div className="form-group-v2">
                    <label htmlFor="phone">Утасны дугаар</label>
                    <input type="tel" id="phone" placeholder="88******" required />
                  </div>
                  <div className="form-group-v2">
                    <label htmlFor="email">И-мэйл (заавал биш)</label>
                    <input type="email" id="email" placeholder="example@mail.com" />
                  </div>
                </div>
                <div className="form-group-v2">
                  <label htmlFor="subject">Сэдэв</label>
                  <input type="text" id="subject" placeholder="Ямар асуудлаар холбогдож байна вэ?" required />
                </div>
                <div className="form-group-v2">
                  <label htmlFor="message">Зурвас</label>
                  <textarea id="message" rows={4} placeholder="Дэлгэрэнгүй мэдээллээ энд бичнэ үү..." required></textarea>
                </div>
                <button type="submit" className="btn-submit-v2" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="sending">Илгээж байна...</span>
                  ) : (
                    <>Илгээх <FiSend /></>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── Map Box ── */}
      <section className="contact-map fade-in-section">
        <div className="container">
          <div className="map-wrapper">
            <iframe
              src="https://maps.google.com/maps?q=47.925668,106.967652&hl=mn&z=16&output=embed"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map"
            ></iframe>
          </div>
        </div>
      </section>

    </div>
  );
};
