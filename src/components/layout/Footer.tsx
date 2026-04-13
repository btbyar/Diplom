import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiInstagram } from 'react-icons/fi';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-section">
            <Link to="/" className="footer-logo">
              <span className="logo-text">X</span>
              <span className="logo-text-highlight">pand</span>
            </Link>
            <p className="footer-description">
              Бид чанартай автомашины сэлбэг болон найдвартай авто үйлчилгээг танд санал болгож байна.
            </p>
            <div className="social-links">
              <a href="#" className="social-link"><FiFacebook /></a>
              <a href="#" className="social-link"><FiInstagram /></a>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Холбоос</h3>
            <ul className="footer-links">
              <li><Link to="/">Нүүр</Link></li>
              <li><Link to="/about">Бидний тухай</Link></li>
              <li><Link to="/parts">Сэлбэг</Link></li>
              <li><Link to="/services">Үйлчилгээ</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Тусламж</h3>
            <ul className="footer-links">
              <li><Link to="/faq">Түгээмэл асуултууд</Link></li>
              <li><Link to="/terms">Үйлчилгээний нөхцөл</Link></li>
              <li><Link to="/privacy">Нууцлалын бодлого</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Холбоо барих</h3>
            <ul className="footer-contact">
              <li>
                <FiPhone className="contact-icon" />
                <span>+976 88XX-XXXX, 99XX-XXXX</span>
              </li>
              <li>
                <FiMail className="contact-icon" />
                <span>info@xpand.mn</span>
              </li>
              <li>
                <FiMapPin className="contact-icon" />
                <span>Улаанбаатар хот, Баянзүрх дүүрэг</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Xpand. Бүх эрх хуулиар хамгаалагдсан.</p>
        </div>
      </div>
    </footer>
  );
};
