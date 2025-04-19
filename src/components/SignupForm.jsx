import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SignupForm() {
  const [mode, setMode] = useState('signup');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
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

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      const userId = data?.user?.id;
      if (userId) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: userId, username }]);

        if (profileError) {
          setMessage('Error saving username: ' + profileError.message);
          setLoading(false);
          return;
        }
      }

      setMessage('Check your email to confirm your account.');
      setLoading(false);
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage('Signed in successfully!');
      }

      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-center">
        {mode === 'signup' ? 'Create an Account' : 'Sign In'}
      </h2>

      <form onSubmit={handleAuth} className="space-y-3">
        {mode === 'signup' && (
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {mode === 'signup' && (
          <div>
            <label className="block text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border p-2 rounded"
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

      {message && <p className="text-sm text-center text-red-600">{message}</p>}

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
