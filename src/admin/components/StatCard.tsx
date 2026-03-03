import '../styles/StatCard.css';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  change?: number;
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

export const StatCard = ({ 
  icon, 
  title, 
  value, 
  change,
  color = 'primary' 
}: StatCardProps) => {
  const isPositive = change && change > 0;

  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-header">
        <span className="stat-icon">{icon}</span>
        <span className="stat-title">{title}</span>
      </div>
      <div className="stat-body">
        <p className="stat-value">{value}</p>
        {change !== undefined && (
          <span className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        )}
      </div>
    </div>
  );
};
