import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { Plus, Search, Edit2, Trash2, Filter, PackageCheck } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function Inventory() {
  const { products, addProduct, editProduct, deleteProduct } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: 'Electronics',
    price: '',
    stock: '',
    minStock: '',
    warehouse: 'Warehouse Alpha'
  });

  const categories = ['All', 'Electronics', 'Furniture', 'Office Supplies'];

  // Search & Filter
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      sku: 'NX-' + Math.floor(100 + Math.random() * 900),
      name: '',
      category: 'Electronics',
      price: '',
      stock: '',
      minStock: '5',
      warehouse: 'Warehouse Alpha'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingId(product.id);
    setFormData({
      sku: product.sku,
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      warehouse: product.warehouse
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      editProduct(editingId, formData);
    } else {
      addProduct(formData);
    }
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Control Bar */}
      <div className="glass-panel" style={{
        padding: '1.25rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexGrow: 1, maxWidth: '600px' }}>
          <Input
            placeholder="Search SKU or product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
            className="search-input-erp"
          />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '10px 14px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <Button onClick={handleOpenAddModal} icon={Plus}>
          Add Product
        </Button>
      </div>

      {/* Main Stock Table */}
      <Card title="Warehouse Inventory Catalog" subtitle={`${filteredProducts.length} items logged in warehouse directories`}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.9rem'
          }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>SKU</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Product Details</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Warehouse Location</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Unit Price</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'center' }}>Stock Status</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const isLow = prod.stock <= prod.minStock;
                  return (
                    <tr key={prod.id} style={{ 
                      borderBottom: '1px solid var(--border-color)',
                      transition: 'background-color 0.2s',
                      cursor: 'default'
                    }} className="table-row-hover">
                      <td style={{ padding: '16px', fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>{prod.sku}</td>
                      <td style={{ padding: '16px', fontWeight: 600 }}>{prod.name}</td>
                      <td style={{ padding: '16px' }}><Badge variant="secondary">{prod.category}</Badge></td>
                      <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{prod.warehouse}</td>
                      <td style={{ padding: '16px', textAlign: 'right', fontWeight: 700 }}>{formatCurrency(prod.price)}</td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontWeight: 700, color: isLow ? 'var(--danger)' : 'var(--success)' }}>
                            {prod.stock} units
                          </span>
                          <Badge variant={isLow ? 'danger' : 'success'}>
                            {isLow ? 'Low Stock' : 'Healthy'}
                          </Badge>
                        </div>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleOpenEditModal(prod)} 
                            icon={Edit2}
                            className="btn-icon-only"
                          />
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteProduct(prod.id)} 
                            icon={Trash2}
                            className="btn-icon-only text-danger"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Warehouse Logistics Visual Sync Board */}
      <div className="glass-panel" style={{
        padding: '1.5rem 2rem',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid var(--border-color)',
        minHeight: '110px'
      }}>
        <div style={{ zIndex: 1, display: 'flex', alignItems: 'center', gap: '15px' }}>
          <PackageCheck size={32} style={{ color: 'var(--info)' }} />
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Logistics Telemetry Synced</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              All 2 active warehouse hubs (Alpha & Beta) are online. RFID tracking and telemetry nodes fully synced.
            </p>
          </div>
        </div>
        <img 
          src="/images/warehouse_asset.png" 
          alt="Warehouse Asset Graphic" 
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            height: '190%',
            opacity: 0.25,
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Modify Product Specifications' : 'Onboard New Inventory Product'}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Specifications</Button>
          </>
        }
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="SKU Code"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
              disabled
            />
            
            <div className="input-container">
              <label className="input-label">Product Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
                style={{ height: '42px', outline: 'none' }}
              >
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Office Supplies">Office Supplies</option>
              </select>
            </div>
          </div>

          <Input
            label="Product Name"
            name="name"
            placeholder="e.g. Dell UltraSharp 32'' Monitor"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Unit Price (USD)"
              name="price"
              type="number"
              step="0.01"
              placeholder="e.g. 399.99"
              value={formData.price}
              onChange={handleChange}
              required
            />
            <div className="input-container">
              <label className="input-label">Storage Warehouse</label>
              <select
                name="warehouse"
                value={formData.warehouse}
                onChange={handleChange}
                className="input-field"
                style={{ height: '42px', outline: 'none' }}
              >
                <option value="Warehouse Alpha">Warehouse Alpha</option>
                <option value="Warehouse Beta">Warehouse Beta</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Initial Stock Quantity"
              name="stock"
              type="number"
              placeholder="e.g. 24"
              value={formData.stock}
              onChange={handleChange}
              required
            />
            <Input
              label="Minimum Alert Stock Level"
              name="minStock"
              type="number"
              placeholder="e.g. 5"
              value={formData.minStock}
              onChange={handleChange}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
