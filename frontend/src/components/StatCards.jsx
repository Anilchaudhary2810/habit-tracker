import React from 'react';
import { TrendingUp, Flame, Star, Target } from 'lucide-react';

const StatCards = ({ user }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <div className="glass-card p-8 group hover:scale-[1.02] transition-all">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
             <p className="stat-card-label">Current Streak</p>
             <h3 className="stat-card-value text-sky-400">
                {user?.current_streak} <span className="text-sm text-slate-500 font-medium">DAYS</span>
             </h3>
          </div>
          <div className="p-3 bg-sky-500/10 rounded-2xl group-hover:bg-sky-500/20 transition-all shadow-inner glass-inner">
            <Flame size={28} className="text-sky-500 group-hover:animate-pulse" />
          </div>
        </div>
      </div>

      <div className="glass-card p-8 group hover:scale-[1.02] transition-all">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
             <p className="stat-card-label">Peak Streak</p>
             <h3 className="stat-card-value text-orange-400">
                {user?.max_streak} <span className="text-sm text-slate-500 font-medium">DAYS</span>
             </h3>
          </div>
          <div className="p-3 bg-orange-500/10 rounded-2xl group-hover:bg-orange-500/20 transition-all shadow-inner glass-inner">
            <TrendingUp size={28} className="text-orange-500 group-hover:translate-y-[-2px] transition-transform" />
          </div>
        </div>
      </div>

      <div className="glass-card p-8 group hover:scale-[1.02] transition-all">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
             <p className="stat-card-label">Total Points</p>
             <h3 className="stat-card-value text-amber-400">
                {user?.points} <span className="text-sm text-slate-500 font-medium">XP</span>
             </h3>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-2xl group-hover:bg-amber-500/20 transition-all shadow-inner glass-inner">
            <Star size={28} className="text-amber-500 group-hover:rotate-12 transition-transform" />
          </div>
        </div>
      </div>

       <div className="glass-card p-8 group hover:scale-[1.02] transition-all">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
             <p className="stat-card-label">Achievements</p>
             <h3 className="stat-card-value text-emerald-400">
                {user?.badges?.length || 0} <span className="text-sm text-slate-500 font-medium">BADGES</span>
             </h3>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-2xl group-hover:bg-emerald-500/20 transition-all shadow-inner glass-inner">
            <Target size={28} className="text-emerald-500 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCards;
