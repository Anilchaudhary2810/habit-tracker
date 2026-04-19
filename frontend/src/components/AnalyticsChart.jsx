import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { TrendingUp } from 'lucide-react';

const PERIOD_TITLES = {
  today: 'Today Progress',
  week: 'This Week Progress',
  month: 'This Month Progress',
};

const AnalyticsChart = ({ data, period = 'month' }) => {
  const chartData = data.map(item => ({
    date: format(new Date(item.date), 'MMM d'),
    count: item.count,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-lg">
          <p className="text-xs font-semibold text-slate-600 mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-600" />
            <p className="text-sm font-semibold text-slate-900">
              {payload[0].value} <span className="text-slate-500 font-medium">completed</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 sm:p-8 group overflow-hidden mt-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <TrendingUp className="text-blue-600" size={28} />
            {PERIOD_TITLES[period] || 'Progress'}
          </h2>
          <p className="text-sm text-slate-600">Completed habits per day</p>
        </div>
      </div>

      <div className="h-[300px] sm:h-[400px] w-full mt-4">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            No completion data for this period yet.
          </div>
        ) : (
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
                dataKey="date" 
                stroke="#cbd5e1"
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: '#64748b', fontWeight: 800 }}
                dy={15}
            />
            <YAxis 
                stroke="#cbd5e1"
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: '#64748b', fontWeight: 800 }}
                allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2563eb', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#2563eb" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#areaGradient)" 
                animationDuration={1200}
                dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AnalyticsChart;
