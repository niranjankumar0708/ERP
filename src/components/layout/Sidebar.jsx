import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  KanbanSquare, 
  DollarSign, 
  Settings as SettingsIcon,
  Hexagon
} from 'lucide-react';
import './layout.css';

export default function Sidebar() {
  const { theme } = useContext(AppContext);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Inventory', path: '/inventory', icon: Package },
    { name: 'Sales / POS', path: '/sales', icon: ShoppingCart },
    { name: 'HR Directory', path: '/hr', icon: Users },
    { name: 'CRM Pipeline', path: '/crm', icon: KanbanSquare },
    { name: 'Finance Ledger', path: '/finance', icon: DollarSign },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-brand">
        <Hexagon className="brand-icon" size={28} />
        <span className="brand-text">Nexus<span>ERP</span></span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink 
              key={item.path} 
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} className="link-icon" />
              <span className="link-text">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile-mini">
          <div className="user-avatar">AD</div>
          <div className="user-info">
            <p className="user-name">Alex Director</p>
            <p className="user-role">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
