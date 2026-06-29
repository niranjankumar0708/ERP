import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import MetricCard from '../components/ui/MetricCard';
import InteractiveChart from '../components/ui/InteractiveChart';
import { DollarSign, Landmark, TrendingDown, ArrowDownLeft, Plus } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function Finance() {
  const { transactions, addTransaction } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    description: '',
    type: 'Expense',
    category: 'Logistics',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  // Formatting for Expense pie chart
  const categories = ['Payroll', 'Marketing', 'Office Supplies', 'Logistics'];
  const expenseBreakdown = categories.map(cat => {
    const amount = transactions
      .filter(t => t.type === 'Expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: cat, value: amount };
  }).filter(item => item.value > 0);

  // Fallback if empty breakdown
  if (expenseBreakdown.length === 0) {
    expenseBreakdown.push({ name: 'Operational', value: 100 });
  }

  const chartColors = ['var(--secondary)', 'var(--primary)', 'var(--warning)', 'var(--danger)'];

  const handleOpenModal = () => {
    setFormData({
      description: '',
      type: 'Expense',
      category: 'Logistics',
      amount: '',
      date: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.description.trim() || !formData.amount) {
      alert('Please fill out all fields');
      return;
    }

    addTransaction(formData);
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Financial metrics row */}
      <div className="grid-cols-4">
        <MetricCard
          title="Consolidated Cash In"
          value={formatCurrency(totalIncome)}
          icon={Landmark}
          trendLabel="total income logged"
          glowColor="var(--success)"
        />
        <MetricCard
          title="Consolidated Cash Out"
          value={formatCurrency(totalExpense)}
          icon={TrendingDown}
          trendLabel="total expenditures logged"
          glowColor="var(--danger)"
        />
        <MetricCard
          title="Net Corporate Balance"
          value={formatCurrency(netBalance)}
          icon={DollarSign}
          trend={netBalance >= 0 ? 'Surplus' : 'Deficit'}
          trendDirection={netBalance >= 0 ? 'up' : 'down'}
          glowColor={netBalance >= 0 ? 'var(--success)' : 'var(--danger)'}
        />
        <Card title="Ledger Bookkeeper" subtitle="Record operational corporate expenditures">
          <Button onClick={handleOpenModal} icon={Plus} style={{ width: '100%', marginTop: '6px' }}>
            Log Transaction
          </Button>
        </Card>
      </div>

      {/* Breakdown Grid Chart & Pie */}
      <div className="grid-cols-3" style={{ gridTemplateColumns: '1.2fr 1.8fr', gap: '2rem' }}>
        <Card title="Expenditure Shares" subtitle="Category distribution of logged business expenses">
          <InteractiveChart
            type="pie"
            data={expenseBreakdown}
            dataKeys={['value']}
            colors={chartColors}
            height={260}
          />
        </Card>

        {/* Ledger Details List */}
        <Card title="Corporate General Ledger" subtitle="Review incoming sales invoices and outgoing operational debits">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>TXN ID</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Details</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'center' }}>Book Entry</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No ledger records.
                    </td>
                  </tr>
                ) : (
                  transactions.map((txn) => {
                    const isIncome = txn.type === 'Income';
                    return (
                      <tr key={txn.id} style={{ borderBottom: '1px solid var(--border-color)' }} className="table-row-hover">
                        <td style={{ padding: '12px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>{txn.id}</td>
                        <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{formatDate(txn.date)}</td>
                        <td style={{ padding: '12px', fontWeight: 600 }}>{txn.description}</td>
                        <td style={{ padding: '12px' }}><Badge variant={isIncome ? 'success' : 'secondary'}>{txn.category}</Badge></td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <Badge variant={isIncome ? 'success' : 'danger'}>
                            {isIncome ? 'Credit' : 'Debit'}
                          </Badge>
                        </td>
                        <td style={{ 
                          padding: '12px', 
                          textAlign: 'right', 
                          fontWeight: 700,
                          color: isIncome ? 'var(--success)' : 'var(--danger)'
                        }}>
                          {isIncome ? '+' : '-'}{formatCurrency(txn.amount)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Transaction Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Accounting Transaction Entry"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Confirm Ledger Entry</Button>
          </>
        }
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <Input
            label="Transaction Description / Memo"
            name="description"
            placeholder="e.g. Purchase office stationery supply packages"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-container">
              <label className="input-label">Accounting Entry Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="input-field"
                style={{ height: '42px', outline: 'none' }}
              >
                <option value="Expense">Debit (Expense)</option>
                <option value="Income">Credit (Income)</option>
              </select>
            </div>
            
            <div className="input-container">
              <label className="input-label">Expense Category</label>
              {formData.type === 'Expense' ? (
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                  style={{ height: '42px', outline: 'none' }}
                >
                  <option value="Payroll">Payroll</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Logistics">Logistics</option>
                </select>
              ) : (
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                  style={{ height: '42px', outline: 'none' }}
                >
                  <option value="Sales Revenue">Sales Revenue</option>
                  <option value="Investment">Capital Investment</option>
                </select>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Transaction Value (USD)"
              name="amount"
              type="number"
              step="0.01"
              placeholder="e.g. 1500.00"
              value={formData.amount}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Valuation Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

        </form>
      </Modal>
    </div>
  );
}
