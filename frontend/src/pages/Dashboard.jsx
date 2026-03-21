import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatCards from '../components/StatCards';
import DailyTracker from '../components/DailyTracker';
import AnalyticsChart from '../components/AnalyticsChart';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const [analytics, setAnalytics] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('habits/notifications/');
      const unreadAlerts = res.data.filter(n => !n.is_read);
      
      unreadAlerts.forEach(async (n) => {
        if (n.notification_type === 'achievement') {
           toast(n.message, { 
             icon: '🎉',
             duration: 6000,
           });
        } else {
           toast.success(n.message);
        }
        // Mark as read immediately to avoid repeats (use custom action)
        await api.post(`habits/notifications/${n.id}/mark_as_read/`);
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get('accounts/profile/');
      setUser(prev => ({ ...prev, ...res.data }));
    } catch (err) {
      console.error("Failed to refresh profile", err);
    }
  };

  const fetchAnalytics = async () => {
    try {
       const today = new Date();
       const res = await api.get(`habits/analytics/?month=${format(today, 'M')}&year=${format(today, 'yyyy')}`);
       setAnalytics(res.data);
    } catch (err) {
        console.error("Failed to fetch analytics", err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchNotifications();
  }, []);

  const handleUpdate = () => {
    fetchProfile();
    fetchAnalytics();
    fetchNotifications();
  };

  return (
    <div className="min-h-screen pb-28 md:pb-12">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-6">
            <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                    Hi, <span className="text-sky-500">{user?.username}</span>
                </h1>
                <p className="text-slate-400 text-sm sm:text-base">Track your progress and build consistent habits.</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-500 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 w-fit">
                <span className="font-mono uppercase tracking-widest">{format(new Date(), 'EEEE, LLLL do')}</span>
            </div>
        </div>
        
        <StatCards user={user} />
        
        <DailyTracker onUpdate={handleUpdate} />
        
        <AnalyticsChart data={analytics} />
      </main>
    </div>
  );
};

export default Dashboard;
