import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { LayoutGrid, TrendingUp } from 'lucide-react';

const AnalyticsChart = ({ data }) => {
  const chartData = data.map(item => ({
    date: format(new Date(item.date), 'MMM d'),
    count: item.count,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_8px_#0ea5e9]" />
            <p className="text-sm font-black text-white">{payload[0].value} <span className="text-slate-400 font-medium">COMPLETED</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 sm:p-10 group overflow-hidden bg-slate-900/40 mt-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-4">
            <TrendingUp className="text-brand-primary" size={28} />
            Performance <span className="text-brand-primary italic">Pulse</span>
          </h2>
          <div className="flex items-center gap-3 ml-1">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/40" />
              <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase">System Analytics Visualization</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-950/30 rounded-xl border border-white/5 h-fit text-slate-500">
           <LayoutGrid size={16} />
           <span className="text-[10px] font-black uppercase tracking-widest">Global Trend View</span>
        </div>
      </div>

      <div className="h-[300px] sm:h-[400px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
            <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.1)" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: '#475569', fontWeight: 800 }}
                dy={15}
            />
            <YAxis 
                stroke="rgba(255,255,255,0.1)" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: '#475569', fontWeight: 800 }}
                allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#0ea5e9', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#0ea5e9" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#areaGradient)" 
                animationDuration={2000}
                dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#030712' }}
                activeDot={{ r: 6, strokeWidth: 0, shadow: '0 0 10px #0ea5e9' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;
