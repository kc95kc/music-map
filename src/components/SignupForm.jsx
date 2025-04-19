import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setErrorMsg(authError.message);
      return;
    }

    const userId = authData.user?.id;
    if (!userId) {
      setErrorMsg('Failed to get user ID.');
      return;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: userId, username }]);

    if (profileError) {
      setErrorMsg(profileError.message);
    } else {
      setSuccess(true);
      setErrorMsg('');
    }
  };

  return (
    <form onSubmit={handleSignUp} className="max-w-md p-6 mx-auto mt-10 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-bold">Sign Up</h2>
      {errorMsg && <p className="text-red-500">{errorMsg}</p>}
      {success && <p className="text-green-600">Signup successful! Check your email to confirm.</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        Sign Up
      </button>
    </form>
  );
}
