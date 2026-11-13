import { usePlayer } from '../../context/PlayerContext';
import { useMusicData } from '../../context/MusicDataContext';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Heart,
  Mic2,
  Star,
  Flag,
  PlusCircle,
} from 'lucide-react';

export const BottomPlayer = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    isRepeat,
    togglePlay,
    nextSong,
    prevSong,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    lyricsOpen,
    toggleLyrics,
    setRateModalSong,
    setFlagModalSong,
    setPlaylistModalSong,
  } = usePlayer();

  const { favorites, toggleFavorite, userRatings } = useMusicData();

  if (!currentSong) return null;

  const isFavorited = favorites.includes(currentSong.id);
  const userRate = userRatings[currentSong.id];

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bottom-player-container">
      {/* Track info & quick actions */}
      <div className="player-track-info">
        <img
          src={currentSong.coverUrl}
          alt={currentSong.name}
          className="player-track-cover"
        />
        <div className="player-track-meta">
          <div className="track-title-row">
            <h4 className="player-track-title">{currentSong.name}</h4>
            {isPlaying && (
              <div className="mini-equalizer">
                <span className="eq-bar bar1"></span>
                <span className="eq-bar bar2"></span>
                <span className="eq-bar bar3"></span>
              </div>
            )}
          </div>
          <p className="player-track-artist">{currentSong.artist}</p>
        </div>

        <div className="player-quick-actions">
          {/* Favorite */}
          <button
            type="button"
            className={`icon-action-btn ${isFavorited ? 'favorited' : ''}`}
            onClick={() => toggleFavorite(currentSong.id)}
            title={isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
          >
            <Heart size={18} fill={isFavorited ? '#ef4444' : 'none'} color={isFavorited ? '#ef4444' : 'currentColor'} />
          </button>

          {/* Add to Playlist */}
          <button
            type="button"
            className="icon-action-btn"
            onClick={() => setPlaylistModalSong(currentSong)}
            title="Add to Playlist"
          >
            <PlusCircle size={18} />
          </button>

          {/* Rate */}
          <button
            type="button"
            className={`icon-action-btn ${userRate ? 'rated' : ''}`}
            onClick={() => setRateModalSong(currentSong)}
            title={userRate ? `Your Rating: ${userRate} Stars` : 'Rate Track'}
          >
            <Star size={18} fill={userRate ? '#fbbf24' : 'none'} color={userRate ? '#fbbf24' : 'currentColor'} />
          </button>

          {/* Flag */}
          <button
            type="button"
            className="icon-action-btn flag-btn"
            onClick={() => setFlagModalSong(currentSong)}
            title="Report / Flag Content"
          >
            <Flag size={16} />
          </button>
        </div>
      </div>

      {/* Main playback controls & progress scrub */}
      <div className="player-center-controls">
        <div className="playback-buttons-row">
          <button
            type="button"
            className={`control-btn sub-btn ${isShuffle ? 'active-glow' : ''}`}
            onClick={toggleShuffle}
            title={isShuffle ? 'Shuffle On' : 'Shuffle Off'}
          >
            <Shuffle size={17} />
          </button>

          <button
            type="button"
            className="control-btn"
            onClick={prevSong}
            title="Previous Track"
          >
            <SkipBack size={20} />
          </button>

          <button
            type="button"
            className="play-main-button"
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="offset-play" />}
          </button>

          <button
            type="button"
            className="control-btn"
            onClick={nextSong}
            title="Next Track"
          >
            <SkipForward size={20} />
          </button>

          <button
            type="button"
            className={`control-btn sub-btn ${isRepeat ? 'active-glow' : ''}`}
            onClick={toggleRepeat}
            title={isRepeat ? 'Repeat On' : 'Repeat Off'}
          >
            <Repeat size={17} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="player-progress-bar-group">
          <span className="time-display current">{formatTime(currentTime)}</span>
          <div
            className="scrub-track-wrapper"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, clickX / rect.width));
              seek(ratio * (duration || 180));
            }}
          >
            <div className="scrub-track-bg">
              <div
                className="scrub-track-fill"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="scrub-thumb"></div>
              </div>
            </div>
          </div>
          <span className="time-display total">{formatTime(duration || currentSong.duration)}</span>
        </div>
      </div>

      {/* Right side: Lyrics, Volume */}
      <div className="player-extra-controls">
        <button
          type="button"
          className={`control-btn lyrics-pill-btn ${lyricsOpen ? 'active' : ''}`}
          onClick={toggleLyrics}
          title="Toggle Lyrics"
        >
          <Mic2 size={18} />
          <span>Lyrics</span>
        </button>

        <div className="volume-control-group">
          <button
            type="button"
            className="control-btn"
            onClick={toggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? <VolumeX size={19} /> : <Volume2 size={19} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="volume-slider"
          />
        </div>
      </div>
    </div>
  );
};

