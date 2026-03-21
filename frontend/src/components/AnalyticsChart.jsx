import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format } from 'date-fns';

const AnalyticsChart = ({ data }) => {
  const chartData = data.map(item => ({
    date: format(new Date(item.date), 'MMM d'),
    count: item.count,
  }));

  return (
    <div className="glass-card p-10 mt-10 group shadow-sky-500/5">
      <div className="mb-10 pl-1">
        <h2 className="text-2xl font-extrabold flex items-center gap-3 text-white tracking-tight">
          <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)] animate-pulse" />
          Progress <span className="text-sky-500">Analytics</span>
        </h2>
        <p className="text-slate-500 text-sm font-medium ml-5 mt-1 text-balance">Monthly habit completion performance visualization</p>
      </div>
      <div className="h-[350px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.4}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="rgba(255,255,255,0.03)" />
            <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.2)" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: '#64748b' }}
                dy={15}
            />
            <YAxis 
                stroke="rgba(255,255,255,0.2)" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: '#64748b' }}
                allowDecimals={false}
            />
            <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.02)', radius: 8 }}
                contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    backdropFilter: 'blur(12px)',
                    borderRadius: '20px', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
                    padding: '12px 16px'
                }}
                itemStyle={{ color: '#0ea5e9', fontWeight: 'bold' }}
                labelStyle={{ color: '#cbd5e1', marginBottom: '4px', fontWeight: 'bold' }}
            />
            <Bar dataKey="count" radius={[8, 8, 4, 4]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="url(#barGradient)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;
