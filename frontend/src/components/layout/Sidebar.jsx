import { useAuth } from '../../context/AuthContext';
import { useMusicData } from '../../context/MusicDataContext';
import { usePlayer } from '../../context/PlayerContext';
import {
  Home,
  Compass,
  Library,
  Heart,
  Mic2,
  Palette,
  Shield,
  Plus,
  Music2,
  Sparkles,
} from 'lucide-react';

export const Sidebar = ({ currentView, setCurrentView }) => {
  const { role, isAuthenticated, openAuthModal } = useAuth();
  const { playlists, createPlaylist } = useMusicData();
  const { toggleLyrics } = usePlayer();

  const handleCreateNewPlaylist = () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    const name = prompt('Enter a name for your new playlist:', 'My Awesome Mix');
    if (name && name.trim()) {
      createPlaylist(name.trim());
      setCurrentView('playlists');
    }
  };

  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand" onClick={() => setCurrentView('home')}>
        <div className="brand-logo-icon">
          <Music2 size={24} color="#ffffff" />
        </div>
        <div className="brand-text">
          <span className="brand-name">BeatStream</span>
          <span className="brand-sub">Music V2</span>
        </div>
      </div>

      {/* Main Nav Section */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">Menu</div>

        <button
          type="button"
          className={`nav-item-btn ${currentView === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentView('home')}
        >
          <Home size={19} />
          <span>Home</span>
        </button>

        <button
          type="button"
          className={`nav-item-btn ${currentView === 'search' ? 'active' : ''}`}
          onClick={() => setCurrentView('search')}
        >
          <Compass size={19} />
          <span>Search & Explore</span>
        </button>

        <button
          type="button"
          className={`nav-item-btn ${currentView === 'playlists' ? 'active' : ''}`}
          onClick={() => setCurrentView('playlists')}
        >
          <Library size={19} />
          <span>My Library</span>
        </button>

        <button
          type="button"
          className={`nav-item-btn ${currentView === 'favorites' ? 'active' : ''}`}
          onClick={() => setCurrentView('favorites')}
        >
          <Heart size={19} />
          <span>Favorites</span>
        </button>

        <button
          type="button"
          className="nav-item-btn"
          onClick={toggleLyrics}
        >
          <Mic2 size={19} />
          <span>Lyrics Drawer</span>
        </button>

        {/* Creator Studio Link */}
        {(role === 'CREATOR' || role === 'ADMIN') && (
          <>
            <div className="nav-section-title">Creator Hub</div>
            <button
              type="button"
              className={`nav-item-btn creator-highlight ${currentView === 'creator' ? 'active' : ''}`}
              onClick={() => setCurrentView('creator')}
            >
              <Palette size={19} />
              <span>Creator Studio</span>
              <span className="nav-badge creator">Studio</span>
            </button>
          </>
        )}

        {/* Admin Link */}
        {role === 'ADMIN' && (
          <>
            <div className="nav-section-title">Administration</div>
            <button
              type="button"
              className={`nav-item-btn admin-highlight ${currentView === 'admin' ? 'active' : ''}`}
              onClick={() => setCurrentView('admin')}
            >
              <Shield size={19} />
              <span>Admin Dashboard</span>
              <span className="nav-badge admin">Admin</span>
            </button>
          </>
        )}
      </nav>

      {/* Playlists Quick List */}
      <div className="sidebar-playlists-section">
        <div className="playlists-header-row">
          <span className="nav-section-title">Playlists</span>
          <button
            type="button"
            className="sidebar-add-btn"
            onClick={handleCreateNewPlaylist}
            title="Create Playlist"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="sidebar-playlists-scroll">
          {playlists.map((playlist) => (
            <button
              key={playlist.id}
              type="button"
              className="sidebar-playlist-item"
              onClick={() => setCurrentView('playlists')}
            >
              <span className="playlist-dot"></span>
              <span className="playlist-name-truncate">{playlist.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom status/upsell card */}
      {!isAuthenticated ? (
        <div className="sidebar-cta-card">
          <div className="cta-header">
            <Sparkles size={16} color="#38bdf8" />
            <span>Join BeatStream</span>
          </div>
          <p>Sign in to save your playlists, rate tracks, and unlock creator uploads.</p>
          <button
            type="button"
            className="cta-button"
            onClick={() => openAuthModal('register')}
          >
            Create Free Account
          </button>
        </div>
      ) : null}
    </aside>
  );
};

