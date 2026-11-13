import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Lock, Mail, User, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

export const AuthModal = () => {
  const { isAuthModalOpen, setAuthModalOpen, authModalMode, setAuthModalMode, login, register } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER'); // 'USER' | 'CREATOR' | 'ADMIN'
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      if (authModalMode === 'login') {
        if (!usernameOrEmail.trim() || !password) {
          throw new Error('Please fill in both fields');
        }
        await login(usernameOrEmail.trim(), password);
      } else {
        // Register validation
        if (username.trim().length < 3) {
          throw new Error('Username must be at least 3 characters');
        }
        if (!email.includes('@')) {
          throw new Error('Please enter a valid email address');
        }
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters');
        }
        await register({
          username: username.trim(),
          email: email.trim(),
          password,
          role,
        });
        setSuccess('Account created successfully! Welcome to BeatStream.');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = (type) => {
    setError(null);
    if (type === 'creator') {
      if (authModalMode === 'login') {
        setUsernameOrEmail('creator@test.com');
        setPassword('Password123!');
      } else {
        const rand = Math.floor(Math.random() * 900) + 100;
        setUsername(`artist_${rand}`);
        setEmail(`artist_${rand}@beatstream.io`);
        setPassword('Password123!');
        setRole('CREATOR');
      }
    } else if (type === 'user') {
      if (authModalMode === 'login') {
        setUsernameOrEmail('music_fan');
        setPassword('Password123!');
      } else {
        const rand = Math.floor(Math.random() * 900) + 100;
        setUsername(`listener_${rand}`);
        setEmail(`listener_${rand}@beatstream.io`);
        setPassword('Password123!');
        setRole('USER');
      }
    } else if (type === 'admin') {
      if (authModalMode === 'login') {
        setUsernameOrEmail('admin');
        setPassword('Password123!');
      } else {
        const rand = Math.floor(Math.random() * 900) + 100;
        setUsername(`admin_${rand}`);
        setEmail(`admin_${rand}@beatstream.io`);
        setPassword('Password123!');
        setRole('ADMIN');
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setAuthModalOpen(false)}>
      <div className="modal-content auth-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-btn"
          onClick={() => setAuthModalOpen(false)}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="auth-header">
          <div className="auth-badge">
            <Sparkles size={16} /> BeatStream Authentication
          </div>
          <h2>{authModalMode === 'login' ? 'Welcome Back' : 'Create an Account'}</h2>
          <p>
            {authModalMode === 'login'
              ? 'Log in to access your playlists, ratings, and music library.'
              : 'Join BeatStream as a listener, music creator, or platform administrator.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${authModalMode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setAuthModalMode('login');
              setError(null);
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${authModalMode === 'register' ? 'active' : ''}`}
            onClick={() => {
              setAuthModalMode('register');
              setError(null);
            }}
          >
            Create Account
          </button>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div className="quick-fill-section">
          <span className="quick-fill-label">Quick Demo Fill:</span>
          <div className="quick-fill-pills">
            <button
              type="button"
              className="quick-pill creator"
              onClick={() => handleQuickFill('creator')}
            >
              🎨 Creator
            </button>
            <button
              type="button"
              className="quick-pill user"
              onClick={() => handleQuickFill('user')}
            >
              👤 Listener
            </button>
            <button
              type="button"
              className="quick-pill admin"
              onClick={() => handleQuickFill('admin')}
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="auth-alert error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="auth-alert success">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {authModalMode === 'login' ? (
            <>
              <div className="form-group">
                <label>Username or Email</label>
                <div className="input-with-icon">
                  <Mail size={18} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. creator@test.com or testcreator"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-with-icon">
                  <Lock size={18} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Role</label>
                <div className="role-selector">
                  <label className={`role-card ${role === 'USER' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="role"
                      value="USER"
                      checked={role === 'USER'}
                      onChange={() => setRole('USER')}
                    />
                    <div className="role-icon">👤</div>
                    <div className="role-info">
                      <div className="role-name">General User</div>
                      <div className="role-desc">Listen, rate & create playlists</div>
                    </div>
                  </label>

                  <label className={`role-card ${role === 'CREATOR' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="role"
                      value="CREATOR"
                      checked={role === 'CREATOR'}
                      onChange={() => setRole('CREATOR')}
                    />
                    <div className="role-icon">🎨</div>
                    <div className="role-info">
                      <div className="role-name">Music Creator</div>
                      <div className="role-desc">Upload & manage songs/albums</div>
                    </div>
                  </label>

                  <label className={`role-card ${role === 'ADMIN' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="role"
                      value="ADMIN"
                      checked={role === 'ADMIN'}
                      onChange={() => setRole('ADMIN')}
                    />
                    <div className="role-icon">🛡️</div>
                    <div className="role-info">
                      <div className="role-name">Administrator</div>
                      <div className="role-desc">System monitor & moderation</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Username</label>
                  <div className="input-with-icon">
                    <User size={18} />
                    <input
                      type="text"
                      required
                      minLength={3}
                      maxLength={50}
                      placeholder="min 3 characters"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-with-icon">
                    <Mail size={18} />
                    <input
                      type="email"
                      required
                      placeholder="user@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-with-icon">
                  <Lock size={18} />
                  <input
                    type="password"
                    required
                    minLength={8}
                    maxLength={128}
                    placeholder="min 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <span className="input-hint">Must be at least 8 characters long</span>
              </div>
            </>
          )}

          <button type="submit" className="auth-submit-btn" disabled={submitting}>
            {submitting
              ? 'Connecting to FastAPI...'
              : authModalMode === 'login'
              ? 'Sign In to BeatStream'
              : `Create ${role} Account`}
          </button>
        </form>

        <div className="auth-footer">
          {authModalMode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                className="link-button"
                onClick={() => {
                  setAuthModalMode('register');
                  setError(null);
                }}
              >
                Sign up now
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                className="link-button"
                onClick={() => {
                  setAuthModalMode('login');
                  setError(null);
                }}
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
