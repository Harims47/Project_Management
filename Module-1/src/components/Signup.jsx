import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import BrandLogo from './BrandLogo';

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email) {
      setError('Please enter a work email.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the Terms of Service & Privacy Policy.');
      return;
    }

    setLoading(true);

    // Simulate network authentication delay
    setTimeout(() => {
      const registeredStr = localStorage.getItem('registeredUsers') || '[]';
      const registeredUsers = JSON.parse(registeredStr);
      
      // Check if user already exists
      const userExists = registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (userExists || email.toLowerCase() === 'admin@indegene.com') {
        setError('This email is already registered. Please sign in or use another email.');
        setLoading(false);
        return;
      }

      // Add user to local registration store (defaulting role to 'Director')
      const newUser = { name, email, password, role: 'Director' };
      registeredUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

      // Set flags for Login auto-fill redirect
      localStorage.setItem('justSignedUp', 'true');
      localStorage.setItem('signupEmail', email);

      setLoading(false);
      navigate('/login');
    }, 900);
  };

  return (
    <>
      <div className="auth-title-block">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join the portfolio operations management system</p>
      </div>

      {/* Form */}
      <form className="login-form" onSubmit={handleSignup}>
        {error && (
          <div className="login-error-alert animate-shake">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Full Name field */}
        <div className="form-group-wrapper">
          <label htmlFor="name">Full Name</label>
          <div className="input-group-relative">
            <User className="input-field-icon" size={18} />
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="login-input-field"
              disabled={loading}
            />
          </div>
        </div>

        {/* Email field */}
        <div className="form-group-wrapper">
          <label htmlFor="email">Work Email</label>
          <div className="input-group-relative">
            <Mail className="input-field-icon" size={18} />
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input-field"
              disabled={loading}
            />
          </div>
        </div>

        {/* Password field */}
        <div className="form-group-wrapper">
          <label htmlFor="password">Password</label>
          <div className="input-group-relative">
            <Lock className="input-field-icon" size={18} />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min. 6 characters"
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

        {/* Confirm Password field */}
        <div className="form-group-wrapper">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="input-group-relative">
            <Lock className="input-field-icon" size={18} />
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="login-input-field"
              disabled={loading}
            />
          </div>
        </div>

        {/* Terms checkbox */}
        <div className="login-flex-row">
          <label className="checkbox-container-label" style={{ fontSize: '12px', lineHeight: '1.4' }}>
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="login-checkbox-input"
              disabled={loading}
            />
            <span className="checkbox-custom-box"></span>
            <span>
              I agree to the <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Terms of Service clicked.'); }} className="text-link" style={{ fontSize: '12px' }}>Terms of Service</a> & <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy Policy clicked.'); }} className="text-link" style={{ fontSize: '12px' }}>Privacy Policy</a>.
            </span>
          </label>
        </div>

        {/* Submit */}
        <button 
          type="submit" 
          className={`btn btn-primary login-submit-btn ${loading ? 'btn-loading' : ''}`}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      {/* Switch Link */}
      <div className="auth-switch-text-row">
        Already have an account? <Link to="/login" className="text-link">Sign In</Link>
      </div>
    </>
  );
};

export default Signup;
