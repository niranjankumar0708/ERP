import React from 'react';
import Card from '../common/Card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection = 'up',
  trendLabel = 'vs last month',
  glowColor = 'var(--primary)'
}) {
  const isPositive = trendDirection === 'up';

  return (
    <Card className="metric-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{title}</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '6px', marginBottom: '8px', letterSpacing: '-0.03em' }}>{value}</h2>
        </div>
        <div style={{ 
          width: '46px', 
          height: '46px', 
          borderRadius: '12px', 
          background: 'var(--bg-surface)', 
          border: '1px solid var(--border-color)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: `0 0 12px ${glowColor}1a`,
          color: glowColor
        }}>
          {Icon && <Icon size={22} />}
        </div>
      </div>
      
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', marginTop: '4px' }}>
          <span style={{ 
            display: 'flex', 
            alignItems: 'center', 
            fontWeight: 700, 
            color: isPositive ? 'var(--success)' : 'var(--danger)',
            background: isPositive ? 'var(--success-glow)' : 'var(--danger-glow)',
            padding: '2px 6px',
            borderRadius: '4px'
          }}>
            {isPositive ? <ArrowUpRight size={12} style={{ marginRight: '2px' }} /> : <ArrowDownRight size={12} style={{ marginRight: '2px' }} />}
            {trend}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>{trendLabel}</span>
        </div>
      )}
    </Card>
  );
}
