import { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { useMusicData } from '../../context/MusicDataContext';
import { useAuth } from '../../context/AuthContext';
import { X, Flag, AlertTriangle, Check } from 'lucide-react';

const REASONS = [
  'Inappropriate or explicit lyrics',
  'Copyright or intellectual property issue',
  'Incorrect metadata / artist attribution',
  'Distorted or defective audio quality',
  'Spam or duplicate upload',
  'Other policy violation',
];

export const FlagModal = () => {
  const { flagModalSong, setFlagModalSong } = usePlayer();
  const { flagContent } = useMusicData();
  const { user } = useAuth();

  const [selectedReason, setSelectedReason] = useState(REASONS[0]);
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!flagModalSong) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    flagContent({
      songId: flagModalSong.id,
      reason: `${selectedReason}${details ? ` - ${details}` : ''}`,
      user,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFlagModalSong(null);
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={() => setFlagModalSong(null)}>
      <div className="modal-content medium-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-btn"
          onClick={() => setFlagModalSong(null)}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flag-modal-header">
          <div className="flag-icon-badge">
            <Flag size={20} color="#ef4444" />
          </div>
          <h3>Report Track for Moderation</h3>
          <p className="modal-subtitle">
            Report <strong>"{flagModalSong.name}"</strong> by {flagModalSong.artist} to BeatStream platform administrators.
          </p>
        </div>

        {submitted ? (
          <div className="flag-success-message">
            <Check size={32} color="#10b981" />
            <h4>Report Submitted</h4>
            <p>Our admin moderation team will review this track promptly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flag-form">
            <div className="form-group">
              <label>Reason for reporting</label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="select-input"
              >
                {REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Additional Notes (optional)</label>
              <textarea
                rows={3}
                placeholder="Provide any additional context for the admin team..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="textarea-input"
              />
            </div>

            <div className="flag-warning-box">
              <AlertTriangle size={16} />
              <span>Flagged items are queued in the Admin Moderation Dashboard.</span>
            </div>

            <div className="modal-actions-row">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setFlagModalSong(null)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-danger">
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

