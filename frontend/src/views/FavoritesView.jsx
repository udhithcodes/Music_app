import { useMusicData } from '../context/MusicDataContext';
import { usePlayer } from '../context/PlayerContext';
import { Heart, Play, Pause, Clock, Star, Mic2, PlusCircle, Flag, Music2 } from 'lucide-react';

export const FavoritesView = () => {
  const { songs, favorites, toggleFavorite } = useMusicData();
  const { currentSong, isPlaying, playSong, togglePlay, setRateModalSong, setFlagModalSong, setPlaylistModalSong, toggleLyrics } = usePlayer();

  const favoriteSongs = songs.filter((s) => favorites.includes(s.id));

  const formatTime = (secs) => {
    if (!secs) return '3:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="view-container favorites-view">
      <div className="favorites-hero">
        <div className="favorites-heart-box">
          <Heart size={48} fill="#ef4444" color="#ef4444" />
        </div>
        <div className="favorites-hero-info">
          <span className="playlist-tag">COLLECTION</span>
          <h1 className="view-title">Liked Songs</h1>
          <p className="view-subtitle">{favoriteSongs.length} tracks saved to your favorites</p>
          {favoriteSongs.length > 0 && (
            <button
              type="button"
              className="btn-play-all mt-4"
              onClick={() => playSong(favoriteSongs[0], favoriteSongs)}
            >
              <Play size={18} fill="currentColor" /> Play Liked Tracks
            </button>
          )}
        </div>
      </div>

      {favoriteSongs.length === 0 ? (
        <div className="empty-results-box">
          <Music2 size={44} color="#6b7280" />
          <h3>No liked songs yet</h3>
          <p>Tap the heart icon on any track in Home or Search to add it to your favorites.</p>
        </div>
      ) : (
        <div className="songs-table-container">
          <table className="songs-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>Title</th>
                <th>Album</th>
                <th>Rating</th>
                <th><Clock size={16} /></th>
                <th style={{ width: '130px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {favoriteSongs.map((song, idx) => {
                const isThisPlaying = currentSong?.id === song.id && isPlaying;
                return (
                  <tr
                    key={song.id}
                    className={`song-table-row ${currentSong?.id === song.id ? 'active' : ''}`}
                    onClick={() => playSong(song, favoriteSongs)}
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
                            playSong(song, favoriteSongs);
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

                    <td className="row-rating-cell">
                      <button
                        type="button"
                        className="table-rate-pill"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRateModalSong(song);
                        }}
                      >
                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                        <span>{song.rating.toFixed(1)}</span>
                      </button>
                    </td>

                    <td className="row-duration-cell">{formatTime(song.duration)}</td>

                    <td className="row-actions-cell" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="row-action-icon text-red"
                        title="Remove from favorites"
                        onClick={() => toggleFavorite(song.id)}
                      >
                        <Heart size={16} fill="#ef4444" color="#ef4444" />
                      </button>

                      <button
                        type="button"
                        className="row-action-icon"
                        title="Lyrics"
                        onClick={() => {
                          playSong(song, favoriteSongs);
                          toggleLyrics();
                        }}
                      >
                        <Mic2 size={16} />
                      </button>

                      <button
                        type="button"
                        className="row-action-icon"
                        title="Add to Playlist"
                        onClick={() => setPlaylistModalSong(song)}
                      >
                        <PlusCircle size={16} />
                      </button>

                      <button
                        type="button"
                        className="row-action-icon flag-icon"
                        title="Flag"
                        onClick={() => setFlagModalSong(song)}
                      >
                        <Flag size={15} />
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
  );
};

