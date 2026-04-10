import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { servicesAPI } from '../services/api';
import type { Service } from '../types';
import { FiClock, FiCheckCircle, FiCalendar, FiSettings } from 'react-icons/fi';
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
          <div className="services-list-view">
            {services.map(service => (
              <div key={service._id || service.id} className="service-row">
                
                <div className="service-row-left">
                  <div className="service-icon-box">
                    <FiSettings />
                  </div>
                  <div className="service-info">
                    <h3 className="service-name">{service.name}</h3>
                    <p className="service-desc">{service.description || 'Дэлгэрэнгүй мэдээлэл ороогүй байна.'}</p>
                    <div className="service-meta">
                      <span className="meta-badge"><FiClock /> {service.duration || 60} мин</span>
                      <span className="meta-badge"><FiCheckCircle /> Баталгаат хугацаа</span>
                    </div>
                  </div>
                </div>

                <div className="service-row-right">
                  <div className="service-price">
                    <span className="price-label">Үнэ</span>
                    <span className="price-val">₮{service.price.toLocaleString()}</span>
                  </div>
                  <Link to={`/book?service=${service._id || service.id}`} className="btn-book-row">
                    Цаг захиалах <FiCalendar />
                  </Link>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
