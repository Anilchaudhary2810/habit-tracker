import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, UserPlus, User as UserIcon, Lock } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../utils/api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const safeUsername = username.trim();
      await register(safeUsername, email.trim(), password);
      await login(safeUsername, password);
      navigate('/');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Registration failed.'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-card w-full max-w-xl p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-2xl mb-4 border border-blue-100">
            <UserPlus size={34} className="text-blue-700" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Create Account</h1>
          <p className="text-slate-600 font-semibold">Start tracking habits with a clear, simple workflow.</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl mb-5">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text"
                  className="input-field pl-10"
                  placeholder="john_doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  className="input-field pl-10"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
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
            Create Account
          </button>
        </form>

        <p className="text-slate-600 font-semibold text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-700 font-extrabold hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
