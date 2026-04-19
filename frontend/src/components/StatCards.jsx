import React from 'react';
import { TrendingUp, Flame, Star, Target } from 'lucide-react';

const StatCards = ({ user }) => {
  const stats = [
    { label: 'Current streak', value: user?.current_streak || 0, unit: 'days', icon: <Flame />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Best streak', value: user?.max_streak || 0, unit: 'days', icon: <TrendingUp />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total points', value: user?.points || 0, unit: 'pts', icon: <Star />, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Badges', value: user?.awarded_badges?.length || 0, unit: '', icon: <Target />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-10">
      {stats.map((stat, i) => (
        <div key={i} className="glass-card p-6 sm:p-7 flex items-center justify-between">
          <div className="relative z-10">
             <p className="stat-card-label mb-1">{stat.label}</p>
             <h3 className={`stat-card-value ${stat.color} leading-none`}>
                {stat.value} 
                <span className="text-xs text-slate-500 font-semibold ml-1">
                    {stat.unit}
                </span>
             </h3>
          </div>
          <div className={`p-3.5 sm:p-4 ${stat.bg} rounded-2xl relative z-10 border border-slate-200`}>
            {React.cloneElement(stat.icon, { 
                size: 26, 
                className: `${stat.color}` 
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;
