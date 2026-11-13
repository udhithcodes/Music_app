import { useAuth } from '../context/AuthContext';
import { useMusicData } from '../context/MusicDataContext';
import {
  User,
  Mail,
  Shield,
  Palette,
  CheckCircle,
  LogOut,
  Sparkles,
  ListMusic,
  Star,
  RefreshCw,
} from 'lucide-react';
import { useState } from 'react';

export const ProfileView = () => {
  const { user, role, logout, refreshProfile, openAuthModal } = useAuth();
  const { playlists, favorites } = useMusicData();
  const [refreshing, setRefreshing] = useState(false);

  if (!user) {
    return (
      <div className="view-container profile-view">
        <div className="empty-results-box">
          <User size={48} color="#6b7280" />
          <h2>You are not signed in</h2>
          <p>Sign in to view your profile and manage account details.</p>
          <button
            type="button"
            className="btn-primary mt-4"
            onClick={() => openAuthModal('login')}
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshProfile();
    setRefreshing(false);
  };

  const rolePill = () => {
    switch (user.role) {
      case 'ADMIN':
        return {
          title: 'System Administrator',
          color: '#10b981',
          icon: <Shield size={16} />,
          desc: 'Full administrative access, moderation tools, and system analytics.',
        };
      case 'CREATOR':
        return {
          title: 'Music Creator',
          color: '#a855f7',
          icon: <Palette size={16} />,
          desc: 'Access to Creator Studio, song & album publishing, and engagement metrics.',
        };
      default:
        return {
          title: 'Standard Listener',
          color: '#38bdf8',
          icon: <User size={16} />,
          desc: 'Stream music, create playlists, rate tracks, and read multi-language lyrics.',
        };
    }
  };

  const pillInfo = rolePill();

  return (
    <div className="view-container profile-view">
      <div className="profile-hero-card">
        <div className="profile-avatar-big">
          {user.username.slice(0, 2).toUpperCase()}
        </div>

        <div className="profile-hero-meta">
          <div className="profile-role-badge" style={{ borderColor: pillInfo.color, color: pillInfo.color }}>
            {pillInfo.icon}
            <span>{pillInfo.title}</span>
          </div>
          <h1 className="profile-username">{user.username}</h1>
          <p className="profile-email">
            <Mail size={15} /> {user.email}
          </p>
          <div className="profile-status-tag">
            <CheckCircle size={14} color="#10b981" />
            <span>Account Active (ID: #{user.id})</span>
          </div>
        </div>

        <div className="profile-hero-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Fetch latest from /api/v1/auth/me"
          >
            <RefreshCw size={16} className={refreshing ? 'spin' : ''} />
            <span>Sync Profile</span>
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={logout}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* User metrics / stats */}
      <div className="stats-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrap blue">
            <ListMusic size={24} />
          </div>
          <div className="kpi-meta">
            <span className="kpi-label">Playlists Created</span>
            <strong className="kpi-value">{playlists.length}</strong>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap red">
            <Sparkles size={24} />
          </div>
          <div className="kpi-meta">
            <span className="kpi-label">Favorite Tracks</span>
            <strong className="kpi-value">{favorites.length}</strong>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap amber">
            <Star size={24} />
          </div>
          <div className="kpi-meta">
            <span className="kpi-label">Account Role</span>
            <strong className="kpi-value">{user.role}</strong>
          </div>
        </div>
      </div>

      {/* Permissions Breakdown */}
      <div className="profile-details-section">
        <h3>Role Privileges & Permissions</h3>
        <p className="section-subtitle">{pillInfo.desc}</p>

        <div className="permissions-grid">
          <div className="perm-item">
            <CheckCircle size={18} color="#10b981" />
            <div>
              <strong>High-Fidelity Audio Streaming</strong>
              <p>Listen to all tracks with scrub controls, lyrics, and playlists.</p>
            </div>
          </div>

          <div className="perm-item">
            <CheckCircle size={18} color="#10b981" />
            <div>
              <strong>Ratings & Feedback</strong>
              <p>Rate tracks 1-5 stars and submit reports for inappropriate content.</p>
            </div>
          </div>

          <div className={`perm-item ${role === 'CREATOR' || role === 'ADMIN' ? '' : 'disabled'}`}>
            <CheckCircle size={18} color={role === 'CREATOR' || role === 'ADMIN' ? '#10b981' : '#6b7280'} />
            <div>
              <strong>Creator Studio Publishing</strong>
              <p>Upload new tracks, edit lyrics (multi-language UTF-8), and manage albums.</p>
            </div>
          </div>

          <div className={`perm-item ${role === 'ADMIN' ? '' : 'disabled'}`}>
            <CheckCircle size={18} color={role === 'ADMIN' ? '#10b981' : '#6b7280'} />
            <div>
              <strong>Administrator Governance</strong>
              <p>Content moderation queue, delete infringing items, and monitor backend health.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
