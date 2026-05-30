import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from './AuthContext';
import AuthCard from './components/AuthCard';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setFormLoading(true);
    try {
      await login(email, password);
      navigate('/projects');
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const footerLink = (
    <span>
      Don't have an account?{' '}
      <Link to="/register" className="font-medium underline theme-transition" style={{ color: 'var(--accent)' }}>
        Create one
      </Link>
    </span>
  );

  return (
    <AuthCard
      title="Sign in to your account"
      error={error}
      loading={formLoading}
      onSubmit={handleSubmit}
      submitText="Sign in"
      footerLink={footerLink}
    >
      <div>
        <label className="block text-xs uppercase tracking-wider font-mono mb-1.5" style={{ color: 'var(--muted)' }}>
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-3 py-2 text-sm rounded-[var(--radius)] border theme-transition outline-none"
          style={{
            backgroundColor: 'var(--bg)',
            borderColor: 'var(--border)',
            color: 'var(--text)',
          }}
          required
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wider font-mono mb-1.5" style={{ color: 'var(--muted)' }}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full px-3 py-2 text-sm rounded-[var(--radius)] border theme-transition outline-none"
          style={{
            backgroundColor: 'var(--bg)',
            borderColor: 'var(--border)',
            color: 'var(--text)',
          }}
          required
        />
      </div>
    </AuthCard>
  );
}
