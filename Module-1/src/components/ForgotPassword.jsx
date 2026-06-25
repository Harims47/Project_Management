import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import BrandLogo from './BrandLogo';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecovery = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your work email.');
      return;
    }

    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      setSuccess(`A password recovery link has been dispatched to ${email}. Please check your inbox and follow the instructions.`);
      setEmail('');
      setLoading(false);
    }, 900);
  };

  return (
    <>
      <div className="auth-title-block">
        <h1 className="auth-title">Recover Password</h1>
        <p className="auth-subtitle">Get instructions sent to your registered work email</p>
      </div>

      {/* Form */}
      <form className="login-form" onSubmit={handleRecovery}>
        {error && (
          <div className="login-error-alert animate-shake">
            <span>⚠️</span> {error}
          </div>
        )}
        {success && (
          <div className="login-success-alert" style={{ lineHeight: '1.5' }}>
            <span>✉️</span> {success}
          </div>
        )}

        {!success && (
          <>
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

            {/* Submit */}
            <button 
              type="submit" 
              className={`btn btn-primary login-submit-btn ${loading ? 'btn-loading' : ''}`}
              disabled={loading}
              style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}
            >
              <Send size={16} />
              {loading ? 'Sending Request...' : 'Send Recovery Link'}
            </button>
          </>
        )}

        {success && (
          <button 
            type="button" 
            className="btn btn-outline" 
            onClick={() => navigate('/login')}
            style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
          >
            Return to Login
          </button>
        )}
      </form>

      {/* Switch Link */}
      {!success && (
        <div className="auth-switch-text-row">
          <Link to="/login" className="text-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      )}
    </>
  );
};

export default ForgotPassword;
