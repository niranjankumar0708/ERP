import React from 'react';
import './common.css';

export default function Card({ 
  children, 
  title, 
  subtitle,
  headerAction,
  className = '',
  onClick
}) {
  return (
    <div className={`glass-card ${className}`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      {(title || subtitle || headerAction) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', gap: '1rem' }}>
          <div>
            {title && <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{title}</h3>}
            {subtitle && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px', margin: 0 }}>{subtitle}</p>}
          </div>
          {headerAction && <div style={{ display: 'flex', alignItems: 'center' }}>{headerAction}</div>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}
