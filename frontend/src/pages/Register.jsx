import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, UserPlus, User as UserIcon, Lock, ChevronRight } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Registration failed. Username might already exist.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <div className="glass-card w-full max-w-2xl p-12 relative overflow-hidden group">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-5 bg-sky-500/10 rounded-3xl mb-6 shadow-inner glass-inner">
            <UserPlus size={40} className="text-sky-500" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">Join <span className="text-sky-500">NexHabit</span></h1>
          <p className="text-slate-400 font-medium">Start your journey to a better version of yourself</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-2xl mb-8 text-center text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-300 ml-1">Username</label>
                <div className="relative group/input">
                    <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-sky-500 transition-colors" size={20} />
                    <input 
                        type="text" 
                        className="input-field pl-14" 
                        placeholder="john_doe" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
            </div>
            <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-300 ml-1">Email</label>
                <div className="relative group/input">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-sky-500 transition-colors" size={20} />
                    <input 
                        type="email" 
                        className="input-field pl-14" 
                        placeholder="john@example.com" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-300 ml-1">Password</label>
            <div className="relative group/input">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-sky-500 transition-colors" size={20} />
              <input 
                type="password" 
                className="input-field pl-14" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-5 text-xl flex items-center justify-center gap-3 active:scale-95 transition-all mt-4">
             Create Account <ChevronRight className="group-hover:translate-x-2 transition-transform" size={24} />
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-slate-400 font-medium">
            Already have an account? <Link to="/login" className="text-sky-400 font-bold hover:text-sky-300 transition-colors ml-1">Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
