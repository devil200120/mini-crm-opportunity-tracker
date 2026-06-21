import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus, Eye, EyeOff } from 'lucide-react';

const Register = ({ onSwitchToLogin, addToast }) => {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);

    if (result.success) {
      addToast('Account created successfully! Welcome to the CRM.', 'success');
    } else {
      addToast(result.error, 'error');
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '20px'
    }}>
      <div className="neo-card auth-card">
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '8px' }}>
            Get Started
          </h2>
          <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
            Create an account to join the shared pipeline
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="neo-label" htmlFor="register-name">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-light)'
              }} />
              <input
                id="register-name"
                type="text"
                className="neo-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ paddingLeft: '48px' }}
              />
            </div>
            {errors.name && (
              <span style={{ fontSize: '12px', color: 'var(--color-danger)', marginTop: '4px', display: 'block', paddingLeft: '4px' }}>
                {errors.name}
              </span>
            )}
          </div>

          <div>
            <label className="neo-label" htmlFor="register-email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-light)'
              }} />
              <input
                id="register-email"
                type="email"
                className="neo-input"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '48px' }}
              />
            </div>
            {errors.email && (
              <span style={{ fontSize: '12px', color: 'var(--color-danger)', marginTop: '4px', display: 'block', paddingLeft: '4px' }}>
                {errors.email}
              </span>
            )}
          </div>

          <div>
            <label className="neo-label" htmlFor="register-password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-light)'
              }} />
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                className="neo-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '48px', paddingRight: '48px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: 'var(--text-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span style={{ fontSize: '12px', color: 'var(--color-danger)', marginTop: '4px', display: 'block', paddingLeft: '4px' }}>
                {errors.password}
              </span>
            )}
          </div>

          <div>
            <label className="neo-label" htmlFor="register-confirm-password">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-light)'
              }} />
              <input
                id="register-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                className="neo-input"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ paddingLeft: '48px', paddingRight: '48px' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: 'var(--text-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span style={{ fontSize: '12px', color: 'var(--color-danger)', marginTop: '4px', display: 'block', paddingLeft: '4px' }}>
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="neo-btn neo-btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '12px', padding: '14px' }}
          >
            {loading ? (
              <div style={{
                width: '20px',
                height: '20px',
                border: '3px solid rgba(255,255,255,0.3)',
                borderTop: '3px solid #fff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            ) : (
              <>
                <UserPlus size={18} /> Create Account
              </>
            )}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(124, 142, 171, 0.15)'
        }}>
          <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="neo-btn"
              style={{
                background: 'none',
                boxShadow: 'none',
                padding: 0,
                color: 'var(--accent-color)',
                fontSize: '14px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Sign In instead
            </button>
          </p>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Register;
