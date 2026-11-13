import { useMusicData } from '../context/MusicDataContext';
import { usePlayer } from '../context/PlayerContext';
import {
  Play,
  Pause,
  Star,
  Clock,
  Mic2,
  PlusCircle,
  Flag,
  Sparkles,
  Flame,
  Radio,
} from 'lucide-react';

export const HomeView = ({ setCurrentView, setSearchQuery }) => {
  const { songs, albums } = useMusicData();
  const { currentSong, isPlaying, playSong, togglePlay, setRateModalSong, setFlagModalSong, setPlaylistModalSong, toggleLyrics } = usePlayer();

  const featuredSong = songs[0];
  const topRatedSongs = [...songs].sort((a, b) => b.rating - a.rating).slice(0, 5);
  const recentSongs = [...songs].slice(0, 6);

  const formatTime = (secs) => {
    if (!secs) return '3:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const genres = ['All', 'Synthwave', 'Lo-Fi', 'World Fusion', 'Electronic'];

  return (
    <div className="view-container home-view">
      {/* Hero Featured Banner */}
      {featuredSong && (
        <section className="hero-banner">
          <div className="hero-glow-backdrop"></div>
          <div className="hero-content">
            <span className="featured-badge">
              <Sparkles size={14} /> Featured Album & Track
            </span>
            <h1 className="hero-title">{featuredSong.name}</h1>
            <p className="hero-artist">
              By <strong>{featuredSong.artist}</strong> • Album: <em>{featuredSong.albumName}</em>
            </p>
            <p className="hero-description">
              Immerse yourself in rich synthesizers and lush atmospheric rhythms. High fidelity streaming with multi-language synchronized lyrics.
            </p>

            <div className="hero-actions-row">
              <button
                type="button"
                className="btn-hero-play"
                onClick={() => {
                  if (currentSong?.id === featuredSong.id) {
                    togglePlay();
                  } else {
                    playSong(featuredSong, songs);
                  }
                }}
              >
                {currentSong?.id === featuredSong.id && isPlaying ? (
                  <>
                    <Pause size={20} fill="currentColor" /> Pause
                  </>
                ) : (
                  <>
                    <Play size={20} fill="currentColor" /> Play Now
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn-hero-secondary"
                onClick={() => {
                  if (currentSong?.id !== featuredSong.id) {
                    playSong(featuredSong, songs);
                  }
                  toggleLyrics();
                }}
              >
                <Mic2 size={18} /> View Lyrics
              </button>
            </div>
          </div>

          <div className="hero-cover-wrapper">
            <img src={featuredSong.coverUrl} alt={featuredSong.name} className="hero-cover-img" />
          </div>
        </section>
      )}

      {/* Genre Pills Quick Filter */}
      <section className="genre-strip-section">
        <div className="genre-strip">
          {genres.map((g) => (
            <button
              key={g}
              type="button"
              className="genre-chip"
              onClick={() => {
                if (g !== 'All') setSearchQuery(g);
                setCurrentView('search');
              }}
            >
              <Radio size={14} />
              <span>{g}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Latest Releases Grid */}
      <section className="content-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">
              <Flame size={22} color="#f97316" /> Latest Releases
            </h2>
            <p className="section-subtitle">Newly added tracks uploaded by community creators</p>
          </div>
          <button
            type="button"
            className="view-all-link"
            onClick={() => setCurrentView('search')}
          >
            View all ({songs.length})
          </button>
        </div>

        <div className="cards-grid">
          {recentSongs.map((song) => {
            const isThisPlaying = currentSong?.id === song.id && isPlaying;
            return (
              <div
                key={song.id}
                className={`song-card ${currentSong?.id === song.id ? 'active-track' : ''}`}
                onClick={() => playSong(song, songs)}
              >
                <div className="card-cover-container">
                  <img src={song.coverUrl} alt={song.name} className="card-cover-img" />
                  <button
                    type="button"
                    className={`card-play-fab ${isThisPlaying ? 'playing' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (currentSong?.id === song.id) {
                        togglePlay();
                      } else {
                        playSong(song, songs);
                      }
                    }}
                  >
                    {isThisPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                  </button>
                </div>

                <div className="card-meta">
                  <h4 className="card-title" title={song.name}>{song.name}</h4>
                  <p className="card-artist">{song.artist}</p>
                  <div className="card-footer-row">
                    <span className="card-genre">{song.genre}</span>
                    <span className="card-rating">
                      <Star size={13} fill="#fbbf24" color="#fbbf24" /> {song.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Albums Section */}
      <section className="content-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Featured Albums</h2>
            <p className="section-subtitle">Curated albums and full discographies</p>
          </div>
        </div>

        <div className="albums-grid">
          {albums.map((album) => {
            const albumSongs = songs.filter((s) => s.albumId === album.id);
            return (
              <div key={album.id} className="album-card">
                <div className="album-cover-wrap">
                  <img src={album.coverUrl} alt={album.name} />
                  <button
                    type="button"
                    className="card-play-fab"
                    onClick={() => {
                      if (albumSongs.length > 0) {
                        playSong(albumSongs[0], albumSongs);
                      }
                    }}
                  >
                    <Play size={20} fill="currentColor" />
                  </button>
                </div>
                <div className="album-info">
                  <h4 className="album-name">{album.name}</h4>
                  <p className="album-artist">{album.artist} • {album.releaseYear}</p>
                  <span className="album-track-count">{albumSongs.length} Tracks</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Top Rated Songs Table */}
      <section className="content-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Community Top Rated</h2>
            <p className="section-subtitle">Highest listener-rated songs across all genres</p>
          </div>
        </div>

        <div className="songs-table-container">
          <table className="songs-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>Title</th>
                <th>Album</th>
                <th>Rating</th>
                <th><Clock size={16} /></th>
                <th style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {topRatedSongs.map((song, idx) => {
                const isThisPlaying = currentSong?.id === song.id && isPlaying;
                return (
                  <tr
                    key={song.id}
                    className={`song-table-row ${currentSong?.id === song.id ? 'active' : ''}`}
                    onClick={() => playSong(song, songs)}
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

                    <td className="row-rating-cell">
                      <button
                        type="button"
                        className="table-rate-pill"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRateModalSong(song);
                        }}
                        title="Rate this track"
                      >
                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                        <span>{song.rating.toFixed(1)}</span>
                        <span className="count-sub">({song.ratingCount})</span>
                      </button>
                    </td>

                    <td className="row-duration-cell">{formatTime(song.duration)}</td>

                    <td className="row-actions-cell" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="row-action-icon"
                        title="View Lyrics"
                        onClick={() => {
                          playSong(song, songs);
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
                        title="Report Content"
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
      </section>
    </div>
  );
};
