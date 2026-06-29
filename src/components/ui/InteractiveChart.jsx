import React, { useContext } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { AppContext } from '../../context/AppContext';

export default function InteractiveChart({
  type = 'area', // 'area' | 'bar' | 'pie'
  data = [],
  dataKeys = [], // e.g. ['sales', 'profit']
  colors = ['#3b82f6', '#8b5cf6'],
  xKey = 'name',
  height = 300
}) {
  const { theme } = useContext(AppContext);
  const isDark = theme === 'dark';

  const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
  const labelColor = isDark ? '#9ca3af' : '#475569';
  const tooltipBg = isDark ? '#111827' : '#ffffff';
  const tooltipBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
  const tooltipText = isDark ? '#f3f4f6' : '#0f172a';

  const renderTooltip = () => (
    <Tooltip
      contentStyle={{
        backgroundColor: tooltipBg,
        borderColor: tooltipBorder,
        borderRadius: '8px',
        color: tooltipText,
        boxShadow: 'var(--shadow-md)',
        fontFamily: 'inherit',
        fontSize: '0.85rem'
      }}
    />
  );

  if (type === 'area') {
    return (
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {dataKeys.map((key, i) => (
                <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[i] || '#3b82f6'} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={colors[i] || '#3b82f6'} stopOpacity={0.0}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis 
              dataKey={xKey} 
              stroke={labelColor} 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke={labelColor} 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(v) => `$${v}`}
            />
            {renderTooltip()}
            {dataKeys.map((key, i) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[i] || '#3b82f6'}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#gradient-${key})`}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'bar') {
    return (
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis 
              dataKey={xKey} 
              stroke={labelColor} 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke={labelColor} 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
            />
            {renderTooltip()}
            {dataKeys.map((key, i) => (
              <Bar 
                key={key} 
                dataKey={key} 
                fill={colors[i] || '#3b82f6'} 
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'pie') {
    return (
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={4}
              dataKey={dataKeys[0]}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            {renderTooltip()}
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconSize={10} 
              iconType="circle"
              wrapperStyle={{ fontSize: '0.85rem', color: labelColor }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
}
