import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Sun, Moon, LogOut, Briefcase, User as UserIcon } from 'lucide-react';

const Navbar = ({ addToast }) => {
  const { user, logout } = useContext(AuthContext);
  const [theme, setTheme] = useState(localStorage.getItem('crm_theme') || 'light');
  const [visible, setVisible] = useState(true);
  const [isHoveredTop, setIsHoveredTop] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('crm_theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Navbar is only naturally visible at the very top of the page
      if (currentScrollY < 50) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    const handleMouseMove = (e) => {
      // To activate, cursor must touch the very top edge (25px) of the viewport.
      // Once visible, it remains open as long as cursor is within the navbar (100px).
      setIsHoveredTop((prevHovered) => {
        const threshold = prevHovered ? 100 : 25;
        return e.clientY < threshold;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    addToast(`Switched to ${theme === 'light' ? 'Dark' : 'Light'} theme`, 'success');
  };

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'success');
  };

  const showNavbar = visible || isHoveredTop;

  return (
    <nav className={`neo-navbar ${showNavbar ? '' : 'navbar-hidden'}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-outset-sm)',
          background: 'var(--bg-color)'
        }}>
          <Briefcase size={22} style={{ color: 'var(--accent-color)' }} />
        </div>
        <span style={{
          fontSize: '20px',
          fontWeight: '800',
          letterSpacing: '-0.5px',
          background: 'linear-gradient(135deg, var(--accent-color), var(--accent-light))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          MiniCRM
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="neo-btn neo-btn-icon"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} style={{ color: '#f1c40f' }} />}
        </button>

        {user && (
          <>
            <div className="user-badge hide-mobile">
              <UserIcon size={14} style={{ color: 'var(--accent-color)' }} />
              <span style={{
                maxWidth: '120px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {user.name}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="neo-btn neo-btn-danger"
              style={{
                fontSize: '14px'
              }}
            >
              <LogOut size={16} />
              <span className="hide-mobile">Log Out</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
