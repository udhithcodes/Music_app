import { useState, useMemo } from 'react';
import { useMusicData } from '../context/MusicDataContext';
import { usePlayer } from '../context/PlayerContext';
import {
  Search,
  SlidersHorizontal,
  Star,
  Play,
  Pause,
  Clock,
  Mic2,
  PlusCircle,
  Flag,
  Filter,
} from 'lucide-react';

export const SearchView = ({ searchQuery, setSearchQuery }) => {
  const { songs, albums } = useMusicData();
  const { currentSong, isPlaying, playSong, togglePlay, setRateModalSong, setFlagModalSong, setPlaylistModalSong, toggleLyrics } = usePlayer();

  const [selectedGenre, setSelectedGenre] = useState('ALL');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'newest' | 'title' | 'duration'

  // Extract unique genres
  const genres = useMemo(() => {
    const set = new Set(songs.map((s) => s.genre));
    return ['ALL', ...Array.from(set)];
  }, [songs]);

  // Filtered & sorted songs
  const filteredSongs = useMemo(() => {
    return songs
      .filter((song) => {
        // Query match
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          song.name.toLowerCase().includes(q) ||
          song.artist.toLowerCase().includes(q) ||
          song.albumName.toLowerCase().includes(q) ||
          song.genre.toLowerCase().includes(q) ||
          (song.lyrics && song.lyrics.toLowerCase().includes(q));

        // Genre match
        const matchesGenre = selectedGenre === 'ALL' || song.genre.toLowerCase() === selectedGenre.toLowerCase();

        // Rating match
        const matchesRating = song.rating >= minRating;

        return matchesQuery && matchesGenre && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.dateCreated) - new Date(a.dateCreated);
        if (sortBy === 'title') return a.name.localeCompare(b.name);
        if (sortBy === 'duration') return b.duration - a.duration;
        return 0;
      });
  }, [songs, searchQuery, selectedGenre, minRating, sortBy]);

  // Filtered albums based on search query
  const filteredAlbums = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return albums.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.artist.toLowerCase().includes(q) ||
        a.genre.toLowerCase().includes(q)
    );
  }, [albums, searchQuery]);

  const formatTime = (secs) => {
    if (!secs) return '3:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="view-container search-view">
      {/* Search Header & Query Field */}
      <div className="search-header-panel">
        <h1 className="view-title">Search & Explore</h1>
        <p className="view-subtitle">Find songs by title, artist, album, genre, or lyrics</p>

        <div className="big-search-box">
          <Search size={22} className="big-search-icon" />
          <input
            type="text"
            placeholder="Type artist, song, lyrics (e.g. 'rain', 'Luna', 'monsoon')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-query-btn"
              onClick={() => setSearchQuery('')}
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="filters-control-bar">
          {/* Genre chips */}
          <div className="filter-group">
            <span className="filter-label"><Filter size={14} /> Genre:</span>
            <div className="filter-pills-row">
              {genres.map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`filter-pill ${selectedGenre === g ? 'active' : ''}`}
                  onClick={() => setSelectedGenre(g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="filter-group">
            <span className="filter-label"><Star size={14} /> Rating:</span>
            <div className="filter-pills-row">
              {[
                { label: 'All', val: 0 },
                { label: '3★+', val: 3.0 },
                { label: '4★+', val: 4.0 },
                { label: '4.5★+', val: 4.5 },
              ].map((r) => (
                <button
                  key={r.val}
                  type="button"
                  className={`filter-pill ${minRating === r.val ? 'active' : ''}`}
                  onClick={() => setMinRating(r.val)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="filter-group sort-group">
            <span className="filter-label"><SlidersHorizontal size={14} /> Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="rating">Highest Rated</option>
              <option value="newest">Recently Added</option>
              <option value="title">Title (A-Z)</option>
              <option value="duration">Longest Duration</option>
            </select>
          </div>
        </div>
      </div>

      {/* Matching Albums section if search query is active */}
      {filteredAlbums.length > 0 && (
        <section className="search-section">
          <h3 className="section-title">Matching Albums ({filteredAlbums.length})</h3>
          <div className="albums-grid">
            {filteredAlbums.map((album) => {
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
                    <p className="album-artist">{album.artist} • {album.genre}</p>
                    <span className="album-track-count">{albumSongs.length} Tracks</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Results Table */}
      <section className="search-section">
        <div className="results-header-row">
          <h3>
            Tracks Found <span className="results-badge">{filteredSongs.length}</span>
          </h3>
          {searchQuery && (
            <span className="query-indicator">
              Showing matches for: <strong>"{searchQuery}"</strong>
            </span>
          )}
        </div>

        {filteredSongs.length === 0 ? (
          <div className="empty-results-box">
            <Search size={40} color="#6b7280" />
            <h4>No tracks match your criteria</h4>
            <p>Try searching for a different keyword, selecting "ALL" genres, or lowering the star filter.</p>
          </div>
        ) : (
          <div className="songs-table-container">
            <table className="songs-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>#</th>
                  <th>Title</th>
                  <th>Album</th>
                  <th>Genre</th>
                  <th>Rating</th>
                  <th><Clock size={16} /></th>
                  <th style={{ width: '130px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSongs.map((song, idx) => {
                  const isThisPlaying = currentSong?.id === song.id && isPlaying;
                  return (
                    <tr
                      key={song.id}
                      className={`song-table-row ${currentSong?.id === song.id ? 'active' : ''}`}
                      onClick={() => playSong(song, filteredSongs)}
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
                              playSong(song, filteredSongs);
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
                            playSong(song, filteredSongs);
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
        )}
      </section>
    </div>
  );
};

