import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { Trophy, Flame, Star, Crown, TrendingUp, User as UserIcon } from 'lucide-react';

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
        if(index === 0) return <Crown className="text-yellow-400 drop-shadow-lg scale-125" size={24} />;
        if(index === 1) return <Crown className="text-slate-400 drop-shadow-md scale-110" size={20} />;
        if(index === 2) return <Crown className="text-orange-400/80 drop-shadow-sm" size={18} />;
        return <span className="font-mono font-bold text-slate-500">#{index + 1}</span>;
    }

    return (
        <div className="min-h-screen pb-28 md:pb-12">
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-sky-500/10 rounded-2xl sm:rounded-3xl mb-4 border border-sky-500/20 shadow-2xl shadow-sky-500/10">
                        <Trophy size={40} className="text-sky-500 animate-pulse" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">The Habit <span className="text-sky-500">Masters</span></h1>
                    <p className="text-slate-400 text-sm sm:text-lg max-w-lg mx-auto">See how you rank against other habit builders. Consistency is key.</p>
                </div>

                <div className="glass-card overflow-hidden">
                    <div className="hidden sm:grid grid-cols-12 gap-4 p-4 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-white/5 bg-white/5">
                        <div className="col-span-1 text-center">Rank</div>
                        <div className="col-span-5 px-4 text-left">Player</div>
                        <div className="col-span-3 text-center flex items-center justify-center gap-1"><Flame size={12}/> Streak</div>
                        <div className="col-span-3 text-center flex items-center justify-center gap-1"><Star size={12}/> Points</div>
                    </div>
                    
                    <div className="divide-y divide-white/5">
                        {players.map((player, index) => (
                            <div key={player.id} className="grid grid-cols-12 gap-2 sm:gap-4 p-4 sm:p-5 hover:bg-white/5 transition-colors items-center group">
                                <div className="col-span-2 sm:col-span-1 flex justify-center items-center">
                                    {topRank(index)}
                                </div>
                                <div className="col-span-10 sm:col-span-5 px-2 sm:px-4 flex items-center gap-2 sm:gap-4">
                                   <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-sky-500/20 to-purple-500/20 flex items-center justify-center border border-white/5 overflow-hidden shrink-0">
                                        <UserIcon size={16} className="text-slate-400 group-hover:scale-110 transition-transform" />
                                   </div>
                                   <div className="min-w-0">
                                       <h3 className="font-bold text-white group-hover:text-sky-400 transition-colors uppercase tracking-tight truncate text-sm sm:text-base">{player.username}</h3>
                                       {index < 3 && <span className="text-[8px] sm:text-[10px] bg-sky-500/10 text-sky-400 px-2 rounded-full font-bold">Elite Builder</span>}
                                   </div>
                                </div>
                                {/* Mobile view for stats */}
                                <div className="col-start-3 col-span-10 flex sm:hidden gap-6 mt-1">
                                    <div className="flex items-center gap-1 text-sky-400 font-mono text-sm font-bold">
                                        <Flame size={14} /> {player.current_streak}d
                                    </div>
                                    <div className="flex items-center gap-1 text-amber-400 font-mono text-sm font-bold">
                                        <Star size={14} /> {player.points} xp
                                    </div>
                                </div>
                                {/* Desktop view for stats */}
                                <div className="hidden sm:flex col-span-3 justify-center items-center font-bold text-lg text-sky-400 font-mono">
                                    {player.current_streak}d
                                </div>
                                <div className="hidden sm:flex col-span-3 justify-center items-center font-bold text-lg text-amber-400 font-mono">
                                    {player.points} pts
                                </div>
                            </div>
                        ))}
                        {players.length === 0 && (
                            <div className="text-center py-20 text-slate-500 italic opacity-60">
                                No builders on the leaderboard yet. Start your journey!
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-card p-6 flex flex-col items-center text-center">
                        <Flame size={32} className="text-primary-500 mb-2" />
                        <h4 className="font-bold">Consistency Wins</h4>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Streaks define your rank above all else.</p>
                    </div>
                    <div className="glass-card p-6 flex flex-col items-center text-center">
                        <Star size={32} className="text-orange-500 mb-2" />
                        <h4 className="font-bold">Gain Experience</h4>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Earn 10 points for every single habit you complete.</p>
                    </div>
                    <div className="glass-card p-6 flex flex-col items-center text-center">
                        <TrendingUp size={32} className="text-emerald-500 mb-2" />
                        <h4 className="font-bold">Monthly Reset</h4>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Leaderboards are live snapshots of builder excellence.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Leaderboard;
