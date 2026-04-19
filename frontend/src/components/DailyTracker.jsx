import React, { useState, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, CalendarDays, StickyNote } from 'lucide-react';

import api, { getApiErrorMessage } from '../utils/api';

const isHabitActiveOnDate = (habit, date) => {
  const sameMonth = habit.month === date.getMonth() + 1 && habit.year === date.getFullYear();
  if (!sameMonth) return false;

  const day = date.getDate();
  if (day < habit.start_day) return false;

  if (habit.frequency === 'daily') return true;
  if (habit.frequency === 'weekly') return (day - habit.start_day) % 7 === 0;
  if (habit.frequency === 'monthly') return day === habit.start_day;
  return false;
};

const DailyTracker = ({ onUpdate, quickFilter = 'month' }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [habits, setHabits] = useState([]);
  const [entries, setEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [noteDrafts, setNoteDrafts] = useState({});

  useEffect(() => {
    const today = new Date();
    if (quickFilter === 'today' || quickFilter === 'week') {
      setCurrentDate(today);
      setSelectedDate(today);
    }
    if (quickFilter === 'month') {
      setCurrentDate(today);
    }
  }, [quickFilter]);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const res = await api.get('habits/habits/');
        setHabits(res.data);
      } catch (err) {
        console.error('Failed to fetch habits', err);
      }
    };
    fetchHabits();
  }, []);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const month = format(currentDate, 'M');
        const year = format(currentDate, 'yyyy');
        const res = await api.get(`habits/entries/?month=${month}&year=${year}`);
        setEntries(res.data);
      } catch (err) {
        console.error('Failed to fetch entries', err);
      }
    };
    fetchEntries();
  }, [currentDate]);

  const start = startOfWeek(startOfMonth(currentDate));
  const end = endOfWeek(endOfMonth(currentDate));
  const days = eachDayOfInterval({ start, end });

  const toggleHabit = async (habitId, date) => {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const existing = entries.find((e) => e.habit === habitId && e.date === formattedDate);
      const isCurrentlyCompleted = existing?.completed || false;
      const note = noteDrafts[habitId] ?? existing?.note ?? '';

      const res = await api.post('habits/entries/', {
        habit: habitId,
        date: formattedDate,
        completed: !isCurrentlyCompleted,
        note
      });

      setEntries((prev) => {
        const idx = prev.findIndex((e) => e.habit === habitId && e.date === formattedDate);
        const next = [...prev];
        if (idx > -1) next[idx] = res.data;
        else next.push(res.data);
        return next;
      });

      onUpdate?.();
    } catch (err) {
      console.error('Failed to toggle habit', err);
      alert(getApiErrorMessage(err, 'Unable to update habit entry'));
    }
  };

  const saveNote = async (habitId, date) => {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const existing = entries.find((e) => e.habit === habitId && e.date === formattedDate);
      const note = (noteDrafts[habitId] ?? existing?.note ?? '').trim();

      const res = await api.post('habits/entries/', {
        habit: habitId,
        date: formattedDate,
        completed: existing?.completed || false,
        note
      });

      setEntries((prev) => {
        const idx = prev.findIndex((e) => e.habit === habitId && e.date === formattedDate);
        const next = [...prev];
        if (idx > -1) next[idx] = res.data;
        else next.push(res.data);
        return next;
      });
    } catch (err) {
      alert(getApiErrorMessage(err, 'Unable to save note'));
    }
  };

  const filteredHabits = habits.filter((habit) => isHabitActiveOnDate(habit, selectedDate));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-8">
      <div className="xl:col-span-8 glass-card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays className="text-blue-600" size={24} />
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 rounded-md border border-slate-200 hover:bg-slate-50">
              <ChevronLeft size={18} className="text-slate-600" />
            </button>
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 rounded-md border border-slate-200 hover:bg-slate-50">
              <ChevronRight size={18} className="text-slate-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-slate-500 py-1">
              {d}
            </div>
          ))}
          {days.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = format(day, 'M') === format(currentDate, 'M');
            const dateStr = format(day, 'yyyy-MM-dd');
            const completionCount = entries.filter((e) => e.date === dateStr && e.completed).length;

            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`p-2 aspect-square rounded-md flex flex-col items-center justify-center border ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : isCurrentMonth
                      ? 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                      : 'bg-slate-100 border-slate-100 text-slate-400'
                }`}
              >
                <span className="text-sm sm:text-base font-semibold">{format(day, 'd')}</span>
                {isCurrentMonth && completionCount > 0 && (
                  <span className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-blue-700'}`}>{completionCount}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="xl:col-span-4">
        <div className="glass-card p-5 sm:p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Daily Check</h3>
          <p className="text-sm text-slate-600 mb-4">{format(selectedDate, 'EEEE, MMMM do')}</p>

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {filteredHabits.length === 0 && (
              <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <p className="text-sm text-slate-700">No habits scheduled for this date.</p>
                <Link to="/planning" className="text-sm text-blue-700 font-semibold mt-2 inline-block hover:underline">
                  Add habits in planning
                </Link>
              </div>
            )}

            {filteredHabits.map((habit) => {
              const entry = entries.find((e) => e.habit === habit.id && e.date === format(selectedDate, 'yyyy-MM-dd'));
              const isCompleted = entry?.completed;
              const noteValue = noteDrafts[habit.id] ?? entry?.note ?? '';

              return (
                <div key={habit.id} className={`p-3 rounded-md border ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="pr-3 min-w-0">
                      <h4 className="font-semibold text-slate-900 truncate">{habit.name}</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        {habit.category} • {habit.frequency}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleHabit(habit.id, selectedDate)}
                      className={`p-2 rounded-md border ${
                        isCompleted ? 'bg-green-600 border-green-600 text-white' : 'bg-slate-50 border-slate-300 text-slate-600'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </button>
                  </div>

                  <div className="mt-3">
                    <label className="text-xs text-slate-600 flex items-center gap-1 mb-1">
                      <StickyNote size={12} /> Note
                    </label>
                    <textarea
                      value={noteValue}
                      maxLength={280}
                      onChange={(e) => setNoteDrafts((prev) => ({ ...prev, [habit.id]: e.target.value }))}
                      className="input-field min-h-[72px] text-sm"
                      placeholder="Add a quick note for today"
                    />
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">{noteValue.length}/280</span>
                      <button
                        onClick={() => saveNote(habit.id, selectedDate)}
                        className="text-xs text-blue-700 font-semibold hover:underline"
                        type="button"
                      >
                        Save note
                      </button>
                    </div>
                  </div>
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
