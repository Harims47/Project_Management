import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import BrandLogo from './BrandLogo';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock Credentials
  const MOCK_EMAIL = 'admin@indegene.com';
  const MOCK_PASSWORD = 'admin123';
  const DEFAULT_ROLE = 'Director';

  useEffect(() => {
    // Check if redirecting from a successful signup
    const justSignedUp = localStorage.getItem('justSignedUp');
    const signupEmail = localStorage.getItem('signupEmail');
    if (justSignedUp === 'true') {
      setSuccess('Account created successfully! Please sign in.');
      if (signupEmail) setEmail(signupEmail);
      localStorage.removeItem('justSignedUp');
      localStorage.removeItem('signupEmail');
      localStorage.removeItem('signupRole');
    }

    // Auto-fill remembered email
    const remembered = localStorage.getItem('rememberedUser');
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || !password) {
      setError('Please fill in all email and password fields.');
      return;
    }

    setLoading(true);

    // Simulate network latency for auth verification
    setTimeout(() => {
      // 1. Check default mock credentials
      const matchesMock = email.toLowerCase() === MOCK_EMAIL && password === MOCK_PASSWORD;
      
      // 2. Check localStorage custom registrations
      const registeredStr = localStorage.getItem('registeredUsers') || '[]';
      const registeredUsers = JSON.parse(registeredStr);
      const customUser = registeredUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (matchesMock || customUser) {
        const loggedInRole = customUser ? customUser.role : DEFAULT_ROLE;
        
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUserRole', loggedInRole);
        localStorage.setItem('currentUserEmail', email);
        
        if (rememberMe) {
          localStorage.setItem('rememberedUser', email);
        } else {
          localStorage.removeItem('rememberedUser');
        }
        setLoading(false);
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
      }
    }, 850);
  };

  return (
    <>
      <div className="auth-title-block">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to manage your portfolio operations system</p>
      </div>

      {/* Form */}
      <form className="login-form" onSubmit={handleLogin}>
        {error && (
          <div className="login-error-alert animate-shake">
            <span>⚠️</span> {error}
          </div>
        )}
        {success && (
          <div className="login-success-alert">
            <span>✅</span> {success}
          </div>
        )}

        {/* Email field */}
        <div className="form-group-wrapper">
          <label htmlFor="email">Email or phone</label>
          <div className="input-group-relative">
            <Mail className="input-field-icon" size={18} />
            <input
              id="email"
              type="email"
              placeholder="Enter your email or phone number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input-field"
              disabled={loading}
            />
          </div>
        </div>

        {/* Password field */}
        <div className="form-group-wrapper">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <label htmlFor="password" style={{ margin: 0 }}>Password</label>
            <Link to="/forgot-password" className="text-link" style={{ fontSize: '13px' }}>
              Forget Password?
            </Link>
          </div>
          
          <div className="input-group-relative">
            <Lock className="input-field-icon" size={18} />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input-field"
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="login-flex-row">
          <label className="checkbox-container-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="login-checkbox-input"
              disabled={loading}
            />
            <span className="checkbox-custom-box"></span>
            Keep me signed in
          </label>
        </div>

        {/* Submit */}
        <button 
          type="submit" 
          className={`btn btn-primary login-submit-btn ${loading ? 'btn-loading' : ''}`}
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Sign In'}
        </button>

        {/* Separator */}
        <div className="auth-or-divider">
          <div className="divider-line"></div>
          <span className="divider-text">or</span>
          <div className="divider-line"></div>
        </div>

        {/* Google Authentication Button */}
        <button 
          type="button" 
          className="btn btn-outline google-auth-btn" 
          onClick={() => {
            // For easy test evaluation: auto logs in as default mock account!
            setEmail(MOCK_EMAIL);
            setPassword(MOCK_PASSWORD);
            alert('Google SSO simulated: Autofilled admin credentials. Click Sign In to enter.');
          }}
          disabled={loading}
        >
          <svg className="google-icon-svg" viewBox="0 0 24 24" width="16" height="16">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
          </svg>
          Log in with Google
        </button>
      </form>

      {/* Switch Link */}
      <div className="auth-switch-text-row">
        Don't have an account? <Link to="/signup" className="text-link">Sign Up</Link>
      </div>
    </>
  );
};

export default Login;
