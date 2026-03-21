import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Target, CalendarDays, Activity } from 'lucide-react';

const DailyTracker = ({ onUpdate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [habits, setHabits] = useState([]);
  const [entries, setEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchHabits = async () => {
    try {
      const res = await api.get('habits/habits/');
      setHabits(res.data);
    } catch (err) {
      console.error("Failed to fetch habits", err);
    }
  };

  const fetchEntries = async () => {
    try {
      const month = format(currentDate, 'M');
      const year = format(currentDate, 'yyyy');
      const res = await api.get(`habits/entries/?month=${month}&year=${year}`);
      setEntries(res.data);
    } catch (err) {
      console.error("Failed to fetch entries", err);
    }
  };

  useEffect(() => {
    fetchHabits();
    fetchEntries();
  }, [currentDate]);

  const start = startOfWeek(startOfMonth(currentDate));
  const end = endOfWeek(endOfMonth(currentDate));
  const days = eachDayOfInterval({ start, end });

  const toggleHabit = async (habitId, date) => {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const entryIdx = entries.findIndex(e => e.habit === habitId && e.date === formattedDate);
      const isCurrentlyCompleted = entryIdx > -1 ? entries[entryIdx].completed : false;

      const res = await api.post('habits/entries/', {
        habit: habitId,
        date: formattedDate,
        completed: !isCurrentlyCompleted
      });

      setEntries(prev => {
        const newEntries = [...prev];
        if (entryIdx > -1) {
          newEntries[entryIdx] = res.data;
        } else {
          newEntries.push(res.data);
        }
        return newEntries;
      });

      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Failed to toggle habit", err);
    }
  };

  const filteredHabits = habits.filter(h => {
    const isMonthMatch = h.month === (selectedDate.getMonth() + 1) && h.year === selectedDate.getFullYear();
    if (!isMonthMatch) return false;
    if (h.frequency === 'daily') return selectedDate.getDate() === h.start_day;
    return true;
  });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-10 mt-12">
      {/* Calendar Architecture */}
      <div className="xl:col-span-8 glass-card p-6 sm:p-10 group overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
              <CalendarDays className="text-brand-primary" size={32} />
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-3 ml-1">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/40" />
                <p className="text-slate-500 text-sm font-semibold tracking-wide uppercase">Interactive Progression Matrix</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-950/50 p-1.5 rounded-2xl border border-white/5 w-fit">
            <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-3 hover:bg-white/5 rounded-xl transition-all active:scale-95">
              <ChevronLeft size={22} className="text-slate-400" />
            </button>
            <div className="h-6 w-px bg-white/5" />
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-3 hover:bg-white/5 rounded-xl transition-all active:scale-95">
              <ChevronRight size={22} className="text-slate-400" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3 sm:gap-5">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
            <div key={d} className="text-center text-[10px] font-black text-slate-700 uppercase py-2 tracking-widest border-b border-white/5 mb-4">
              {d}
            </div>
          ))}
          {days.map(day => {
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = format(day, 'MMM') === format(currentDate, 'MMM');
            const dateStr = format(day, 'yyyy-MM-dd');
            const completionCount = entries.filter(e => e.date === dateStr && e.completed).length;
            
            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`p-2 sm:p-4 aspect-square rounded-[20px] sm:rounded-[24px] flex flex-col items-center justify-center transition-all duration-500 relative group/day ${
                  isSelected 
                    ? 'bg-brand-primary text-white shadow-2xl shadow-brand-primary/40 ring-4 ring-brand-primary/10 z-10 scale-105' 
                    : isCurrentMonth 
                      ? 'bg-slate-900/40 hover:bg-slate-800 text-slate-400 border border-white/5' 
                      : 'opacity-5 pointer-events-none'
                }`}
              >
                <span className={`text-base sm:text-2xl font-black ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                  {format(day, 'd')}
                </span>
                {isCurrentMonth && completionCount > 0 && (
                  <div className={`mt-2 flex gap-1 ${isSelected ? 'opacity-100' : 'opacity-60'}`}>
                    {Array.from({ length: Math.min(completionCount, 4) }).map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full shadow-sm ${isSelected ? 'bg-white' : 'bg-brand-primary'}`} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Control Panel side */}
      <div className="xl:col-span-4 space-y-8">
        <div className="glass-card p-8 h-fit bg-slate-900/30">
          <div className="mb-10">
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3 uppercase italic">
                <Activity className="text-brand-primary" size={24} />
                Daily <span className="text-brand-primary">Check</span>
              </h2>
              <div className="flex items-center gap-2 mt-2 bg-brand-primary/5 w-fit px-3 py-1 rounded-full border border-brand-primary/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                  <p className="text-brand-primary text-[10px] font-black uppercase tracking-widest">{format(selectedDate, 'EEEE, LLLL do')}</p>
              </div>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
            {filteredHabits.length === 0 && (
              <div className="text-center py-16 rounded-[2rem] bg-slate-900/20 border border-dashed border-slate-800/50">
                  <Target size={52} className="mx-auto text-slate-800 mb-6 opacity-40" />
                  <p className="text-slate-500 font-bold font-sans text-sm tracking-tight px-6 text-balance">No activities synchronized for this date</p>
                  <Link to="/planning" className="text-brand-primary font-black text-[10px] sm:text-xs mt-6 uppercase tracking-widest hover:text-white transition-colors block border border-brand-primary/20 w-fit mx-auto px-6 py-2 rounded-full">Initialize Planning →</Link>
              </div>
            )}
            {filteredHabits.map(habit => {
              const entry = entries.find(e => e.habit === habit.id && e.date === format(selectedDate, 'yyyy-MM-dd'));
              const isCompleted = entry?.completed;
              return (
                <div
                  key={habit.id}
                  className={`group flex items-center justify-between p-5 rounded-[22px] border transition-all duration-500 ${
                      isCompleted 
                      ? 'bg-brand-primary/10 border-brand-primary/40 shadow-xl shadow-brand-primary/10' 
                      : 'bg-slate-950/40 border-white/5 hover:border-white/10 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className={`font-black truncate text-lg transition-colors leading-tight ${isCompleted ? 'text-brand-primary' : 'text-slate-100 group-hover:text-white'}`}>{habit.name}</h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-[8px] uppercase font-black text-slate-500 tracking-[0.2em] border border-white/5">
                          {habit.category}
                      </span>
                      <span className="text-[9px] text-slate-600 font-black uppercase tracking-[0.1em]">• {habit.frequency}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleHabit(habit.id, selectedDate)}
                    className={`p-3.5 rounded-[18px] transition-all duration-500 active:scale-75 border relative shadow-2xl ${
                      isCompleted 
                      ? 'bg-brand-primary text-white shadow-brand-primary/40 border-white/20' 
                      : 'bg-slate-900 text-slate-700 hover:text-slate-300 border-white/5 hover:border-white/20'
                    }`}
                  >
                      {isCompleted ? <CheckCircle size={28} strokeWidth={3} /> : <Circle size={28} strokeWidth={2} className="opacity-30 group-hover:opacity-100" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyTracker;
