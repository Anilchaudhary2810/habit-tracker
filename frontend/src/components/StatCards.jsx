import React from 'react';
import { TrendingUp, Flame, Star, Target } from 'lucide-react';

const StatCards = ({ user }) => {
  const stats = [
    { label: 'Current Streak', value: user?.current_streak, unit: 'DAYS', icon: <Flame />, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { label: 'Peak Streak', value: user?.max_streak, unit: 'DAYS', icon: <TrendingUp />, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'Total XP', value: user?.points, unit: 'XP', icon: <Star />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Achievements', value: user?.awarded_badges?.length || 0, unit: 'BADGES', icon: <Target />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-10">
      {stats.map((stat, i) => (
        <div key={i} className="glass-card p-6 sm:p-8 flex items-center justify-between group overflow-hidden">
          <div className="relative z-10">
             <p className="stat-card-label mb-1">{stat.label}</p>
             <h3 className={`stat-card-value ${stat.color} leading-none`}>
                {stat.value} 
                <span className="text-[10px] sm:text-xs text-slate-500 font-black tracking-tighter ml-1 opacity-70">
                    {stat.unit}
                </span>
             </h3>
          </div>
          <div className={`p-3.5 sm:p-4 ${stat.bg} rounded-2xl relative z-10 shadow-inner glass-inner`}>
            {React.cloneElement(stat.icon, { 
                size: 26, 
                className: `${stat.color} group-hover:scale-110 transition-transform duration-500` 
            })}
          </div>
          {/* Subtle Background Accent */}
          <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.bg} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700`} />
        </div>
      ))}
    </div>
  );
};

export default StatCards;
