import React from 'react';
import Badge from '../common/Badge';
import { ArrowLeft, ArrowRight, DollarSign, Calendar, User } from 'lucide-react';

const STAGES = ['Lead', 'Contacted', 'Proposal', 'Negotiation', 'Won', 'Lost'];

export default function KanbanBoard({ deals, onMoveDeal }) {
  const getStageColor = (stage) => {
    switch (stage) {
      case 'Lead': return 'muted';
      case 'Contacted': return 'info';
      case 'Proposal': return 'secondary';
      case 'Negotiation': return 'warning';
      case 'Won': return 'success';
      case 'Lost': return 'danger';
      default: return 'info';
    }
  };

  const getStageDeals = (stage) => deals.filter(d => d.stage === stage);

  const moveDeal = (dealId, currentStage, direction) => {
    const currentIndex = STAGES.indexOf(currentStage);
    let nextIndex = currentIndex;
    
    if (direction === 'next' && currentIndex < STAGES.length - 1) {
      // If at Negotiation, next is Won, but we also allow Lost (which is the last index). 
      // Let's make it go to Won. If they want Lost they can select from options or we can handle logically.
      nextIndex = currentIndex + 1;
    } else if (direction === 'prev' && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    }
    
    if (nextIndex !== currentIndex) {
      onMoveDeal(dealId, STAGES[nextIndex]);
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: '1.25rem',
      overflowX: 'auto',
      paddingBottom: '1rem',
      minHeight: '550px',
      alignItems: 'stretch'
    }}>
      {STAGES.map((stage) => {
        const stageDeals = getStageDeals(stage);
        
        return (
          <div key={stage} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            padding: '1rem',
            minWidth: '220px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '0.75rem',
              marginBottom: '0.25rem'
            }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{stage}</h3>
              <Badge variant={getStageColor(stage)}>{stageDeals.length}</Badge>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              overflowY: 'auto',
              flexGrow: 1
            }}>
              {stageDeals.length === 0 ? (
                <div style={{
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  border: '1px dashed var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexGrow: 1
                }}>
                  Drop deals here
                </div>
              ) : (
                stageDeals.map((deal) => (
                  <div 
                    key={deal.id} 
                    className="glass-panel" 
                    style={{
                      padding: '1rem',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'transform 0.2s ease, border-color 0.2s ease'
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '2px', lineHeight: 1.3 }}>{deal.title}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{deal.company}</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <DollarSign size={13} style={{ color: 'var(--success)' }} />
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                          {deal.value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={13} />
                        <span>{deal.contact}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={13} />
                        <span>{deal.date}</span>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '0.6rem',
                      marginTop: '0.2rem'
                    }}>
                      <button
                        onClick={() => moveDeal(deal.id, deal.stage, 'prev')}
                        disabled={stage === 'Lead'}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: stage === 'Lead' ? 'var(--text-muted)' : 'var(--text-secondary)',
                          cursor: stage === 'Lead' ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '3px'
                        }}
                        title="Move left"
                      >
                        <ArrowLeft size={14} />
                      </button>

                      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {deal.id}
                      </span>

                      <button
                        onClick={() => moveDeal(deal.id, deal.stage, 'next')}
                        disabled={stage === 'Won' || stage === 'Lost'}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: (stage === 'Won' || stage === 'Lost') ? 'var(--text-muted)' : 'var(--text-secondary)',
                          cursor: (stage === 'Won' || stage === 'Lost') ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '3px'
                        }}
                        title="Move right"
                      >
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
