import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const initialProducts = [
  { id: '1', sku: 'NX-892', name: 'Alpha Server Rack v2', category: 'Electronics', price: 1299.99, stock: 14, minStock: 5, warehouse: 'Warehouse Alpha' },
  { id: '2', sku: 'NX-104', name: 'Ergonomic Mesh Chair', category: 'Furniture', price: 249.50, stock: 3, minStock: 8, warehouse: 'Warehouse Beta' },
  { id: '3', sku: 'NX-551', name: 'Thunderbolt 4 Docking Hub', category: 'Electronics', price: 189.99, stock: 45, minStock: 10, warehouse: 'Warehouse Alpha' },
  { id: '4', sku: 'NX-770', name: 'Ultra-Quiet Mechanical Keyboard', category: 'Office Supplies', price: 99.00, stock: 2, minStock: 6, warehouse: 'Warehouse Beta' },
  { id: '5', sku: 'NX-302', name: 'Premium Office Noise-Canceling Headphones', category: 'Electronics', price: 299.99, stock: 22, minStock: 5, warehouse: 'Warehouse Alpha' },
  { id: '6', sku: 'NX-912', name: 'Adjustable Standing Desk (Dual Motor)', category: 'Furniture', price: 499.00, stock: 8, minStock: 4, warehouse: 'Warehouse Beta' }
];

const initialOrders = [
  { id: 'ORD-5001', date: '2026-06-28', customer: 'Global Tech Corp', items: [{ id: '1', name: 'Alpha Server Rack v2', qty: 2, price: 1299.99 }], total: 2599.98, status: 'Shipped', paymentMethod: 'Bank Transfer' },
  { id: 'ORD-5002', date: '2026-06-29', customer: 'Sarah Jenkins', items: [{ id: '2', name: 'Ergonomic Mesh Chair', qty: 1, price: 249.50 }, { id: '4', name: 'Ultra-Quiet Mechanical Keyboard', qty: 1, price: 99.00 }], total: 348.50, status: 'Pending', paymentMethod: 'Credit Card' },
  { id: 'ORD-5003', date: '2026-06-25', customer: 'Apex Logistics LLC', items: [{ id: '3', name: 'Thunderbolt 4 Docking Hub', qty: 5, price: 189.99 }], total: 949.95, status: 'Fulfilled', paymentMethod: 'Bank Transfer' },
  { id: 'ORD-5004', date: '2026-06-27', customer: 'David Miller', items: [{ id: '5', name: 'Premium Noise-Canceling Headphones', qty: 1, price: 299.99 }], total: 299.99, status: 'Cancelled', paymentMethod: 'Cash' }
];

const initialEmployees = [
  { id: 'EMP-01', name: 'Alexander Wright', role: 'Head of Operations', department: 'Operations', status: 'Active', email: 'a.wright@nexuserp.com', attendance: 'Checked In', joinDate: '2022-04-12' },
  { id: 'EMP-02', name: 'Elena Rostova', role: 'CFO', department: 'Finance', status: 'Active', email: 'e.rostova@nexuserp.com', attendance: 'Checked In', joinDate: '2021-09-01' },
  { id: 'EMP-03', name: 'Marcus Sterling', role: 'Inventory Manager', department: 'Operations', status: 'Active', email: 'm.sterling@nexuserp.com', attendance: 'Checked Out', joinDate: '2023-01-15' },
  { id: 'EMP-04', name: 'Jessica Vance', role: 'Lead Sales Consultant', department: 'Sales', status: 'Active', email: 'j.vance@nexuserp.com', attendance: 'Checked In', joinDate: '2024-03-20' },
  { id: 'EMP-05', name: 'Liam O\'Connor', role: 'HR Coordinator', department: 'HR', status: 'On Leave', email: 'l.oconnor@nexuserp.com', attendance: 'Checked Out', joinDate: '2023-11-10' }
];

const initialDeals = [
  { id: 'CRM-101', title: '50x Workstations Upgrade', company: 'Initech Corp', value: 25000, stage: 'Proposal', contact: 'Peter Gibbons', date: '2026-06-15' },
  { id: 'CRM-102', title: 'Custom Cloud Architecture Integration', company: 'Hooli Inc', value: 85000, stage: 'Negotiation', contact: 'Gavin Belson', date: '2026-06-10' },
  { id: 'CRM-103', title: 'Logistics Fleet Tracking ERP License', company: 'Soylent Co', value: 42000, stage: 'Lead', contact: 'Robert Dean', date: '2026-06-29' },
  { id: 'CRM-104', title: 'Office Relocation Furniture Supply', company: 'Cyberdyne Systems', value: 12500, stage: 'Contacted', contact: 'Sarah Connor', date: '2026-06-27' },
  { id: 'CRM-105', title: 'Mainframe Server Supply Agreement', company: 'Tyrell Corporation', value: 120000, stage: 'Won', contact: 'Eldon Tyrell', date: '2026-06-20' }
];

const initialTransactions = [
  { id: 'TXN-001', date: '2026-06-25', type: 'Income', category: 'Sales Revenue', amount: 949.95, description: 'Order ORD-5003 fulfillment' },
  { id: 'TXN-002', date: '2026-06-26', type: 'Expense', category: 'Marketing', amount: 1500.00, description: 'Q3 Ads Campaign' },
  { id: 'TXN-003', date: '2026-06-27', type: 'Expense', category: 'Payroll', amount: 18500.00, description: 'June Payroll Distribution' },
  { id: 'TXN-004', date: '2026-06-28', type: 'Income', category: 'Sales Revenue', amount: 2599.98, description: 'Order ORD-5001 payment' },
  { id: 'TXN-005', date: '2026-06-29', type: 'Expense', category: 'Logistics', amount: 450.00, description: 'Schenker Courier Fees' }
];

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [employees, setEmployees] = useState(initialEmployees);
  const [deals, setDeals] = useState(initialDeals);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [notifications, setNotifications] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [modalTrigger, setModalTrigger] = useState(null);

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    addNotification('Theme changed to ' + nextTheme + ' mode', 'info');
  };

  // Check for low stock on init and when products change
  const [lowStockAlerted, setLowStockAlerted] = useState({});
  useEffect(() => {
    products.forEach(p => {
      if (p.stock <= p.minStock && !lowStockAlerted[p.id]) {
        addNotification(`Low stock warning: "${p.name}" has only ${p.stock} units left in ${p.warehouse}.`, 'warning');
        setLowStockAlerted(prev => ({ ...prev, [p.id]: true }));
      } else if (p.stock > p.minStock && lowStockAlerted[p.id]) {
        // Clear warning status if stocked back up
        setLowStockAlerted(prev => {
          const updated = { ...prev };
          delete updated[p.id];
          return updated;
        });
      }
    });
  }, [products]);

  // Alert Notification system
  const addNotification = (message, type = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    const newNotif = { id, message, type, time: new Date().toLocaleTimeString() };
    setNotifications(prev => [newNotif, ...prev].slice(0, 50)); // cap at 50 logs
    
    // Add visual window toast
    const event = new CustomEvent('show-toast', { detail: { id, message, type } });
    window.dispatchEvent(event);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Inventory logic
  const addProduct = (product) => {
    const id = (products.length + 1).toString();
    const newProduct = { ...product, id, stock: Number(product.stock), minStock: Number(product.minStock), price: Number(product.price) };
    setProducts(prev => [newProduct, ...prev]);
    addNotification(`Product "${newProduct.name}" added to system database.`, 'success');
  };

  const updateProductStock = (id, newStock) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: Math.max(0, Number(newStock)) } : p));
  };

  const editProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => p.id === id ? { 
      ...p, 
      ...updatedFields,
      stock: Number(updatedFields.stock),
      minStock: Number(updatedFields.minStock),
      price: Number(updatedFields.price)
    } : p));
    addNotification(`Product information updated.`, 'success');
  };

  const deleteProduct = (id) => {
    const product = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    if (product) {
      addNotification(`Product "${product.name}" deleted from records.`, 'warning');
    }
  };

  // Sales Order logic
  const createOrder = (orderData) => {
    const id = 'ORD-' + (orders.length + 5001).toString();
    const newOrder = {
      id,
      date: new Date().toISOString().split('T')[0],
      customer: orderData.customer,
      items: orderData.items,
      total: orderData.total,
      status: 'Pending',
      paymentMethod: orderData.paymentMethod
    };
    
    // Deduct stock
    setProducts(prev => prev.map(p => {
      const orderItem = orderData.items.find(item => item.id === p.id);
      if (orderItem) {
        return { ...p, stock: Math.max(0, p.stock - orderItem.qty) };
      }
      return p;
    }));

    setOrders(prev => [newOrder, ...prev]);
    addNotification(`New order ${id} created for customer "${orderData.customer}".`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (id, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === id) {
        // If transitioning to Fulfilled, register transaction automatically!
        if (newStatus === 'Fulfilled' && o.status !== 'Fulfilled') {
          const newTxn = {
            id: 'TXN-' + (transactions.length + 1).toString().padStart(3, '0'),
            date: new Date().toISOString().split('T')[0],
            type: 'Income',
            category: 'Sales Revenue',
            amount: o.total,
            description: `Order ${o.id} fulfillment payout`
          };
          setTransactions(prevTxns => [newTxn, ...prevTxns]);
          addNotification(`Ledger Updated: +$${o.total.toFixed(2)} revenue recorded.`, 'success');
        }
        return { ...o, status: newStatus };
      }
      return o;
    }));
    addNotification(`Order ${id} status updated to: ${newStatus}.`, 'info');
  };

  // HR employee logic
  const addEmployee = (emp) => {
    const id = 'EMP-' + (employees.length + 1).toString().padStart(2, '0');
    const newEmp = {
      ...emp,
      id,
      status: 'Active',
      attendance: 'Checked Out',
      joinDate: new Date().toISOString().split('T')[0]
    };
    setEmployees(prev => [...prev, newEmp]);
    addNotification(`Employee "${newEmp.name}" onboarded to department ${newEmp.department}.`, 'success');
  };

  const toggleEmployeeAttendance = (id) => {
    setEmployees(prev => prev.map(e => {
      if (e.id === id) {
        const nextAtt = e.attendance === 'Checked In' ? 'Checked Out' : 'Checked In';
        addNotification(`HR Registry: ${e.name} ${nextAtt === 'Checked In' ? 'checked in for shift' : 'checked out from shift'}.`, 'info');
        return { ...e, attendance: nextAtt };
      }
      return e;
    }));
  };

  // CRM Kanban Board logic
  const addDeal = (deal) => {
    const id = 'CRM-' + (deals.length + 101).toString();
    const newDeal = {
      ...deal,
      id,
      stage: deal.stage || 'Lead',
      value: Number(deal.value),
      date: new Date().toISOString().split('T')[0]
    };
    setDeals(prev => [newDeal, ...prev]);
    addNotification(`New CRM Deal created: "${newDeal.title}" with ${newDeal.company}.`, 'success');
  };

  const updateDealStage = (dealId, nextStage) => {
    setDeals(prev => prev.map(d => {
      if (d.id === dealId) {
        addNotification(`CRM Pipeline: "${d.title}" moved to stage "${nextStage}".`, 'info');
        return { ...d, stage: nextStage };
      }
      return d;
    }));
  };

  // Finance Transactions logic
  const addTransaction = (txn) => {
    const id = 'TXN-' + (transactions.length + 1).toString().padStart(3, '0');
    const newTxn = {
      ...txn,
      id,
      amount: Number(txn.amount),
      date: txn.date || new Date().toISOString().split('T')[0]
    };
    setTransactions(prev => [newTxn, ...prev]);
    addNotification(`Transaction logged under ${newTxn.category} (-$${newTxn.amount.toFixed(2)}).`, 'success');
  };

  return (
    <AppContext.Provider value={{
      products,
      orders,
      employees,
      deals,
      transactions,
      notifications,
      theme,
      toggleTheme,
      addProduct,
      editProduct,
      updateProductStock,
      deleteProduct,
      createOrder,
      updateOrderStatus,
      addEmployee,
      toggleEmployeeAttendance,
      addDeal,
      updateDealStage,
      addTransaction,
      addNotification,
      removeNotification,
      modalTrigger,
      setModalTrigger
    }}>
      {children}
    </AppContext.Provider>
  );
};
