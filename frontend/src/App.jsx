import React, { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';

function App() {
  const { user, loading } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState('login'); // login, register
  const [toasts, setToasts] = useState([]);

  // Toast System
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-color)',
        gap: '16px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid var(--shadow-dark)',
          borderTop: '4px solid var(--accent-color)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <h3 style={{ fontWeight: '600', letterSpacing: '-0.3px' }}>Loading MiniCRM...</h3>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="neo-app-container">
      {/* Toast Alert System Overlay */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            onClick={() => removeToast(toast.id)}
          >
            {toast.type === 'success' ? (
              <CheckCircle size={18} />
            ) : (
              <AlertTriangle size={18} />
            )}
            <span style={{ fontSize: '14px', flexGrow: 1 }}>{toast.message}</span>
            <X size={14} style={{ cursor: 'pointer', opacity: 0.7 }} />
          </div>
        ))}
      </div>

      <Navbar addToast={addToast} />

      {user ? (
        <Dashboard addToast={addToast} />
      ) : currentPage === 'login' ? (
        <Login
          onSwitchToRegister={() => setCurrentPage('register')}
          addToast={addToast}
        />
      ) : (
        <Register
          onSwitchToLogin={() => setCurrentPage('login')}
          addToast={addToast}
        />
      )}
    </div>
  );
}

export default App;
