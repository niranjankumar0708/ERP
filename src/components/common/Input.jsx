import React from 'react';
import './common.css';

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  icon: Icon,
  required = false,
  min,
  max,
  step,
  name,
  disabled = false,
  className = ''
}) {
  return (
    <div className={`input-container ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        {Icon && <Icon className="input-icon" size={18} />}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={`input-field ${Icon ? 'has-icon' : ''}`}
        />
      </div>
    </div>
  );
}
