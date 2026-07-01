import { useState } from 'react';
import { signInWithEmail, signInWithOAuth } from '@/services/supabase-auth';

export function LoginRedirect() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleEmailSignIn(event: React.FormEvent) {
    event.preventDefault();
    setStatus('sending');
    setErrorMessage(null);
    try {
      await signInWithEmail(email);
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to send sign-in link.');
    }
  }

  async function handleGoogleSignIn() {
    setErrorMessage(null);
    try {
      await signInWithOAuth('google');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to start Google sign-in.');
    }
  }

  return (
    <section className="placeholder-screen" role="status">
      <p className="eyebrow">Authentication</p>
      <h1>Sign in required</h1>
      {status === 'sent' ? (
        <p>Check {email} for a sign-in link.</p>
      ) : (
        <>
          <p>Sign in with your email or Google account to continue.</p>
          <form onSubmit={handleEmailSignIn}>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              required
              aria-label="Email address"
            />
            <button type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send sign-in link'}
            </button>
          </form>
          <button type="button" onClick={handleGoogleSignIn}>
            Sign in with Google
          </button>
          {errorMessage ? <p role="alert">{errorMessage}</p> : null}
        </>
      )}
    </section>
  );
}
