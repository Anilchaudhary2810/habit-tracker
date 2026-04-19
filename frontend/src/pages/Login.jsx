import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User as UserIcon, LogIn } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../utils/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username.trim(), password);
      navigate('/');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Invalid username or password.'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-card w-full max-w-lg p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-2xl mb-4 border border-blue-100">
            <LogIn size={34} className="text-blue-700" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Welcome Back</h1>
          <p className="text-slate-600 font-semibold">Log in to continue your habit journey.</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl mb-5">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Username</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                className="input-field pl-10"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="password"
                className="input-field pl-10"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-3 text-base mt-2">
            Sign In
          </button>
        </form>

        <p className="text-slate-600 font-semibold text-center mt-6">
          New here?{' '}
          <Link to="/register" className="text-blue-700 font-extrabold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
