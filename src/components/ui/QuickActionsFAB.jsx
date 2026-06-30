import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { 
  Plus, 
  Package, 
  DollarSign, 
  Users, 
  KanbanSquare, 
  ShoppingCart 
} from 'lucide-react';

export default function QuickActionsFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const { setModalTrigger } = useContext(AppContext);
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Register POS Sale',
      icon: ShoppingCart,
      color: 'var(--success)',
      onClick: () => {
        setModalTrigger('sales');
        navigate('/sales');
      }
    },
    {
      label: 'Log Transaction',
      icon: DollarSign,
      color: 'var(--danger)',
      onClick: () => {
        setModalTrigger('finance');
        navigate('/finance');
      }
    },
    {
      label: 'New CRM Deal',
      icon: KanbanSquare,
      color: 'var(--warning)',
      onClick: () => {
        setModalTrigger('crm');
        navigate('/crm');
      }
    },
    {
      label: 'Onboard Staff',
      icon: Users,
      color: 'var(--secondary)',
      onClick: () => {
        setModalTrigger('hr');
        navigate('/hr');
      }
    },
    {
      label: 'Add Product',
      icon: Package,
      color: 'var(--primary)',
      onClick: () => {
        setModalTrigger('inventory');
        navigate('/inventory');
      }
    }
  ];

  return (
    <div className="fab-container no-print">
      <div className={`fab-menu ${isOpen ? 'open' : ''}`}>
        {actions.map((act, index) => {
          const Icon = act.icon;
          return (
            <button
              key={index}
              className="fab-item"
              onClick={() => {
                act.onClick();
                setIsOpen(false);
              }}
            >
              <span>{act.label}</span>
              <div className="fab-item-icon" style={{ color: act.color }}>
                <Icon size={16} />
              </div>
            </button>
          );
        })}
      </div>
      
      <button 
        className={`fab-main-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Quick actions"
      >
        <Plus size={28} />
      </button>
    </div>
  );
}
