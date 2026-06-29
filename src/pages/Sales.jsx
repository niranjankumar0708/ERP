import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import { ShoppingBag, Plus, Trash2, Check, ArrowRight, XCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function Sales() {
  const { products, orders, createOrder, updateOrderStatus } = useContext(AppContext);
  
  // POS Cart State
  const [cart, setCart] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [qty, setQty] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

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
    <div className="animate-fade-in grid-cols-3" style={{ gridTemplateColumns: '1.2fr 1.8fr', gap: '2rem', alignItems: 'flex-start' }}>
      
      {/* POS Cart Panel */}
      <Card title="POS Terminal & Checkout" subtitle="Register instant customer sales invoices and sync stock levels">
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
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', alignItems: 'flex-end' }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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

                {/* Status action buttons */}
                {ord.status !== 'Fulfilled' && ord.status !== 'Cancelled' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
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
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
