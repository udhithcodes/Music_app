import { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { useMusicData } from '../../context/MusicDataContext';
import { X, Star, Check } from 'lucide-react';

export const RatingModal = () => {
  const { rateModalSong, setRateModalSong } = usePlayer();
  const { userRatings, rateSong } = useMusicData();

  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  if (!rateModalSong) return null;

  const currentRating = userRatings[rateModalSong.id] || 0;

  const handleSelectRating = (stars) => {
    rateSong(rateModalSong.id, stars);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRateModalSong(null);
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={() => setRateModalSong(null)}>
      <div className="modal-content small-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-btn"
          onClick={() => setRateModalSong(null)}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="rate-modal-header">
          <div className="song-preview-pill">
            <img src={rateModalSong.coverUrl} alt={rateModalSong.name} />
            <div>
              <h4>{rateModalSong.name}</h4>
              <p>{rateModalSong.artist}</p>
            </div>
          </div>
          <h3>Rate this Track</h3>
          <p className="modal-subtitle">
            Community rating: <strong>★ {rateModalSong.rating.toFixed(1)}</strong> ({rateModalSong.ratingCount} reviews)
          </p>
        </div>

        {submitted ? (
          <div className="rate-success-message">
            <Check size={28} color="#10b981" />
            <p>Thank you for rating!</p>
          </div>
        ) : (
          <div className="stars-picker-container">
            <div className="stars-row">
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = (hoverRating || currentRating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    className={`star-pick-btn ${filled ? 'filled' : ''}`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleSelectRating(star)}
                  >
                    <Star size={36} fill={filled ? '#fbbf24' : 'none'} color="#fbbf24" />
                  </button>
                );
              })}
            </div>
            <span className="star-label-hint">
              {hoverRating
                ? `${hoverRating} of 5 Stars`
                : currentRating
                ? `You rated this ${currentRating} of 5 Stars`
                : 'Tap a star to rate'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

