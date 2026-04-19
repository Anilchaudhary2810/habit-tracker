import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

import Navbar from '../components/Navbar';
import StatCards from '../components/StatCards';
import DailyTracker from '../components/DailyTracker';
import AnalyticsChart from '../components/AnalyticsChart';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const QUICK_FILTERS = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' }
];

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const [quickFilter, setQuickFilter] = useState('month');
  const [analytics, setAnalytics] = useState([]);
  const [insights, setInsights] = useState({
    missed_days: 0,
    completion_rate: 0,
    best_weekday: null,
    best_weekday_count: 0
  });

  const fetchNotifications = async () => {
    try {
      const res = await api.get('habits/notifications/');
      const unreadAlerts = res.data.filter((n) => !n.is_read);

      unreadAlerts.forEach(async (n) => {
        if (n.notification_type === 'achievement') {
          toast(n.message, {
            icon: '🏆',
            duration: 6000
          });
        } else {
          toast.success(n.message);
        }
        await api.post(`habits/notifications/${n.id}/mark_as_read/`);
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get('accounts/profile/');
      setUser((prev) => ({ ...prev, ...res.data }));
    } catch (err) {
      console.error('Failed to refresh profile', err);
    }
  };

  const fetchAnalytics = async (period = quickFilter) => {
    try {
      const res = await api.get(`habits/analytics/?period=${period}`);
      setAnalytics(res.data);
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    }
  };

  const fetchInsights = async (period = quickFilter) => {
    try {
      const res = await api.get(`habits/insights/?period=${period}`);
      setInsights(res.data);
    } catch (err) {
      console.error('Failed to fetch insights', err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchNotifications();
  }, []);

  useEffect(() => {
    fetchAnalytics(quickFilter);
    fetchInsights(quickFilter);
  }, [quickFilter]);

  const handleUpdate = () => {
    fetchProfile();
    fetchAnalytics(quickFilter);
    fetchInsights(quickFilter);
    fetchNotifications();
  };

  return (
    <div className="min-h-screen pb-28 md:pb-12">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Hi, <span className="text-blue-700">{user?.username}</span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">Track your progress and build consistent habits.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg px-4 py-2 w-fit">
            <span className="font-medium">{format(new Date(), 'EEEE, LLLL do')}</span>
          </div>
        </div>

        <StatCards user={user} />

        <div className="glass-card p-4 mb-6 flex flex-wrap items-center gap-2">
          {QUICK_FILTERS.map((f) => (
            <button
              key={f.key}
              className={`px-3 py-1.5 rounded-md text-sm border ${
                quickFilter === f.key
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
              onClick={() => setQuickFilter(f.key)}
              type="button"
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-5">
            <p className="text-sm text-slate-600">Missed days</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{insights.missed_days ?? 0}</p>
            <p className="text-xs text-slate-500 mt-1">Within selected period</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-sm text-slate-600">Completion rate</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{insights.completion_rate ?? 0}%</p>
            <p className="text-xs text-slate-500 mt-1">Completed vs expected checks</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-sm text-slate-600">Best day</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{insights.best_weekday || '-'}</p>
            <p className="text-xs text-slate-500 mt-1">{insights.best_weekday_count || 0} completions</p>
          </div>
        </div>

        <DailyTracker onUpdate={handleUpdate} quickFilter={quickFilter} />
        <AnalyticsChart data={analytics} period={quickFilter} />
      </main>
    </div>
  );
};

export default Dashboard;
