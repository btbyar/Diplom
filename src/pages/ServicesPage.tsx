import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { servicesAPI } from '../services/api';
import type { Service } from '../types';
import { FiClock, FiCheckCircle, FiCalendar } from 'react-icons/fi';
import './ServicesPage.css';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await servicesAPI.getAll();
        setServices(res.data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="client-services-page">
      <div className="page-header">
        <div className="container">
          <h1>Авто засварын үйлчилгээ</h1>
          <p>Бид таны автомашинд мэргэжлийн түвшинд, баталгаат засвар үйлчилгээ үзүүлж байна.</p>
        </div>
      </div>

      <div className="container services-container">
        {loading ? (
          <div className="loading-state">Үйлчилгээнүүдийг уншиж байна...</div>
        ) : services.length === 0 ? (
          <div className="empty-state">
            <h3>Одоогоор үйлчилгээ бүртгэгдээгүй байна.</h3>
          </div>
        ) : (
          <div className="services-grid">
            {services.map(service => (
              <div key={service._id || service.id} className="service-card">
                <div className="service-content">
                  <h3 className="service-name">{service.name}</h3>
                  <p className="service-desc">{service.description || 'Дэлгэрэнгүй мэдээлэл ороогүй байна.'}</p>

                  <ul className="service-features">
                    <li><FiClock className="icon" /> Хугацаа: ~{service.duration || 60} мин</li>
                    <li><FiCheckCircle className="icon" /> Баталгаат хугацаатай</li>
                  </ul>

                  <div className="service-footer">
                    <span className="service-price">₮{service.price.toLocaleString()}</span>
                    <Link to={`/book?service=${service._id || service.id}`} className="btn-book">
                      <FiCalendar /> Цаг захиалах
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
