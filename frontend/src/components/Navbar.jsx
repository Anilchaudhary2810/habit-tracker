import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Trophy, Plus, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: "/", icon: <Home size={22} />, label: "Dashboard" },
    { to: "/planning", icon: <Plus size={22} />, label: "Plan" },
    { to: "/leaderboard", icon: <Trophy size={22} />, label: "Stats" },
  ];

  return (
    <>
      <nav className="glass-nav py-4 mb-4 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link to="/" className="text-xl sm:text-2xl font-black text-white tracking-tighter flex items-center gap-2 sm:gap-3 group">
             <div className="p-2 bg-sky-500/10 rounded-xl group-hover:bg-sky-500/20 transition-all shadow-inner glass-inner">
               <Trophy size={24} className="text-sky-500 animate-float" />
             </div>
             Nex<span className="text-sky-500">Habit</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map(link => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
                 {link.icon} {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-2 sm:gap-3 bg-slate-900 border border-slate-800 rounded-2xl px-3 sm:px-5 py-2 shadow-inner group cursor-default">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-sky-500 to-purple-500 flex items-center justify-center text-white text-[10px] sm:text-xs font-bold">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-white leading-tight truncate max-w-[60px] sm:max-w-none">{user?.username}</span>
                <span className="text-[8px] sm:text-[10px] text-sky-400 font-black uppercase tracking-widest leading-none mt-0.5">
                    {user?.points} XP
                </span>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 sm:p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl sm:rounded-2xl transition-all active:scale-90 border border-red-500/10">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-lg border-t border-slate-900 px-6 py-3 flex justify-around items-center z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
        {navLinks.map(link => (
          <NavLink 
            key={link.to} 
            to={link.to} 
            className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-sky-500' : 'text-slate-500'}`}
          >
            {link.icon}
            <span className="text-[10px] font-bold uppercase tracking-tighter">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default Navbar;
