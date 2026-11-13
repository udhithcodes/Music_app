import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  Activity,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Shield,
  Palette,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const Navbar = ({ currentView, setCurrentView, searchQuery, setSearchQuery }) => {
  const { user, isAuthenticated, role, logout, openAuthModal, backendHealth, checkHealth } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [healthTooltip, setHealthTooltip] = useState(false);

  const getRoleBadge = (userRole) => {
    switch (userRole) {
      case 'ADMIN':
        return { label: 'Admin', className: 'badge-admin', icon: <Shield size={12} /> };
      case 'CREATOR':
        return { label: 'Creator', className: 'badge-creator', icon: <Palette size={12} /> };
      default:
        return { label: 'Listener', className: 'badge-user', icon: <User size={12} /> };
    }
  };

  const badge = getRoleBadge(role);

  return (
    <header className="app-navbar">
      {/* Search Bar */}
      <div className="navbar-search">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search songs, artists, albums, or lyrics..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (currentView !== 'search' && e.target.value.trim().length > 0) {
              setCurrentView('search');
            }
          }}
          onFocus={() => {
            if (currentView !== 'search' && searchQuery.trim().length > 0) {
              setCurrentView('search');
            }
          }}
        />
        {searchQuery && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => setSearchQuery('')}
          >
            ×
          </button>
        )}
      </div>

      {/* Right controls: Backend health, auth buttons */}
      <div className="navbar-actions">
        {/* Backend health status badge */}
        <div
          className="backend-health-pill"
          onClick={() => {
            checkHealth();
            setHealthTooltip((v) => !v);
          }}
          title="Click to check FastAPI status"
        >
          <span className={`status-dot ${backendHealth}`}></span>
          <span className="status-text">
            {backendHealth === 'online' ? 'FastAPI Online' : backendHealth === 'checking' ? 'Connecting...' : 'API Offline'}
          </span>
          <Activity size={14} className="activity-icon" />

          {healthTooltip && (
            <div className="health-popover">
              <div className="popover-row">
                {backendHealth === 'online' ? (
                  <CheckCircle2 size={16} color="#10b981" />
                ) : (
                  <AlertCircle size={16} color="#ef4444" />
                )}
                <strong>FastAPI Service: {backendHealth.toUpperCase()}</strong>
              </div>
              <p>Endpoints: <code>/api/v1/auth/*</code>, <code>/health</code></p>
              <button
                type="button"
                className="recheck-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  checkHealth();
                }}
              >
                Re-check Health
              </button>
            </div>
          )}
        </div>

        {/* User Auth state */}
        {isAuthenticated && user ? (
          <div className="user-profile-menu-container">
            <button
              type="button"
              className="user-profile-btn"
              onClick={() => setShowUserMenu((v) => !v)}
            >
              <div className="user-avatar-circle">
                {user.username.slice(0, 2).toUpperCase()}
              </div>
              <div className="user-meta-text">
                <span className="user-name">{user.username}</span>
                <span className={`role-pill-badge ${badge.className}`}>
                  {badge.icon} {badge.label}
                </span>
              </div>
            </button>

            {showUserMenu && (
              <div className="user-dropdown-menu" onClick={() => setShowUserMenu(false)}>
                <div className="dropdown-user-header">
                  <p className="email-display">{user.email}</p>
                  <span className={`role-pill-badge ${badge.className}`}>
                    {badge.icon} {user.role} Account
                  </span>
                </div>
                <hr className="menu-divider" />
                <button
                  type="button"
                  className="menu-item-btn"
                  onClick={() => setCurrentView('profile')}
                >
                  <User size={16} /> My Profile & Info
                </button>
                {role === 'CREATOR' || role === 'ADMIN' ? (
                  <button
                    type="button"
                    className="menu-item-btn"
                    onClick={() => setCurrentView('creator')}
                  >
                    <Palette size={16} /> Creator Studio
                  </button>
                ) : null}
                {role === 'ADMIN' && (
                  <button
                    type="button"
                    className="menu-item-btn"
                    onClick={() => setCurrentView('admin')}
                  >
                    <Shield size={16} /> Admin Dashboard
                  </button>
                )}
                <hr className="menu-divider" />
                <button
                  type="button"
                  className="menu-item-btn logout-btn"
                  onClick={logout}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-buttons-group">
            <button
              type="button"
              className="btn-signin"
              onClick={() => openAuthModal('login')}
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              className="btn-signup"
              onClick={() => openAuthModal('register')}
            >
              <UserPlus size={16} />
              <span>Register</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

