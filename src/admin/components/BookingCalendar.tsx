import { useState, useMemo } from 'react';
import type { Booking } from '../../types';
import './BookingCalendar.css';

interface BookingCalendarProps {
  bookings: Booking[];
  onDaySelect?: (date: string | null) => void;
  selectedDate?: string | null;
}

const WEEKDAYS = ['Да', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя', 'Ня'];
const MONTHS = [
  'Нэгдүгээр сар',
  'Хоёрдугаар сар',
  'Гуравдугаар сар',
  'Дөрөвдүгээр сар',
  'Тавдугаар сар',
  'Зургадугаар сар',
  'Долдугаар сар',
  'Наймдугаар сар',
  'Есдүгээр сар',
  'Аравдугаар сар',
  'Арван нэгдүгээр сар',
  'Арван хоёрдугаар сар',
];

const STATUS_COLORS: Record<string, string> = {
  payment_pending: '#f59e0b',
  pending: '#3b82f6',
  confirmed: '#10b981',
  completed: '#6366f1',
  cancelled: '#ef4444',
};

export const BookingCalendar = ({ bookings, onDaySelect, selectedDate }: BookingCalendarProps) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed

  // Map date string -> list of bookings for that date
  const bookingsByDate = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    bookings.forEach((b) => {
      if (!b.date) return;
      // Normalize: ensure YYYY-MM-DD format
      const key = b.date.substring(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push(b);
    });
    return map;
  }, [bookings]);

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    // Monday-based week: 0=Mon, 6=Sun
    let startDow = firstDay.getDay(); // 0=Sun
    startDow = startDow === 0 ? 6 : startDow - 1; // convert to Mon=0

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const cells: Array<{ date: string | null; day: number | null }> = [];
    // Padding before first day
    for (let i = 0; i < startDow; i++) {
      cells.push({ date: null, day: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const mm = String(currentMonth + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      cells.push({ date: `${currentYear}-${mm}-${dd}`, day: d });
    }
    return cells;
  }, [currentYear, currentMonth]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const handleDayClick = (date: string | null) => {
    if (!date) return;
    if (!bookingsByDate[date]) return; // no bookings, ignore click
    if (onDaySelect) {
      onDaySelect(selectedDate === date ? null : date);
    }
  };

  // Stats for current month
  const monthStats = useMemo(() => {
    const mm = String(currentMonth + 1).padStart(2, '0');
    const prefix = `${currentYear}-${mm}`;
    let total = 0;
    let confirmed = 0;
    let pending = 0;
    Object.entries(bookingsByDate).forEach(([date, blist]) => {
      if (date.startsWith(prefix)) {
        total += blist.length;
        blist.forEach((b) => {
          if (b.status === 'confirmed') confirmed++;
          if (b.status === 'pending' || b.status === 'payment_pending') pending++;
        });
      }
    });
    return { total, confirmed, pending };
  }, [bookingsByDate, currentYear, currentMonth]);

  return (
    <div className="booking-calendar">
      {/* Header */}
      <div className="bc-header">
        <button className="bc-nav-btn" onClick={prevMonth} aria-label="Өмнөх сар">
          ‹
        </button>
        <div className="bc-title">
          <span className="bc-month">{MONTHS[currentMonth]}</span>
          <span className="bc-year">{currentYear}</span>
        </div>
        <button className="bc-nav-btn" onClick={nextMonth} aria-label="Дараах сар">
          ›
        </button>
      </div>

      {/* Month stats */}
      <div className="bc-stats">
        <div className="bc-stat-item">
          <span className="bc-stat-num">{monthStats.total}</span>
          <span className="bc-stat-label">Нийт захиалга</span>
        </div>
        <div className="bc-stat-item">
          <span className="bc-stat-num" style={{ color: '#10b981' }}>{monthStats.confirmed}</span>
          <span className="bc-stat-label">Баталгаажсан</span>
        </div>
        <div className="bc-stat-item">
          <span className="bc-stat-num" style={{ color: '#f59e0b' }}>{monthStats.pending}</span>
          <span className="bc-stat-label">Хүлээгдэж буй</span>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="bc-weekdays">
        {WEEKDAYS.map((w) => (
          <div key={w} className="bc-weekday">{w}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="bc-grid">
        {calendarDays.map((cell, idx) => {
          if (!cell.date || !cell.day) {
            return <div key={`empty-${idx}`} className="bc-day bc-day--empty" />;
          }
          const dayBookings = bookingsByDate[cell.date] || [];
          const hasBookings = dayBookings.length > 0;
          const isToday = cell.date === todayStr;
          const isSelected = cell.date === selectedDate;

          // Determine dominant status color
          const statusCount: Record<string, number> = {};
          dayBookings.forEach((b) => {
            statusCount[b.status] = (statusCount[b.status] || 0) + 1;
          });
          const dominantStatus = Object.entries(statusCount).sort((a, b) => b[1] - a[1])[0]?.[0];
          const dotColor = dominantStatus ? STATUS_COLORS[dominantStatus] : '#00d4ff';

          return (
            <div
              key={cell.date}
              className={[
                'bc-day',
                hasBookings ? 'bc-day--has-bookings' : '',
                isToday ? 'bc-day--today' : '',
                isSelected ? 'bc-day--selected' : '',
                hasBookings ? 'bc-day--clickable' : '',
              ].join(' ')}
              onClick={() => handleDayClick(cell.date)}
              title={hasBookings ? `${dayBookings.length} захиалга` : ''}
            >
              <span className="bc-day-num">{cell.day}</span>
              {hasBookings && (
                <div className="bc-booking-dots">
                  {dayBookings.length <= 3 ? (
                    dayBookings.map((b, i) => (
                      <span
                        key={i}
                        className="bc-dot"
                        style={{ background: STATUS_COLORS[b.status] || '#00d4ff' }}
                      />
                    ))
                  ) : (
                    <>
                      <span className="bc-dot" style={{ background: dotColor }} />
                      <span className="bc-dot" style={{ background: dotColor }} />
                      <span className="bc-count">+{dayBookings.length}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="bc-legend">
        {Object.entries(STATUS_COLORS).map(([status, color]) => {
          const labels: Record<string, string> = {
            payment_pending: 'Төлбөр хүлээгдэж буй',
            pending: 'Хүлээгдэж буй',
            confirmed: 'Баталгаажсан',
            completed: 'Дууссан',
            cancelled: 'Цуцлагдсан',
          };
          return (
            <div key={status} className="bc-legend-item">
              <span className="bc-dot" style={{ background: color }} />
              <span>{labels[status]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
