'use client';
import { useEffect, useState } from 'react';
import './login.css';
import { useAuth } from '../context/auth-context';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="singularity">
      <div className="left-panel">
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {error && <div style={{ color: 'tomato', marginTop: '1rem' }}>{error}</div>}
        <div className="register">
          <span>Don't have an account?</span>
          <a href="/signup">Sign Up</a>
        </div>
      </div>
      <div className="right-panel">
        <div className="grain-overlay"></div>
        {/* <div className="brand">Snario</div> */}
        <div className="brand">Kontent Flow</div>
        <div className="tagline">
          Build and deliver content pipelines with clarity, speed, and flow.
        </div>
      </div>
    </div>
  );
}
