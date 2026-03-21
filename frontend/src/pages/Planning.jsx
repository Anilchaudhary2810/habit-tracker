import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { Plus, Trash2, Calendar, Target, Hash } from 'lucide-react';
import { format } from 'date-fns';

const Planning = () => {
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Health');
  const [frequency, setFrequency] = useState('daily');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [day, setDay] = useState(new Date().getDate());

  const fetchHabits = async () => {
    const res = await api.get('habits/habits/');
    setHabits(res.data);
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleAddHabit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('habits/habits/', {
        name,
        category,
        frequency,
        month,
        year,
        start_day: day,
      });
      setHabits([...habits, res.data]);
      setName('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`habits/habits/${id}/`);
      setHabits(habits.filter((h) => h.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = [2025, 2026, 2027];

  return (
    <div className="min-h-screen pb-28 md:pb-14">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        <div className="flex flex-col lg:flex-row items-start justify-between mb-10 gap-10">
            <div className="lg:w-1/3 w-full">
                <h1 className="text-3xl font-bold text-white mb-2">Monthly Planning</h1>
                <p className="text-slate-400">Design your habits for the month. Focus on what matters.</p>
                
                <form onSubmit={handleAddHabit} className="glass-card p-8 mt-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300">Habit Name</label>
                        <div className="relative">
                            <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input 
                                type="text" 
                                className="input-field pl-12" 
                                placeholder="Read 20 pages" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300">Category</label>
                            <select className="input-field appearance-none cursor-pointer" value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option>Health</option>
                                <option>Work</option>
                                <option>Study</option>
                                <option>Mindset</option>
                                <option>Finance</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300">Frequency</label>
                            <select className="input-field appearance-none cursor-pointer" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300">Month</label>
                            <select className="input-field appearance-none cursor-pointer" value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
                                {months.map(m => <option key={m} value={m}>{format(new Date(2025, m-1), 'MMMM')}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300">Year</label>
                            <select className="input-field appearance-none cursor-pointer" value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300">Specific Day {frequency === 'daily' ? '(Task only shows on this day)' : '(Starting from)'}</label>
                        <select className="input-field appearance-none cursor-pointer" value={day} onChange={(e) => setDay(parseInt(e.target.value))}>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                        <Plus size={20} /> Create Habit
                    </button>
                </form>
            </div>

            <div className="flex-1 w-full">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Hash size={20} className="text-primary-500" /> Current Habits ({habits.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {habits.map((habit) => (
                        <div key={habit.id} className="glass-card p-6 flex items-start justify-between group">
                            <div>
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/5 text-primary-400 mb-2 inline-block`}>
                                    {habit.category}
                                </span>
                                <h3 className="text-lg font-bold text-white">{habit.name}</h3>
                                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                &bull; <span className="flex items-center gap-1 capitalize"><Calendar size={14}/> {habit.frequency}</span>
                                <span className="flex items-center gap-1 font-mono tracking-tighter">
                                    {format(new Date(habit.year, habit.month - 1, habit.start_day), 'do MMM yyyy')}
                                </span>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(habit.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                    {habits.length === 0 && (
                        <div className="col-span-full py-16 text-center glass-card border-dashed">
                            <p className="text-slate-500 italic">No habits planned yet. Use the form to your left to get started!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Planning;
