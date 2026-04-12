import React from 'react';
import { FiInbox } from 'react-icons/fi';
import './EmptyState.css';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  size?: 'normal' | 'small';
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action, size = 'normal' }) => {
  return (
    <div className={`empty-state-container size-${size} animate-fade-in`}>
      <div className="empty-state-icon">
        {icon ? icon : <FiInbox />}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-desc">{description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
};
