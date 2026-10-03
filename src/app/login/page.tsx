'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      setError('Incorrect password. Please try again.');
      setIsSubmitting(false);
      return;
    }

    router.push('/');
    router.refresh();
  }

  return (
    <main className="page-shell" style={{ maxWidth: 520 }}>
      <div className="detail-panel" style={{ marginTop: 80 }}>
        <p className="eyebrow">Private access</p>
        <h1 style={{ marginTop: 8, marginBottom: 16 }}>WAC Console</h1>

        <form onSubmit={handleSubmit} className="cargo-form">
          <label>
            <span>Admin password</span>
            <div className="password-input-row">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-visibility-button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          {error ? <p style={{ color: '#b42318', fontWeight: 700 }}>{error}</p> : null}

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Enter ERP'}
          </button>
        </form>

        <p style={{ marginTop: 16, color: '#5b6a7d', lineHeight: 1.6 }}>
          This keeps the app private to local access and prevents public viewing. Set a custom password in the environment as ADMIN_PASSWORD before deploying.
        </p>
      </div>
    </main>
  );
}
