import { useState } from 'react';
import './Login.css';
import logo from '../../assets/logo.png';
import background_banner from '../../assets/background_banner.jpg';
import netflix_spinner from '../../assets/netflix_spinner.gif';
import { useApp } from '../../context/AppContext';

const Login = () => {
  const { setIsLoggedIn, setUser, showToast, setCurrentTab } = useApp();
  const [signState, setSignState] = useState('Sign In');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (signState === 'Sign Up' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter a valid email or phone number.');
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must contain at least 4 characters.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setUser((prev) => ({
        ...prev,
        name: signState === 'Sign Up' ? name : (email.split('@')[0] || 'Krishna'),
        email: email
      }));
      setIsLoggedIn(true);
      setCurrentTab('home');
      showToast(signState === 'Sign Up' ? `Welcome to Fatflix, ${name}!` : 'Signed in successfully');
    }, 900);
  };

  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUser((prev) => ({
        ...prev,
        name: 'Krishna',
        email: 'krishna@fatflix.com'
      }));
      setIsLoggedIn(true);
      setCurrentTab('home');
      showToast('Welcome back, Krishna!');
    }, 600);
  };

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${background_banner})` }}
    >
      <div className="login-overlay"></div>

      {/* Header */}
      <div className="login-header">
        <img
          src={logo}
          alt="Fatflix"
          className="login-logo"
          onClick={() => {
            setIsLoggedIn(true);
            setCurrentTab('home');
          }}
        />
      </div>

      {/* Login Box */}
      <div className="login-box-wrapper">
        <div className="login-box">
          <h2>{signState}</h2>

          {error && <div className="login-error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            {signState === 'Sign Up' && (
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            )}

            <div className="input-group">
              <input
                type="text"
                placeholder="Email or mobile number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="input-group password-group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="show-pwd-btn"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? (
                <img src={netflix_spinner} alt="Loading..." className="btn-spinner" />
              ) : (
                signState
              )}
            </button>

            <div className="login-divider">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="demo-login-btn"
              onClick={handleDemoLogin}
              disabled={loading}
            >
              1-Click Demo Sign In
            </button>

            <div className="form-help">
              <label className="remember-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <span
                className="help-link"
                onClick={() => showToast('Demo credentials auto-filled! Click Demo Sign In.')}
              >
                Need help?
              </span>
            </div>
          </form>

          <div className="login-switch">
            {signState === 'Sign In' ? (
              <p>
                New to Fatflix?{' '}
                <span onClick={() => { setSignState('Sign Up'); setError(''); }}>
                  Sign up now.
                </span>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <span onClick={() => { setSignState('Sign In'); setError(''); }}>
                  Sign in now.
                </span>
              </p>
            )}
          </div>

          <p className="recaptcha-notice">
            This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
            <span className="learn-more">Learn more.</span>
          </p>
        </div>
      </div>

      {/* Login Footer */}
      <div className="login-footer">
        <p className="footer-call">Questions? Call 000-800-919-1694</p>
        <div className="login-footer-links">
          <span>FAQ</span>
          <span>Help Centre</span>
          <span>Terms of Use</span>
          <span>Privacy</span>
          <span>Cookie Preferences</span>
          <span>Corporate Information</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
