import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import MetricCard from '../components/ui/MetricCard';
import InteractiveChart from '../components/ui/InteractiveChart';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { 
  DollarSign, 
  Package, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function Dashboard() {
  const { products, orders, employees, deals, transactions, notifications } = useContext(AppContext);

  // Math totals
  const totalRevenue = transactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const activePipelineValue = deals
    .filter(d => d.stage !== 'Won' && d.stage !== 'Lost')
    .reduce((sum, d) => sum + d.value, 0);

  const checkedInCount = employees.filter(e => e.attendance === 'Checked In').length;
  const totalEmployees = employees.length;

  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;

  // Chart data formatting
  const salesPerformanceData = [
    { name: 'Jan', sales: 12000, profit: 4500 },
    { name: 'Feb', sales: 15000, profit: 5800 },
    { name: 'Mar', sales: 18000, profit: 7200 },
    { name: 'Apr', sales: 14000, profit: 5100 },
    { name: 'May', sales: 22000, profit: 9000 },
    { name: 'Jun', sales: totalRevenue, profit: totalRevenue * 0.4 } // Dyn sync
  ];

  const crmConversionData = [
    { name: 'Leads', count: deals.filter(d => d.stage === 'Lead').length },
    { name: 'Contacted', count: deals.filter(d => d.stage === 'Contacted').length },
    { name: 'Proposal', count: deals.filter(d => d.stage === 'Proposal').length },
    { name: 'Negotiation', count: deals.filter(d => d.stage === 'Negotiation').length },
    { name: 'Won', count: deals.filter(d => d.stage === 'Won').length }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Welcome Banner Card */}
      <div className="glass-panel" style={{
        padding: '2.5rem 2rem',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ zIndex: 1, maxWidth: '65%' }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em' }}>Welcome Back, Alex Director</h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            NexusERP analytics engine is active. There are {lowStockCount} warehouse items requiring inventory stock adjustments, and {checkedInCount} active staff members checked in for today's shift.
          </p>
        </div>
        <img 
          src="/images/dashboard_banner.png" 
          alt="Analytics Illustration" 
          style={{
            position: 'absolute',
            right: '-10px',
            top: '50%',
            transform: 'translateY(-50%)',
            height: '140%',
            opacity: 0.85,
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Overview stats panel */}
      <div className="grid-cols-4">
        <MetricCard
          title="Consolidated Revenue"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          trend="+18.4%"
          trendDirection="up"
          glowColor="var(--success)"
        />
        <MetricCard
          title="Sales Pipeline Value"
          value={formatCurrency(activePipelineValue)}
          icon={TrendingUp}
          trend="+5.2%"
          trendDirection="up"
          glowColor="var(--primary)"
        />
        <MetricCard
          title="Staff Shift Registry"
          value={`${checkedInCount} / ${totalEmployees}`}
          icon={Users}
          trendLabel="currently checked in"
          glowColor="var(--secondary)"
        />
        <MetricCard
          title="Critical Stock Alerts"
          value={lowStockCount}
          icon={AlertTriangle}
          trend={lowStockCount > 0 ? `${lowStockCount} critical items` : 'Stock healthy'}
          trendDirection={lowStockCount > 0 ? 'down' : 'up'}
          glowColor={lowStockCount > 0 ? 'var(--danger)' : 'var(--success)'}
        />
      </div>

      {/* Primary Analytics Charts Section */}
      <div className="grid-cols-3" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <Card title="Sales & Net Profits Trend" subtitle="Consolidated monthly sales vs estimated net profit margins">
          <InteractiveChart
            type="area"
            data={salesPerformanceData}
            dataKeys={['sales', 'profit']}
            colors={['var(--primary)', 'var(--secondary)']}
            height={320}
          />
        </Card>

        <Card title="CRM Pipeline Stage Mix" subtitle="Overview of leads progressing through deals pipeline">
          <InteractiveChart
            type="bar"
            data={crmConversionData}
            dataKeys={['count']}
            colors={['var(--secondary)']}
            xKey="name"
            height={320}
          />
        </Card>
      </div>

      {/* Bottom widgets and Logs */}
      <div className="grid-cols-2">
        <Card title="Low Stock System Alerts" subtitle="Items that have fallen below the configured minimum stock threshold">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.5rem' }}>
            {products.filter(p => p.stock <= p.minStock).length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '1rem', textAlign: 'center' }}>
                ✓ All items currently have healthy stock levels.
              </div>
            ) : (
              products.filter(p => p.stock <= p.minStock).map((prod) => (
                <div key={prod.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.85rem 1rem',
                  border: '1px solid rgba(239, 68, 68, 0.15)',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(239, 68, 68, 0.03)'
                }}>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{prod.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SKU: {prod.sku} | Location: {prod.warehouse}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Stock: <span style={{ fontWeight: 700, color: 'var(--danger)' }}>{prod.stock}</span> / {prod.minStock} min
                    </span>
                    <Badge variant="danger">Low</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card title="Recent Live System Logs" subtitle="Audit log detailing operations completed across departments">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.5rem' }}>
            {notifications.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '1rem', textAlign: 'center' }}>
                No operations logged yet. Perform actions to see logs here.
              </div>
            ) : (
              notifications.slice(0, 4).map((notif) => (
                <div key={notif.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255,255,255,0.01)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: notif.type === 'success' ? 'var(--success)' : 
                                  notif.type === 'warning' ? 'var(--warning)' : 
                                  notif.type === 'error' ? 'var(--danger)' : 'var(--primary)'
                    }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>{notif.message}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0 }}>{notif.time}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
