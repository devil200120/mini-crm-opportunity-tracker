import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { 
  Edit2, Trash2, Calendar, DollarSign, Mail, Phone, User, 
  Tag, MessageSquare, Send, ChevronDown, ChevronUp 
} from 'lucide-react';

const OpportunityCard = ({ opportunity, onEdit, onDelete, onUpdate }) => {
  const { user } = useContext(AuthContext);
  const [showActivities, setShowActivities] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [loadingActivity, setLoadingActivity] = useState(false);

  const isOwner = user && opportunity.owner && (opportunity.owner._id === user._id || opportunity.owner === user._id);

  // Stage Badge Colors
  const getStageColor = (stage) => {
    switch (stage) {
      case 'New': return { bg: 'rgba(74, 116, 255, 0.1)', text: 'var(--accent-color)' };
      case 'Contacted': return { bg: 'rgba(106, 124, 149, 0.1)', text: 'var(--text-light)' };
      case 'Qualified': return { bg: 'rgba(241, 196, 15, 0.1)', text: '#d4ac0d' };
      case 'Proposal Sent': return { bg: 'rgba(230, 126, 34, 0.1)', text: '#e67e22' };
      case 'Won': return { bg: 'rgba(46, 204, 113, 0.1)', text: 'var(--color-success)' };
      case 'Lost': return { bg: 'rgba(231, 76, 60, 0.1)', text: 'var(--color-danger)' };
      default: return { bg: 'rgba(0,0,0,0.05)', text: 'var(--text-color)' };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'var(--color-danger)';
      case 'Medium': return '#e67e22';
      case 'Low': return 'var(--color-success)';
      default: return 'var(--text-light)';
    }
  };

  const stageColor = getStageColor(opportunity.stage);
  const priorityColor = getPriorityColor(opportunity.priority);

  const formatDate = (dateString) => {
    if (!dateString) return 'None';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    setLoadingActivity(true);
    try {
      const res = await API.post(`/opportunities/${opportunity._id}/activities`, { note: noteText });
      onUpdate(res.data); // Update dashboard state immediately
      setNoteText('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to record activity log');
    } finally {
      setLoadingActivity(false);
    }
  };

  const activities = opportunity.activityHistory || [];

  return (
    <div className="neo-card" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      height: '100%'
    }}>
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flexGrow: 1, paddingRight: '8px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '800', letterSpacing: '-0.3px', marginBottom: '4px' }}>
            {opportunity.customerName}
          </h3>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: '10px',
            fontWeight: '800',
            padding: '2px 8px',
            borderRadius: '50px',
            backgroundColor: stageColor.bg,
            color: stageColor.text,
            textTransform: 'uppercase'
          }}>
            {opportunity.stage}
          </span>
        </div>

        {/* Priority Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: priorityColor
          }} />
          <span style={{ fontSize: '11px', fontWeight: '700', color: priorityColor }}>
            {opportunity.priority}
          </span>
        </div>
      </div>

      {/* Requirement Description */}
      <p style={{ fontSize: '13.5px', color: 'var(--text-light)', lineHeight: '1.4' }}>
        {opportunity.requirement}
      </p>

      {/* Contact Details */}
      {(opportunity.contactName || opportunity.contactEmail || opportunity.contactPhone) && (
        <div className="neo-inset" style={{
          padding: '10px 14px',
          borderRadius: 'var(--border-radius-sm)',
          fontSize: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          boxShadow: 'var(--shadow-inset-sm)',
          overflow: 'hidden'
        }}>
          {opportunity.contactName && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <User size={12} style={{ color: 'var(--text-light)', flexShrink: 0 }} />
              <span style={{ fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {opportunity.contactName}
              </span>
            </div>
          )}
          {opportunity.contactEmail && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <Mail size={12} style={{ color: 'var(--text-light)', flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '11px' }} title={opportunity.contactEmail}>
                {opportunity.contactEmail}
              </span>
            </div>
          )}
          {opportunity.contactPhone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <Phone size={12} style={{ color: 'var(--text-light)', flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {opportunity.contactPhone}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Deal Value and Follow Up */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '8px',
        borderTop: '1px solid rgba(124, 142, 171, 0.1)'
      }}>
        <div>
          <span style={{ fontSize: '10px', color: 'var(--text-light)', display: 'block', fontWeight: '600' }}>
            Deal Value
          </span>
          <span style={{ fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center' }}>
            <DollarSign size={13} style={{ color: 'var(--color-success)' }} />
            {opportunity.estimatedValue.toLocaleString()}
          </span>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-light)', display: 'block', fontWeight: '600' }}>
            Follow-Up
          </span>
          <span style={{ fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={12} style={{ color: 'var(--accent-color)' }} />
            {formatDate(opportunity.nextFollowUpDate)}
          </span>
        </div>
      </div>

      {/* Primary Notes (if any) */}
      {opportunity.notes && (
        <div style={{
          fontSize: '11px',
          color: 'var(--text-light)',
          fontStyle: 'italic',
          background: 'rgba(124, 142, 171, 0.05)',
          padding: '6px 10px',
          borderRadius: 'var(--border-radius-sm)',
        }}>
          💡 {opportunity.notes}
        </div>
      )}

      {/* Activities Timeline Toggle */}
      <div style={{ borderTop: '1px solid rgba(124, 142, 171, 0.1)', paddingTop: '10px' }}>
        <button
          onClick={() => setShowActivities(!showActivities)}
          className="neo-btn"
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: '12px',
            boxShadow: 'var(--shadow-outset-sm)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700' }}>
            <MessageSquare size={13} />
            Activity History ({activities.length})
          </span>
          {showActivities ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {/* Collapsible Timeline Content */}
        {showActivities && (
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Timeline Stream */}
            <div style={{
              maxHeight: '180px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '4px',
              borderLeft: '2px dashed var(--shadow-dark)',
              marginLeft: '8px',
              paddingLeft: '12px'
            }}>
              {activities.map((act, index) => (
                <div key={act._id || index} style={{ position: 'relative' }}>
                  {/* Bullet */}
                  <span style={{
                    position: 'absolute',
                    left: '-17px',
                    top: '4px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-color)',
                    boxShadow: '0 0 4px var(--accent-light)'
                  }} />
                  <div style={{ fontSize: '11px', color: 'var(--text-light)', marginBottom: '2px' }}>
                    <span style={{ fontWeight: '700', color: 'var(--text-color)' }}>
                      {act.createdBy?.name || 'User'}
                    </span>
                    {' • '}{formatDateTime(act.createdAt)}
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-color)', lineHeight: '1.3' }}>
                    {act.note}
                  </p>
                </div>
              ))}
              {activities.length === 0 && (
                <span style={{ fontSize: '11px', color: 'var(--text-light)', fontStyle: 'italic' }}>
                  No updates recorded yet.
                </span>
              )}
            </div>

            {/* Note Entry (Owner only) */}
            {isOwner && (
              <form onSubmit={handleAddActivity} style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <input
                  type="text"
                  className="neo-input"
                  placeholder="Record an activity update..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  style={{
                    height: '36px',
                    padding: '0 12px',
                    fontSize: '12px',
                    flexGrow: 1,
                    borderRadius: 'var(--border-radius-sm)',
                    boxShadow: 'var(--shadow-inset-sm)'
                  }}
                  disabled={loadingActivity}
                />
                <button
                  type="submit"
                  className="neo-btn neo-btn-primary"
                  style={{ 
                    height: '36px',
                    minWidth: '36px',
                    width: '36px',
                    padding: 0,
                    borderRadius: 'var(--border-radius-sm)'
                  }}
                  disabled={loadingActivity || !noteText.trim()}
                >
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Footer Creator Details & Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '8px',
        marginTop: 'auto'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '9px', color: 'var(--text-light)' }}>Created by</span>
          <span style={{
            fontSize: '11px',
            fontWeight: '700',
            color: isOwner ? 'var(--accent-color)' : 'var(--text-color)',
            maxWidth: '120px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {isOwner ? 'You' : (opportunity.owner?.name || 'Unknown')}
          </span>
        </div>

        {/* Action Buttons (Only visible to the creator) */}
        {isOwner && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onEdit(opportunity)}
              className="neo-btn neo-btn-icon-sm"
              title="Edit Opportunity"
            >
              <Edit2 size={13} />
            </button>
            <button
              onClick={() => onDelete(opportunity._id)}
              className="neo-btn neo-btn-danger neo-btn-icon-sm"
              title="Delete Opportunity"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunityCard;
