import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from './AuthContext';
import AuthCard from './components/AuthCard';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setFormLoading(true);
    try {
      await register(name, email, password);
      navigate('/projects');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const footerLink = (
    <span>
      Already a member?{' '}
      <Link to="/login" className="font-medium underline theme-transition" style={{ color: 'var(--accent)' }}>
        Sign in
      </Link>
    </span>
  );

  return (
    <AuthCard
      title="Create your account"
      error={error}
      loading={formLoading}
      onSubmit={handleSubmit}
      submitText="Create account"
      footerLink={footerLink}
    >
      <div>
        <label className="block text-xs uppercase tracking-wider font-mono mb-1.5" style={{ color: 'var(--muted)' }}>
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
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
