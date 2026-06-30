import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { X, CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';
import './layout.css';

export default function Layout() {
  const [toasts, setToasts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleShowToast = (event) => {
      const { id, message, type } = event.detail;
      const newToast = { id, message, type };
      
      setToasts(prev => [...prev, newToast]);

      // Auto-dismiss after 4 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 4000);
    };

    window.addEventListener('show-toast', handleShowToast);
    return () => window.removeEventListener('show-toast', handleShowToast);
  }, []);

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getToastIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={18} />;
      case 'warning': return <AlertTriangle size={18} />;
      case 'error': return <XCircle size={18} />;
      default: return <Info size={18} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      
      <main className="main-content">
        <Header onMenuClick={() => setSidebarOpen(prev => !prev)} />
        <div className="page-wrapper">
          <Outlet />
        </div>
      </main>

      {/* Toast Alert System Overlay */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type} glass-panel`}>
            <span className="toast-icon">{getToastIcon(toast.type)}</span>
            <p className="toast-text">{toast.message}</p>
            <button className="toast-close" onClick={() => dismissToast(toast.id)}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
