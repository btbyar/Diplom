import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { FiHome, FiCalendar, FiTool, FiPackage, FiUsers, FiTrendingUp, FiLogOut } from 'react-icons/fi';
import '../styles/Sidebar.css';

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();

  const menuItems = [
    { icon: FiHome, label: 'Хянах самбар', path: '/admin' },
    { icon: FiCalendar, label: 'Захиалгууд', path: '/admin/bookings' },
    { icon: FiTool, label: 'Үйлчилгээнүүд', path: '/admin/services' },
    { icon: FiUsers, label: 'Хэрэглэгчид', path: '/admin/users' },
    { icon: FiPackage, label: 'Сэлбэг', path: '/admin/parts' },
    { icon: FiTrendingUp, label: 'Анализ ', path: '/admin/analytics' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">⚙️</span>
            <span className="logo-text">AutoCare</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.path}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                }}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                title={item.label}
              >
                <span className="nav-icon"><Icon size={20} /></span>
                <span className="nav-label">
                  {item.label}
                </span>
                {isActive(item.path) && <span className="nav-indicator"></span>}
              </a>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button 
            className="logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            <span className="icon"><FiLogOut size={18} /></span>
            <span className="label">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
