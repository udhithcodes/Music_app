import { useState } from 'react';
import { useMusicData } from '../context/MusicDataContext';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import {
  Plus,
  Edit3,
  Trash2,
  Music,
  Disc,
  Play,
  Pause,
  Star,
  TrendingUp,
  X,
  Languages,
} from 'lucide-react';

export const CreatorStudioView = () => {
  const { user } = useAuth();
  const { songs, albums, addSong, editSong, deleteSong, addAlbum, deleteAlbum } = useMusicData();
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();

  // Modals
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [showAddAlbumModal, setShowAddAlbumModal] = useState(false);
  const [editingSong, setEditingSong] = useState(null);

  // Form states for new song
  const [songName, setSongName] = useState('');
  const [songArtist, setSongArtist] = useState(user?.username || 'Creator Artist');
  const [songAlbumId, setSongAlbumId] = useState('');
  const [songGenre, setSongGenre] = useState('Synthwave');
  const [songDuration, setSongDuration] = useState('180');
  const [songLyrics, setSongLyrics] = useState('');
  const [songCoverUrl, setSongCoverUrl] = useState('');
  const [songAudioUrl, setSongAudioUrl] = useState('');

  // Form states for new album
  const [albumName, setAlbumName] = useState('');
  const [albumArtist, setAlbumArtist] = useState(user?.username || 'Creator Artist');
  const [albumGenre, setAlbumGenre] = useState('Synthwave');
  const [albumCoverUrl, setAlbumCoverUrl] = useState('');
  const [albumDesc, setAlbumDesc] = useState('');

  // Creator stats
  const totalPlays = songs.reduce((sum, s) => sum + (s.plays || 0), 0);
  const avgRating =
    songs.length > 0
      ? (songs.reduce((sum, s) => sum + s.rating, 0) / songs.length).toFixed(1)
      : '0.0';

  const handleCreateSong = (e) => {
    e.preventDefault();
    if (!songName.trim()) return;

    const chosenAlbum = albums.find((a) => a.id === Number(songAlbumId));

    addSong({
      name: songName.trim(),
      artist: songArtist.trim() || user?.username || 'Artist',
      albumId: songAlbumId ? Number(songAlbumId) : null,
      albumName: chosenAlbum ? chosenAlbum.name : 'Singles',
      genre: songGenre,
      duration: Number(songDuration) || 180,
      lyrics: songLyrics || 'Instrumental / No lyrics provided.',
      coverUrl: songCoverUrl.trim() || undefined,
      audioUrl: songAudioUrl.trim() || undefined,
    });

    // Reset
    setSongName('');
    setSongLyrics('');
    setSongCoverUrl('');
    setSongAudioUrl('');
    setShowAddSongModal(false);
  };

  const handleSaveEditSong = (e) => {
    e.preventDefault();
    if (!editingSong || !editingSong.name.trim()) return;

    const chosenAlbum = albums.find((a) => a.id === Number(editingSong.albumId));

    editSong(editingSong.id, {
      name: editingSong.name.trim(),
      artist: editingSong.artist.trim(),
      albumId: editingSong.albumId ? Number(editingSong.albumId) : null,
      albumName: chosenAlbum ? chosenAlbum.name : editingSong.albumName,
      genre: editingSong.genre,
      duration: Number(editingSong.duration) || 180,
      lyrics: editingSong.lyrics,
      coverUrl: editingSong.coverUrl,
      audioUrl: editingSong.audioUrl,
    });

    setEditingSong(null);
  };

  const handleCreateAlbum = (e) => {
    e.preventDefault();
    if (!albumName.trim()) return;

    addAlbum({
      name: albumName.trim(),
      artist: albumArtist.trim() || user?.username || 'Artist',
      genre: albumGenre,
      coverUrl: albumCoverUrl.trim() || undefined,
      description: albumDesc.trim(),
      releaseYear: new Date().getFullYear(),
    });

    setAlbumName('');
    setAlbumCoverUrl('');
    setAlbumDesc('');
    setShowAddAlbumModal(false);
  };

  return (
    <div className="view-container creator-studio-view">
      {/* Studio Header */}
      <div className="view-header-row">
        <div>
          <div className="flex-title-row">
            <h1 className="view-title">Creator Studio</h1>
            <span className="creator-role-tag">CREATOR HUB</span>
          </div>
          <p className="view-subtitle">
            Upload songs, manage albums, edit lyrics in multiple languages, and review track engagement.
          </p>
        </div>

        <div className="studio-top-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setShowAddAlbumModal(true)}
          >
            <Disc size={18} /> New Album
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setShowAddSongModal(true)}
          >
            <Plus size={18} /> Upload Track
          </button>
        </div>
      </div>

      {/* Analytics KPI cards */}
      <div className="stats-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrap purple">
            <Music size={24} />
          </div>
          <div className="kpi-meta">
            <span className="kpi-label">Uploaded Tracks</span>
            <strong className="kpi-value">{songs.length}</strong>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap blue">
            <TrendingUp size={24} />
          </div>
          <div className="kpi-meta">
            <span className="kpi-label">Total Stream Plays</span>
            <strong className="kpi-value">{totalPlays.toLocaleString()}</strong>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap amber">
            <Star size={24} />
          </div>
          <div className="kpi-meta">
            <span className="kpi-label">Average Rating</span>
            <strong className="kpi-value">★ {avgRating}</strong>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap emerald">
            <Disc size={24} />
          </div>
          <div className="kpi-meta">
            <span className="kpi-label">Active Albums</span>
            <strong className="kpi-value">{albums.length}</strong>
          </div>
        </div>
      </div>

      {/* Song Management Section */}
      <section className="studio-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Track Catalog & Management</h2>
            <p className="section-subtitle">Edit song attributes, lyrics, and album assignments</p>
          </div>
        </div>

        <div className="songs-table-container">
          <table className="songs-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>Play</th>
                <th>Track</th>
                <th>Album</th>
                <th>Genre</th>
                <th>Rating</th>
                <th>Plays</th>
                <th style={{ width: '110px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song) => {
                const isThisPlaying = currentSong?.id === song.id && isPlaying;
                return (
                  <tr key={song.id} className="song-table-row">
                    <td>
                      <button
                        type="button"
                        className="row-play-btn inline-btn"
                        onClick={() => {
                          if (currentSong?.id === song.id) {
                            togglePlay();
                          } else {
                            playSong(song, songs);
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
                    <td className="row-genre-cell">
                      <span className="meta-pill">{song.genre}</span>
                    </td>
                    <td className="row-rating-cell">★ {song.rating.toFixed(1)}</td>
                    <td>{song.plays?.toLocaleString() || 0}</td>

                    <td className="row-actions-cell">
                      <button
                        type="button"
                        className="row-action-icon"
                        title="Edit Song & Lyrics"
                        onClick={() => setEditingSong({ ...song })}
                      >
                        <Edit3 size={16} />
                      </button>

                      <button
                        type="button"
                        className="row-action-icon text-red"
                        title="Remove Song"
                        onClick={() => {
                          if (confirm(`Remove song "${song.name}"?`)) {
                            deleteSong(song.id);
                          }
                        }}
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
      </section>

      {/* Albums Management Section */}
      <section className="studio-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Albums & Discography</h2>
            <p className="section-subtitle">Create and organize album collections</p>
          </div>
        </div>

        <div className="albums-grid">
          {albums.map((album) => {
            const albumSongs = songs.filter((s) => s.albumId === album.id);
            return (
              <div key={album.id} className="album-card studio-album-card">
                <div className="album-cover-wrap">
                  <img src={album.coverUrl} alt={album.name} />
                  <button
                    type="button"
                    className="album-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete album "${album.name}"?`)) {
                        deleteAlbum(album.id);
                      }
                    }}
                    title="Delete Album"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="album-info">
                  <h4 className="album-name">{album.name}</h4>
                  <p className="album-artist">{album.artist} • {album.genre}</p>
                  <span className="album-track-count">{albumSongs.length} Tracks Assigned</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Upload Track Modal */}
      {showAddSongModal && (
        <div className="modal-overlay" onClick={() => setShowAddSongModal(false)}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setShowAddSongModal(false)}
            >
              <X size={18} />
            </button>
            <div className="modal-header">
              <Plus size={20} color="#38bdf8" />
              <h3>Upload & Add New Song</h3>
            </div>
            <form onSubmit={handleCreateSong} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Song Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Neon Horizon"
                    value={songName}
                    onChange={(e) => setSongName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Artist Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Artist name"
                    value={songArtist}
                    onChange={(e) => setSongArtist(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Assign to Album</label>
                  <select
                    value={songAlbumId}
                    onChange={(e) => setSongAlbumId(e.target.value)}
                    className="select-input"
                  >
                    <option value="">No Album (Single)</option>
                    {albums.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Genre</label>
                  <select
                    value={songGenre}
                    onChange={(e) => setSongGenre(e.target.value)}
                    className="select-input"
                  >
                    <option value="Synthwave">Synthwave</option>
                    <option value="Lo-Fi">Lo-Fi</option>
                    <option value="Electronic">Electronic</option>
                    <option value="World Fusion">World Fusion</option>
                    <option value="Pop">Pop</option>
                    <option value="Rock">Rock</option>
                    <option value="Jazz">Jazz</option>
                    <option value="Acoustic">Acoustic</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Duration (Seconds)</label>
                  <input
                    type="number"
                    min="10"
                    max="1800"
                    value={songDuration}
                    onChange={(e) => setSongDuration(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="label-with-badge">
                  <label>Lyrics (Multi-Language UTF-8 Supported)</label>
                  <span className="lang-pill">
                    <Languages size={13} /> English, Español, हिन्दी, 日本語, etc.
                  </span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Paste or write lyrics with timestamps [00:15] or plain text..."
                  value={songLyrics}
                  onChange={(e) => setSongLyrics(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Cover Artwork URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={songCoverUrl}
                    onChange={(e) => setSongCoverUrl(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>MP3 Audio Stream URL</label>
                  <input
                    type="url"
                    placeholder="https://...mp3 (or leave empty for audio synth)"
                    value={songAudioUrl}
                    onChange={(e) => setSongAudioUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddSongModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Publish Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Track Modal */}
      {editingSong && (
        <div className="modal-overlay" onClick={() => setEditingSong(null)}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setEditingSong(null)}
            >
              <X size={18} />
            </button>
            <div className="modal-header">
              <Edit3 size={20} color="#a855f7" />
              <h3>Edit Song & Lyrics: {editingSong.name}</h3>
            </div>
            <form onSubmit={handleSaveEditSong} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Song Title</label>
                  <input
                    type="text"
                    required
                    value={editingSong.name}
                    onChange={(e) => setEditingSong({ ...editingSong, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Artist</label>
                  <input
                    type="text"
                    required
                    value={editingSong.artist}
                    onChange={(e) => setEditingSong({ ...editingSong, artist: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Album Assignment</label>
                  <select
                    value={editingSong.albumId || ''}
                    onChange={(e) => setEditingSong({ ...editingSong, albumId: e.target.value })}
                    className="select-input"
                  >
                    <option value="">No Album (Single)</option>
                    {albums.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Genre</label>
                  <input
                    type="text"
                    value={editingSong.genre}
                    onChange={(e) => setEditingSong({ ...editingSong, genre: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Duration (secs)</label>
                  <input
                    type="number"
                    value={editingSong.duration}
                    onChange={(e) => setEditingSong({ ...editingSong, duration: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="label-with-badge">
                  <label>Lyrics (UTF-8 Multi-language supported)</label>
                  <span className="lang-pill"><Languages size={13} /> UTF-8</span>
                </div>
                <textarea
                  rows={6}
                  value={editingSong.lyrics || ''}
                  onChange={(e) => setEditingSong({ ...editingSong, lyrics: e.target.value })}
                />
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setEditingSong(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Album Modal */}
      {showAddAlbumModal && (
        <div className="modal-overlay" onClick={() => setShowAddAlbumModal(false)}>
          <div className="modal-content medium-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setShowAddAlbumModal(false)}
            >
              <X size={18} />
            </button>
            <div className="modal-header">
              <Disc size={20} color="#a855f7" />
              <h3>Create New Album</h3>
            </div>
            <form onSubmit={handleCreateAlbum} className="modal-form">
              <div className="form-group">
                <label>Album Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Neon Horizons Vol. 1"
                  value={albumName}
                  onChange={(e) => setAlbumName(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Artist Name</label>
                  <input
                    type="text"
                    value={albumArtist}
                    onChange={(e) => setAlbumArtist(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Genre</label>
                  <input
                    type="text"
                    value={albumGenre}
                    onChange={(e) => setAlbumGenre(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Cover Artwork URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={albumCoverUrl}
                  onChange={(e) => setAlbumCoverUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Album Description</label>
                <textarea
                  rows={2}
                  placeholder="Theme or background story..."
                  value={albumDesc}
                  onChange={(e) => setAlbumDesc(e.target.value)}
                />
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddAlbumModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
