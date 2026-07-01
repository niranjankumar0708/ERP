import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { ShoppingBag, Plus, Trash2, Check, ArrowRight, XCircle, FileText, Printer } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function Sales() {
  const { products, orders, createOrder, updateOrderStatus, modalTrigger, setModalTrigger } = useContext(AppContext);
  
  // POS Cart State
  const [cart, setCart] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [qty, setQty] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  // Invoice Modal State
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  useEffect(() => {
    if (modalTrigger === 'sales' || modalTrigger === 'pos') {
      const checkoutEl = document.querySelector('.pos-terminal-card');
      if (checkoutEl) {
        checkoutEl.scrollIntoView({ behavior: 'smooth' });
        // Add a temporary glow effect or focus
        checkoutEl.style.boxShadow = '0 0 25px rgba(59, 130, 246, 0.6)';
        setTimeout(() => {
          checkoutEl.style.boxShadow = '';
        }, 2000);
      }
      setModalTrigger(null);
    }
  }, [modalTrigger, setModalTrigger]);

  // Find active product detail
  const activeProduct = products.find(p => p.id === selectedProductId);

  const handleAddToCart = () => {
    if (!selectedProductId) return;
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    if (qty > product.stock) {
      alert(`Insufficient stock! "${product.name}" has only ${product.stock} units available.`);
      return;
    }

    const existingCartItem = cart.find(item => item.id === product.id);
    if (existingCartItem) {
      if (existingCartItem.qty + qty > product.stock) {
        alert(`Cannot add more! Combined cart quantity exceeds available stock.`);
        return;
      }
      setCart(prev => prev.map(item => 
        item.id === product.id ? { ...item, qty: item.qty + qty } : item
      ));
    } else {
      setCart(prev => [...prev, {
        id: product.id,
        name: product.name,
        qty: qty,
        price: product.price
      }]);
    }

    // Reset selectors
    setSelectedProductId('');
    setQty(1);
  };

  const handleRemoveFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const calculateTax = () => calculateSubtotal() * 0.08; // 8% sales tax
  const calculateTotal = () => calculateSubtotal() + calculateTax();

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }
    if (!customerName.trim()) {
      alert('Please enter a customer name.');
      return;
    }

    createOrder({
      customer: customerName,
      items: cart,
      total: calculateTotal(),
      paymentMethod: paymentMethod
    });

    // Clear cart
    setCart([]);
    setCustomerName('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Fulfilled': return <Badge variant="success">Fulfilled</Badge>;
      case 'Shipped': return <Badge variant="info">Shipped</Badge>;
      case 'Pending': return <Badge variant="warning">Pending</Badge>;
      case 'Cancelled': return <Badge variant="danger">Cancelled</Badge>;
      default: return <Badge variant="muted">{status}</Badge>;
    }
  };

  return (
    <div className="animate-fade-in grid-2-col" style={{ alignItems: 'flex-start' }}>
      
      {/* POS Cart Panel */}
      <Card title="POS Terminal & Checkout" subtitle="Register instant customer sales invoices and sync stock levels" className="pos-terminal-card">
        <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="input-container">
            <label className="input-label">Select Catalog Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="input-field"
              style={{ height: '42px', outline: 'none' }}
            >
              <option value="">-- Choose inventory item --</option>
              {products.map(p => (
                <option key={p.id} value={p.id} disabled={p.stock === 0}>
                  {p.name} (SKU: {p.sku} | In Stock: {p.stock} units | ${p.price.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {activeProduct && (
            <div className="form-grid" style={{ alignItems: 'flex-end' }}>
              <Input
                label="Quantity"
                type="number"
                min="1"
                max={activeProduct.stock}
                value={qty}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              />
              <Button variant="outline" onClick={handleAddToCart} icon={Plus} style={{ height: '42px' }}>
                Add to Cart
              </Button>
            </div>
          )}

          {/* Cart Contents list */}
          <div style={{
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            background: 'rgba(0,0,0,0.1)',
            minHeight: '120px'
          }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', marginBottom: '8px' }}>
              Cart items ({cart.length})
            </h4>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', paddingTop: '20px' }}>
                No items added to invoice draft.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                    <div style={{ maxWidth: '65%' }}>
                      <span style={{ fontWeight: 600 }}>{item.name}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: '6px' }}>x{item.qty}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700 }}>{formatCurrency(item.price * item.qty)}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveFromCart(item.id)} 
                        style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '2px' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Input
            label="Customer Name"
            placeholder="e.g. John Doe / Acme Inc"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />

          <div className="input-container">
            <label className="input-label">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="input-field"
              style={{ height: '42px', outline: 'none' }}
            >
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
            </select>
          </div>

          {/* Pricing calculations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Subtotal:</span>
              <span>{formatCurrency(calculateSubtotal())}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Sales Tax (8%):</span>
              <span>{formatCurrency(calculateTax())}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem', marginTop: '4px', borderTop: '1px dashed var(--border-color)', paddingTop: '6px' }}>
              <span>Grand Total:</span>
              <span style={{ color: 'var(--primary)' }}>{formatCurrency(calculateTotal())}</span>
            </div>
          </div>

          <Button type="submit" disabled={cart.length === 0} icon={ShoppingBag}>
            Dispatch Order
          </Button>

        </form>
      </Card>

      {/* Orders Ledger List */}
      <Card title="Sales Order Directory" subtitle="Review dispatch states, invoice values, and fulfill deliveries">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No orders registered in system yet.
            </div>
          ) : (
            orders.map((ord) => (
              <div 
                key={ord.id} 
                className="glass-panel" 
                style={{
                  padding: '1.25rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}
              >
                <div className="order-card-header">
                  <div>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>{ord.id}</span>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '2px 0' }}>{ord.customer}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Logged: {formatDate(ord.date)} | Method: {ord.paymentMethod}</span>
                  </div>
                  <div>
                    {getStatusBadge(ord.status)}
                  </div>
                </div>

                {/* List items in order */}
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: 'var(--text-secondary)',
                  background: 'rgba(0,0,0,0.05)',
                  padding: '6px 12px',
                  borderRadius: '4px'
                }}>
                  {ord.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{item.name} x{item.qty}</span>
                      <span>{formatCurrency(item.price * item.qty)}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginTop: '4px', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)', paddingTop: '4px' }}>
                    <span>Order Total:</span>
                    <span>{formatCurrency(ord.total)}</span>
                  </div>
                </div>

                {/* Status and invoice action buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setSelectedInvoice(ord);
                      setIsInvoiceModalOpen(true);
                    }}
                    icon={FileText}
                  >
                    View Invoice
                  </Button>

                  {ord.status !== 'Fulfilled' && ord.status !== 'Cancelled' && (
                    <>
                      {ord.status === 'Pending' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => updateOrderStatus(ord.id, 'Shipped')}
                          icon={ArrowRight}
                        >
                          Ship Order
                        </Button>
                      )}
                      {ord.status === 'Shipped' && (
                        <Button 
                          variant="primary" 
                          size="sm" 
                          onClick={() => updateOrderStatus(ord.id, 'Fulfilled')}
                          icon={Check}
                          style={{ background: 'var(--success)' }}
                        >
                          Fulfill (Collect Payout)
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => updateOrderStatus(ord.id, 'Cancelled')}
                        icon={XCircle}
                        className="text-danger"
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Invoice Receipt Modal */}
      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title="Tax Invoice / Receipt"
        footer={
          <div className="modal-overlay-actions" style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'flex-end' }}>
            <Button variant="outline" onClick={() => setIsInvoiceModalOpen(false)} className="no-print">Close</Button>
            <Button onClick={() => window.print()} icon={Printer} className="no-print">Print Invoice</Button>
          </div>
        }
      >
        {selectedInvoice && (
          <div className="printable-invoice" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--text-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>Nexus<span style={{ color: 'var(--primary)' }}>ERP</span></h2>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Corporate Accounting System</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>INVOICE</h3>
                <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>{selectedInvoice.id}</span>
              </div>
            </div>

            <div className="form-grid" style={{ fontSize: '0.85rem' }}>
              <div>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Billed To:</h4>
                <p style={{ fontWeight: 700 }}>{selectedInvoice.customer}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Client Partner Account</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Invoice Details:</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Date: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatDate(selectedInvoice.date)}</span></p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Payment: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedInvoice.paymentMethod}</span></p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Status: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedInvoice.status}</span></p>
              </div>
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    <th style={{ padding: '8px 0' }}>Item Description</th>
                    <th style={{ padding: '8px 0', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '8px 0', textAlign: 'right' }}>Unit Price</th>
                    <th style={{ padding: '8px 0', textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '10px 0', fontWeight: 600 }}>{item.name}</td>
                      <td style={{ padding: '10px 0', textAlign: 'center' }}>{item.qty}</td>
                      <td style={{ padding: '10px 0', textAlign: 'right' }}>{formatCurrency(item.price)}</td>
                      <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 700 }}>{formatCurrency(item.price * item.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', width: '220px', alignSelf: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal:</span>
                <span>{formatCurrency(selectedInvoice.total / 1.08)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Sales Tax (8%):</span>
                <span>{formatCurrency(selectedInvoice.total - (selectedInvoice.total / 1.08))}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem', borderTop: '1px dashed var(--border-color)', paddingTop: '6px', marginTop: '4px' }}>
                <span>Grand Total:</span>
                <span style={{ color: 'var(--primary)' }}>{formatCurrency(selectedInvoice.total)}</span>
              </div>
            </div>

            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              Thank you for your business. For billing disputes, contact accounting@nexuserp.com.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
