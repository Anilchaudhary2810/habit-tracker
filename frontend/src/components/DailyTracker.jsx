import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Target } from 'lucide-react';

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

  // Generate calendar days
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

      if (onUpdate) onUpdate(); // Signal dashboard to refresh user profile
    } catch (err) {
      console.error("Failed to toggle habit", err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
      {/* Calendar Side */}
      <div className="lg:col-span-8 glass-card p-8 group shadow-sky-500/5">
        <div className="flex items-center justify-between mb-10">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold flex items-center gap-3 text-white tracking-tight">
              <div className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.8)] animate-pulse" />
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <p className="text-slate-500 text-sm font-medium ml-5">Select a date to track your habits</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all active:scale-90 shadow-inner glass-inner">
              <ChevronLeft size={22} className="text-slate-300" />
            </button>
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all active:scale-90 shadow-inner glass-inner">
              <ChevronRight size={22} className="text-slate-300" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 sm:gap-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-xs font-black text-slate-600 uppercase py-3 tracking-widest">
              {d}
            </div>
          ))}
          {days.map(day => {
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = format(day, 'MMM') === format(currentDate, 'MMM');
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayEntries = entries.filter(e => e.date === dateStr && e.completed);
            
            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`p-3 sm:p-5 aspect-square rounded-2xl flex flex-col items-center justify-center transition-all relative group/day ${
                  isSelected 
                    ? 'bg-sky-600 text-white shadow-xl shadow-sky-600/40 z-10 scale-105' 
                    : isCurrentMonth 
                      ? 'bg-slate-900/40 hover:bg-white/5 text-slate-300 border border-white/5 shadow-inner' 
                      : 'opacity-10 pointer-events-none'
                }`}
              >
                <span className={`text-base sm:text-xl font-black tracking-tighter ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {format(day, 'd')}
                </span>
                {isCurrentMonth && dayEntries.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {dayEntries.slice(0, 3).map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full shadow-sm ${isSelected ? 'bg-white shadow-white/50' : 'bg-sky-500 shadow-sky-500/50'}`} />
                    ))}
                    {dayEntries.length > 3 && <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white/60' : 'bg-sky-500/60'}`} />}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Habit List Side */}
      <div className="lg:col-span-4 glass-card p-8 h-fit bg-slate-950/40 shadow-purple-500/5">
        <div className="mb-8 pl-1">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Active <span className="text-sky-500">Habits</span></h2>
            <div className="flex items-center gap-2 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">{format(selectedDate, 'EEEE, LLLL do')}</p>
            </div>
        </div>
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
          {habits.filter(h => {
              const isMonthMatch = h.month === (selectedDate.getMonth() + 1) && h.year === selectedDate.getFullYear();
              if (!isMonthMatch) return false;
              
              if (h.frequency === 'daily') {
                return selectedDate.getDate() === h.start_day;
              }
              // Monthly shows for the whole month
              return true;
          }).length === 0 && (
            <div className="text-center py-12 rounded-3xl bg-white/5 border border-dashed border-slate-800">
                <Target size={48} className="mx-auto text-slate-700 mb-4 opacity-40" />
                <p className="text-slate-500 font-medium font-sans">No tasks scheduled for this date.</p>
                <Link to="/planning" className="text-sky-500 font-bold text-sm mt-3 hover:text-sky-400 transition-colors inline-block">Initialize your first habit →</Link>
            </div>
          )}
          {habits
            .filter(h => {
                const isMonthMatch = h.month === (selectedDate.getMonth() + 1) && h.year === selectedDate.getFullYear();
                if (!isMonthMatch) return false;
                
                if (h.frequency === 'daily') {
                    return selectedDate.getDate() === h.start_day;
                }
                return true;
            })
            .map(habit => {
            const entry = entries.find(e => e.habit === habit.id && e.date === format(selectedDate, 'yyyy-MM-dd'));
            const isCompleted = entry?.completed;
            return (
              <div
                key={habit.id}
                className={`group flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                    isCompleted 
                    ? 'bg-sky-500/10 border-sky-500/30 shadow-inner' 
                    : 'bg-slate-900/50 border-white/5 hover:border-white/20 hover:bg-slate-900/80 shadow-inner'
                }`}
              >
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className={`font-bold truncate text-lg transition-colors ${isCompleted ? 'text-sky-300' : 'text-slate-100 group-hover:text-white'}`}>{habit.name}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="px-2 py-0.5 rounded-lg bg-white/5 text-[9px] uppercase font-black text-slate-500 tracking-[0.2em] border border-white/5 border-b-sky-500/20">
                        {habit.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">• {habit.frequency}</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleHabit(habit.id, selectedDate)}
                  className={`p-3 rounded-2xl transition-all duration-300 active:scale-90 border overflow-hidden relative shadow-lg ${
                    isCompleted 
                    ? 'bg-sky-600 text-white shadow-sky-500/30 border-sky-400/50' 
                    : 'bg-slate-800 text-slate-500 hover:text-white border-white/10 hover:border-white/20'
                  }`}
                >
                    {isCompleted ? <CheckCircle size={26} /> : <Circle size={26} className="opacity-40 group-hover:opacity-100 transition-opacity" />}
                </button>
              </div>
            );
          })}
      </div>
      </div>
    </div>
  );
};

export default DailyTracker;
