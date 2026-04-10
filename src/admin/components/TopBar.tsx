import { useAdminAuthStore } from '../../store';
import { FiBell } from 'react-icons/fi';
import '../styles/TopBar.css';

interface TopBarProps {
  title: string;
  onMenuClick?: () => void;
}

export const TopBar = ({ title, onMenuClick }: TopBarProps) => {
  const { user } = useAdminAuthStore();

  return (
    <header className="topbar">
      <div className="topbar-left">
        {onMenuClick && (
          <button className="menu-toggle" onClick={onMenuClick}>
            ☰
          </button>
        )}
        <h2 className="topbar-title">{title}</h2>
      </div>

      <div className="topbar-right">
        <div className="user-info">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <p className="user-name">{user?.name || 'Хэрэглэгч'}</p>
            <p className="user-role">{user?.role === 'admin' ? 'Админ' : 'Хэрэглэгч'}</p>
          </div>
        </div>
        <button className="notification-btn" title="Мэдэгдэл">
          <FiBell size={20} />
        </button>
      </div>
    </header>
  );
};
