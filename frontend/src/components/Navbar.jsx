import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Trophy, Plus, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: "/", icon: <Home size={22} />, label: "Dashboard" },
    { to: "/planning", icon: <Plus size={22} />, label: "Planning" },
    { to: "/leaderboard", icon: <Trophy size={22} />, label: "Stats" },
  ];

  return (
    <>
      <nav className="glass-nav py-4 mb-4 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link to="/" className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2 sm:gap-3 group">
             <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-all shadow-inner glass-inner">
               <Trophy size={24} className="text-blue-600" />
             </div>
             Habit<span className="text-blue-600">Tracker</span>
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
            <div className="flex items-center gap-2 sm:gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3 sm:px-4 py-2 shadow-inner cursor-default">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-[10px] sm:text-xs font-bold">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight truncate max-w-[60px] sm:max-w-none">{user?.username}</span>
                <span className="text-[10px] text-blue-700 font-semibold leading-none mt-0.5">
                    {user?.points} points
                </span>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 sm:p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl sm:rounded-2xl transition-all active:scale-90 border border-red-200">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-6 py-3 flex justify-around items-center z-50 shadow-[0_-10px_20px_rgba(15,23,42,0.08)]">
        {navLinks.map(link => (
          <NavLink 
            key={link.to} 
            to={link.to} 
            className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-blue-600' : 'text-slate-500'}`}
          >
            {link.icon}
            <span className="text-[10px] font-semibold">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default Navbar;
