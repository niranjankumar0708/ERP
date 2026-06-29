import React from 'react';
import './common.css';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  type = 'button',
  disabled = false,
  onClick,
  icon: Icon,
  className = ''
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn btn-${variant} btn-${size} ${className}`}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {children}
    </button>
  );
}
