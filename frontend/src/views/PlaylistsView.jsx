import { useState } from 'react';
import { useMusicData } from '../context/MusicDataContext';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  Play,
  Pause,
  Trash2,
  Music2,
  Clock,
  Sparkles,
  ListMusic,
  ArrowLeft,
  X,
} from 'lucide-react';

export const PlaylistsView = () => {
  const { playlists, songs, createPlaylist, deletePlaylist, removeSongFromPlaylist } = useMusicData();
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();
  const { isAuthenticated, openAuthModal } = useAuth();

  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  const selectedPlaylist = playlists.find((p) => p.id === selectedPlaylistId);
  const playlistSongs = selectedPlaylist
    ? selectedPlaylist.songIds
        .map((sId) => songs.find((s) => s.id === sId))
        .filter(Boolean)
    : [];

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const created = createPlaylist(
      name.trim(),
      description.trim(),
      coverUrl.trim()
    );
    setName('');
    setDescription('');
    setCoverUrl('');
    setShowCreateModal(false);
    setSelectedPlaylistId(created.id);
  };

  const formatTime = (secs) => {
    if (!secs) return '3:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const totalDurationSecs = playlistSongs.reduce((acc, s) => acc + (s.duration || 180), 0);
  const totalMins = Math.round(totalDurationSecs / 60);

  return (
    <div className="view-container playlists-view">
      {selectedPlaylist ? (
        /* Playlist Detail Screen */
        <div className="playlist-detail-page">
          <button
            type="button"
            className="back-btn"
            onClick={() => setSelectedPlaylistId(null)}
          >
            <ArrowLeft size={18} /> Back to All Playlists
          </button>

          <div className="playlist-hero-header">
            <img
              src={selectedPlaylist.coverUrl}
              alt={selectedPlaylist.name}
              className="playlist-hero-cover"
            />
            <div className="playlist-hero-info">
              <span className="playlist-tag">PLAYLIST</span>
              <h1 className="playlist-title">{selectedPlaylist.name}</h1>
              {selectedPlaylist.description && (
                <p className="playlist-description">{selectedPlaylist.description}</p>
              )}
              <div className="playlist-stats-row">
                <span>{playlistSongs.length} tracks</span>
                <span>•</span>
                <span>approx. {totalMins} min</span>
              </div>

              <div className="playlist-header-actions">
                <button
                  type="button"
                  className="btn-play-all"
                  disabled={playlistSongs.length === 0}
                  onClick={() => {
                    if (playlistSongs.length > 0) {
                      playSong(playlistSongs[0], playlistSongs);
                    }
                  }}
                >
                  <Play size={18} fill="currentColor" /> Play Playlist
                </button>

                <button
                  type="button"
                  className="btn-delete-playlist"
                  onClick={() => {
                    if (confirm(`Delete playlist "${selectedPlaylist.name}"?`)) {
                      deletePlaylist(selectedPlaylist.id);
                      setSelectedPlaylistId(null);
                    }
                  }}
                  title="Delete Playlist"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>

          {/* Song list table */}
          {playlistSongs.length === 0 ? (
            <div className="empty-playlist-notice">
              <Music2 size={40} color="#6b7280" />
              <h3>This playlist is empty</h3>
              <p>Explore songs or search tracks and use the "Add to Playlist" (+) button to build your queue.</p>
            </div>
          ) : (
            <div className="songs-table-container">
              <table className="songs-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>#</th>
                    <th>Title</th>
                    <th>Album</th>
                    <th><Clock size={16} /></th>
                    <th style={{ width: '80px' }}>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {playlistSongs.map((song, idx) => {
                    const isThisPlaying = currentSong?.id === song.id && isPlaying;
                    return (
                      <tr
                        key={song.id}
                        className={`song-table-row ${currentSong?.id === song.id ? 'active' : ''}`}
                        onClick={() => playSong(song, playlistSongs)}
                      >
                        <td className="row-index">
                          <span className="index-num">{idx + 1}</span>
                          <button
                            type="button"
                            className="row-play-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (currentSong?.id === song.id) {
                                togglePlay();
                              } else {
                                playSong(song, playlistSongs);
                              }
                            }}
                          >
                            {isThisPlaying ? <Pause size={14} /> : <Play size={14} />}
                          </button>
                        </td>

                        <td className="row-title-cell">
                          <img src={song.coverUrl} alt={song.name} className="table-row-thumb" />
                          <div>
                            <div className="song-name-text">{song.name}</div>
                            <div className="song-artist-text">{song.artist}</div>
                          </div>
                        </td>

                        <td className="row-album-cell">{song.albumName}</td>
                        <td className="row-duration-cell">{formatTime(song.duration)}</td>

                        <td className="row-actions-cell" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className="row-action-icon text-red"
                            title="Remove from this playlist"
                            onClick={() => removeSongFromPlaylist(selectedPlaylist.id, song.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Playlists Grid Overview */
        <>
          <div className="view-header-row">
            <div>
              <h1 className="view-title">My Playlists & Library</h1>
              <p className="view-subtitle">Organize your favorite music into custom playlists</p>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                if (!isAuthenticated) {
                  openAuthModal('login');
                } else {
                  setShowCreateModal(true);
                }
              }}
            >
              <Plus size={18} /> New Playlist
            </button>
          </div>

          <div className="playlists-grid">
            {playlists.map((playlist) => {
              const count = playlist.songIds.length;
              return (
                <div
                  key={playlist.id}
                  className="playlist-card"
                  onClick={() => setSelectedPlaylistId(playlist.id)}
                >
                  <div className="playlist-card-cover-wrap">
                    <img src={playlist.coverUrl} alt={playlist.name} />
                    <button
                      type="button"
                      className="card-play-fab"
                      onClick={(e) => {
                        e.stopPropagation();
                        const pSongs = playlist.songIds
                          .map((sId) => songs.find((s) => s.id === sId))
                          .filter(Boolean);
                        if (pSongs.length > 0) {
                          playSong(pSongs[0], pSongs);
                        }
                      }}
                      title="Play Playlist"
                    >
                      <Play size={20} fill="currentColor" />
                    </button>
                  </div>
                  <div className="playlist-card-info">
                    <h3 className="playlist-card-name">{playlist.name}</h3>
                    <p className="playlist-card-desc">{playlist.description || 'Custom listener playlist'}</p>
                    <span className="playlist-card-tracks">
                      <ListMusic size={14} /> {count} {count === 1 ? 'track' : 'tracks'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content medium-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setShowCreateModal(false)}
            >
              <X size={18} />
            </button>
            <div className="modal-header">
              <Sparkles size={20} color="#38bdf8" />
              <h3>Create New Playlist</h3>
            </div>
            <form onSubmit={handleCreate} className="modal-form">
              <div className="form-group">
                <label>Playlist Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep Focus Flow"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Description (optional)</label>
                <textarea
                  rows={2}
                  placeholder="What is this playlist about?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Cover Image URL (optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                />
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Playlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

