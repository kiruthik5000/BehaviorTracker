import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, Target, History } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import api from '../api';

export default function Analytics() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/logs/all');
      // Sort oldest to newest for chronological charting
      const sorted = res.data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setLogs(sorted);
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = logs.map(log => ({
    name: format(parseISO(log.date), 'MMM dd'),
    Progress: log.progressPercentage || 0,
    Modifications: log.aiModifications || 0
  }));

  const totalInterventions = logs.reduce((acc, curr) => acc + (curr.aiModifications || 0), 0);
  const avgCompletion = logs.length 
    ? Math.round(logs.reduce((acc, curr) => acc + (curr.progressPercentage || 0), 0) / logs.length)
    : 0;
  const bestDay = logs.length 
    ? logs.reduce((max, curr) => (curr.progressPercentage || 0) > (max.progressPercentage || 0) ? curr : max, logs[0])
    : null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10">
        <h2 className="text-sm font-bold tracking-widest text-slate-500 uppercase mb-2">Metrics & Insights</h2>
        <h1 className="text-4xl font-black text-white tracking-tight">Analytics</h1>
      </header>

      {isLoading ? (
        <div className="flex gap-2 items-center justify-center h-64">
           <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
           <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
           <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-[#0f172a] rounded-2xl border border-white/5 p-8 text-center text-slate-400 italic">
          No protocols recorded yet. Finish a task on the dashboard to generate your first metric!
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-6 mb-8">
            <StatCard 
              icon={<Target className="w-6 h-6 text-green-400" />} 
              title="Avg. Completion" 
              value={`${avgCompletion}%`}
            />
            <StatCard 
              icon={<Zap className="w-6 h-6 text-purple-400" />} 
              title="AI Interventions" 
              value={totalInterventions}
            />
            <StatCard 
              icon={<History className="w-6 h-6 text-blue-400" />} 
              title="Best Performance" 
              value={bestDay?.progressPercentage === 0 ? '-' : `${bestDay?.progressPercentage}%`}
              subtitle={bestDay?.progressPercentage > 0 ? format(parseISO(bestDay.date), 'MMM do') : ''}
            />
          </div>

          <div className="bg-[#0f172a] rounded-2xl border border-white/5 p-6 h-[400px] shadow-xl">
            <h3 className="text-lg font-bold text-slate-200 mb-6 px-2">Completion Consistency</h3>
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Area type="monotone" dataKey="Progress" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorProgress)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon, title, value, subtitle }) {
  return (
    <div className="bg-[#0f172a] rounded-2xl border border-white/5 p-6 flex flex-col justify-between hover:bg-[#1e293b] transition-colors shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-white/5 p-2 rounded-xl">
          {icon}
        </div>
        <h4 className="font-semibold text-slate-400 text-sm tracking-wide">{title}</h4>
      </div>
      <div>
        <span className="text-3xl font-black text-white">{value}</span>
        {subtitle && <p className="text-xs font-semibold text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
