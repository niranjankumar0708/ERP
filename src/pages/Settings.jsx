import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import { Settings as SettingsIcon, ShieldCheck, Sun, Moon, Building2, Save } from 'lucide-react';

export default function Settings() {
  const { theme, toggleTheme, addNotification } = useContext(AppContext);
  
  // Profile settings state
  const [profile, setProfile] = useState({
    companyName: 'Nexus Global Logistics Corp',
    taxId: 'TX-990-281-US',
    currency: 'USD ($)',
    timezone: 'UTC-5 (EST)'
  });

  const handleProfileSave = (e) => {
    e.preventDefault();
    addNotification('Corporate settings successfully synced to directory nodes.', 'success');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const systemRoles = [
    { title: 'Administrator', desc: 'Full core operations, databases modification, and billing control.', color: 'danger', permissions: ['All Access'] },
    { title: 'CFO (Finance Controller)', desc: 'General ledger records access, accounts payable audit rights.', color: 'warning', permissions: ['Read Ledger', 'Write Ledger', 'View Payroll'] },
    { title: 'Inventory Manager', desc: 'Warehouse logistics stock adjust, supplier indexing.', color: 'info', permissions: ['Read Stock', 'Write Stock', 'Move Warehouses'] },
    { title: 'Sales Consultant', desc: 'CRM pipeline stage movements, POS checkout creation.', color: 'success', permissions: ['POS Checkout', 'Modify Deals', 'View Customers'] }
  ];

  return (
    <div className="animate-fade-in grid-cols-2" style={{ gap: '2rem', alignItems: 'flex-start' }}>
      
      {/* Company settings form */}
      <Card title="Corporate Profile Configurations" subtitle="Maintain company identification parameters and invoicing preferences">
        <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '0.25rem' }}>
            <Building2 size={20} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Corporate Identity</h3>
          </div>

          <Input
            label="Company Name"
            name="companyName"
            value={profile.companyName}
            onChange={handleInputChange}
            required
          />

          <Input
            label="Corporate Tax Identification Number"
            name="taxId"
            value={profile.taxId}
            onChange={handleInputChange}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-container">
              <label className="input-label">Accounting Currency</label>
              <select
                name="currency"
                value={profile.currency}
                onChange={handleInputChange}
                className="input-field"
                style={{ height: '42px', outline: 'none' }}
              >
                <option value="USD ($)">USD - US Dollar ($)</option>
                <option value="EUR (€)">EUR - Euro (€)</option>
                <option value="GBP (£)">GBP - British Pound (£)</option>
              </select>
            </div>
            
            <div className="input-container">
              <label className="input-label">Operational Timezone</label>
              <select
                name="timezone"
                value={profile.timezone}
                onChange={handleInputChange}
                className="input-field"
                style={{ height: '42px', outline: 'none' }}
              >
                <option value="UTC-5 (EST)">UTC-5 Eastern Standard Time (EST)</option>
                <option value="UTC-8 (PST)">UTC-8 Pacific Standard Time (PST)</option>
                <option value="UTC+0 (GMT)">UTC+0 Greenwich Mean Time (GMT)</option>
              </select>
            </div>
          </div>

          <Button type="submit" icon={Save} style={{ marginTop: '0.5rem' }}>
            Save Configurations
          </Button>

        </form>
      </Card>

      {/* Access lists and Preferences */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Visual Settings theme switcher */}
        <Card title="Interface Preferences" subtitle="Adjust interface options and system viewports">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)'
          }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Color Theme Options</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Switch application styling between Light and Dark visual environments</p>
            </div>
            <Button 
              variant="outline" 
              onClick={toggleTheme}
              icon={theme === 'dark' ? Sun : Moon}
            >
              {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
            </Button>
          </div>
        </Card>

        {/* Roles and Permissions directory info */}
        <Card title="Corporate Role Directory & ACL" subtitle="Assigned system roles and access lists constraints">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            {systemRoles.map((role, idx) => (
              <div 
                key={idx} 
                className="glass-panel" 
                style={{
                  padding: '1rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={16} style={{ color: `var(--${role.color})` }} />
                    {role.title}
                  </span>
                  <Badge variant={role.color}>{role.title.split(' ')[0]}</Badge>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.3 }}>{role.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {role.permissions.map((p, pidx) => (
                    <span 
                      key={pidx} 
                      style={{ 
                        fontSize: '0.65rem', 
                        background: 'var(--bg-surface)', 
                        border: '1px solid var(--border-color)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontWeight: 600,
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          NexusERP Suite v1.4.0 (Enterprise Edition) • Cluster Status: Healthy
        </div>
      </div>
    </div>
  );
}
