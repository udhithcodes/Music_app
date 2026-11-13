import { useState, useEffect } from 'react';
import { useMusicData } from '../context/MusicDataContext';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import {
  Users,
  Music,
  AlertTriangle,
  CheckCircle,
  Activity,
  Trash2,
  RefreshCw,
  Server,
  Check,
  Radio,
  Shield,
} from 'lucide-react';

export const AdminDashboardView = () => {
  const { songs, albums, flags, resolveFlag, deleteSong } = useMusicData();
  const { backendHealth, checkHealth } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'flags' | 'songs' | 'system'
  const [rootData, setRootData] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(false);

  const fetchSystemData = async () => {
    setLoadingHealth(true);
    try {
      const [, rootRes] = await Promise.all([
        authAPI.getHealth(),
        authAPI.getHome(),
      ]);
      setRootData(rootRes);
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    fetchSystemData();
  }, []);

  // Demo user statistics
  const totalStreams = songs.reduce((sum, s) => sum + (s.plays || 0), 0);
  const totalRatings = songs.reduce((sum, s) => sum + (s.ratingCount || 0), 0);
  const flaggedSongsCount = songs.filter((s) => s.flagged).length;

  return (
    <div className="view-container admin-dashboard-view">
      {/* Header */}
      <div className="view-header-row">
        <div>
          <div className="flex-title-row">
            <h1 className="view-title">Admin Dashboard</h1>
            <span className="admin-role-tag">SYSTEM ADMINISTRATOR</span>
          </div>
          <p className="view-subtitle">
            Platform governance, metrics, flagged content moderation queue, and system infrastructure.
          </p>
        </div>

        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            checkHealth();
            fetchSystemData();
          }}
          disabled={loadingHealth}
        >
          <RefreshCw size={16} className={loadingHealth ? 'spin' : ''} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrap emerald">
            <Users size={24} />
          </div>
          <div className="kpi-meta">
            <span className="kpi-label">Registered Accounts</span>
            <strong className="kpi-value">124</strong>
            <span className="kpi-sub">34 Creators • 1 Admin</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap blue">
            <Music size={24} />
          </div>
          <div className="kpi-meta">
            <span className="kpi-label">Total Audio Tracks</span>
            <strong className="kpi-value">{songs.length}</strong>
            <span className="kpi-sub">{albums.length} Albums</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap purple">
            <Radio size={24} />
          </div>
          <div className="kpi-meta">
            <span className="kpi-label">Total Streams Played</span>
            <strong className="kpi-value">{totalStreams.toLocaleString()}</strong>
            <span className="kpi-sub">{totalRatings} user reviews</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap red">
            <AlertTriangle size={24} />
          </div>
          <div className="kpi-meta">
            <span className="kpi-label">Flagged Moderation</span>
            <strong className="kpi-value">{flags.length}</strong>
            <span className="kpi-sub">{flaggedSongsCount} tracks flagged</span>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="admin-tabs-row">
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Moderation Queue ({flags.length})
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'songs' ? 'active' : ''}`}
          onClick={() => setActiveTab('songs')}
        >
          All Content ({songs.length} tracks, {albums.length} albums)
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'system' ? 'active' : ''}`}
          onClick={() => setActiveTab('system')}
        >
          FastAPI & Database Health
        </button>
      </div>

      {/* Moderation Queue Tab */}
      {activeTab === 'overview' && (
        <section className="admin-section">
          <div className="section-header-row">
            <div>
              <h3 className="section-title">Flagged Content Moderation Queue</h3>
              <p className="section-subtitle">
                Reports submitted by listeners. Review flags, dismiss reports, or delete violating tracks.
              </p>
            </div>
          </div>

          {flags.length === 0 ? (
            <div className="moderation-empty-box">
              <CheckCircle size={44} color="#10b981" />
              <h4>Moderation Queue is Clear</h4>
              <p>No songs or albums have active community flags.</p>
            </div>
          ) : (
            <div className="flags-list">
              {flags.map((flag) => {
                const flaggedSong = songs.find((s) => s.id === flag.songId);
                return (
                  <div key={flag.id} className="flag-item-card">
                    <div className="flag-item-header">
                      <div className="flag-type-badge">
                        <AlertTriangle size={15} /> Content Flag
                      </div>
                      <span className="flag-date">{flag.date}</span>
                    </div>

                    <div className="flag-item-content">
                      {flaggedSong ? (
                        <div className="flag-song-preview">
                          <img src={flaggedSong.coverUrl} alt={flaggedSong.name} />
                          <div>
                            <h4>{flaggedSong.name}</h4>
                            <p>{flaggedSong.artist} • {flaggedSong.albumName}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flag-song-preview">
                          <p>Unknown or removed content (ID: {flag.songId})</p>
                        </div>
                      )}

                      <div className="flag-reason-box">
                        <strong>Reason reported:</strong>
                        <p>{flag.reason}</p>
                        <span className="reported-by-tag">Reported by: @{flag.reportedBy}</span>
                      </div>
                    </div>

                    <div className="flag-actions-row">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => resolveFlag(flag.id, 'dismiss')}
                      >
                        <Check size={16} /> Dismiss Flag (Keep Content)
                      </button>

                      <button
                        type="button"
                        className="btn-danger"
                        onClick={() => {
                          if (confirm('Permanently remove this content from BeatStream?')) {
                            resolveFlag(flag.id, 'remove_content');
                          }
                        }}
                      >
                        <Trash2 size={16} /> Delete Violating Content
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Content Management Tab */}
      {activeTab === 'songs' && (
        <section className="admin-section">
          <div className="section-header-row">
            <div>
              <h3 className="section-title">All Catalog Content</h3>
              <p className="section-subtitle">Manage or remove any song or album on the platform</p>
            </div>
          </div>

          <div className="songs-table-container">
            <table className="songs-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Track Title</th>
                  <th>Artist</th>
                  <th>Album</th>
                  <th>Rating</th>
                  <th>Flagged</th>
                  <th style={{ width: '90px' }}>Remove</th>
                </tr>
              </thead>
              <tbody>
                {songs.map((song) => (
                  <tr key={song.id} className="song-table-row">
                    <td>#{song.id}</td>
                    <td className="row-title-cell">
                      <img src={song.coverUrl} alt={song.name} className="table-row-thumb" />
                      <strong>{song.name}</strong>
                    </td>
                    <td>{song.artist}</td>
                    <td>{song.albumName}</td>
                    <td>★ {song.rating.toFixed(1)}</td>
                    <td>
                      {song.flagged ? (
                        <span className="status-flag-pill">Flagged</span>
                      ) : (
                        <span className="status-ok-pill">Clean</span>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="row-action-icon text-red"
                        title="Delete track"
                        onClick={() => {
                          if (confirm(`Admin action: Delete track "${song.name}"?`)) {
                            deleteSong(song.id);
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* System Health Tab */}
      {activeTab === 'system' && (
        <section className="admin-section">
          <div className="section-header-row">
            <div>
              <h3 className="section-title">API Server & Infrastructure Health</h3>
              <p className="section-subtitle">Real-time status of backend services and database connection</p>
            </div>
          </div>

          <div className="system-health-grid">
            <div className="health-card">
              <div className="health-card-header">
                <Server size={22} color="#38bdf8" />
                <h4>FastAPI Service</h4>
                <span className={`status-badge ${backendHealth}`}>{backendHealth.toUpperCase()}</span>
              </div>
              <ul className="health-specs">
                <li>Host: <code>http://localhost:8000</code></li>
                <li>Health Endpoint: <code>/health</code></li>
                <li>Status: <strong>{backendHealth === 'online' ? 'healthy' : 'offline'}</strong></li>
                <li>App Title: <strong>{rootData?.message || 'Music Streaming API'}</strong></li>
              </ul>
            </div>

            <div className="health-card">
              <div className="health-card-header">
                <Shield size={22} color="#10b981" />
                <h4>JWT Security & RBAC</h4>
                <span className="status-badge online">ACTIVE</span>
              </div>
              <ul className="health-specs">
                <li>Algorithm: <code>HS256</code></li>
                <li>Token Scheme: <code>Bearer</code></li>
                <li>Protected Routes: <code>/api/v1/auth/me</code></li>
                <li>Roles Supported: <code>ADMIN, CREATOR, USER</code></li>
              </ul>
            </div>

            <div className="health-card">
              <div className="health-card-header">
                <Activity size={22} color="#a855f7" />
                <h4>Database Engine</h4>
                <span className="status-badge online">CONNECTED</span>
              </div>
              <ul className="health-specs">
                <li>Engine: <code>PostgreSQL / Supabase AWS pooler</code></li>
                <li>ORM: <code>SQLAlchemy 2.0 mapped_column</code></li>
                <li>Users Table: <code>users</code></li>
                <li>Session Pooling: <code>Active</code></li>
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
