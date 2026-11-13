import { usePlayer } from '../../context/PlayerContext';
import { X, Mic2, Music, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export const LyricsDrawer = () => {
  const { currentSong, lyricsOpen, setLyricsOpen } = usePlayer();
  const [copied, setCopied] = useState(false);

  if (!lyricsOpen) return null;

  const handleCopy = () => {
    if (!currentSong?.lyrics) return;
    navigator.clipboard.writeText(currentSong.lyrics);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="lyrics-drawer-overlay" onClick={() => setLyricsOpen(false)}>
      <div className="lyrics-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="lyrics-drawer-header">
          <div className="drawer-title-group">
            <Mic2 size={20} color="#a855f7" />
            <h3>Lyrics & Song Details</h3>
          </div>
          <div className="drawer-actions-group">
            <button
              type="button"
              className="lyrics-action-btn"
              onClick={handleCopy}
              title="Copy Lyrics"
            >
              {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              type="button"
              className="drawer-close-btn"
              onClick={() => setLyricsOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {currentSong ? (
          <div className="lyrics-content-scroll">
            <div className="lyrics-song-card">
              <img src={currentSong.coverUrl} alt={currentSong.name} />
              <div className="lyrics-song-meta">
                <h2>{currentSong.name}</h2>
                <p className="artist-name">{currentSong.artist}</p>
                <div className="meta-tags">
                  <span className="meta-pill">{currentSong.genre}</span>
                  <span className="meta-pill">{currentSong.albumName}</span>
                  <span className="meta-pill">★ {currentSong.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div className="lyrics-body">
              <h4>Lyrics</h4>
              <pre className="lyrics-text">{currentSong.lyrics || 'No lyrics available for this song.'}</pre>
            </div>
          </div>
        ) : (
          <div className="no-lyrics-state">
            <Music size={48} color="#6b7280" />
            <p>Select a track to view lyrics and song details</p>
          </div>
        )}
      </div>
    </div>
  );
};

