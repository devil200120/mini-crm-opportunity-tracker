import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({ value, onChange, options, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div 
      ref={dropdownRef} 
      className={`neo-select-container ${className}`} 
      style={{ position: 'relative', width: '100%' }}
    >
      {/* Trigger Box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="neo-input"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          paddingRight: '16px',
          userSelect: 'none'
        }}
      >
        <span style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {selectedOption ? selectedOption.label : value}
        </span>
        <ChevronDown 
          size={16} 
          style={{ 
            color: 'var(--text-light)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform var(--transition-speed) ease',
            flexShrink: 0
          }} 
        />
      </div>

      {/* Options Dropdown Card */}
      {isOpen && (
        <div
          className="neo-card"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            width: '100%',
            maxHeight: '260px',
            overflowY: 'auto',
            zIndex: 100,
            padding: '8px',
            boxShadow: 'var(--shadow-outset)',
            borderRadius: 'var(--border-radius-sm)',
            background: 'var(--bg-color)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxSizing: 'border-box'
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: isSelected ? '700' : '500',
                  color: isSelected ? 'var(--accent-color)' : 'var(--text-color)',
                  background: isSelected ? 'rgba(74, 116, 255, 0.1)' : 'transparent',
                  boxShadow: isSelected ? 'var(--shadow-inset-sm)' : 'none',
                  transition: 'all var(--transition-speed) ease',
                  marginBottom: '4px',
                  userSelect: 'none'
                }}
                className="neo-select-option"
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
