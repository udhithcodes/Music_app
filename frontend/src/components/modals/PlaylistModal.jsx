import { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { useMusicData } from '../../context/MusicDataContext';
import { X, Plus, ListMusic, Check } from 'lucide-react';

export const PlaylistModal = () => {
  const { playlistModalSong, setPlaylistModalSong } = usePlayer();
  const { playlists, createPlaylist, addSongToPlaylist } = useMusicData();

  const [creatingNew, setCreatingNew] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [addedIds, setAddedIds] = useState([]);

  if (!playlistModalSong) return null;

  const handleAdd = (playlistId) => {
    addSongToPlaylist(playlistId, playlistModalSong.id);
    setAddedIds((prev) => [...prev, playlistId]);
    setTimeout(() => {
      setPlaylistModalSong(null);
    }, 900);
  };

  const handleCreateNew = (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    const created = createPlaylist(newPlaylistName.trim());
    addSongToPlaylist(created.id, playlistModalSong.id);
    setAddedIds((prev) => [...prev, created.id]);
    setNewPlaylistName('');
    setCreatingNew(false);
    setTimeout(() => {
      setPlaylistModalSong(null);
    }, 900);
  };

  return (
    <div className="modal-overlay" onClick={() => setPlaylistModalSong(null)}>
      <div className="modal-content medium-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-btn"
          onClick={() => setPlaylistModalSong(null)}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="playlist-modal-header">
          <div className="song-preview-pill">
            <img src={playlistModalSong.coverUrl} alt={playlistModalSong.name} />
            <div>
              <h4>Add to Playlist</h4>
              <p>{playlistModalSong.name} • {playlistModalSong.artist}</p>
            </div>
          </div>
        </div>

        {creatingNew ? (
          <form onSubmit={handleCreateNew} className="new-playlist-mini-form">
            <div className="form-group">
              <label>Playlist Name</label>
              <input
                type="text"
                autoFocus
                required
                placeholder="e.g. Chill Synth Hits"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
              />
            </div>
            <div className="modal-actions-row">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setCreatingNew(false)}
              >
                Back
              </button>
              <button type="submit" className="btn-primary">
                Create & Add Song
              </button>
            </div>
          </form>
        ) : (
          <div className="playlists-picker-list">
            <button
              type="button"
              className="create-playlist-row-btn"
              onClick={() => setCreatingNew(true)}
            >
              <div className="add-icon-box">
                <Plus size={20} />
              </div>
              <div className="add-text">
                <strong>New Playlist</strong>
                <span>Create a new collection</span>
              </div>
            </button>

            <div className="playlists-scrollable">
              {playlists.map((playlist) => {
                const isAlreadyIn = playlist.songIds.includes(playlistModalSong.id);
                const isJustAdded = addedIds.includes(playlist.id);

                return (
                  <div key={playlist.id} className="playlist-picker-item">
                    <img
                      src={playlist.coverUrl}
                      alt={playlist.name}
                      className="playlist-item-thumb"
                    />
                    <div className="playlist-item-meta">
                      <h5>{playlist.name}</h5>
                      <span className="track-count">
                        <ListMusic size={13} /> {playlist.songIds.length} tracks
                      </span>
                    </div>

                    {isJustAdded || isAlreadyIn ? (
                      <span className="already-added-tag">
                        <Check size={14} /> {isJustAdded ? 'Added' : 'In Playlist'}
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="btn-add-to-list"
                        onClick={() => handleAdd(playlist.id)}
                      >
                        Add
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

