import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User as UserIcon, LogIn, ChevronRight } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <div className="glass-card w-full max-w-lg p-12 relative overflow-hidden group">
        
        <div className="text-center mb-12 relative">
          <div className="inline-flex items-center justify-center p-5 bg-sky-500/10 rounded-3xl mb-6 border border-white/5">
            <LogIn size={40} className="text-sky-500" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">Welcome <span className="text-sky-500">Back</span></h1>
          <p className="text-slate-400 font-medium">Log in to your dashboard to continue</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-4 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 ml-1">Username</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                className="input-field pl-12" 
                placeholder="Enter your username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" 
                className="input-field pl-12" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-5 text-xl flex items-center justify-center gap-3 active:scale-95 transition-all mt-4">
             Explore Dashboard <ChevronRight className="group-hover:translate-x-2 transition-transform" size={24} />
          </button>
        </form>
 
        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-slate-400 font-medium">
            New to NexHabit? <Link to="/register" className="text-sky-400 font-bold hover:text-sky-300 transition-colors ml-1">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
