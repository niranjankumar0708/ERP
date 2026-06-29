import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import KanbanBoard from '../components/ui/KanbanBoard';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import MetricCard from '../components/ui/MetricCard';
import { DollarSign, Award, Target, FolderKanban, Plus } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function CRM() {
  const { deals, addDeal, updateDealStage } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    value: '',
    contact: '',
    stage: 'Lead'
  });

  // Calculate Pipeline Math
  const totalPipeline = deals
    .filter(d => d.stage !== 'Won' && d.stage !== 'Lost')
    .reduce((sum, d) => sum + d.value, 0);

  const wonDealsValue = deals
    .filter(d => d.stage === 'Won')
    .reduce((sum, d) => sum + d.value, 0);

  const activeDealsCount = deals.filter(d => d.stage !== 'Won' && d.stage !== 'Lost').length;
  const wonDealsCount = deals.filter(d => d.stage === 'Won').length;
  
  // Calculate a mock target progress (e.g. out of $250,000 target)
  const targetGoal = 250000;
  const targetProgressPercent = Math.min(100, Math.round((wonDealsValue / targetGoal) * 100));

  const handleOpenModal = () => {
    setFormData({
      title: '',
      company: '',
      value: '',
      contact: '',
      stage: 'Lead'
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.company.trim() || !formData.value) {
      alert('Please fill all required fields');
      return;
    }

    addDeal(formData);
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Metrics Row */}
      <div className="grid-cols-4">
        <MetricCard
          title="Active Pipe Volume"
          value={formatCurrency(totalPipeline)}
          icon={DollarSign}
          trend={`${activeDealsCount} active deals`}
          trendDirection="up"
          glowColor="var(--primary)"
        />
        <MetricCard
          title="Sales Closed Won"
          value={formatCurrency(wonDealsValue)}
          icon={Award}
          trend={`${wonDealsCount} contracts signed`}
          trendDirection="up"
          glowColor="var(--success)"
        />
        <MetricCard
          title="Quarterly Sales Target"
          value={`${targetProgressPercent}%`}
          icon={Target}
          trendLabel={`Goal: ${formatCurrency(targetGoal)}`}
          glowColor="var(--secondary)"
        />
        <Card title="Sales Strategy Suite" subtitle="Manage client pipelines and deal closure stages">
          <Button onClick={handleOpenModal} icon={Plus} style={{ width: '100%', marginTop: '6px' }}>
            New CRM Deal
          </Button>
        </Card>
      </div>

      {/* Target Progress Bar */}
      <Card title="Sales Close Target Tracker" subtitle={`Consolidated Closed Won Contracts ($${wonDealsValue.toLocaleString()}) vs Goal ($${targetGoal.toLocaleString()})`}>
        <div style={{
          width: '100%',
          height: '24px',
          background: 'var(--bg-surface)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          position: 'relative',
          marginTop: '0.5rem'
        }}>
          <div style={{
            width: `${targetProgressPercent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
            borderRadius: '12px',
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 0 10px rgba(139, 92, 246, 0.4)'
          }} />
          <span style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#ffffff',
            textShadow: '0 1px 4px rgba(0,0,0,0.5)'
          }}>
            {targetProgressPercent}% Target Reached
          </span>
        </div>
      </Card>

      {/* Kanban Board Container */}
      <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
          <FolderKanban className="brand-icon" size={22} style={{ color: 'var(--primary)' }} />
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Sales Pipeline Board</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Progress deals by clicking directional stage action switches</p>
          </div>
        </div>
        <KanbanBoard deals={deals} onMoveDeal={updateDealStage} />
      </div>

      {/* New Deal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Enterprise CRM Deal"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Initialize Deal</Button>
          </>
        }
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <Input
            label="Deal Contract Name"
            name="title"
            placeholder="e.g. 100x Enterprise SaaS licenses"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <Input
            label="Client Company Name"
            name="company"
            placeholder="e.g. Weyland-Yutani Corp"
            value={formData.company}
            onChange={handleChange}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Estimated Deal Value (USD)"
              name="value"
              type="number"
              placeholder="e.g. 50000"
              value={formData.value}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Primary Contact Person"
              name="contact"
              placeholder="e.g. Ellen Ripley"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-container">
            <label className="input-label">Initial Stage</label>
            <select
              name="stage"
              value={formData.stage}
              onChange={handleChange}
              className="input-field"
              style={{ height: '42px', outline: 'none' }}
            >
              <option value="Lead">Lead</option>
              <option value="Contacted">Contacted</option>
              <option value="Proposal">Proposal</option>
              <option value="Negotiation">Negotiation</option>
            </select>
          </div>

        </form>
      </Modal>
    </div>
  );
}
