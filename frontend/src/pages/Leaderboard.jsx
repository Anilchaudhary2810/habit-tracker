import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Star, Crown, TrendingUp, User as UserIcon } from 'lucide-react';

import Navbar from '../components/Navbar';
import api from '../utils/api';

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get('habits/leaderboard/');
      setPlayers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const topRank = (index) => {
    if (index === 0) return <Crown className="text-yellow-500" size={22} />;
    if (index === 1) return <Crown className="text-slate-400" size={20} />;
    if (index === 2) return <Crown className="text-amber-600" size={18} />;
    return <span className="font-mono font-bold text-slate-500">#{index + 1}</span>;
  };

  return (
    <div className="min-h-screen pb-28 md:pb-12">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-blue-50 rounded-2xl sm:rounded-3xl mb-4 border border-blue-200">
            <Trophy size={38} className="text-blue-700" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
            Habit <span className="text-blue-700">Leaderboard</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-lg max-w-lg mx-auto">
            Compare streaks and points with other builders.
          </p>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="hidden sm:grid grid-cols-12 gap-4 p-4 text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 bg-slate-50">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-5 px-4 text-left">Player</div>
            <div className="col-span-3 text-center flex items-center justify-center gap-1">
              <Flame size={12} /> Streak
            </div>
            <div className="col-span-3 text-center flex items-center justify-center gap-1">
              <Star size={12} /> Points
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {players.map((player, index) => (
              <div key={player.id} className="grid grid-cols-12 gap-2 sm:gap-4 p-4 sm:p-5 hover:bg-slate-50 transition-colors items-center">
                <div className="col-span-2 sm:col-span-1 flex justify-center items-center">{topRank(index)}</div>
                <div className="col-span-10 sm:col-span-5 px-2 sm:px-4 flex items-center gap-2 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                    <UserIcon size={16} className="text-blue-700" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 truncate text-sm sm:text-base">{player.username}</h3>
                    {index < 3 && <span className="text-[10px] bg-blue-50 text-blue-700 px-2 rounded-full font-bold">Top Builder</span>}
                  </div>
                </div>
                <div className="col-start-3 col-span-10 flex sm:hidden gap-6 mt-1">
                  <div className="flex items-center gap-1 text-blue-700 font-mono text-sm font-bold">
                    <Flame size={14} /> {player.current_streak}d
                  </div>
                  <div className="flex items-center gap-1 text-amber-600 font-mono text-sm font-bold">
                    <Star size={14} /> {player.points} xp
                  </div>
                </div>
                <div className="hidden sm:flex col-span-3 justify-center items-center font-bold text-lg text-blue-700 font-mono">
                  {player.current_streak}d
                </div>
                <div className="hidden sm:flex col-span-3 justify-center items-center font-bold text-lg text-amber-600 font-mono">
                  {player.points} pts
                </div>
              </div>
            ))}
            {players.length === 0 && (
              <div className="text-center py-16 text-slate-600">No users on the leaderboard yet.</div>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-6 flex flex-col items-center text-center">
            <Flame size={30} className="text-blue-700 mb-2" />
            <h4 className="font-bold text-slate-900">Consistency Wins</h4>
            <p className="text-xs text-slate-600 mt-1">Streaks have the highest impact on rank.</p>
          </div>
          <div className="glass-card p-6 flex flex-col items-center text-center">
            <Star size={30} className="text-amber-600 mb-2" />
            <h4 className="font-bold text-slate-900">Gain Experience</h4>
            <p className="text-xs text-slate-600 mt-1">Each completed entry gives 10 points.</p>
          </div>
          <div className="glass-card p-6 flex flex-col items-center text-center">
            <TrendingUp size={30} className="text-emerald-600 mb-2" />
            <h4 className="font-bold text-slate-900">Live Rankings</h4>
            <p className="text-xs text-slate-600 mt-1">The board updates as progress changes.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
