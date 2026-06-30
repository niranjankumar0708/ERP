import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { Bell, Sun, Moon, Search, Calendar, Trash2, Menu } from 'lucide-react';
import './layout.css';

export default function Header({ onMenuClick }) {
  const { theme, toggleTheme, notifications, removeNotification } = useContext(AppContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Determine page title based on path
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Analytics Dashboard';
      case '/inventory': return 'Inventory & Warehousing';
      case '/sales': return 'Point of Sale & Orders';
      case '/hr': return 'Human Resources Registry';
      case '/crm': return 'CRM Pipeline & Lead Board';
      case '/finance': return 'Financial Ledger Sheet';
      case '/settings': return 'System Settings';
      default: return 'NexusERP Suite';
    }
  };

  const getUnreadCount = () => notifications.length;

  return (
    <header className="header glass-panel">
      <div className="header-left">
        <button className="menu-toggle-btn" onClick={onMenuClick} aria-label="Toggle Menu">
          <Menu size={20} />
        </button>
        <h1 className="header-title">{getPageTitle()}</h1>
        <div className="header-date">
          <Calendar size={15} />
          <span>{currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <span className="time-divider">|</span>
          <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>
      </div>

      <div className="header-right">
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="notification-wrapper">
          <button 
            className="notif-btn" 
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="View notifications"
          >
            <Bell size={20} />
            {getUnreadCount() > 0 && (
              <span className="notif-badge">{getUnreadCount()}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notif-dropdown glass-panel animate-fade-in">
              <div className="notif-dropdown-header">
                <h3>System Logs & Notifications</h3>
                <span className="notif-count">{notifications.length} logs</span>
              </div>
              <div className="notif-dropdown-body">
                {notifications.length === 0 ? (
                  <div className="notif-empty">No active system warnings or logs.</div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className={`notif-item type-${notif.type}`}>
                      <div className="notif-item-content">
                        <p className="notif-text">{notif.message}</p>
                        <span className="notif-time">{notif.time}</span>
                      </div>
                      <button 
                        className="notif-delete-btn" 
                        onClick={() => removeNotification(notif.id)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="header-user">
          <div className="header-avatar">AD</div>
          <span className="header-username">Alex D.</span>
        </div>
      </div>
    </header>
  );
}
