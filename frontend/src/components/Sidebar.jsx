import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FilePlus, History, FileText, LogOut, Sun, Moon, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onClose) onClose();
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className={`sidebar glass-panel ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>TransBilling</h2>
        <button className="sidebar-close" onClick={onClose}>
          <X size={24} />
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={handleNavClick} end>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/create-bill" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={handleNavClick}>
          <FilePlus size={20} />
          <span>Create Bill</span>
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={handleNavClick}>
          <History size={20} />
          <span>Bill History</span>
        </NavLink>
        <NavLink to="/statements" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={handleNavClick}>
          <FileText size={20} />
          <span>Statements</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
