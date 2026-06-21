import React, { useState, useEffect } from 'react';
import { X, Save, DollarSign } from 'lucide-react';
import CustomSelect from './CustomSelect';

const OpportunityForm = ({ opportunity, onClose, onSave }) => {
  const [customerName, setCustomerName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [requirement, setRequirement] = useState('');
  const [estimatedValue, setEstimatedValue] = useState(0);
  const [stage, setStage] = useState('New');
  const [priority, setPriority] = useState('Medium');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState({});
  const isEditMode = !!opportunity;

  useEffect(() => {
    if (opportunity) {
      setCustomerName(opportunity.customerName || '');
      setContactName(opportunity.contactName || '');
      setContactEmail(opportunity.contactEmail || '');
      setContactPhone(opportunity.contactPhone || '');
      setRequirement(opportunity.requirement || '');
      setEstimatedValue(opportunity.estimatedValue || 0);
      setStage(opportunity.stage || 'New');
      setPriority(opportunity.priority || 'Medium');
      
      if (opportunity.nextFollowUpDate) {
        // Convert to YYYY-MM-DD for HTML input binding
        const date = new Date(opportunity.nextFollowUpDate);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        setNextFollowUpDate(`${yyyy}-${mm}-${dd}`);
      } else {
        setNextFollowUpDate('');
      }
      setNotes(opportunity.notes || '');
    }
  }, [opportunity]);

  const validateForm = () => {
    const newErrors = {};
    if (!customerName.trim()) {
      newErrors.customerName = 'Customer or company name is required';
    }
    if (!requirement.trim()) {
      newErrors.requirement = 'Requirement description is required';
    }
    if (estimatedValue < 0) {
      newErrors.estimatedValue = 'Deal value cannot be negative';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      customerName,
      contactName,
      contactEmail,
      contactPhone,
      requirement,
      estimatedValue: Number(estimatedValue),
      stage,
      priority,
      nextFollowUpDate: nextFollowUpDate || null,
      notes,
    };

    onSave(payload);
  };

  const stageOptions = [
    { value: 'New', label: 'New' },
    { value: 'Contacted', label: 'Contacted' },
    { value: 'Qualified', label: 'Qualified' },
    { value: 'Proposal Sent', label: 'Proposal Sent' },
    { value: 'Won', label: 'Won' },
    { value: 'Lost', label: 'Lost' }
  ];

  const priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content neo-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          borderBottom: '1px solid rgba(124, 142, 171, 0.1)',
          paddingBottom: '12px'
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.4px' }}>
            {isEditMode ? 'Edit Opportunity' : 'New Opportunity'}
          </h2>
          <button 
            type="button" 
            onClick={onClose} 
            className="neo-btn neo-btn-icon-sm"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Main Info */}
          <div className="neo-form-grid">
            <div className="grid-span-2">
              <label className="neo-label" htmlFor="form-company">Customer / Company Name *</label>
              <input
                id="form-company"
                type="text"
                className="neo-input"
                placeholder="Acme Corporation"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              {errors.customerName && (
                <span style={{ fontSize: '11px', color: 'var(--color-danger)', marginTop: '4px', display: 'block' }}>
                  {errors.customerName}
                </span>
              )}
            </div>
            
            <div className="grid-span-2">
              <label className="neo-label" htmlFor="form-requirement">Requirement Summary *</label>
              <input
                id="form-requirement"
                type="text"
                className="neo-input"
                placeholder="e.g. 50 licenses of ERP software + training"
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
              />
              {errors.requirement && (
                <span style={{ fontSize: '11px', color: 'var(--color-danger)', marginTop: '4px', display: 'block' }}>
                  {errors.requirement}
                </span>
              )}
            </div>
          </div>

          {/* Contact Details Section */}
          <div className="neo-inset" style={{
            padding: '16px',
            borderRadius: 'var(--border-radius-sm)',
            boxShadow: 'var(--shadow-inset-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-light)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Primary Contact Details
            </h4>
            <div className="neo-form-grid" style={{ gap: '12px' }}>
              <div>
                <label className="neo-label" htmlFor="form-contact-name" style={{ fontSize: '12px' }}>Contact Person</label>
                <input
                  id="form-contact-name"
                  type="text"
                  className="neo-input"
                  placeholder="John Doe"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  style={{ padding: '10px 14px', fontSize: '13px' }}
                />
              </div>
              <div>
                <label className="neo-label" htmlFor="form-contact-phone" style={{ fontSize: '12px' }}>Phone Number</label>
                <input
                  id="form-contact-phone"
                  type="tel"
                  className="neo-input"
                  placeholder="+1 (555) 019-2834"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  style={{ padding: '10px 14px', fontSize: '13px' }}
                />
              </div>
              <div className="grid-span-2">
                <label className="neo-label" htmlFor="form-contact-email" style={{ fontSize: '12px' }}>Email Address</label>
                <input
                  id="form-contact-email"
                  type="email"
                  className="neo-input"
                  placeholder="john@acme.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  style={{ padding: '10px 14px', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>

          {/* Deal Metadata */}
          <div className="neo-form-grid">
            <div>
              <label className="neo-label" htmlFor="form-value">Estimated Value ($)</label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={14} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-light)'
                }} />
                <input
                  id="form-value"
                  type="number"
                  className="neo-input"
                  placeholder="0"
                  min="0"
                  value={estimatedValue}
                  onChange={(e) => setEstimatedValue(e.target.value)}
                  style={{ paddingLeft: '32px' }}
                />
              </div>
              {errors.estimatedValue && (
                <span style={{ fontSize: '11px', color: 'var(--color-danger)', marginTop: '4px', display: 'block' }}>
                  {errors.estimatedValue}
                </span>
              )}
            </div>

            <div>
              <label className="neo-label" htmlFor="form-followup">Follow-Up Date</label>
              <input
                id="form-followup"
                type="date"
                className="neo-input"
                value={nextFollowUpDate}
                onChange={(e) => setNextFollowUpDate(e.target.value)}
              />
            </div>
          </div>

          {/* Status and Priority */}
          <div className="neo-form-grid">
            <div>
              <label className="neo-label">Deal Stage</label>
              <CustomSelect
                value={stage}
                onChange={setStage}
                options={stageOptions}
              />
            </div>

            <div>
              <label className="neo-label">Priority</label>
              <CustomSelect
                value={priority}
                onChange={setPriority}
                options={priorityOptions}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="neo-label" htmlFor="form-notes">Additional Notes</label>
            <textarea
              id="form-notes"
              className="neo-input"
              placeholder="Record notes on meetings, custom customer requests, or next action steps..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                minHeight: '80px',
                resize: 'vertical',
                borderRadius: 'var(--border-radius-sm)',
                padding: '12px'
              }}
            />
          </div>

          {/* Footer Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '12px',
            borderTop: '1px solid rgba(124, 142, 171, 0.1)',
            paddingTop: '16px'
          }}>
            <button type="button" onClick={onClose} className="neo-btn" style={{ padding: '10px 18px' }}>
              Cancel
            </button>
            <button type="submit" className="neo-btn neo-btn-primary" style={{ padding: '10px 22px' }}>
              <Save size={16} /> Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OpportunityForm;
