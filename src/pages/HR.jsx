import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { Users, Search, UserPlus, Filter, Mail, Calendar, LogIn, LogOut } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export default function HR() {
  const { employees, addEmployee, toggleEmployeeAttendance, modalTrigger, setModalTrigger } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (modalTrigger === 'hr' || modalTrigger === 'employee' || modalTrigger === 'staff') {
      handleOpenModal();
      setModalTrigger(null);
    }
  }, [modalTrigger, setModalTrigger]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: 'Operations',
    email: '',
    status: 'Active'
  });

  const departments = ['All', 'Operations', 'Sales', 'Finance', 'HR'];

  // Filtering
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleOpenModal = () => {
    setFormData({
      name: '',
      role: '',
      department: 'Operations',
      email: '',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please fill all required fields');
      return;
    }
    
    addEmployee(formData);
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getDeptColor = (dept) => {
    switch (dept) {
      case 'Operations': return 'info';
      case 'Sales': return 'success';
      case 'Finance': return 'warning';
      case 'HR': return 'secondary';
      default: return 'muted';
    }
  };

  const getAttendanceBadge = (status) => {
    return status === 'Checked In' 
      ? <Badge variant="success">Active Shift</Badge>
      : <Badge variant="muted">Off Shift</Badge>;
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Search & Filter Header Bar */}
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
            placeholder="Search employee names, titles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
            className="search-input-erp"
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
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
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <Button onClick={handleOpenModal} icon={UserPlus}>
          Onboard Staff
        </Button>
      </div>

      {/* Grid listing employees */}
      <div className="grid-cols-3">
        {filteredEmployees.length === 0 ? (
          <div style={{
            gridColumn: 'span 3',
            textAlign: 'center',
            padding: '40px',
            color: 'var(--text-muted)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)'
          }}>
            No staff records found matching search queries.
          </div>
        ) : (
          filteredEmployees.map((emp) => (
            <Card 
              key={emp.id}
              title={emp.name}
              subtitle={emp.role}
              headerAction={<Badge variant={getDeptColor(emp.department)}>{emp.department}</Badge>}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '4px' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <Mail size={14} style={{ color: 'var(--text-muted)' }} />
                  <span>{emp.email}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                  <span>Hired: {formatDate(emp.joinDate)}</span>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '10px',
                  marginTop: '6px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status:</span>
                    {getAttendanceBadge(emp.attendance)}
                  </div>
                  
                  <Button 
                    variant={emp.attendance === 'Checked In' ? 'outline' : 'primary'}
                    size="sm"
                    onClick={() => toggleEmployeeAttendance(emp.id)}
                    icon={emp.attendance === 'Checked In' ? LogOut : LogIn}
                    style={emp.attendance !== 'Checked In' ? { background: 'var(--success)' } : {}}
                  >
                    {emp.attendance === 'Checked In' ? 'Clock Out' : 'Clock In'}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Onboard Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Onboard Corporate Employee"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Confirm Onboarding</Button>
          </>
        }
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <Input
            label="Full Name"
            name="name"
            placeholder="e.g. Liam Sterling"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Professional Title / Role"
            name="role"
            placeholder="e.g. Senior Backend Engineer"
            value={formData.role}
            onChange={handleChange}
            required
          />

          <div className="form-grid">
            <div className="input-container">
              <label className="input-label">Corporate Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="input-field"
                style={{ height: '42px', outline: 'none' }}
              >
                <option value="Operations">Operations</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
              </select>
            </div>
            
            <Input
              label="Work Email Address"
              name="email"
              type="email"
              placeholder="e.g. l.sterling@company.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
