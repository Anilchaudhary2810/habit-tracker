import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus, Archive, RotateCcw, Calendar, Hash } from 'lucide-react';
import toast from 'react-hot-toast';

import Navbar from '../components/Navbar';
import api, { getApiErrorMessage } from '../utils/api';

const Planning = () => {
  const now = new Date();
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Health');
  const [frequency, setFrequency] = useState('daily');
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [day, setDay] = useState(now.getDate());
  const [showArchived, setShowArchived] = useState(false);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 1 + i);

  const maxDayInSelection = new Date(year, month, 0).getDate();
  const validDay = Math.min(day, maxDayInSelection);

  useEffect(() => {
    if (day !== validDay) setDay(validDay);
  }, [month, year]);

  const fetchHabits = async () => {
    try {
      const res = await api.get('habits/habits/?include_archived=1');
      setHabits(res.data);
    } catch (err) {
      console.error(err);
      toast.error(getApiErrorMessage(err, 'Failed to load habits'));
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const activeHabits = habits.filter((h) => !h.is_archived);
  const archivedHabits = habits.filter((h) => h.is_archived);

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Habit name is required.');
      return;
    }

    try {
      const res = await api.post('habits/habits/', {
        name: name.trim(),
        category,
        frequency,
        month,
        year,
        start_day: validDay
      });
      setHabits((prev) => [res.data, ...prev]);
      setName('');
      toast.success('Habit created');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to create habit'));
      console.error(err);
    }
  };

  const handleArchive = async (id) => {
    try {
      await api.post(`habits/habits/${id}/archive/`);
      setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, is_archived: true } : h)));
      toast.success('Habit archived');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to archive habit'));
      console.error(err);
    }
  };

  const handleUnarchive = async (id) => {
    try {
      await api.post(`habits/habits/${id}/unarchive/`);
      setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, is_archived: false } : h)));
      toast.success('Habit restored');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to restore habit'));
      console.error(err);
    }
  };

  const HabitCard = ({ habit, archived = false }) => (
    <div key={habit.id} className="glass-card p-5 flex items-start justify-between">
      <div>
        <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-full bg-blue-50 text-blue-700 mb-2 inline-block">
          {habit.category}
        </span>
        <h3 className="text-lg font-bold text-slate-900">{habit.name}</h3>
        <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
          <Calendar size={14} />
          <span className="capitalize">{habit.frequency}</span>
          <span>•</span>
          <span>{format(new Date(habit.year, habit.month - 1, habit.start_day), 'do MMM yyyy')}</span>
        </div>
      </div>
      {archived ? (
        <button
          onClick={() => handleUnarchive(habit.id)}
          className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-200"
          type="button"
          title="Unarchive"
        >
          <RotateCcw size={18} />
        </button>
      ) : (
        <button
          onClick={() => handleArchive(habit.id)}
          className="p-2 text-amber-700 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-200"
          type="button"
          title="Archive"
        >
          <Archive size={18} />
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pb-28 md:pb-14">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        <div className="flex flex-col lg:flex-row items-start justify-between mb-10 gap-10">
          <div className="lg:w-1/3 w-full">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Planning</h1>
            <p className="text-slate-600">Design your habits for the month with clear, realistic schedules.</p>

            <form onSubmit={handleAddHabit} className="glass-card p-6 mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Habit Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Read 20 pages"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Category</label>
                  <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option>Health</option>
                    <option>Work</option>
                    <option>Study</option>
                    <option>Mindset</option>
                    <option>Finance</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Frequency</label>
                  <select className="input-field" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Month</label>
                  <select className="input-field" value={month} onChange={(e) => setMonth(parseInt(e.target.value, 10))}>
                    {months.map((m) => (
                      <option key={m} value={m}>
                        {format(new Date(2026, m - 1), 'MMMM')}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Year</label>
                  <select className="input-field" value={year} onChange={(e) => setYear(parseInt(e.target.value, 10))}>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Start Day</label>
                <select className="input-field" value={validDay} onChange={(e) => setDay(parseInt(e.target.value, 10))}>
                  {Array.from({ length: maxDayInSelection }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                <Plus size={18} /> Create Habit
              </button>
            </form>
          </div>

          <div className="flex-1 w-full">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900">
              <Hash size={20} className="text-blue-700" /> Active Habits ({activeHabits.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeHabits.map((habit) => <HabitCard key={habit.id} habit={habit} />)}
              {activeHabits.length === 0 && (
                <div className="col-span-full py-16 text-center glass-card border-dashed">
                  <p className="text-slate-600">No active habits. Create one from the form.</p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowArchived((prev) => !prev)}
                type="button"
                className="text-sm text-slate-700 font-semibold hover:underline"
              >
                {showArchived ? 'Hide archived habits' : `Show archived habits (${archivedHabits.length})`}
              </button>
            </div>

            {showArchived && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {archivedHabits.map((habit) => <HabitCard key={habit.id} habit={habit} archived />)}
                {archivedHabits.length === 0 && (
                  <div className="col-span-full py-10 text-center glass-card border-dashed">
                    <p className="text-slate-600">No archived habits yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Planning;
