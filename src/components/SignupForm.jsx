import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SignupForm() {
  const [mode, setMode] = useState('signup'); // 'signup' or 'signin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (mode === 'signup' && password !== confirm) {
      setMessage("Passwords don't match.");
      setLoading(false);
      return;
    }

    const authFunc =
      mode === 'signup'
        ? supabase.auth.signUp
        : supabase.auth.signInWithPassword;

        let data, error;

        if (mode === 'signup') {
          ({ data, error } = await supabase.auth.signUp({
            email,
            password,
          }));
        } else {
          ({ data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          }));
        }
        

    setLoading(false);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        mode === 'signup'
          ? 'Check your email to confirm your account.'
          : 'Signed in successfully!'
      );
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-center">
        {mode === 'signup' ? 'Create an Account' : 'Sign In'}
      </h2>

      <form onSubmit={handleAuth} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {mode === 'signup' && (
          <div>
            <label className="block text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              className="w-full border p-2 rounded"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          {loading
            ? mode === 'signup'
              ? 'Signing Up...'
              : 'Signing In...'
            : mode === 'signup'
            ? 'Sign Up'
            : 'Sign In'}
        </button>
      </form>

      {message && (
        <p className="text-sm text-center text-red-600">{message}</p>
      )}

      <p className="text-center text-sm">
        {mode === 'signup'
          ? 'Already have an account?'
          : 'Need an account?'}{' '}
        <button
          type="button"
          onClick={() =>
            setMode((prev) => (prev === 'signup' ? 'signin' : 'signup'))
          }
          className="text-blue-600 underline"
        >
          {mode === 'signup' ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
}
