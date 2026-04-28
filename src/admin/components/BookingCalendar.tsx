import { useState, useMemo } from 'react';
import type { Booking } from '../../types';
import './BookingCalendar.css';

interface BookingCalendarProps {
  bookings: Booking[];
  onEdit?: (booking: Booking) => void;
  onDelete?: (id: string) => void;
}

const WEEKDAYS = ['Да', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя', 'Ня'];
const MONTHS = [
  'Нэгдүгээр сар','Хоёрдугаар сар','Гуравдугаар сар',
  'Дөрөвдүгээр сар','Тавдугаар сар','Зургадугаар сар',
  'Долдугаар сар','Наймдугаар сар','Есдүгээр сар',
  'Аравдугаар сар','Арван нэгдүгээр сар','Арван хоёрдугаар сар',
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; gradient: string }> = {
  payment_pending: { label: 'Төлбөр хүлээгдэж буй', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', gradient: 'linear-gradient(135deg, #f59e0b22, #f59e0b08)' },
  pending:         { label: 'Хүлээгдэж буй',        color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', gradient: 'linear-gradient(135deg, #3b82f622, #3b82f608)' },
  confirmed:       { label: 'Баталгаажсан',          color: '#10b981', bg: 'rgba(16,185,129,0.15)', gradient: 'linear-gradient(135deg, #10b98122, #10b98108)' },
  completed:       { label: 'Дууссан',               color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', gradient: 'linear-gradient(135deg, #8b5cf622, #8b5cf608)' },
  cancelled:       { label: 'Цуцлагдсан',            color: '#ef4444', bg: 'rgba(239,68,68,0.15)',  gradient: 'linear-gradient(135deg, #ef444422, #ef444408)' },
};

export const BookingCalendar = ({ bookings, onEdit, onDelete }: BookingCalendarProps) => {
  const today = new Date();
  const [currentYear, setCurrentYear]   = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  /* ─── bookings grouped by date ─── */
  const bookingsByDate = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    bookings.forEach(b => {
      if (!b.date) return;
      const key = b.date.substring(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push(b);
    });
    return map;
  }, [bookings]);

  /* ─── calendar grid ─── */
  const { cells, daysInMonth } = useMemo(() => {
    const first = new Date(currentYear, currentMonth, 1);
    let dow = first.getDay();
    dow = dow === 0 ? 6 : dow - 1; // Mon = 0

    const dim = new Date(currentYear, currentMonth + 1, 0).getDate();
    const c: Array<{ date: string | null; day: number | null }> = [];
    for (let i = 0; i < dow; i++) c.push({ date: null, day: null });
    for (let d = 1; d <= dim; d++) {
      const mm = String(currentMonth + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      c.push({ date: `${currentYear}-${mm}-${dd}`, day: d });
    }
    return { cells: c, daysInMonth: dim };
  }, [currentYear, currentMonth]);

  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  /* ─── month stats ─── */
  const stats = useMemo(() => {
    const mm = String(currentMonth + 1).padStart(2, '0');
    const prefix = `${currentYear}-${mm}`;
    let total = 0, confirmed = 0, pending = 0, cancelled = 0;
    Object.entries(bookingsByDate).forEach(([date, list]) => {
      if (!date.startsWith(prefix)) return;
      total += list.length;
      list.forEach(b => {
        if (b.status === 'confirmed') confirmed++;
        else if (b.status === 'pending' || b.status === 'payment_pending') pending++;
        else if (b.status === 'cancelled') cancelled++;
      });
    });
    const busyDays = Object.keys(bookingsByDate).filter(d => d.startsWith(prefix)).length;
    return { total, confirmed, pending, cancelled, busyDays };
  }, [bookingsByDate, currentYear, currentMonth]);

  const selectedBookings = selectedDate ? (bookingsByDate[selectedDate] || []) : [];

  const navigate = (dir: -1 | 1) => {
    setCurrentMonth(m => {
      const next = m + dir;
      if (next < 0)  { setCurrentYear(y => y - 1); return 11; }
      if (next > 11) { setCurrentYear(y => y + 1); return 0;  }
      return next;
    });
    setSelectedDate(null);
  };

  const handleDayClick = (date: string | null) => {
    if (!date) return;
    setSelectedDate(prev => prev === date ? null : date);
  };

  /* heat-map intensity 1-3 */
  const getHeat = (date: string) => {
    const n = (bookingsByDate[date] || []).length;
    if (n === 0) return 0;
    if (n <= 2)  return 1;
    if (n <= 4)  return 2;
    return 3;
  };

  return (
    <div className="bcal-wrapper">
      {/* ═══ HEADER ═══ */}
      <div className="bcal-header">
        <div className="bcal-header-left">
          <h2 className="bcal-title">
            <span className="bcal-month-label">{MONTHS[currentMonth]}</span>
            <span className="bcal-year-label">{currentYear}</span>
          </h2>
          <p className="bcal-subtitle">Захиалгын хуваарь</p>
        </div>

        <div className="bcal-header-right">
          {/* Stats pills */}
          <div className="bcal-stat-pills">
            <div className="bcal-pill bcal-pill--total">
              <span className="bcal-pill-num">{stats.total}</span>
              <span className="bcal-pill-lbl">Нийт</span>
            </div>
            <div className="bcal-pill bcal-pill--confirmed">
              <span className="bcal-pill-num">{stats.confirmed}</span>
              <span className="bcal-pill-lbl">Баталгаажсан</span>
            </div>
            <div className="bcal-pill bcal-pill--pending">
              <span className="bcal-pill-num">{stats.pending}</span>
              <span className="bcal-pill-lbl">Хүлээгдэж буй</span>
            </div>
            <div className="bcal-pill bcal-pill--busy">
              <span className="bcal-pill-num">{stats.busyDays}</span>
              <span className="bcal-pill-lbl">Захиалгатай өдөр</span>
            </div>
          </div>

          {/* Nav */}
          <div className="bcal-nav">
            <button className="bcal-nav-btn" onClick={() => navigate(-1)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button className="bcal-today-btn" onClick={() => { setCurrentYear(today.getFullYear()); setCurrentMonth(today.getMonth()); setSelectedDate(todayStr); }}>
              Өнөөдөр
            </button>
            <button className="bcal-nav-btn" onClick={() => navigate(1)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ═══ CALENDAR GRID ═══ */}
      <div className="bcal-grid-wrap">
        {/* Weekday labels */}
        <div className="bcal-weekdays">
          {WEEKDAYS.map(w => <div key={w} className="bcal-wday">{w}</div>)}
        </div>

        {/* Days */}
        <div className="bcal-days">
          {cells.map((cell, idx) => {
            if (!cell.date || !cell.day) {
              return <div key={`e${idx}`} className="bcal-cell bcal-cell--empty" />;
            }
            const dayBooks = bookingsByDate[cell.date] || [];
            const heat     = getHeat(cell.date);
            const isToday  = cell.date === todayStr;
            const isSel    = cell.date === selectedDate;
            const hasBks   = dayBooks.length > 0;

            // dominant status
            const statusCounts: Record<string, number> = {};
            dayBooks.forEach(b => { statusCounts[b.status] = (statusCounts[b.status] || 0) + 1; });
            const domStatus = Object.entries(statusCounts).sort((a,b) => b[1]-a[1])[0]?.[0];
            const domColor  = domStatus ? STATUS_CONFIG[domStatus]?.color : '#00d4ff';

            return (
              <div
                key={cell.date}
                className={[
                  'bcal-cell',
                  hasBks  ? `bcal-cell--heat${heat}` : '',
                  isToday ? 'bcal-cell--today' : '',
                  isSel   ? 'bcal-cell--selected' : '',
                  hasBks  ? 'bcal-cell--clickable' : '',
                ].filter(Boolean).join(' ')}
                style={hasBks ? { '--dom-color': domColor } as React.CSSProperties : undefined}
                onClick={() => handleDayClick(cell.date)}
                title={hasBks ? `${dayBooks.length} захиалга` : ''}
              >
                <span className="bcal-day-num">{cell.day}</span>

                {/* booking count badge */}
                {hasBks && (
                  <span className="bcal-badge" style={{ background: domColor }}>
                    {dayBooks.length}
                  </span>
                )}

                {/* status dots row */}
                {hasBks && (
                  <div className="bcal-dots">
                    {Object.entries(statusCounts).slice(0, 3).map(([st]) => (
                      <span key={st} className="bcal-dot" style={{ background: STATUS_CONFIG[st]?.color }} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ LEGEND ═══ */}
      <div className="bcal-legend">
        {Object.entries(STATUS_CONFIG).map(([st, cfg]) => (
          <div key={st} className="bcal-legend-item">
            <span className="bcal-dot" style={{ background: cfg.color }} />
            <span>{cfg.label}</span>
          </div>
        ))}
        <div className="bcal-legend-item bcal-legend-heat">
          <span className="heat-swatch heat-1" /><span className="heat-swatch heat-2" /><span className="heat-swatch heat-3" />
          <span>Эрчим</span>
        </div>
      </div>

      {/* ═══ SELECTED DAY PANEL ═══ */}
      {selectedDate && (
        <div className="bcal-detail">
          <div className="bcal-detail-header">
            <div>
              <h3 className="bcal-detail-title">{selectedDate}</h3>
              <p className="bcal-detail-sub">{selectedBookings.length} захиалга энэ өдөрт</p>
            </div>
            <button className="bcal-close-btn" onClick={() => setSelectedDate(null)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {selectedBookings.length === 0 ? (
            <div className="bcal-empty">Энэ өдөрт захиалга байхгүй</div>
          ) : (
            <div className="bcal-cards">
              {selectedBookings.map((b, i) => {
                const cfg = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;
                const userName    = typeof b.userId    === 'object' && b.userId    ? (b.userId as any).name    : b.userId;
                const serviceName = typeof b.serviceId === 'object' && b.serviceId ? (b.serviceId as any).name : b.serviceId;
                return (
                  <div
                    key={b._id || b.id || i}
                    className="bcal-card"
                    style={{ '--card-color': cfg.color, animationDelay: `${i * 60}ms` } as React.CSSProperties}
                  >
                    <div className="bcal-card-accent" style={{ background: cfg.color }} />
                    <div className="bcal-card-body">
                      <div className="bcal-card-top">
                        <div className="bcal-card-time">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                          {b.time}
                        </div>
                        <span className="bcal-status-badge" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}40` }}>
                          {cfg.label}
                        </span>
                      </div>

                      <div className="bcal-card-info">
                        <div className="bcal-info-row">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          <span>{userName || '—'}</span>
                        </div>
                        <div className="bcal-info-row">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                          <span>{serviceName || '—'}</span>
                        </div>
                        {b.brand && b.brand !== 'Бүх марк' && (
                          <div className="bcal-info-row">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                            <span>{b.brand}</span>
                          </div>
                        )}
                        {b.notes && (
                          <div className="bcal-info-row bcal-notes">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
                            <span>{b.notes}</span>
                          </div>
                        )}
                      </div>

                      {(onEdit || onDelete) && (
                        <div className="bcal-card-actions">
                          {onEdit && (
                            <button className="bcal-action-btn bcal-action-edit" onClick={() => onEdit(b)}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                              Засах
                            </button>
                          )}
                          {onDelete && (
                            <button className="bcal-action-btn bcal-action-delete" onClick={() => onDelete(b._id || b.id || '')}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                              Устгах
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
