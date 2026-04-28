import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { servicesAPI, bookingsAPI } from '../services/api';
import { useAuthStore } from '../store';
import type { Service } from '../types';
import './BookingPage.css';

const ALL_SLOTS = [
  '09:00', '09:30',
  '10:00', '10:30',
  '11:00', '11:30',
  '12:00', '12:30',
  '13:00', '13:30',
  '14:00', '14:30',
  '15:00', '15:30',
  '16:00', '16:30',
  '17:00',
];

const STEP_LABELS = ['Үйлчилгээ', 'Огноо & Цаг', 'Баталгаажуулах'];

export const BookingPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const initialServiceId = searchParams.get('service') || '';
  const initialDate      = searchParams.get('date') || '';

  const [step, setStep] = useState(initialServiceId ? 1 : 0); // 0=service, 1=datetime, 2=confirm
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookedSlots, setBookedSlots]   = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [brand, setBrand]   = useState('');
  const [notes, setNotes]   = useState('');

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedTime, setSelectedTime] = useState('');

  /* ─── Load services ─── */
  useEffect(() => {
    servicesAPI.getAll()
      .then(res => {
        const list: Service[] = res.data || [];
        setServices(list);
        if (initialServiceId) {
          const found = list.find(s => (s._id || s.id) === initialServiceId);
          if (found) setSelectedService(found);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ─── Load booked slots when date changes ─── */
  const fetchSlots = useCallback(async (date: string) => {
    if (!date) return;
    setSlotsLoading(true);
    try {
      const res = await bookingsAPI.getAvailableSlots(date);
      setBookedSlots(res.data.bookedSlots || []);
    } catch {
      setBookedSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      setSelectedTime(''); // reset time on date change
      fetchSlots(selectedDate);
    }
  }, [selectedDate]);

  /* ─── today min date ─── */
  const todayStr = new Date().toISOString().split('T')[0];

  /* ─── submit ─── */
  const handleSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedTime) return;
    setSubmitting(true);
    try {
      const res = await bookingsAPI.create({
        serviceId: (selectedService._id || selectedService.id) as any,
        date: selectedDate,
        time: selectedTime,
        brand: brand || 'Бүх марк',
        notes,
        status: 'payment_pending',
        userId: '',
      } as any);

      const paymentUrl = (res.data as any).paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        toast.success('Захиалга амжилттай бүртгэгдлээ!');
        navigate('/');
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Алдаа гарлаа';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── Auth gate ─── */
  if (!isAuthenticated) {
    return (
      <div className="bk-auth-gate">
        <div className="bk-auth-card">
          <div className="bk-auth-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h2>Нэвтрэх шаардлагатай</h2>
          <p>Цаг захиалахын тулд та эхлээд бүртгэлдээ нэвтэрнэ үү.</p>
          <div className="bk-auth-actions">
            <Link to="/login" state={{ from: location.pathname + location.search }} className="bk-btn-primary">
              Нэвтрэх
            </Link>
            <Link to="/register" className="bk-btn-secondary">Бүртгүүлэх</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bk-page">
      {/* Background decoration */}
      <div className="bk-bg-orb bk-bg-orb--1" />
      <div className="bk-bg-orb bk-bg-orb--2" />

      <div className="bk-container">
        {/* Page title */}
        <div className="bk-page-header">
          <h1>Цаг захиалах</h1>
          <p>Өөрт тохиромжтой үйлчилгээ, огноо, цагаа сонгоно уу</p>
        </div>

        {/* Step indicator */}
        <div className="bk-steps">
          {STEP_LABELS.map((label, i) => (
            <React.Fragment key={i}>
              <div
                className={['bk-step', i < step ? 'bk-step--done' : '', i === step ? 'bk-step--active' : ''].join(' ')}
                onClick={() => i < step && setStep(i)}
                style={{ cursor: i < step ? 'pointer' : 'default' }}
              >
                <div className="bk-step-circle">
                  {i < step
                    ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>
                    : <span>{i + 1}</span>
                  }
                </div>
                <span className="bk-step-label">{label}</span>
              </div>
              {i < STEP_LABELS.length - 1 && <div className={['bk-step-line', i < step ? 'bk-step-line--done' : ''].join(' ')} />}
            </React.Fragment>
          ))}
        </div>

        {/* ═══ STEP 0: Service selection ═══ */}
        {step === 0 && (
          <div className="bk-panel bk-animate">
            <h3 className="bk-panel-title">Үйлчилгээ сонгоно уу</h3>
            {loading ? (
              <div className="bk-loading">
                <div className="bk-spinner" />
                <span>Үйлчилгээ уншиж байна...</span>
              </div>
            ) : (
              <div className="bk-services-grid">
                {services.map(s => {
                  const id = s._id || s.id || '';
                  const active = selectedService && (selectedService._id || selectedService.id) === id;
                  return (
                    <div
                      key={id}
                      className={['bk-service-card', active ? 'bk-service-card--active' : ''].join(' ')}
                      onClick={() => setSelectedService(s)}
                    >
                      <div className="bk-service-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                      </div>
                      <div className="bk-service-info">
                        <h4>{s.name}</h4>
                        {s.duration && <span className="bk-service-dur">⏱ {s.duration} мин</span>}
                        {s.description && <p className="bk-service-desc">{s.description}</p>}
                      </div>
                      <div className="bk-service-price">₮{s.price.toLocaleString()}</div>
                      {active && (
                        <div className="bk-service-check">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <div className="bk-actions">
              <button
                className="bk-btn-primary bk-btn--next"
                disabled={!selectedService}
                onClick={() => setStep(1)}
              >
                Цааш үргэлжлэх
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        )}

        {/* ═══ STEP 1: Date & Time ═══ */}
        {step === 1 && (
          <div className="bk-panel bk-animate">
            <h3 className="bk-panel-title">Огноо & цаг сонгоно уу</h3>

            {/* Selected service summary */}
            {selectedService && (
              <div className="bk-selected-service">
                <span className="bk-sel-label">Сонгосон үйлчилгээ:</span>
                <span className="bk-sel-name">{selectedService.name}</span>
                <span className="bk-sel-price">₮{selectedService.price.toLocaleString()}</span>
                <button className="bk-change-btn" onClick={() => setStep(0)}>Өөрчлөх</button>
              </div>
            )}

            {/* Date picker */}
            <div className="bk-date-section">
              <label className="bk-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Огноо
              </label>
              <input
                className="bk-date-input"
                type="date"
                min={todayStr}
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
              />
            </div>

            {/* Time grid */}
            {selectedDate && (
              <div className="bk-time-section">
                <label className="bk-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
                  Цаг сонгоно уу
                  {slotsLoading && <span className="bk-slots-loading">Шалгаж байна...</span>}
                </label>
                <div className="bk-time-grid">
                  {ALL_SLOTS.map(slot => {
                    const booked   = bookedSlots.includes(slot);
                    const selected = slot === selectedTime;
                    return (
                      <button
                        key={slot}
                        type="button"
                        className={[
                          'bk-time-slot',
                          booked   ? 'bk-time-slot--booked'   : '',
                          selected ? 'bk-time-slot--selected' : '',
                        ].join(' ')}
                        disabled={booked}
                        onClick={() => !booked && setSelectedTime(slot)}
                        title={booked ? 'Энэ цаг захиалагдсан' : slot}
                      >
                        {slot}
                        {booked && (
                          <span className="bk-slot-x">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          </span>
                        )}
                        {selected && (
                          <span className="bk-slot-check">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="bk-slot-legend">
                  <span><span className="bk-legend-dot bk-legend-dot--free" />Чөлөөт</span>
                  <span><span className="bk-legend-dot bk-legend-dot--booked" />Захиалагдсан</span>
                  <span><span className="bk-legend-dot bk-legend-dot--selected" />Сонгосон</span>
                </div>
              </div>
            )}

            <div className="bk-actions">
              <button className="bk-btn-secondary" onClick={() => setStep(0)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Буцах
              </button>
              <button
                className="bk-btn-primary bk-btn--next"
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep(2)}
              >
                Баталгаажуулах
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        )}

        {/* ═══ STEP 2: Confirm ═══ */}
        {step === 2 && selectedService && (
          <div className="bk-panel bk-animate">
            <h3 className="bk-panel-title">Захиалгаа баталгаажуулна уу</h3>

            {/* Summary card */}
            <div className="bk-summary">
              <div className="bk-summary-row">
                <span>Үйлчилгээ</span>
                <strong>{selectedService.name}</strong>
              </div>
              <div className="bk-summary-row">
                <span>Огноо</span>
                <strong>{selectedDate}</strong>
              </div>
              <div className="bk-summary-row">
                <span>Цаг</span>
                <strong>{selectedTime}</strong>
              </div>
              {selectedService.duration && (
                <div className="bk-summary-row">
                  <span>Хугацаа</span>
                  <strong>{selectedService.duration} минут</strong>
                </div>
              )}
              <div className="bk-summary-row bk-summary-row--total">
                <span>Нийт дүн</span>
                <strong className="bk-total-price">₮{selectedService.price.toLocaleString()}</strong>
              </div>
            </div>

            {/* Extra info */}
            <div className="bk-extra-section">
              <div className="bk-form-group">
                <label className="bk-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                  Машины марк (заавал биш)
                </label>
                <input
                  className="bk-input"
                  type="text"
                  placeholder="Toyota, Lexus, Hyundai..."
                  value={brand}
                  onChange={e => setBrand(e.target.value)}
                />
              </div>
              <div className="bk-form-group">
                <label className="bk-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
                  Нэмэлт тэмдэглэл (заавал биш)
                </label>
                <textarea
                  className="bk-input bk-textarea"
                  placeholder="Машины улсын дугаар, онцгой хэрэгцээ..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="bk-notice">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Баталгаажуулахын дараа та төлбөрийн хуудас руу шилжих болно.
            </div>

            <div className="bk-actions">
              <button className="bk-btn-secondary" onClick={() => setStep(1)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Буцах
              </button>
              <button
                className="bk-btn-primary bk-btn--submit"
                disabled={submitting}
                onClick={handleSubmit}
              >
                {submitting ? (
                  <>
                    <span className="bk-spinner bk-spinner--sm" />
                    Захиалж байна...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
                    Захиалга өгөх & Төлбөр хийх
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
