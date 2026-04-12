import React from 'react';
import './Skeleton.css';

interface SkeletonProps {
  type?: 'text' | 'title' | 'avatar' | 'card' | 'img' | 'button';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ type = 'text', width, height, className = '' }) => {
  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  if (type === 'card') {
    return (
      <div className={`skeleton-card ${className}`} style={style}>
        <div className="skeleton-base skeleton-img" />
        <div className="skeleton-base skeleton-title" />
        <div className="skeleton-base skeleton-text" />
        <div className="skeleton-base skeleton-text short" />
        <div className="skeleton-base skeleton-button" />
      </div>
    );
  }

  return (
    <div 
      className={`skeleton-base skeleton-${type} ${className}`} 
      style={style} 
    />
  );
};
